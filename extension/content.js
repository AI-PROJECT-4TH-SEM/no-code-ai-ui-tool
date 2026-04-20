// ─── Chai Ke Sath AI — Content Script v2.1 ───────────────────────────────────
const THEME_ID   = "__cksa_theme"
const OVERLAY_ID = "__cksa_overlay"
const PANEL_ID   = "__cksa_panel"
const BADGE_ID   = "__cksa_badge"

let inspectorActive = false
let selectedEl      = null
let originalStyles  = {}

// ─── Undo / Redo stacks ───────────────────────────────────────────────────────
const MAX_STACK  = 20
let undoStack    = []   // each entry: { label, bodyHTML }
let redoStack    = []

// Snapshot captures body HTML + active theme CSS (covers fixes + layout + theme)
function snapshotPage() {
  const themeEl = document.getElementById("__cksa_theme")
  return {
    bodyHTML:  document.body ? document.body.innerHTML : "",
    themeCSS:  themeEl ? themeEl.textContent : null,
  }
}

function restorePage(snapshot) {
  if (!snapshot) return
  if (document.body) document.body.innerHTML = snapshot.bodyHTML
  // Restore or remove theme
  const themeEl = document.getElementById("__cksa_theme")
  if (snapshot.themeCSS !== null) {
    if (themeEl) { themeEl.textContent = snapshot.themeCSS }
    else {
      const s = document.createElement("style")
      s.id = "__cksa_theme"
      s.textContent = snapshot.themeCSS
      document.head.appendChild(s)
    }
  } else {
    themeEl?.remove()
  }
}

function pushUndo(label) {
  undoStack.push({ label, snapshot: snapshotPage() })
  if (undoStack.length > MAX_STACK) undoStack.shift()
  redoStack = []
}

function stackState() {
  return {
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
    undoLabel: undoStack.length ? undoStack[undoStack.length - 1].label : null,
    redoLabel: redoStack.length ? redoStack[redoStack.length - 1].label : null,
  }
}

// ─── Messages ─────────────────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  switch (msg.type) {
    case "PING":       sendResponse({ alive: true }); return true
    case "APPLY_FIX": {
      const label = fixLabel(msg.domFix)
      pushUndo(label)                      // snapshot BEFORE the fix
      try {
        const result = applyFix(msg.domFix)
        sendResponse({ success: true, result, ...stackState() })
      } catch (e) {
        undoStack.pop()                    // fix failed — remove snapshot
        sendResponse({ success: false, error: e.message, ...stackState() })
      }
      return true
    }
    case "APPLY_THEME":
      try {
        pushUndo("Theme: " + (msg.name || "applied"))
        injectCSS(msg.css)
        sendResponse({ success: true, ...stackState() })
      }
      catch (e) { undoStack.pop(); sendResponse({ success: false, error: e.message }) }
      return true

    case "REMOVE_THEME":
      pushUndo("Remove theme")
      removeCSS()
      sendResponse({ success: true, ...stackState() })
      return true

    case "APPLY_LAYOUT": {
      // Layout inspector "Apply to HTML" — bakes inline styles
      try {
        pushUndo("Layout: " + (msg.label || "element edited"))
        const el = document.querySelector(msg.selector)
        if (el && msg.styles) {
          Object.entries(msg.styles).forEach(([prop, val]) => {
            if (val !== null && val !== undefined && val !== "") el.style[prop] = val
          })
        }
        sendResponse({ success: true, ...stackState() })
      } catch(e) { undoStack.pop(); sendResponse({ success: false, error: e.message }) }
      return true
    }
    case "TOGGLE_INSPECTOR":
      msg.active ? enableInspector() : disableInspector()
      sendResponse({ success: true }); return true

    case "GET_STACK_STATE":
      sendResponse(stackState()); return true

    case "UNDO_FIX": {
      if (!undoStack.length) { sendResponse({ success: false, ...stackState() }); return true }
      const entry = undoStack.pop()
      redoStack.push({ label: entry.label, snapshot: snapshotPage() })
      if (redoStack.length > MAX_STACK) redoStack.shift()
      restorePage(entry.snapshot)
      showUndoToast("↩ Undid: " + entry.label)
      sendResponse({ success: true, ...stackState() })
      return true
    }

    case "REDO_FIX": {
      if (!redoStack.length) { sendResponse({ success: false, ...stackState() }); return true }
      const entry = redoStack.pop()
      undoStack.push({ label: entry.label, snapshot: snapshotPage() })
      if (undoStack.length > MAX_STACK) undoStack.shift()
      restorePage(entry.snapshot)
      showUndoToast("↪ Redid: " + entry.label)
      sendResponse({ success: true, ...stackState() })
      return true
    }

    // Return full page HTML (head + body) for rescore and download
    case "GET_HTML":
      sendResponse({ html: document.documentElement.outerHTML, ...stackState() })
      return true

    // Live preview: apply a single CSS property to selected element
    // When pushUndo:true (on slider release), push one undo entry per property
    case "APPLY_LIVE_STYLE": {
      try {
        const el = document.querySelector(msg.selector)
        if (el && msg.prop && msg.value !== undefined) {
          if (msg.pushUndo) {
            // Push undo BEFORE applying — one entry per property change
            pushUndo("Layout " + msg.prop + ": " + msg.value)
          }
          el.style[msg.prop] = msg.value
        }
        sendResponse({ success: true, ...stackState() })
      } catch(e) { sendResponse({ success: false }) }
      return true
    }

    // Bake layout changes permanently (with undo)
    case "BAKE_LAYOUT": {
      try {
        pushUndo("Layout: " + (msg.label || "element"))
        const el = document.querySelector(msg.selector)
        if (el && msg.styles) {
          Object.entries(msg.styles).forEach(([prop, val]) => {
            if (val !== null && val !== undefined && val !== "") el.style[prop] = val
          })
          // Tag for download changelog
          const id = el.id ? "#" + el.id : (el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/)[0] : el.tagName.toLowerCase())
          el.setAttribute("data-cksa-layout", id + " — styles edited")
        }
        // Notify popup that layout was applied (to update undo buttons)
        chrome.runtime.sendMessage({ type: "LAYOUT_APPLIED", ...stackState() }).catch(() => {})
        sendResponse({ success: true, ...stackState() })
      } catch(e) { undoStack.pop(); sendResponse({ success: false, error: e.message }) }
      return true
    }
  }
})

// ─── Theme ────────────────────────────────────────────────────────────────────
function injectCSS(css) {
  let el = document.getElementById(THEME_ID)
  if (!el) { el = document.createElement("style"); el.id = THEME_ID; document.head.appendChild(el) }
  el.textContent = css
}
function removeCSS() { document.getElementById(THEME_ID)?.remove() }

// ═════════════════════════════════════════════════════════════════════════════
// ═════════════════════════════════════════════════════════════════════════════
//  LAYOUT INSPECTOR — hover highlight only; all editing done inside the panel
// ═════════════════════════════════════════════════════════════════════════════

let currentInspEl = null   // currently selected element

function enableInspector() {
  if (inspectorActive) return
  inspectorActive = true
  document.body.style.cursor = "crosshair"
  document.addEventListener("mouseover", onHover,         true)
  document.addEventListener("mouseout",  onHoverOut,      true)
  document.addEventListener("click",     onInspectorClick, true)
  document.addEventListener("keydown",   onEscKey,         true)
}

function disableInspector() {
  if (!inspectorActive) return
  inspectorActive = false
  document.body.style.cursor = ""
  document.removeEventListener("mouseover", onHover,          true)
  document.removeEventListener("mouseout",  onHoverOut,       true)
  document.removeEventListener("click",     onInspectorClick,  true)
  document.removeEventListener("keydown",   onEscKey,          true)
  clearOverlay()
  currentInspEl = null
}

function onEscKey(e) {
  if (e.key === "Escape") {
    disableInspector()
    chrome.runtime.sendMessage({ type: "INSPECTOR_CLOSED", ...stackState() })
  }
}

// ── Hover highlight ────────────────────────────────────────────────────────────
function onHover(e) {
  if (isInspEl(e.target)) return
  clearOverlay()
  const rect = e.target.getBoundingClientRect()
  const ov   = document.createElement("div")
  ov.id = OVERLAY_ID
  Object.assign(ov.style, {
    position: "fixed",
    top:    rect.top    + "px",
    left:   rect.left   + "px",
    width:  rect.width  + "px",
    height: rect.height + "px",
    outline: "2px dashed #a78bfa",
    background: "rgba(167,139,250,0.07)",
    pointerEvents: "none",
    zIndex: "2147483644",
    borderRadius: "2px",
    boxSizing: "border-box",
  })
  // Tag badge
  const badge = document.createElement("div")
  badge.id = BADGE_ID
  badge.textContent = e.target.tagName.toLowerCase()
  Object.assign(badge.style, {
    position: "fixed",
    top:  Math.max(0, rect.top - 20) + "px",
    left: rect.left + "px",
    background: "#a78bfa", color: "#fff",
    fontSize: "10px", fontWeight: "700",
    padding: "2px 6px", borderRadius: "4px 4px 0 0",
    pointerEvents: "none", zIndex: "2147483645",
    fontFamily: "monospace",
  })
  document.body.appendChild(ov)
  document.body.appendChild(badge)
}

function onHoverOut(e) {
  if (isInspEl(e.target)) return
  clearOverlay()
}

function clearOverlay() {
  document.getElementById(OVERLAY_ID)?.remove()
  document.getElementById(BADGE_ID)?.remove()
}

function isInspEl(el) { return false }  // nothing is "inspector UI" on page now

// ── Click — collect computed styles and send to extension panel ───────────────
function onInspectorClick(e) {
  e.preventDefault()
  e.stopPropagation()
  clearOverlay()

  const el  = e.target
  currentInspEl = el
  const cs  = window.getComputedStyle(el)
  const tag = el.tagName.toLowerCase()
  const cls = typeof el.className === "string" ? el.className.trim().split(/\s+/).filter(Boolean).slice(0,2).map(c=>"."+c).join(" ") : ""
  const id  = el.id ? "#" + el.id : ""

  // Outline selected element
  glow(el)

  function parseRgbToHex(str) {
    const m = str && str.match(/\d+/g)
    if (!m) return "#000000"
    return "#" + m.slice(0,3).map(v => (+v).toString(16).padStart(2,"0")).join("")
  }

  function findBgHex(node) {
    while (node) {
      const bg = window.getComputedStyle(node).backgroundColor
      if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") return parseRgbToHex(bg)
      node = node.parentElement
    }
    return "#ffffff"
  }

  // Send all computed styles to the popup panel via chrome.runtime
  chrome.runtime.sendMessage({
    type: "ELEMENT_PICKED",
    tag,
    label: (id || cls || "<" + tag + ">").slice(0, 40),
    selector: buildSelector(el),
    styles: {
      fontSize:     parseFloat(cs.fontSize)      || 16,
      lineHeight:   parseFloat(cs.lineHeight)    || 24,
      letterSpacing:parseFloat(cs.letterSpacing) || 0,
      fontWeight:   cs.fontWeight                || "400",
      paddingTop:   parseFloat(cs.paddingTop)    || 0,
      paddingRight: parseFloat(cs.paddingRight)  || 0,
      paddingBottom:parseFloat(cs.paddingBottom) || 0,
      paddingLeft:  parseFloat(cs.paddingLeft)   || 0,
      marginTop:    parseFloat(cs.marginTop)     || 0,
      marginRight:  parseFloat(cs.marginRight)   || 0,
      marginBottom: parseFloat(cs.marginBottom)  || 0,
      marginLeft:   parseFloat(cs.marginLeft)    || 0,
      width:        parseFloat(cs.width)         || 0,
      height:       parseFloat(cs.height)        || 0,
      borderRadius: parseFloat(cs.borderRadius)  || 0,
      color:        parseRgbToHex(cs.color),
      backgroundColor: findBgHex(el),
    }
  })
}

// Build a reliable CSS selector for the element
function buildSelector(el) {
  if (el.id) return "#" + el.id
  const tag = el.tagName.toLowerCase()
  let idx = 1
  let sib = el.previousElementSibling
  while (sib) { if (sib.tagName === el.tagName) idx++; sib = sib.previousElementSibling }
  const parent = el.parentElement
  if (!parent || parent === document.body) return tag + ":nth-of-type(" + idx + ")"
  return buildSelector(parent) + " > " + tag + ":nth-of-type(" + idx + ")"
}

// ── Apply live style to the selected element (called from popup via message) ──
// This is used for live preview as user drags sliders in the panel


// ─── Fix label helper ─────────────────────────────────────────────────────────
function fixLabel(fix) {
  if (!fix) return "Fix"
  const map = {
    setAttribute:     "Set " + (fix.attribute||"attr") + " on " + (fix.selector||"element"),
    removeAttribute:  "Remove " + (fix.attribute||"attr"),
    setStyle:         "Style " + (fix.selector||"element"),
    setStyleImportant:"Style " + (fix.selector||"element"),
    setInnerText:     "Edit text",
    addClass:         "Add class",
    replaceHtml:      "Replace HTML",
    replaceTag:       "Change tag to <" + (fix.tag||"?") + ">",
    wrapMain:         "Wrap in <main>",
    wrapWithMain:     "Wrap in <main>",
    ensureH1:         "Add <h1>",
    multifix:         "Apply " + ((fix.fixes||[]).length) + " fixes",
  }
  return map[fix.type] || fix.type
}

// ─── Undo toast on page ───────────────────────────────────────────────────────
function showUndoToast(msg) {
  const existing = document.getElementById("__cksa_undo_toast")
  if (existing) existing.remove()
  const el = document.createElement("div")
  el.id = "__cksa_undo_toast"
  Object.assign(el.style, {
    position: "fixed", bottom: "16px", left: "50%",
    transform: "translateX(-50%)",
    background: "#1e1040", border: "1px solid #a78bfa",
    color: "#c4b5fd", fontSize: "11px", fontWeight: "700",
    padding: "7px 16px", borderRadius: "8px",
    zIndex: "2147483647", pointerEvents: "none",
    whiteSpace: "nowrap", boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
  })
  el.textContent = msg
  document.body.appendChild(el)
  setTimeout(() => el.remove(), 2200)
}

//  FIX ENGINE  (mirrors applyFix.js + heuristics.js)
// ═════════════════════════════════════════════════════════════════════════════
function applyFix(fix) {
  if (!fix?.type) return "no-op"
  switch (fix.type) {
    case "setAttribute": {
      const els = document.querySelectorAll(fix.selector)
      if (!els.length) throw new Error("No elements: " + fix.selector)
      els.forEach(el => el.setAttribute(fix.attribute, fix.value))
      els.forEach(glow); return `setAttribute(${fix.attribute})`
    }
    case "removeAttribute": {
      document.querySelectorAll(fix.selector).forEach(el => el.removeAttribute(fix.attribute))
      return `removeAttribute`
    }
    case "setStyle": {
      document.querySelectorAll(fix.selector).forEach(el => { el.style[fix.style] = fix.styleValue })
      return "setStyle"
    }
    case "setStyleImportant": {
      document.querySelectorAll(fix.selector).forEach(el => el.style.setProperty(fix.style, fix.styleValue, "important"))
      return "setStyleImportant"
    }
    case "setInnerText": {
      document.querySelectorAll(fix.selector).forEach(el => { el.textContent = fix.value })
      return "setInnerText"
    }
    case "addClass": {
      document.querySelectorAll(fix.selector).forEach(el => el.classList.add(fix.value))
      return "addClass"
    }
    case "replaceHtml": {
      const el = document.querySelector(fix.selector)
      if (el) el.outerHTML = fix.value
      return "replaceHtml"
    }
    case "replaceTag": {
      const el = document.querySelector(fix.selector)
      if (!el) throw new Error("Not found: " + fix.selector)
      const n = document.createElement(fix.tag)
      n.innerHTML = el.innerHTML
      Array.from(el.attributes).forEach(a => n.setAttribute(a.name, a.value))
      el.parentNode.replaceChild(n, el)
      glow(n); return `replaceTag → <${fix.tag}>`
    }
    case "wrapMain": case "wrapWithMain": {
      if (document.querySelector("main")) return "main exists"
      if (fix.selector) {
        const el = document.querySelector(fix.selector)
        if (el) { const m = document.createElement("main"); el.replaceWith(m); m.appendChild(el); glow(m); return "wrapWithMain" }
      }
      const m = document.createElement("main")
      Array.from(document.body.children).forEach(c => {
        if (!["HEADER","NAV","FOOTER"].includes(c.tagName)) m.appendChild(c)
      })
      document.body.appendChild(m); glow(m); return "wrapMain"
    }
    case "ensureH1": {
      if (document.querySelector("h1")) return "h1 exists"
      const h = document.createElement("h1")
      h.textContent = document.title || "Main Heading"
      h.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap"
      document.body.insertBefore(h, document.body.firstChild)
      return "ensureH1"
    }
    case "multifix":
      return (fix.fixes||[]).map(f => { try { return applyFix(f) } catch(e) { return "FAIL:"+e.message } })
    default: return "unknown: " + fix.type
  }
}

function glow(el) {
  if (!el?.style) return
  const p = el.style.outline, po = el.style.outlineOffset
  el.style.outline = "3px solid #a78bfa"
  el.style.outlineOffset = "3px"
  setTimeout(() => { el.style.outline = p; el.style.outlineOffset = po }, 2200)
}
