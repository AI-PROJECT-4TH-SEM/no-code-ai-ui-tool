const THEME_ID   = "__cksa_theme"
const OVERLAY_ID = "__cksa_overlay"
const PANEL_ID   = "__cksa_panel"
const BADGE_ID   = "__cksa_badge"
const GLOBAL_THEME_KEY = "global_website_theme"
let lastThemePageKey = null

// Inject global theme manager for cross-page theme application
function injectGlobalThemeManager() {
  if (document.getElementById('global-theme-manager-script')) return

  const script = document.createElement('script')
  script.id = 'global-theme-manager-script'
  script.src = chrome.runtime.getURL('global-theme-manager.js')
  document.head.appendChild(script)
}

function normalizePageKey(url) {
  if (!url) return ""
  try {
    const parsed = new URL(url, location.origin)
    return parsed.origin
  } catch {
    const raw = String(url)
    const match = raw.match(/^https?:\/\/[^/]+/i)
    return match ? match[0] : raw.split("#")[0].split("?")[0]
  }
}

function isReloadNavigation() {
  try {
    const navEntries = performance.getEntriesByType("navigation")
    if (navEntries?.length && navEntries[0]?.type === "reload") return true
  } catch { }

  try {
    return performance.navigation && performance.navigation.type === 1
  } catch {
    return false
  }
}

async function clearThemeOnReloadIfNeeded() {
  if (!isReloadNavigation()) return

  const pageKey = normalizePageKey(location.href)
  if (!pageKey) return

  try {
    await chrome.runtime.sendMessage({ type: "CLEAR_THEME", pageKey })
  } catch { }

  removeCSS()
  if (typeof window !== "undefined" && window.globalThemeManager) {
    window.globalThemeManager.removeTheme()
  }
}

async function syncThemeForCurrentPage(force = false) {
  const pageKey = normalizePageKey(location.href)
  if (!pageKey) return
  if (!force && pageKey === lastThemePageKey) return
  lastThemePageKey = pageKey

  try {
    const res = await chrome.runtime.sendMessage({ type: "LOAD_THEME", pageKey })
    if (res?.theme?.css) {
      injectCSS(res.theme.css)
      // Also apply globally using sessionStorage
      if (typeof window !== 'undefined' && window.globalThemeManager) {
        window.globalThemeManager.applyTheme(res.theme)
      }
    } else {
      removeCSS()
      if (typeof window !== 'undefined' && window.globalThemeManager) {
        window.globalThemeManager.removeTheme()
      }
    }
  } catch {
    removeCSS()
  }
}

let inspectorActive = false
let selectedEl      = null
let originalStyles  = {}
let dragModeActive  = false
let draggedEl       = null
let dragOffsetX     = 0
let dragOffsetY     = 0
const DRAG_THRESHOLD = 6
let dragHandleEl = null
let hoveredDragElement = null
let chatPickModeActive = false

const MAX_STACK  = 20
let undoStack    = []   
let redoStack    = []

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

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  switch (msg.type) {
    case "PING":       sendResponse({ alive: true }); return true
    case "APPLY_FIX": {
      const label = fixLabel(msg.domFix)
      pushUndo(label)                      
      try {
        const result = applyFix(msg.domFix)
        sendResponse({ success: true, result, ...stackState() })
      } catch (e) {
        undoStack.pop()                    
        sendResponse({ success: false, error: e.message, ...stackState() })
      }
      return true
    }
    case "APPLY_THEME":
      try {
        pushUndo("Theme: " + (msg.name || "applied"))
        injectCSS(msg.css)
        lastThemePageKey = normalizePageKey(location.href)
        sendResponse({ success: true, ...stackState() })
      }
      catch (e) { undoStack.pop(); sendResponse({ success: false, error: e.message }) }
      return true

    case "REMOVE_THEME":
      pushUndo("Remove theme")
      removeCSS()
      lastThemePageKey = normalizePageKey(location.href)
      sendResponse({ success: true, ...stackState() })
      return true

    case "APPLY_LAYOUT": {
      
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
    case "APPLY_TEXT_CONTENT": {
      try {
        const selector = String(msg.selector || "").trim()
        const els = resolveSelector(selector)
        if (!els.length) {
          sendResponse({ success: false, error: "Element not found for text update", ...stackState() })
          return true
        }

        const nextText = msg.text == null ? "" : String(msg.text)
        const mode = msg.mode === "append" ? "append" : "replace"
        const label = mode === "append" ? "Text append" : "Text replace"
        pushUndo(label + ": " + selector.slice(0, 36))

        els.forEach(el => {
          if (mode === "append") el.textContent = (el.textContent || "") + nextText
          else el.textContent = nextText
          const mark = el.id ? "#" + el.id : el.tagName.toLowerCase()
          el.setAttribute("data-cksa-layout", mark + " — text edited")
          glow(el)
        })

        chrome.runtime.sendMessage({ type: "LAYOUT_APPLIED", ...stackState() }).catch(() => {})
        sendResponse({ success: true, count: els.length, ...stackState() })
      } catch (e) {
        sendResponse({ success: false, error: e.message, ...stackState() })
      }
      return true
    }
    case "TOGGLE_INSPECTOR":
      if (msg.active) {
        disableDragMode()
        enableInspector()
      } else {
        disableInspector()
      }
      sendResponse({ success: true }); return true

    case "TOGGLE_DRAG_MODE":
      if (msg.active) {
        disableInspector()
        enableDragMode()
      } else {
        disableDragMode()
      }
      sendResponse({ success: true, ...stackState() }); return true

    case "TOGGLE_CLICK_MOVE":
      clickMoveMode = !!msg.active && dragModeActive
      clickMoveArmed = false
      sendResponse({ success: true, clickMoveMode, ...stackState() }); return true

    case "GET_DRAG_ENGINE_OPTIONS":
      sendResponse({ success: true, options: dragEngineOptions, ...stackState() })
      return true

    case "SET_DRAG_ENGINE_OPTIONS":
      sendResponse({ success: true, options: setDragEngineOptions(msg.options || {}), ...stackState() })
      return true

    case "ADD_DRAG_IMAGE": {
      const result = addDragImage(msg.dataUrl, msg.name)
      sendResponse({ ...result, ...stackState() })
      return true
    }

    case "RESET_ALL_MOVES":
      resetAllMoves()
      sendResponse({ success: true, ...stackState() }); return true

    case "RESET_LAST_MOVE": {
      const success = resetLastMovedElement()
      sendResponse({ success, ...stackState() })
      return true
    }

    case "GET_STACK_STATE":
      sendResponse(stackState()); return true

    case "CAPTURE_DOWNLOAD": {
      const result = capturePageForDownload()
      sendResponse(result); return true
    }

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

    case "GET_HTML": {
     
      const layoutChanges = []
      document.querySelectorAll("[data-cksa-layout]").forEach(el => {
        const selector = el.id ? "#" + el.id
          : el.className && typeof el.className === "string"
            ? "." + el.className.trim().split(/\s+/)[0]
            : el.tagName.toLowerCase()
        layoutChanges.push({
          tag:      el.tagName.toLowerCase(),
          selector: selector,
          label:    el.getAttribute("data-cksa-layout") || "",
          style:    el.getAttribute("style") || "",
        })
      })

      const themeEl  = document.getElementById("__cksa_theme")
      const themeCss = themeEl ? themeEl.textContent : null

      sendResponse({
        html:          document.documentElement.outerHTML,
        layoutChanges,
        themeCss,
        ...stackState()
      })
      return true
    }

    case "APPLY_LIVE_STYLE": {
      try {
        const el = document.querySelector(msg.selector)
        if (el && msg.prop && msg.value !== undefined) {
          if (msg.pushUndo) {
           
            pushUndo("Layout " + msg.prop + ": " + msg.value)
          }
          el.style[msg.prop] = msg.value
        }
        sendResponse({ success: true, ...stackState() })
      } catch(e) { sendResponse({ success: false }) }
      return true
    }

    case "BAKE_LAYOUT": {
      try {
        pushUndo("Layout: " + (msg.label || "element"))
        const el = document.querySelector(msg.selector)
        if (el && msg.styles) {
          Object.entries(msg.styles).forEach(([prop, val]) => {
            if (val !== null && val !== undefined && val !== "") el.style[prop] = val
          })
        
          const id = el.id ? "#" + el.id : (el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/)[0] : el.tagName.toLowerCase())
          el.setAttribute("data-cksa-layout", id + " — styles edited")
        }
      
        chrome.runtime.sendMessage({ type: "LAYOUT_APPLIED", ...stackState() }).catch(() => {})
        sendResponse({ success: true, ...stackState() })
      } catch(e) { undoStack.pop(); sendResponse({ success: false, error: e.message }) }
      return true
    }

    case "PICK_FOR_CHAT": {
      try {
        const el = document.querySelector(msg.selector)
        if (!el) {
          sendResponse({ success: false, error: "Element not found" })
          return true
        }
        const info = {
          selector: msg.selector,
          tag: el.tagName.toLowerCase(),
          label: elementLabel(el),
          id: el.id || null,
          className: el.className || null,
        }
        chrome.runtime.sendMessage({ type: "CHAT_ELEMENT_PICKED", info }).catch(() => {})
        sendResponse({ success: true })
      } catch (e) {
        sendResponse({ success: false, error: e.message })
      }
      return true
    }

    case "ENABLE_CHAT_PICK_MODE": {
      chatPickModeActive = true
      if (chatPickModeActive) {
        document.body.style.cursor = "pointer"
      }
      sendResponse({ success: true })
      return true
    }

    case "DISABLE_CHAT_PICK_MODE": {
      chatPickModeActive = false
      document.body.style.cursor = "auto"
      sendResponse({ success: true })
      return true
    }
  }
})

// Chat pick mode click listener - allows selecting elements directly from chat tab
document.addEventListener("click", (e) => {
  if (!chatPickModeActive) return
  e.preventDefault()
  e.stopPropagation()
  
  const el = e.target
  const selector = buildSelector(el)
  const info = {
    selector,
    tag: el.tagName.toLowerCase(),
    label: elementLabel(el),
    id: el.id || null,
    className: el.className || null,
  }
  
  chrome.runtime.sendMessage({ type: "CHAT_ELEMENT_PICKED", info }).catch(() => {})
}, true)

function injectCSS(css) {
  let el = document.getElementById(THEME_ID)
  if (!el) { el = document.createElement("style"); el.id = THEME_ID; document.head.appendChild(el) }
  el.textContent = css
}
function removeCSS() { document.getElementById(THEME_ID)?.remove() }


let currentInspEl = null  

function enableInspector() {
  if (inspectorActive) return
  inspectorActive = true
  document.body.style.cursor = "crosshair"
  document.addEventListener("mouseover", onHover,         true)
  document.addEventListener("mouseout",  onHoverOut,      true)
  document.addEventListener("click",     onInspectorClick, true)
  document.addEventListener("dblclick",  onInspectorDoubleClick, true)
  document.addEventListener("keydown",   onEscKey,         true)
}

function disableInspector() {
  if (!inspectorActive) return
  inspectorActive = false
  document.body.style.cursor = ""
  document.removeEventListener("mouseover", onHover,          true)
  document.removeEventListener("mouseout",  onHoverOut,       true)
  document.removeEventListener("click",     onInspectorClick,  true)
  document.removeEventListener("dblclick",  onInspectorDoubleClick, true)
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

function isInspEl(el) { return false }  

function getElementTextForEditor(el) {
  if (!el) return ""
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) return el.value || ""
  return (el.textContent || "").replace(/\s+/g, " ").trim()
}

function sendInspectorElementPicked(el) {
  const cs  = window.getComputedStyle(el)
  const tag = el.tagName.toLowerCase()
  const cls = typeof el.className === "string" ? el.className.trim().split(/\s+/).filter(Boolean).slice(0,2).map(c=>"."+c).join(" ") : ""
  const id  = el.id ? "#" + el.id : ""

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

  chrome.runtime.sendMessage({
    type: "ELEMENT_PICKED",
    tag,
    label: (id || cls || "<" + tag + ">").slice(0, 40),
    selector: buildSelector(el),
    currentText: getElementTextForEditor(el),
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

function onInspectorClick(e) {
  e.preventDefault()
  e.stopPropagation()
  clearOverlay()

  const el  = e.target
  currentInspEl = el
  glow(el)
  sendInspectorElementPicked(el)
}

function onInspectorDoubleClick(e) {
  if (!inspectorActive) return
  if (e.button !== 0) return
  const el = e.target
  if (!(el instanceof Element)) return
  if (isInspEl(el)) return
  const text = getElementTextForEditor(el)
  if (!text) return

  e.preventDefault()
  e.stopPropagation()
  clearOverlay()

  currentInspEl = el
  glow(el)
  sendInspectorElementPicked(el)
}

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

function fixLabel(fix) {
  if (!fix?.type) return "Unknown fix"
  return fix.type + (fix.selector ? ` → ${fix.selector.substring(0, 30)}` : "")
}

function getHueRotationDegrees(hexColor) {
  // Simple hue rotation calculator based on hex color
  const hex = String(hexColor || "#000").replace("#", "")
  if (hex.length === 6) {
    const r = parseInt(hex.substring(0, 2), 16) / 255
    const g = parseInt(hex.substring(2, 4), 16) / 255
    const b = parseInt(hex.substring(4, 6), 16) / 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    if (max === r) h = ((g - b) / (max - min)) % 6
    else if (max === g) h = (b - r) / (max - min) + 2
    else h = (r - g) / (max - min) + 4
    h = Math.round((h * 60 + 360) % 360)
    return h
  }
  return 0
}

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
    // Chatbot fixes
    setColorAdvanced: "Color: " + (fix.styleValue||"#000"),
    setBackgroundColorAdvanced: "Background: " + (fix.styleValue||"#fff"),
    setIconColorAdvanced: "Icon color: " + (fix.styleValue||"#000"),
    setImageColorAdvanced: "Image color: " + (fix.styleValue||"#000"),
    setTextColorUniversal: "Text color: " + (fix.styleValue||"#000"),
    setHeaderTextColorAdvanced: "Header color: " + (fix.styleValue||"#000"),
    setGradientBackground: "Gradient background",
  }
  return map[fix.type] || fix.type
}

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

/**
 * Enhanced selector resolution to handle complex selectors like #vector-main-menu-dropdown-checkbox
 * Tries multiple strategies to find matching elements
 */
function resolveSelector(selector) {
  if (!selector) return []
  
  // Strategy 1: Direct querySelectorAll (handles IDs, classes, attributes, etc.)
  try {
    const els = document.querySelectorAll(selector)
    if (els.length > 0) return Array.from(els)
  } catch (e) {
    console.warn("⚠️ Selector parse error:", selector, e.message)
  }
  
  // Strategy 2: If selector starts with #, try as ID
  if (selector.startsWith("#")) {
    const idName = selector.substring(1)
    const el = document.getElementById(idName)
    if (el) return [el]
  }
  
  // Strategy 3: If selector contains -, try as data-attribute or special case
  if (selector.includes("-")) {
    // Try as element with data-* attributes
    const parts = selector.split("-")
    const dataSelectors = [
      `[data-id="${selector}"]`,
      `[data-${parts[0]}]`,
      `[name*="${parts[parts.length-1]}"]`
    ]
    for (const sel of dataSelectors) {
      try {
        const els = document.querySelectorAll(sel)
        if (els.length > 0) return Array.from(els)
      } catch (e) {}
    }
  }
  
  // Strategy 4: Try case-insensitive attribute matching
  try {
    const xpath = `//*[@*[contains(translate(@*, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${selector.toLowerCase()}')]]`
    const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
    if (result.snapshotLength > 0) {
      const arr = []
      for (let i = 0; i < result.snapshotLength; i++) {
        arr.push(result.snapshotItem(i))
      }
      return arr
    }
  } catch (e) {}
  
  return []
}

function applyFix(fix) {
  if (!fix?.type) return "no-op"
  
  // Resolve selector with enhanced strategies
  const resolveElements = (selector) => {
    const els = resolveSelector(selector)
    if (!els.length) {
      throw new Error(`Selector not found: "${selector}" (tried multiple resolution strategies)`)
    }
    return els
  }
  
  switch (fix.type) {
    case "setAttribute": {
      const els = resolveElements(fix.selector)
      els.forEach(el => {
        el.setAttribute(fix.attribute, fix.value)
        glow(el)
      })
      return `✓ setAttribute(${fix.attribute}) on ${els.length} element(s)`
    }
    
    case "removeAttribute": {
      const els = resolveElements(fix.selector)
      els.forEach(el => {
        el.removeAttribute(fix.attribute)
        glow(el)
      })
      return `✓ removeAttribute on ${els.length} element(s)`
    }
    
    case "setStyle": {
      const els = resolveElements(fix.selector)
      els.forEach(el => {
        el.style[fix.style] = fix.styleValue
        glow(el)
      })
      return `✓ setStyle(${fix.style}) on ${els.length} element(s)`
    }
    
    case "setStyleImportant": {
      const els = resolveElements(fix.selector)
      
      els.forEach(el => {
        // Support for all CSS properties including filters, transforms, etc.
        const cssProperty = fix.style.replace(/([A-Z])/g, "-$1").toLowerCase()
        const cssValue = String(fix.styleValue || "").trim()
        
        if (!cssValue) {
          console.warn("⚠️ Empty value for property:", cssProperty)
          return
        }
        
        el.style.setProperty(cssProperty, cssValue, "important")
        glow(el)
        
        // Log what was applied
        console.log(`✓ Applied ${cssProperty}: ${cssValue.substring(0, 50)}...`)
      })
      
      return `✓ setStyleImportant(${fix.style}) on ${els.length} element(s): ${String(fix.styleValue).substring(0, 60)}`
    }
    
    case "setInnerText": {
      const els = resolveElements(fix.selector)
      els.forEach(el => {
        el.textContent = fix.value
        glow(el)
      })
      return `✓ setInnerText on ${els.length} element(s)`
    }
    
    case "addClass": {
      const els = resolveElements(fix.selector)
      els.forEach(el => {
        el.classList.add(fix.value)
        glow(el)
      })
      return `✓ addClass(${fix.value}) on ${els.length} element(s)`
    }
    
    case "replaceHtml": {
      const els = resolveElements(fix.selector)
      if (!els.length) throw new Error("Not found: " + fix.selector)
      els.forEach(el => {
        el.outerHTML = fix.value
      })
      return "✓ replaceHtml"
    }
    
    case "replaceTag": {
      const els = resolveElements(fix.selector)
      els.forEach(el => {
        const n = document.createElement(fix.tag)
        n.innerHTML = el.innerHTML
        Array.from(el.attributes).forEach(a => n.setAttribute(a.name, a.value))
        el.parentNode.replaceChild(n, el)
        glow(n)
      })
      return `✓ replaceTag → <${fix.tag}>`
    }
    
    case "wrapMain":
    case "wrapWithMain": {
      if (document.querySelector("main")) return "main exists"
      if (fix.selector) {
        const el = document.querySelector(fix.selector)
        if (el) {
          const m = document.createElement("main")
          el.replaceWith(m)
          m.appendChild(el)
          glow(m)
          return "✓ wrapWithMain"
        }
      }
      const m = document.createElement("main")
      Array.from(document.body.children).forEach(c => {
        if (!["HEADER", "NAV", "FOOTER"].includes(c.tagName)) m.appendChild(c)
      })
      document.body.appendChild(m)
      glow(m)
      return "✓ wrapMain"
    }
    
    case "ensureH1": {
      if (document.querySelector("h1")) return "h1 exists"
      const h = document.createElement("h1")
      h.textContent = document.title || "Main Heading"
      h.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap"
      document.body.insertBefore(h, document.body.firstChild)
      return "✓ ensureH1"
    }
    
    case "multifix":
      return (fix.fixes || []).map(f => {
        try {
          return applyFix(f)
        } catch (e) {
          console.error("❌ multifix error:", e.message)
          return "FAIL: " + e.message
        }
      })
    
    // ===== Advanced Color Fixes (Chatbot) =====
    case "setColorAdvanced": {
      const els = resolveElements(fix.selector)
      const color = String(fix.styleValue || "#000").trim()
      els.forEach(el => {
        el.style.setProperty("color", color, "important")
        el.style.setProperty("-webkit-text-fill-color", color, "important")
        glow(el)
      })
      return `✓ setColorAdvanced on ${els.length} element(s): ${color}`
    }

    case "setBackgroundColorAdvanced": {
      const els = resolveElements(fix.selector)
      const color = String(fix.styleValue || "#fff").trim()
      els.forEach(el => {
        el.style.setProperty("background-color", color, "important")
        el.style.setProperty("background-image", "none", "important")
        glow(el)
      })
      return `✓ setBackgroundColorAdvanced on ${els.length} element(s): ${color}`
    }

    case "setIconColorAdvanced": {
      const els = resolveElements(fix.selector)
      const color = String(fix.styleValue || "#000").trim()
      els.forEach(el => {
        // For SVG icons
        if (el.tagName === "SVG" || el.querySelector("svg")) {
          const svgs = el.tagName === "SVG" ? [el] : el.querySelectorAll("svg")
          svgs.forEach(svg => {
            svg.style.setProperty("color", color, "important")
            svg.querySelectorAll("path, circle, rect, polygon, polyline, line, text, tspan").forEach(shape => {
              shape.style.setProperty("fill", color, "important")
              shape.style.setProperty("stroke", color, "important")
            })
          })
        }
        // For icon images
        if (el.tagName === "IMG") {
          el.style.setProperty("filter", `hue-rotate(${getHueRotationDegrees(color)}deg)`, "important")
        }
        glow(el)
      })
      return `✓ setIconColorAdvanced on ${els.length} element(s): ${color}`
    }

    case "setImageColorAdvanced": {
      const els = resolveElements(fix.selector)
      const color = String(fix.styleValue || "#000").trim()
      els.forEach(el => {
        // Apply color filter to images
        if (el.tagName === "IMG" || el.querySelector("img")) {
          const imgs = el.tagName === "IMG" ? [el] : el.querySelectorAll("img")
          imgs.forEach(img => {
            img.style.setProperty("filter", `hue-rotate(${getHueRotationDegrees(color)}deg) saturate(1.2)`, "important")
            img.style.setProperty("opacity", "0.95", "important")
          })
        }
        glow(el)
      })
      return `✓ setImageColorAdvanced on ${els.length} element(s): ${color}`
    }

    case "setTextColorUniversal": {
      const els = resolveElements(fix.selector)
      const color = String(fix.styleValue || "#000").trim()
      els.forEach(el => {
        // Apply to element itself
        el.style.setProperty("color", color, "important")
        
        // Apply to all children
        const allChildren = el.querySelectorAll("*")
        allChildren.forEach(child => {
          child.style.setProperty("color", color, "important")
          if (child.hasChildNodes()) {
            child.childNodes.forEach(node => {
              if (node.nodeType === 3 && node.textContent.trim()) {
                // Create span wrapper for text nodes if needed
                if (node.parentElement === el) {
                  const span = document.createElement("span")
                  span.style.setProperty("color", color, "important")
                  span.textContent = node.textContent
                  node.parentNode.replaceChild(span, node)
                }
              }
            })
          }
        })
        glow(el)
      })
      return `✓ setTextColorUniversal on ${els.length} element(s): ${color}`
    }

    case "setHeaderTextColorAdvanced": {
      const headerSelectors = ["h1", "h2", "h3", "h4", "h5", "h6", "header", "[role='banner']", ".header", ".navbar"]
      const els = document.querySelectorAll(headerSelectors.join(","))
      if (!els.length) throw new Error("No header elements found")
      const color = String(fix.styleValue || "#000").trim()
      els.forEach(el => {
        el.style.setProperty("color", color, "important")
        glow(el)
      })
      return `✓ setHeaderTextColorAdvanced on ${els.length} header element(s): ${color}`
    }

    case "setGradientBackground": {
      const els = resolveElements(fix.selector)
      const colors = Array.isArray(fix.colors) ? fix.colors : [fix.styleValue]
      const gradient = `linear-gradient(135deg, ${colors.join(", ")})`
      els.forEach(el => {
        el.style.setProperty("background-image", gradient, "important")
        el.style.setProperty("background-color", "unset", "important")
        glow(el)
      })
      return `✓ setGradientBackground on ${els.length} element(s)`
    }

    // ===== ADVANCED CSS FEATURES =====
    case "setComplexStyle": {
      const els = resolveElements(fix.selector)
      const styleValue = String(fix.styleValue || "").trim()
      
      els.forEach(el => {
        // Parse complex styles like "filter: blur(8px)" or "transform: rotate(45deg)"
        const parts = styleValue.split(":")
        if (parts.length >= 2) {
          const prop = parts[0].trim()
          const value = parts.slice(1).join(":").trim()
          el.style.setProperty(prop, value, "important")
        } else {
          el.style.setProperty("", styleValue, "important")
        }
        glow(el)
      })
      return `✓ setComplexStyle on ${els.length} element(s): ${styleValue.substring(0, 50)}`
    }

    case "setFlexboxAdvanced": {
      const els = resolveElements(fix.selector)
      const styleValue = String(fix.styleValue || "").trim()
      
      els.forEach(el => {
        el.style.setProperty("display", "flex", "important")
        
        // Map user-friendly flexbox values to CSS properties
        if (styleValue === "center") {
          el.style.setProperty("justify-content", "center", "important")
          el.style.setProperty("align-items", "center", "important")
        } else if (styleValue === "space-between") {
          el.style.setProperty("justify-content", "space-between", "important")
          el.style.setProperty("align-items", "center", "important")
        } else if (styleValue === "space-around") {
          el.style.setProperty("justify-content", "space-around", "important")
          el.style.setProperty("align-items", "center", "important")
        } else if (styleValue === "column") {
          el.style.setProperty("flex-direction", "column", "important")
        } else if (styleValue === "row") {
          el.style.setProperty("flex-direction", "row", "important")
        } else if (styleValue.startsWith("flex:")) {
          el.style.setProperty("flex", styleValue.substring(5).trim(), "important")
        } else {
          el.style.setProperty("justify-content", styleValue, "important")
        }
        glow(el)
      })
      return `✓ setFlexboxAdvanced on ${els.length} element(s): ${styleValue}`
    }

    case "setGridAdvanced": {
      const els = resolveElements(fix.selector)
      const styleValue = String(fix.styleValue || "").trim()
      
      els.forEach(el => {
        el.style.setProperty("display", "grid", "important")
        
        if (styleValue.includes("repeat")) {
          el.style.setProperty("grid-template-columns", styleValue, "important")
        } else if (styleValue.includes("fr")) {
          el.style.setProperty("grid-template-columns", styleValue, "important")
        } else if (styleValue.includes("auto")) {
          el.style.setProperty("grid-auto-flow", styleValue, "important")
        } else {
          el.style.setProperty("grid-template-columns", styleValue, "important")
        }
        glow(el)
      })
      return `✓ setGridAdvanced on ${els.length} element(s): ${styleValue}`
    }

    case "setBorderAdvanced": {
      const els = resolveElements(fix.selector)
      const styleValue = String(fix.styleValue || "").trim()
      
      els.forEach(el => {
        el.style.setProperty("border", styleValue, "important")
        glow(el)
      })
      return `✓ setBorderAdvanced on ${els.length} element(s): ${styleValue}`
    }

    case "setTextAdvanced": {
      const els = resolveElements(fix.selector)
      const styleValue = String(fix.styleValue || "").trim()
      
      els.forEach(el => {
        // Map user-friendly text values to CSS properties
        if (styleValue === "uppercase") {
          el.style.setProperty("text-transform", "uppercase", "important")
        } else if (styleValue === "lowercase") {
          el.style.setProperty("text-transform", "lowercase", "important")
        } else if (styleValue === "capitalize") {
          el.style.setProperty("text-transform", "capitalize", "important")
        } else if (styleValue === "underline") {
          el.style.setProperty("text-decoration", "underline", "important")
        } else if (styleValue === "line-through") {
          el.style.setProperty("text-decoration", "line-through", "important")
        } else if (styleValue.includes("spacing:")) {
          el.style.setProperty("letter-spacing", styleValue.substring(8).trim(), "important")
        } else if (styleValue.includes("height:")) {
          el.style.setProperty("line-height", styleValue.substring(7).trim(), "important")
        } else {
          el.style.setProperty("text-transform", styleValue, "important")
        }
        glow(el)
      })
      return `✓ setTextAdvanced on ${els.length} element(s): ${styleValue}`
    }

    case "setShadowEffect": {
      const els = resolveElements(fix.selector)
      const styleValue = String(fix.styleValue || "").trim()
      
      els.forEach(el => {
        // Check if it's a box-shadow or text-shadow value
        if (styleValue.toLowerCase().includes("text")) {
          el.style.setProperty("text-shadow", styleValue, "important")
        } else {
          el.style.setProperty("box-shadow", styleValue, "important")
        }
        glow(el)
      })
      return `✓ setShadowEffect on ${els.length} element(s): ${styleValue.substring(0, 50)}`
    }

    case "setTransitionAnimations": {
      const els = resolveElements(fix.selector)
      const styleValue = String(fix.styleValue || "").trim()
      
      els.forEach(el => {
        // Detect if it's animation or transition
        if (styleValue.includes("animation") || styleValue.match(/\d+s.*spin|rotate|bounce/i)) {
          el.style.setProperty("animation", styleValue, "important")
        } else {
          el.style.setProperty("transition", styleValue, "important")
        }
        glow(el)
      })
      return `✓ setTransitionAnimations on ${els.length} element(s): ${styleValue.substring(0, 50)}`
    }

    case "setStructuralChange": {
      const els = resolveElements(fix.selector)
      
      const action = String(fix.action || "wrap").toLowerCase()
      const tag = String(fix.tag || "div").toLowerCase()
      const classes = Array.isArray(fix.classes) ? fix.classes : []
      
      let modified = 0
      els.forEach(el => {
        try {
          if (action === "wrap") {
            const wrapper = document.createElement(tag)
            if (classes.length) wrapper.className = classes.join(" ")
            el.parentNode.insertBefore(wrapper, el)
            wrapper.appendChild(el)
            modified++
            glow(wrapper)
          } else if (action === "replaceTag") {
            const newEl = document.createElement(tag)
            newEl.innerHTML = el.innerHTML
            Array.from(el.attributes).forEach(attr => {
              if (attr.name !== "data-cksa-layout") {
                newEl.setAttribute(attr.name, attr.value)
              }
            })
            if (classes.length) newEl.className = (newEl.className + " " + classes.join(" ")).trim()
            el.parentNode.replaceChild(newEl, el)
            modified++
            glow(newEl)
          } else if (action === "wrapElement") {
            const wrapper = document.createElement(tag)
            if (classes.length) wrapper.className = classes.join(" ")
            wrapper.style.cssText = "display: contents;"
            el.parentNode.insertBefore(wrapper, el)
            wrapper.appendChild(el)
            modified++
            glow(wrapper)
          }
        } catch (e) {
          console.warn("Structural change error:", e.message)
        }
      })
      return `✓ setStructuralChange(${action}) on ${modified} element(s)`
    }
    
    default:
      console.warn("⚠️ Unknown fix type:", fix.type, fix)
      throw new Error("Unknown fix type: " + fix.type)
  }
}


function glow(el) {
  if (!el?.style) return
  const p = el.style.outline, po = el.style.outlineOffset
  el.style.outline = "3px solid #a78bfa"
  el.style.outlineOffset = "3px"
  setTimeout(() => { el.style.outline = p; el.style.outlineOffset = po }, 2200)
}

/* ========== DRAG & DROP FUNCTIONALITY ========== */

let dragStartX = 0
let dragStartY = 0
let isCurrentlyDragging = false
let dragUndoPushed = false
let suppressClickUntil = 0
let suppressCarryDropUntil = 0
let lastDraggedElement = null
let lastMovedElement = null
let dragAxisLock = null
let selectedDragElement = null
let clickMoveMode = false
let clickMoveArmed = false
let carryActive = false
let carriedEl = null
let carryPlaceholder = null
let carryOffsetX = 0
let carryOffsetY = 0
let carryOriginalInlineStyle = null
let carryComputedSnapshot = null
let carryModifiedProps = new Set()
let carryOriginalParent = null
let carryWasDroppedInNewParent = false
let dragLastClientX = 0
let dragLastClientY = 0
const DRAG_ENGINE_STORAGE_KEY = "__cksa_drag_engine_options"
const DEFAULT_DRAG_ENGINE_OPTIONS = {
  freePlacement: true,
  snapToGrid: false,
  gridSize: 8,
  snapToEdges: true,
  boundary: true,
  duplicateOnAlt: true,
  autoScroll: true,
  rotateStep: 5,
  minSize: 24,
}

let dragEngineOptions = { ...DEFAULT_DRAG_ENGINE_OPTIONS }
let dragOverlayEl = null
let dragOverlayLabelEl = null
let dragOverlayHandles = null
let dragHandleOperation = null
let dragClipboardSnapshot = null
const dragSelection = new Set()
let dragA11yLiveRegion = null
let dragDirectCandidate = null

function ensureDragUiStyles() {
  if (document.getElementById("__cksa_drag_ui_styles")) return
  const style = document.createElement("style")
  style.id = "__cksa_drag_ui_styles"
  style.textContent = `
    #__cksa_drag_handle {
      position: fixed;
      width: 20px;
      height: 20px;
      border-radius: 999px;
      border: 1px solid #fff;
      background: #0f172a;
      color: #e2e8f0;
      display: none;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 800;
      z-index: 2147483647;
      box-shadow: 0 2px 10px rgba(0,0,0,0.35);
      cursor: pointer;
      pointer-events: auto;
      user-select: none;
      touch-action: none;
    }
    .cksa-drag-target-outline {
      outline: none !important;
      outline-offset: 0 !important;
    }
    .cksa-drag-selected-outline {
      box-shadow: none !important;
    }
    #__cksa_drag_sr_live {
      position: fixed;
      width: 1px;
      height: 1px;
      left: -9999px;
      top: -9999px;
      overflow: hidden;
    }
  `
  document.documentElement.appendChild(style)
}

function ensureDragA11yRegion() {
  if (dragA11yLiveRegion && document.contains(dragA11yLiveRegion)) return dragA11yLiveRegion
  dragA11yLiveRegion = document.getElementById("__cksa_drag_sr_live")
  if (!dragA11yLiveRegion) {
    dragA11yLiveRegion = document.createElement("div")
    dragA11yLiveRegion.id = "__cksa_drag_sr_live"
    dragA11yLiveRegion.setAttribute("aria-live", "polite")
    dragA11yLiveRegion.setAttribute("aria-atomic", "true")
    dragA11yLiveRegion.setAttribute("role", "status")
    document.documentElement.appendChild(dragA11yLiveRegion)
  }
  return dragA11yLiveRegion
}

function announceDrag(message) {
  const region = ensureDragA11yRegion()
  region.textContent = ""
  setTimeout(() => {
    region.textContent = String(message || "")
  }, 10)
}

function getDragSelectionElements() {
  return Array.from(dragSelection).filter(el => el && document.contains(el))
}

function syncDragSelectionVisuals() {
  document.querySelectorAll(".cksa-drag-selected-outline").forEach(el => el.classList.remove("cksa-drag-selected-outline"))
  getDragSelectionElements().forEach(el => el.classList.add("cksa-drag-selected-outline"))
}

function setDragSelection(el, { additive = false, toggle = false } = {}) {
  if (!el || !document.contains(el)) return
  if (!additive) dragSelection.clear()
  if (toggle && dragSelection.has(el)) dragSelection.delete(el)
  else dragSelection.add(el)
  selectedDragElement = el
  lastMovedElement = el
  syncDragSelectionVisuals()
}

function clearDragSelection() {
  dragSelection.clear()
  syncDragSelectionVisuals()
}

function onDragPointerDown(e) {
  if (!dragModeActive) return
  if (e.button !== 0) return
  if (clickMoveMode) return
  if (!(e.target instanceof Element)) return
  if (e.target.closest("#__cksa_drag_overlay, #__cksa_drag_handle, #__cksa_panel, #__cksa_overlay, #__cksa_badge")) return

  const target = resolveDragTarget(e.target)
  if (!target) return

  setDragSelection(target, {
    additive: e.shiftKey || e.ctrlKey || e.metaKey,
    toggle: e.shiftKey,
  })

  dragDirectCandidate = {
    el: target,
    startX: e.clientX,
    startY: e.clientY,
  }

  suppressClickUntil = Date.now() + 120
  e.preventDefault()
  e.stopPropagation()
}

function onDragPointerUpCapture() {
  dragDirectCandidate = null
}

function loadDragEngineOptions() {
  try {
    chrome.storage.local.get([DRAG_ENGINE_STORAGE_KEY], (data) => {
      const saved = data?.[DRAG_ENGINE_STORAGE_KEY]
      if (saved && typeof saved === "object") {
        dragEngineOptions = { ...DEFAULT_DRAG_ENGINE_OPTIONS, ...saved }
        syncDragOverlay()
      }
    })
  } catch { }
}

function persistDragEngineOptions() {
  try {
    chrome.storage.local.set({ [DRAG_ENGINE_STORAGE_KEY]: dragEngineOptions })
  } catch { }
}

function setDragEngineOptions(nextOptions = {}) {
  dragEngineOptions = { ...dragEngineOptions, ...nextOptions }
  persistDragEngineOptions()
  syncDragOverlay()
  chrome.runtime.sendMessage({
    type: "DRAG_ENGINE_OPTIONS_UPDATED",
    options: dragEngineOptions,
  }).catch(() => { })
  return dragEngineOptions
}

function getSelectedDragElement() {
  const selectedGroup = getDragSelectionElements()
  if (selectedGroup.length) {
    if (selectedDragElement && selectedGroup.includes(selectedDragElement)) return selectedDragElement
    return selectedGroup[selectedGroup.length - 1]
  }
  return (carryActive && carriedEl) || selectedDragElement || lastMovedElement || null
}

function getElementBoundsForDrag(el) {
  if (!el || !document.contains(el)) return null
  return el.getBoundingClientRect()
}

function getOffsetParentDocumentOrigin(el) {
  if (!el) return { left: 0, top: 0 }
  const parent = el.offsetParent
  if (!parent || parent === document.body || parent === document.documentElement) {
    return { left: 0, top: 0 }
  }
  const rect = parent.getBoundingClientRect()
  return {
    left: rect.left + window.scrollX + parent.clientLeft,
    top: rect.top + window.scrollY + parent.clientTop,
  }
}

function getFreePlacementNumber(el, prop, fallback = 0) {
  const datasetKey = "cksa" + prop.charAt(0).toUpperCase() + prop.slice(1)
  const raw = el?.dataset?.[datasetKey]
  if (raw !== undefined) {
    const parsed = parseFloat(raw)
    if (Number.isFinite(parsed)) return parsed
  }
  const inline = parseFloat(el?.style?.[prop])
  if (Number.isFinite(inline)) {
    if (prop === "left" || prop === "top") {
      const origin = getOffsetParentDocumentOrigin(el)
      return inline + (prop === "left" ? origin.left : origin.top)
    }
    return inline
  }
  const rect = getElementBoundsForDrag(el)
  if (!rect) return fallback
  if (prop === "left") return rect.left + window.scrollX
  if (prop === "top") return rect.top + window.scrollY
  if (prop === "width") return rect.width
  if (prop === "height") return rect.height
  return fallback
}

function setFreePlacementNumber(el, prop, value) {
  if (!el) return
  const datasetKey = "cksa" + prop.charAt(0).toUpperCase() + prop.slice(1)
  const nextValue = Math.round(value)
  if (prop === "left" || prop === "top") {
    const origin = getOffsetParentDocumentOrigin(el)
    const cssValue = nextValue - (prop === "left" ? origin.left : origin.top)
    el.style[prop] = Math.round(cssValue) + "px"
    el.dataset[datasetKey] = String(nextValue)
    return
  }
  el.style[prop] = nextValue + "px"
  el.dataset[datasetKey] = String(nextValue)
}

function getFreePlacementRotation(el) {
  const raw = el?.dataset?.cksaRotation
  const parsed = parseFloat(raw)
  return Number.isFinite(parsed) ? parsed : 0
}

function setFreePlacementRotation(el, degrees) {
  if (!el) return
  const nextRotation = Math.round(degrees * 10) / 10
  el.dataset.cksaRotation = String(nextRotation)
  const baseTransform = el.dataset.cksaBaseTransform || ""
  el.style.transformOrigin = "center center"
  el.style.transform = `${baseTransform} rotate(${nextRotation}deg)`.trim()
}

function promoteToFreePlacement(el) {
  if (!el || !document.contains(el)) return
  if (el.dataset.cksaFreePlacement === "true") return

  const rect = el.getBoundingClientRect()
  const computed = window.getComputedStyle(el)

  el.dataset.cksaFreePlacement = "true"
  el.dataset.cksaOriginalStyle = el.getAttribute("style") || ""
  el.dataset.cksaBaseTransform = computed.transform && computed.transform !== "none" ? computed.transform : ""

  // Use document-attached absolute positioning so dropped elements keep position while page scrolls.
  el.style.position = "absolute"
  setFreePlacementNumber(el, "left", Math.max(0, rect.left + window.scrollX))
  setFreePlacementNumber(el, "top", Math.max(0, rect.top + window.scrollY))
  setFreePlacementNumber(el, "width", Math.max(dragEngineOptions.minSize, rect.width))
  setFreePlacementNumber(el, "height", Math.max(dragEngineOptions.minSize, rect.height))
  el.style.margin = "0"
  el.style.zIndex = "2147483646"
  el.style.touchAction = "none"
  el.style.willChange = "transform,left,top,width,height"
  setFreePlacementRotation(el, getFreePlacementRotation(el))
}

function restoreOriginalInlineStyle(el) {
  if (!el) return
  const originalStyle = el.dataset.cksaOriginalStyle
  el.removeAttribute("data-cksa-free-placement")
  el.removeAttribute("data-cksa-original-style")
  el.removeAttribute("data-cksa-base-transform")
  el.removeAttribute("data-cksa-rotation")
  el.removeAttribute("data-cksa-left")
  el.removeAttribute("data-cksa-top")
  el.removeAttribute("data-cksa-width")
  el.removeAttribute("data-cksa-height")
  if (originalStyle !== undefined) {
    el.setAttribute("style", originalStyle)
  }
}

function enableDragMode() {
  if (dragModeActive) return
  dragModeActive = true
  ensureDragUiStyles()
  ensureDragA11yRegion()
  document.body.style.cursor = "grab"
  document.body.style.userSelect = "none"
  loadDragEngineOptions()
  ensureDragOverlay()
  document.addEventListener("pointerdown", onDragPointerDown, true)
  document.addEventListener("pointermove", onDragHoverMove, true)
  document.addEventListener("pointerup", onDragPointerUpCapture, true)
  document.addEventListener("click", onDragClickCapture, true)
  document.addEventListener("keydown", onDragKeyDown, true)
  document.addEventListener("keydown", onDragEscKey, true)

  syncDragOverlay()
  announceDrag("Drag mode enabled")
  chrome.runtime.sendMessage({ type: "DRAG_MODE_TOGGLED", active: true, hasChanges: !!lastMovedElement }).catch(() => { })
}

function disableDragMode() {
  if (!dragModeActive) return
  dragModeActive = false
  document.body.style.cursor = ""
  document.body.style.userSelect = ""
  clickMoveMode = false
  clickMoveArmed = false
  dragDirectCandidate = null
  document.removeEventListener("pointerdown", onDragPointerDown, true)
  document.removeEventListener("pointermove", onDragHoverMove, true)
  document.removeEventListener("pointerup", onDragPointerUpCapture, true)
  document.removeEventListener("click", onDragClickCapture, true)
  document.removeEventListener("keydown", onDragKeyDown, true)
  document.removeEventListener("keydown", onDragEscKey, true)

  if (carryActive) {
    finishCarryAtCurrentPosition(true)
  }
  
  if (draggedEl) {
    draggedEl.style.cursor = ""
    draggedEl.style.opacity = "1"
    draggedEl.style.boxShadow = ""
    draggedEl.style.transition = ""
    draggedEl = null
  }
  isCurrentlyDragging = false
  dragUndoPushed = false
  lastDraggedElement = null
  suppressClickUntil = 0
  dragAxisLock = null
  clearDragSelection()
  hideDragHandle()
  clearDragOperation()
  syncDragOverlay()
  announceDrag("Drag mode disabled")
  chrome.runtime.sendMessage({ type: "DRAG_MODE_TOGGLED", active: false, hasChanges: !!lastMovedElement }).catch(() => { })
}

function addDragImage(dataUrl, name) {
  if (!dataUrl || typeof dataUrl !== "string") return { success: false, error: "Invalid image data" };
  try {
    pushUndo("Add image");

    const img = document.createElement("img");
    img.src = dataUrl;
    img.alt = name || "Uploaded image";
    img.setAttribute("data-cksa-uploaded", "true");
    img.style.maxWidth = "min(360px, 50vw)";
    img.style.maxHeight = "50vh";
    img.style.width = "auto";
    img.style.height = "auto";
    img.style.display = "block";
    img.style.borderRadius = "8px";
    img.style.boxShadow = "0 8px 28px rgba(0,0,0,0.35)";
    img.style.opacity = "1"; // Ensure no transparency
    img.style.mixBlendMode = "normal"; // Normal blend mode
    img.style.backgroundColor = "transparent"; // Transparent background

    const wrap = document.createElement("div");
    wrap.setAttribute("data-cksa-upload-wrap", "true");
    wrap.style.position = "fixed";
    const safeLeft = Math.max(16, Math.min(window.innerWidth - 100, Math.round(window.innerWidth * 0.25)));
    const safeTop = Math.max(16, Math.min(window.innerHeight - 100, Math.round(window.innerHeight * 0.2)));
    wrap.style.left = safeLeft + "px";
    wrap.style.top = safeTop + "px";
    wrap.style.zIndex = "2147483644";
    wrap.style.cursor = "grab";
    wrap.style.transition = "none";
    wrap.style.transform = "translate(0px, 0px)";
    wrap.style.willChange = "transform";
    wrap.setAttribute("data-cksa-transform", "0,0");

    wrap.appendChild(img);
    document.body.appendChild(wrap);

    selectedDragElement = wrap;
    lastMovedElement = wrap;
    showUndoToast("🖼 Image added (draggable)");

    chrome.runtime.sendMessage({
      type: "ELEMENT_DRAGGED",
      tag: "img",
      label: name ? ("image: " + name).slice(0, 40) : "uploaded-image",
      canUndo: stackState().canUndo,
      canRedo: stackState().canRedo,
      undoLabel: stackState().undoLabel,
      redoLabel: stackState().redoLabel,
    }).catch(() => {});

    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

function onDragEscKey(e) {
  if (e.key === "Escape") {
    if (carryActive) {
      finishCarryAtCurrentPosition(false)
      return
    }
    disableDragMode()
    chrome.runtime.sendMessage({ type: "DRAG_MODE_CLOSED", ...stackState() }).catch(() => {})
  }
}

function onDragKeyDown(e) {
  if (!dragModeActive || isCurrentlyDragging) return
  if (e.key === "Escape") return
  if (e.target instanceof Element && e.target.closest("input, textarea, select, [contenteditable='true']")) return

  const el = selectedDragElement || lastMovedElement
  if (!el || !document.contains(el)) return

  const key = String(e.key || "").toLowerCase()

  if ((e.metaKey || e.ctrlKey) && key === "c") {
    e.preventDefault()
    e.stopPropagation()
    updateDragClipboardFromSelection()
    showUndoToast("Copied selected element")
    return
  }

  if ((e.metaKey || e.ctrlKey) && key === "v") {
    e.preventDefault()
    e.stopPropagation()
    if (applyClipboardDuplicate()) showUndoToast("Pasted duplicated element")
    return
  }

  if ((e.metaKey || e.ctrlKey) && key === "d") {
    e.preventDefault()
    e.stopPropagation()
    if (duplicateSelectedDragElement()) showUndoToast("Duplicated selected element")
    return
  }

  const step = e.shiftKey ? 10 : 1
  let dx = 0
  let dy = 0

  if (e.key === "ArrowLeft") dx = -step
  else if (e.key === "ArrowRight") dx = step
  else if (e.key === "ArrowUp") dy = -step
  else if (e.key === "ArrowDown") dy = step
  else if (key === "[") {
    e.preventDefault()
    e.stopPropagation()
    changeSelectedZIndex(-1)
    return
  }
  else if (key === "]") {
    e.preventDefault()
    e.stopPropagation()
    changeSelectedZIndex(1)
    return
  }
  else if (key === "r") {
    e.preventDefault()
    e.stopPropagation()
    promoteToFreePlacement(el)
    setFreePlacementRotation(el, getFreePlacementRotation(el) + dragEngineOptions.rotateStep)
    syncDragOverlay()
    return
  }
  else return

  e.preventDefault()
  e.stopPropagation()
  moveElementBy(el, dx, dy, true)
}

function ensureDragHandle() {
  ensureDragUiStyles()
  if (dragHandleEl) return dragHandleEl
  dragHandleEl = document.getElementById("__cksa_drag_handle")
  if (!dragHandleEl) {
    dragHandleEl = document.createElement("div")
    dragHandleEl.id = "__cksa_drag_handle"
    dragHandleEl.title = "Select element"
    dragHandleEl.textContent = "⠿"
    document.documentElement.appendChild(dragHandleEl)
  }
  if (!dragHandleEl.dataset.cksaBound) {
    dragHandleEl.dataset.cksaBound = "true"
    dragHandleEl.addEventListener("mousedown", (e) => {
      if (!dragModeActive) return
      if (!hoveredDragElement) return
      e.preventDefault()
      e.stopPropagation()
      setDragSelection(hoveredDragElement, {
        additive: e.shiftKey || e.ctrlKey || e.metaKey,
        toggle: e.shiftKey,
      })
      syncDragOverlay()
      announceDrag(`Selected ${elementLabel(hoveredDragElement)}`)
    }, true)
  }
  return dragHandleEl
}

function hideDragHandle() {
  if (dragHandleEl) {
    dragHandleEl.classList.remove("show")
    dragHandleEl.style.display = "none"
  }
  clearTargetOutline()
  hoveredDragElement = null
}

function clearTargetOutline() {
  document.querySelectorAll(".cksa-drag-target-outline").forEach(el => el.classList.remove("cksa-drag-target-outline"))
}

function ensureDragOverlay() {
  if (dragOverlayEl) return dragOverlayEl

  dragOverlayEl = document.createElement("div")
  dragOverlayEl.id = "__cksa_drag_overlay"
  dragOverlayEl.setAttribute("aria-hidden", "true")
  Object.assign(dragOverlayEl.style, {
    position: "fixed",
    inset: "0",
    pointerEvents: "none",
    zIndex: "2147483647",
    display: "none",
  })

  const frame = document.createElement("div")
  frame.id = "__cksa_drag_frame"
  Object.assign(frame.style, {
    position: "fixed",
    border: "1px solid rgba(124,58,237,0.9)",
    borderRadius: "10px",
    boxShadow: "0 0 0 2px rgba(167,139,250,0.12)",
    pointerEvents: "none",
    display: "none",
  })

  dragOverlayLabelEl = document.createElement("div")
  dragOverlayLabelEl.id = "__cksa_drag_label"
  Object.assign(dragOverlayLabelEl.style, {
    position: "fixed",
    pointerEvents: "none",
    background: "rgba(15,23,42,0.96)",
    color: "#e2e8f0",
    fontSize: "10px",
    fontWeight: "700",
    padding: "4px 8px",
    borderRadius: "999px",
    letterSpacing: "0.02em",
    whiteSpace: "nowrap",
    display: "none",
  })

  dragOverlayHandles = {}
  const handleSpecs = [
    ["move", "move"],
    ["nw", "nwse-resize"], ["n", "ns-resize"], ["ne", "nesw-resize"],
    ["e", "ew-resize"], ["se", "nwse-resize"], ["s", "ns-resize"],
    ["sw", "nesw-resize"], ["w", "ew-resize"], ["rotate", "grab"],
  ]

  handleSpecs.forEach(([name, cursor]) => {
    const handle = document.createElement("button")
    handle.type = "button"
    handle.dataset.dragHandle = name
    handle.setAttribute("aria-label", name === "rotate" ? "Rotate element" : name === "move" ? "Move element" : `Resize ${name}`)
    handle.tabIndex = -1
    Object.assign(handle.style, {
      position: "fixed",
      width: name === "rotate" || name === "move" ? "18px" : "12px",
      height: name === "rotate" || name === "move" ? "18px" : "12px",
      borderRadius: name === "rotate" || name === "move" ? "50%" : "3px",
      border: "1px solid #fff",
      background: name === "rotate" ? "#7c3aed" : name === "move" ? "#475569" : "#a78bfa",
      boxShadow: "0 2px 10px rgba(0,0,0,0.35)",
      pointerEvents: "auto",
      cursor,
      padding: "0",
      display: "none",
      color: "#fff",
      fontSize: "9px",
      fontWeight: "800",
      lineHeight: "1",
      alignItems: "center",
      justifyContent: "center",
      userSelect: "none",
      touchAction: "none",
    })
    handle.textContent = name === "rotate" ? "⟳" : name === "move" ? "↔" : ""
    handle.addEventListener("pointerdown", onDragHandlePointerDown, true)
    dragOverlayHandles[name] = handle
    dragOverlayEl.appendChild(handle)
  })

  dragOverlayEl.appendChild(frame)
  dragOverlayEl.appendChild(dragOverlayLabelEl)
  document.documentElement.appendChild(dragOverlayEl)
  return dragOverlayEl
}

function syncDragOverlay() {
  if (!dragOverlayEl) return
  const el = getSelectedDragElement()
  const frame = dragOverlayEl.querySelector("#__cksa_drag_frame")
  if (!el || !dragModeActive || !document.contains(el)) {
    dragOverlayEl.style.display = "none"
    if (frame) frame.style.display = "none"
    if (dragOverlayLabelEl) dragOverlayLabelEl.style.display = "none"
    Object.values(dragOverlayHandles || {}).forEach(handle => { handle.style.display = "none" })
    return
  }

  const rect = el.getBoundingClientRect()
  const pad = 8
  dragOverlayEl.style.display = "block"
  if (frame) {
    frame.style.display = "none"
  }

  if (dragOverlayLabelEl) {
    dragOverlayLabelEl.style.display = "none"
  }

  const handlePositions = {
    move: [Math.max(4, rect.left - 28), Math.max(4, rect.top - 28)],
    nw: [rect.left - 4, rect.top - 4],
    n: [rect.left + rect.width / 2 - 6, rect.top - 4],
    ne: [rect.right - 8, rect.top - 4],
    e: [rect.right - 8, rect.top + rect.height / 2 - 6],
    se: [rect.right - 8, rect.bottom - 8],
    s: [rect.left + rect.width / 2 - 6, rect.bottom - 8],
    sw: [rect.left - 4, rect.bottom - 8],
    w: [rect.left - 4, rect.top + rect.height / 2 - 6],
    rotate: [rect.left + rect.width / 2 - 9, rect.top - 28],
  }

  Object.entries(dragOverlayHandles || {}).forEach(([name, handle]) => {
    handle.style.display = "none"
  })
}

function clearDragOperation() {
  if (!dragHandleOperation) return
  document.removeEventListener("pointermove", onDragHandlePointerMove, true)
  document.removeEventListener("pointerup", onDragHandlePointerUp, true)
  isCurrentlyDragging = false
  dragHandleOperation = null
}

function applyDragConstraints(el, nextLeft, nextTop, nextWidth, nextHeight) {
  const width = Math.max(dragEngineOptions.minSize, nextWidth)
  const height = Math.max(dragEngineOptions.minSize, nextHeight)
  let left = nextLeft
  let top = nextTop
  const docEl = document.documentElement
  const docWidth = Math.max(docEl.scrollWidth, docEl.clientWidth, window.innerWidth)
  const docHeight = Math.max(docEl.scrollHeight, docEl.clientHeight, window.innerHeight)
  const viewLeft = window.scrollX
  const viewTop = window.scrollY
  const viewRight = viewLeft + window.innerWidth
  const viewBottom = viewTop + window.innerHeight

  if (dragEngineOptions.snapToGrid) {
    const grid = Math.max(1, Number(dragEngineOptions.gridSize) || 8)
    left = Math.round(left / grid) * grid
    top = Math.round(top / grid) * grid
  }

  if (dragEngineOptions.snapToEdges) {
    const margin = 8
    if (Math.abs(left - margin) <= 6) left = margin
    if (Math.abs(top - margin) <= 6) top = margin
    if (Math.abs((left + width) - (viewRight - margin)) <= 6) left = viewRight - width - margin
    if (Math.abs((top + height) - (viewBottom - margin)) <= 6) top = viewBottom - height - margin
  }

  if (dragEngineOptions.boundary) {
    left = Math.max(0, Math.min(docWidth - width, left))
    top = Math.max(0, Math.min(docHeight - height, top))
  }

  return {
    left: Math.round(left),
    top: Math.round(top),
    width: Math.round(width),
    height: Math.round(height),
  }
}

function beginFreeDragOperation(el, event, kind = "move", handleName = null) {
  if (!el || !document.contains(el)) return
  const selectedGroup = kind === "move" ? getDragSelectionElements() : [el]
  const allowGroupedMove = kind === "move" && selectedGroup.length > 1 && !!(event.shiftKey || event.ctrlKey || event.metaKey)
  const targets = allowGroupedMove ? selectedGroup : [el]
  targets.forEach(promoteToFreePlacement)
  clearDragOperation()
  dragHandleOperation = {
    el,
    targets,
    kind,
    handleName,
    startX: event.clientX,
    startY: event.clientY,
    startScrollX: window.scrollX,
    startScrollY: window.scrollY,
    lastClientX: event.clientX,
    lastClientY: event.clientY,
    startLeft: getFreePlacementNumber(el, "left", el.getBoundingClientRect().left + window.scrollX),
    startTop: getFreePlacementNumber(el, "top", el.getBoundingClientRect().top + window.scrollY),
    startWidth: getFreePlacementNumber(el, "width", el.getBoundingClientRect().width),
    startHeight: getFreePlacementNumber(el, "height", el.getBoundingClientRect().height),
    startRotation: getFreePlacementRotation(el),
    startsByElement: targets.map((target) => ({
      el: target,
      left: getFreePlacementNumber(target, "left", target.getBoundingClientRect().left + window.scrollX),
      top: getFreePlacementNumber(target, "top", target.getBoundingClientRect().top + window.scrollY),
      width: getFreePlacementNumber(target, "width", target.getBoundingClientRect().width),
      height: getFreePlacementNumber(target, "height", target.getBoundingClientRect().height),
    })),
    moved: false,
  }

  pushUndo(`${kind === "resize" ? "Resize" : kind === "rotate" ? "Rotate" : "Move"}: ${elementLabel(el)}`)
  isCurrentlyDragging = true
  document.body.style.cursor = kind === "move" ? "grabbing" : kind === "rotate" ? "crosshair" : "nwse-resize"
  document.addEventListener("pointermove", onDragHandlePointerMove, true)
  document.addEventListener("pointerup", onDragHandlePointerUp, true)
}

function onDragHandlePointerDown(e) {
  if (!dragModeActive) return
  if (!(e.target instanceof Element)) return
  const handleName = e.target.dataset.dragHandle
  if (!handleName) return
  const el = getSelectedDragElement()
  if (!el) return

  e.preventDefault()
  e.stopPropagation()
  setDragSelection(el, { additive: false })
  promoteToFreePlacement(el)
  beginFreeDragOperation(el, e, handleName === "rotate" ? "rotate" : handleName === "move" ? "move" : "resize", handleName)
}

function onDragHandlePointerMove(e) {
  if (!dragHandleOperation?.el) return
  const op = dragHandleOperation
  const el = op.el
  op.lastClientX = e.clientX
  op.lastClientY = e.clientY
  const dx = (e.clientX - op.startX) + (window.scrollX - op.startScrollX)
  const dy = (e.clientY - op.startY) + (window.scrollY - op.startScrollY)

  if (dragEngineOptions.autoScroll) {
    const edge = 32
    const scrollStep = 18
    if (e.clientY < edge) window.scrollBy(0, -scrollStep)
    if (e.clientY > window.innerHeight - edge) window.scrollBy(0, scrollStep)
    if (e.clientX < edge) window.scrollBy(-scrollStep, 0)
    if (e.clientX > window.innerWidth - edge) window.scrollBy(scrollStep, 0)
  }

  if (op.kind === "rotate") {
    const nextRotation = op.startRotation + ((dx + dy) * 0.7)
    setFreePlacementRotation(el, nextRotation)
    op.moved = true
    syncDragOverlay()
    return
  }

  if (op.kind === "resize") {
    let nextLeft = op.startLeft
    let nextTop = op.startTop
    let nextWidth = op.startWidth
    let nextHeight = op.startHeight

    const dir = op.handleName || "se"
    if (dir.includes("e")) nextWidth = op.startWidth + dx
    if (dir.includes("s")) nextHeight = op.startHeight + dy
    if (dir.includes("w")) {
      nextWidth = op.startWidth - dx
      nextLeft = op.startLeft + dx
    }
    if (dir.includes("n")) {
      nextHeight = op.startHeight - dy
      nextTop = op.startTop + dy
    }

    if (e.shiftKey) {
      const ratio = op.startWidth / Math.max(1, op.startHeight)
      if (Math.abs(dx) > Math.abs(dy)) {
        nextHeight = nextWidth / ratio
      } else {
        nextWidth = nextHeight * ratio
      }
    }

    const constrained = applyDragConstraints(el, nextLeft, nextTop, nextWidth, nextHeight)
    setFreePlacementNumber(el, "left", constrained.left)
    setFreePlacementNumber(el, "top", constrained.top)
    setFreePlacementNumber(el, "width", constrained.width)
    setFreePlacementNumber(el, "height", constrained.height)
    op.moved = true
    selectedDragElement = el
    lastMovedElement = el
    lastDraggedElement = el
    syncDragOverlay()
    return
  }

  const constrained = applyDragConstraints(
    el,
    op.startLeft + dx,
    op.startTop + dy,
    op.startWidth,
    op.startHeight,
  )
  op.startsByElement.forEach((entry) => {
    const groupConstrained = applyDragConstraints(
      entry.el,
      entry.left + dx,
      entry.top + dy,
      entry.width,
      entry.height,
    )
    setFreePlacementNumber(entry.el, "left", groupConstrained.left)
    setFreePlacementNumber(entry.el, "top", groupConstrained.top)
    setFreePlacementNumber(entry.el, "width", groupConstrained.width)
    setFreePlacementNumber(entry.el, "height", groupConstrained.height)
  })
  op.moved = true
  selectedDragElement = el
  lastMovedElement = el
  lastDraggedElement = el
  syncDragOverlay()
}

function onDragHandlePointerUp() {
  if (!dragHandleOperation?.el) return
  const op = dragHandleOperation
  const el = op.el
  const movedCount = op.targets?.length || 1

  clearDragOperation()
  document.body.style.cursor = "grab"
  isCurrentlyDragging = false
  selectedDragElement = el
  lastMovedElement = el
  lastDraggedElement = el
  suppressClickUntil = Date.now() + 220
  syncDragOverlay()
  announceDrag(`Moved ${movedCount} element${movedCount > 1 ? "s" : ""}`)
  chrome.runtime.sendMessage({
    type: "ELEMENT_DRAGGED",
    tag: el.tagName.toLowerCase(),
    label: elementLabel(el).slice(0, 40),
    canUndo: stackState().canUndo,
    canRedo: stackState().canRedo,
    undoLabel: stackState().undoLabel,
    redoLabel: stackState().redoLabel,
  }).catch(() => { })
}

function duplicateSelectedDragElement() {
  const el = getSelectedDragElement()
  if (!el || !document.contains(el)) return false

  pushUndo("Duplicate: " + elementLabel(el))
  const clone = el.cloneNode(true)
  if (clone.id) clone.id = `${clone.id}__cksa_dup_${Date.now()}`
  promoteToFreePlacement(clone)
  const left = getFreePlacementNumber(el, "left", el.getBoundingClientRect().left) + 16
  const top = getFreePlacementNumber(el, "top", el.getBoundingClientRect().top) + 16
  setFreePlacementNumber(clone, "left", left)
  setFreePlacementNumber(clone, "top", top)
  setFreePlacementRotation(clone, getFreePlacementRotation(el))
  clone.style.zIndex = String(Number(el.style.zIndex || 2147483646) + 1)
  el.after(clone)
  setDragSelection(clone)
  selectedDragElement = clone
  lastMovedElement = clone
  lastDraggedElement = clone
  syncDragOverlay()
  return true
}

function changeSelectedZIndex(delta) {
  const el = getSelectedDragElement()
  if (!el || !document.contains(el)) return false
  promoteToFreePlacement(el)
  const current = parseInt(el.style.zIndex || "2147483646", 10)
  el.style.zIndex = String((Number.isFinite(current) ? current : 2147483646) + delta)
  setDragSelection(el)
  selectedDragElement = el
  syncDragOverlay()
  return true
}

function applyClipboardDuplicate() {
  if (!dragClipboardSnapshot) return false
  pushUndo("Paste element")
  const clone = dragClipboardSnapshot.cloneNode(true)
  if (clone.id) clone.id = `${clone.id}__cksa_paste_${Date.now()}`
  promoteToFreePlacement(clone)
  const base = getSelectedDragElement() || lastMovedElement || clone
  const left = getFreePlacementNumber(base, "left", base.getBoundingClientRect().left) + 20
  const top = getFreePlacementNumber(base, "top", base.getBoundingClientRect().top) + 20
  setFreePlacementNumber(clone, "left", left)
  setFreePlacementNumber(clone, "top", top)
  clone.style.zIndex = "2147483647"
  document.body.appendChild(clone)
  setDragSelection(clone)
  selectedDragElement = clone
  lastMovedElement = clone
  lastDraggedElement = clone
  syncDragOverlay()
  return true
}

function updateDragClipboardFromSelection() {
  const el = getSelectedDragElement()
  if (!el || !document.contains(el)) return false
  dragClipboardSnapshot = el.cloneNode(true)
  return true
}

function isValidDragTarget(el) {
  if (!el) return false
  if (el.closest && el.closest("#__cksa_panel, #__cksa_overlay, #__cksa_badge, #__cksa_drag_handle, #__cksa_drag_placeholder")) return false
  if (el === document.body || el === document.documentElement) return false
  if (["HTML", "SCRIPT", "STYLE", "LINK", "META", "HEAD"].includes(el.tagName)) return false
  return true
}

function onDragHoverMove(e) {
  if (!dragModeActive || isCurrentlyDragging) return
  const x = Number.isFinite(e.clientX) ? e.clientX : dragLastClientX
  const y = Number.isFinite(e.clientY) ? e.clientY : dragLastClientY
  dragLastClientX = x
  dragLastClientY = y

  if (dragDirectCandidate && !dragHandleOperation) {
    const dx = x - dragDirectCandidate.startX
    const dy = y - dragDirectCandidate.startY
    const distance = Math.hypot(dx, dy)
    if (distance >= DRAG_THRESHOLD) {
      const target = dragDirectCandidate.el
      dragDirectCandidate = null
      if (target && document.contains(target)) {
        beginFreeDragOperation(target, e, "move", "move")
      }
      return
    }
  }

  if (carryActive && carriedEl) {
    updateCarriedPosition(x, y)
    return
  }
  const els = document.elementsFromPoint(x, y)
  const candidate = els.find(isValidDragTarget)
  if (!candidate) {
    hoveredDragElement = null
    hideDragHandle()
    return
  }

  hoveredDragElement = candidate
  const handle = ensureDragHandle()
  handle.style.display = "none"
  handle.classList.remove("show")
  clearTargetOutline()
}

function elementLabel(el) {
  if (!el) return "element"
  if (el.id) return "#" + el.id
  if (el.className && typeof el.className === "string") return "." + el.className.trim().split(/\s+/)[0]
  return el.tagName.toLowerCase()
}

function getPositionState(el) {
  if (!el) return { x: 0, y: 0 }
  if (el.dataset.cksaFreePlacement === "true") {
    return {
      x: getFreePlacementNumber(el, "left", 0),
      y: getFreePlacementNumber(el, "top", 0),
    }
  }
  const transform = el.getAttribute("data-cksa-transform") || "0,0"
  const [x, y] = transform.split(",").map(Number)
  return { x: Number.isFinite(x) ? x : 0, y: Number.isFinite(y) ? y : 0 }
}

function clampPosition(el, x, y) {
  if (!el || !document.contains(el)) return { x, y }
  const rect = el.getBoundingClientRect()
  const state = getPositionState(el)
  const baseLeft = rect.left - state.x
  const baseTop = rect.top - state.y
  const minX = -baseLeft + 4
  const minY = -baseTop + 4
  const maxX = window.innerWidth - rect.width - baseLeft - 4
  const maxY = window.innerHeight - rect.height - baseTop - 4

  const clampedX = minX <= maxX ? Math.min(maxX, Math.max(minX, x)) : x
  const clampedY = minY <= maxY ? Math.min(maxY, Math.max(minY, y)) : y
  return { x: Math.round(clampedX), y: Math.round(clampedY) }
}

function applyElementPosition(el, x, y) {
  if (el.dataset.cksaFreePlacement === "true") {
    setFreePlacementNumber(el, "left", x)
    setFreePlacementNumber(el, "top", y)
    syncDragOverlay()
    return
  }
  el.style.transform = `translate(${x}px, ${y}px)`
  el.setAttribute("data-cksa-transform", `${x},${y}`)
}

function moveElementBy(el, dx, dy, pushHistory = false) {
  if (!el || !document.contains(el)) return false

  promoteToFreePlacement(el)
  const state = getPositionState(el)
  const next = clampPosition(el, Math.round(state.x + dx), Math.round(state.y + dy))

  if (pushHistory) pushUndo("Move: " + elementLabel(el))
  el.style.transition = "left 120ms ease-out, top 120ms ease-out, transform 120ms ease-out"
  applyElementPosition(el, next.x, next.y)

  setDragSelection(el)
  selectedDragElement = el
  lastMovedElement = el
  lastDraggedElement = el
  suppressClickUntil = Date.now() + 220
  chrome.runtime.sendMessage({
    type: "ELEMENT_DRAGGED",
    tag: el.tagName.toLowerCase(),
    label: elementLabel(el).slice(0, 40),
    canUndo: stackState().canUndo,
    canRedo: stackState().canRedo,
    undoLabel: stackState().undoLabel,
    redoLabel: stackState().redoLabel,
  }).catch(() => {})
  return true
}

function moveSelectedToPoint(el, clientX, clientY, pushHistory = true) {
  if (!el || !document.contains(el)) return false
  promoteToFreePlacement(el)
  const rect = el.getBoundingClientRect()
  const state = getPositionState(el)
  const targetX = state.x + (clientX - (rect.left + rect.width / 2))
  const targetY = state.y + (clientY - (rect.top + rect.height / 2))
  const next = clampPosition(el, targetX, targetY)

  if (pushHistory) pushUndo("Move: " + elementLabel(el))
  el.style.transition = "left 140ms cubic-bezier(.22,.61,.36,1), top 140ms cubic-bezier(.22,.61,.36,1), transform 140ms cubic-bezier(.22,.61,.36,1)"
  applyElementPosition(el, next.x, next.y)

  setDragSelection(el)
  selectedDragElement = el
  lastMovedElement = el
  lastDraggedElement = el
  suppressClickUntil = Date.now() + 220

  chrome.runtime.sendMessage({
    type: "ELEMENT_DRAGGED",
    tag: el.tagName.toLowerCase(),
    label: elementLabel(el).slice(0, 40),
    canUndo: stackState().canUndo,
    canRedo: stackState().canRedo,
    undoLabel: stackState().undoLabel,
    redoLabel: stackState().redoLabel,
  }).catch(() => {})
  return true
}

function resolveDragTarget(node) {
  if (!node) return null
  const el = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement
  if (!el) return null
  if (el.closest && el.closest("#__cksa_panel, #__cksa_overlay, #__cksa_badge, #__cksa_drag_placeholder")) return null
  if (el === document.body || el === document.documentElement) return null
  if (["HTML", "SCRIPT", "STYLE", "LINK", "META", "HEAD"].includes(el.tagName)) return null
  return el
}

function resolveCarryWrapper(target) {
  if (!target) return null

  const wrapperSelectors = [
    ".thumbinner",
    "figure",
    ".gallerybox",
    ".mw-file-element",
    ".mw-file-description",
    ".gallerytext",
  ]

  for (const selector of wrapperSelectors) {
    const wrapper = target.closest ? target.closest(selector) : null
    if (wrapper) return wrapper
  }

  const figure = target.closest ? target.closest("figure") : null
  if (figure) return figure

  return target
}

function onDragDoubleClick(e) {
  if (!dragModeActive) return
  if (e.button !== 0) return

  const target = resolveCarryWrapper(resolveDragTarget(e.target))
  if (!target) return
  if (target.closest && target.closest("#__cksa_drag_handle")) return

  e.preventDefault()
  e.stopPropagation()

  if (carryActive) {
    finishCarryAtCurrentPosition(false)
  }
  suppressCarryDropUntil = Date.now() + 220
  beginCarryMode(target, e)
}

function beginCarryMode(el, event) {
  if (!el || !document.contains(el)) return

  pushUndo("Move: " + elementLabel(el))
  clearTargetOutline()
  hideDragHandle()

  const rect = el.getBoundingClientRect()
  const computed = window.getComputedStyle(el)

  // Capture full computed appearance snapshot
  carryComputedSnapshot = {
    display: computed.display,
    position: computed.position,
    float: computed.float,
    margin: `${computed.marginTop} ${computed.marginRight} ${computed.marginBottom} ${computed.marginLeft}`,
    padding: `${computed.paddingTop} ${computed.paddingRight} ${computed.paddingBottom} ${computed.paddingLeft}`,
    border: computed.border,
    borderRadius: computed.borderRadius,
    background: computed.background,
    backgroundColor: computed.backgroundColor,
    backgroundImage: computed.backgroundImage,
    filter: computed.filter,
    opacity: computed.opacity,
    transform: computed.transform,
    boxShadow: computed.boxShadow,
    visibility: computed.visibility,
    color: computed.color,
    fontSize: computed.fontSize,
    fontWeight: computed.fontWeight,
    textAlign: computed.textAlign,
  }
  carryModifiedProps.clear()

  // Store original parent to detect if dropped in new container
  carryOriginalParent = el.parentNode

  // Create placeholder that preserves space in original layout
  carryPlaceholder = document.createElement("div")
  carryPlaceholder.id = "__cksa_drag_placeholder"
  carryPlaceholder.style.width = rect.width + "px"
  carryPlaceholder.style.height = rect.height + "px"
  carryPlaceholder.style.display = computed.display === "inline" ? "inline-block" : computed.display
  carryPlaceholder.style.marginTop = computed.marginTop
  carryPlaceholder.style.marginRight = computed.marginRight
  carryPlaceholder.style.marginBottom = computed.marginBottom
  carryPlaceholder.style.marginLeft = computed.marginLeft
  carryPlaceholder.style.border = "1px dashed rgba(167,139,250,0.7)"
  carryPlaceholder.style.background = "rgba(167,139,250,0.08)"
  carryPlaceholder.style.borderRadius = "6px"
  carryPlaceholder.style.pointerEvents = "none"

  el.parentNode?.insertBefore(carryPlaceholder, el)

  carryOriginalInlineStyle = el.getAttribute("style") || ""
  carriedEl = el
  carryActive = true
  clickMoveMode = false
  clickMoveArmed = false
  isCurrentlyDragging = false

  carryOffsetX = Math.max(0, Math.min(rect.width, event.clientX - rect.left))
  carryOffsetY = Math.max(0, Math.min(rect.height, event.clientY - rect.top))

  // Apply carry styles while preserving visual appearance
  const propMap = {
    position: "fixed",
    left: rect.left + "px",
    top: rect.top + "px",
    margin: "0",
    width: rect.width + "px",
    maxWidth: "none",
    maxHeight: "none",
    zIndex: "2147483646",
    pointerEvents: "none",
    boxShadow: "0 12px 40px rgba(167,139,250,0.45)",
    transition: "left 40ms linear, top 40ms linear",
  }

  Object.entries(propMap).forEach(([prop, val]) => {
    el.style[prop] = val
    carryModifiedProps.add(prop)
  })

  el.dataset.cksaFreePlacement = "true"
  el.dataset.cksaOriginalStyle = carryOriginalInlineStyle
  el.dataset.cksaLeft = String(rect.left)
  el.dataset.cksaTop = String(rect.top)
  el.dataset.cksaWidth = String(rect.width)
  el.dataset.cksaHeight = String(rect.height)
  el.dataset.cksaBaseTransform = computed.transform && computed.transform !== "none" ? computed.transform : ""

  // Preserve visual properties from computed style
  if (computed.filter !== "none") el.style.filter = computed.filter
  
  // Keep carried element fully visible on top (don't inherit reduced opacity)
  const originalOpacity = parseFloat(computed.opacity)
  if (originalOpacity < 0.7) {
    el.style.opacity = "0.95"
  } else {
    el.style.opacity = Math.min(1, originalOpacity * 0.98)
  }
  
  if (computed.transform !== "none") el.style.transform = computed.transform
  if (computed.background !== "rgba(0, 0, 0, 0)") el.style.background = computed.background
  if (computed.backgroundColor !== "rgba(0, 0, 0, 0)") el.style.backgroundColor = computed.backgroundColor
  
  // Ensure images show proper aspect ratio and sizing
  if (el.tagName.toLowerCase() === "img") {
    el.style.objectFit = el.style.objectFit || computed.objectFit || "contain"
    el.style.objectPosition = el.style.objectPosition || computed.objectPosition || "center"
  }

  el.removeAttribute("data-cksa-transform")

  selectedDragElement = el
  lastMovedElement = el
  suppressClickUntil = Date.now() + 160

  updateCarriedPosition(event.clientX, event.clientY)

  chrome.runtime.sendMessage({
    type: "ELEMENT_DRAGGED",
    tag: el.tagName.toLowerCase(),
    label: (elementLabel(el) + " (picked)").slice(0, 40),
    canUndo: stackState().canUndo,
    canRedo: stackState().canRedo,
    undoLabel: stackState().undoLabel,
    redoLabel: stackState().redoLabel,
  }).catch(() => {})
  syncDragOverlay()
}

function updateCarriedPosition(clientX, clientY) {
  if (!carryActive || !carriedEl) return
  const w = carriedEl.offsetWidth || 0
  const h = carriedEl.offsetHeight || 0
  let left = clientX - carryOffsetX
  let top = clientY - carryOffsetY
  const constrained = applyDragConstraints(carriedEl, left, top, w, h)
  left = constrained.left
  top = constrained.top
  carriedEl.style.left = left + "px"
  carriedEl.style.top = top + "px"
  carriedEl.dataset.cksaLeft = String(left)
  carriedEl.dataset.cksaTop = String(top)
  syncDragOverlay()
}

function findContainerDropTarget(x, y, dragged) {
  const stack = document.elementsFromPoint(x, y)
  for (const el of stack) {
    if (!isValidDragTarget(el)) continue
    if (el === dragged || dragged.contains(el)) continue
    if (el.closest && el.closest("#__cksa_drag_handle, #__cksa_panel, #__cksa_overlay, #__cksa_badge, #__cksa_drag_placeholder")) continue
    if (isContainerDropTarget(el)) return el
    if (el.parentElement && isContainerDropTarget(el.parentElement)) return el.parentElement
  }
  return null
}

function getContainerInsertReference(container, x, y, dragged) {
  const children = Array.from(container.children).filter(child => {
    if (!child || child === dragged) return false
    if (child.id === "__cksa_drag_placeholder") return false
    if (child.matches && child.matches("#__cksa_panel, #__cksa_overlay, #__cksa_badge, #__cksa_drag_handle")) return false
    return true
  })

  if (!children.length) return null

  const style = window.getComputedStyle(container)
  const isRowLayout = style.display?.includes("flex") && style.flexDirection?.startsWith("row")

  for (const child of children) {
    const r = child.getBoundingClientRect()
    const midpoint = isRowLayout ? (r.left + r.width / 2) : (r.top + r.height / 2)
    if ((isRowLayout && x < midpoint) || (!isRowLayout && y < midpoint)) {
      return child
    }
  }

  return null
}

function finishCarryAtCurrentPosition(keepInPlace, dropX, dropY) {
  if (!carryActive || !carriedEl) return

  const el = carriedEl
  const ph = carryPlaceholder

  // CAPTURE THE ACTUAL DRAGGED POSITION BEFORE ANY DOM CHANGES
  const draggedLeft = parseFloat(el.style.left)
  const draggedTop = parseFloat(el.style.top)
  const draggedWidth = parseFloat(el.style.width)
  const draggedHeight = parseFloat(el.style.height)

  if (keepInPlace) {
    // Return to original placeholder location
    if (ph && ph.parentNode) {
      ph.parentNode.insertBefore(el, ph)
    }
  } else {
    if (ph && ph.parentNode) {
      ph.parentNode.insertBefore(el, ph)
      carryWasDroppedInNewParent = false
    }
  }

  // Always restore element to original state - this keeps it functional and in document flow
  // Clean up all temporary carry/drag styles
  el.style.position = ""
  el.style.left = ""
  el.style.top = ""
  el.style.margin = ""
  el.style.width = ""
  el.style.height = ""
  el.style.maxWidth = ""
  el.style.maxHeight = ""
  el.style.zIndex = ""
  el.style.pointerEvents = ""
  el.style.touchAction = ""
  el.style.boxShadow = ""
  el.style.transition = ""
  el.style.opacity = ""
  el.style.filter = ""
  el.style.transform = ""
  el.style.background = ""
  el.style.backgroundColor = ""
  el.style.willChange = ""

  // Restore original inline styles to keep all element properties intact
  if (carryOriginalInlineStyle) {
    el.setAttribute("style", carryOriginalInlineStyle)
  }

  // Clear all drag-related data attributes
  el.removeAttribute("data-cksa-free-placement")
  el.removeAttribute("data-cksa-original-style")
  el.removeAttribute("data-cksa-left")
  el.removeAttribute("data-cksa-top")
  el.removeAttribute("data-cksa-width")
  el.removeAttribute("data-cksa-height")
  el.removeAttribute("data-cksa-rotation")
  el.removeAttribute("data-cksa-base-transform")

  // Clean up temporary states
  ph?.remove()
  carryPlaceholder = null
  carryOriginalInlineStyle = null
  carryComputedSnapshot = null
  carryModifiedProps.clear()
  carryOriginalParent = null
  carryWasDroppedInNewParent = false
  carryActive = false
  carriedEl = null
  suppressClickUntil = Date.now() + 200
  setDragSelection(el)
  selectedDragElement = el
  lastMovedElement = el
  lastDraggedElement = el
  syncDragOverlay()
  announceDrag(`Dropped ${elementLabel(el)}`)

  // Notify popup of the change
  chrome.runtime.sendMessage({
    type: "ELEMENT_DRAGGED",
    tag: el.tagName.toLowerCase(),
    label: (elementLabel(el) + " (dropped)").slice(0, 40),
    canUndo: stackState().canUndo,
    canRedo: stackState().canRedo,
    undoLabel: stackState().undoLabel,
    redoLabel: stackState().redoLabel,
  }).catch(() => {})
}

function onDragClickCapture(e) {
  if (!dragModeActive) return

  const t = e.target
  if (!(t instanceof Element)) return

  if (carryActive) {
    if (Date.now() < suppressCarryDropUntil) {
      e.preventDefault()
      e.stopPropagation()
      return
    }
    e.preventDefault()
    e.stopPropagation()
    finishCarryAtCurrentPosition(false, e.clientX, e.clientY)
    return
  }

  if (clickMoveMode) {
    const target = resolveDragTarget(t)

    if (!selectedDragElement || !document.contains(selectedDragElement)) {
      if (!target) return
      setDragSelection(target)
      selectedDragElement = target
      lastMovedElement = target
      clickMoveArmed = true
      suppressClickUntil = Date.now() + 120
      glow(target)
      announceDrag(`Selected ${elementLabel(target)}`)
      chrome.runtime.sendMessage({
        type: "ELEMENT_DRAGGED",
        tag: target.tagName.toLowerCase(),
        label: (elementLabel(target) + " (selected)").slice(0, 40),
        canUndo: stackState().canUndo,
        canRedo: stackState().canRedo,
        undoLabel: stackState().undoLabel,
        redoLabel: stackState().redoLabel,
      }).catch(() => {})
      e.preventDefault()
      e.stopPropagation()
      return
    }

    if (!clickMoveArmed && target && target !== selectedDragElement) {
      setDragSelection(target)
      selectedDragElement = target
      lastMovedElement = target
      clickMoveArmed = true
      suppressClickUntil = Date.now() + 120
      glow(target)
      announceDrag(`Selected ${elementLabel(target)}`)
      chrome.runtime.sendMessage({
        type: "ELEMENT_DRAGGED",
        tag: target.tagName.toLowerCase(),
        label: (elementLabel(target) + " (selected)").slice(0, 40),
        canUndo: stackState().canUndo,
        canRedo: stackState().canRedo,
        undoLabel: stackState().undoLabel,
        redoLabel: stackState().redoLabel,
      }).catch(() => {})
      e.preventDefault()
      e.stopPropagation()
      return
    }

    if (!clickMoveArmed) {
      clickMoveArmed = true
      e.preventDefault()
      e.stopPropagation()
      return
    }

    moveSelectedToPoint(selectedDragElement, e.clientX, e.clientY, true)
    clickMoveArmed = false
    suppressClickUntil = Date.now() + 220
    e.preventDefault()
    e.stopPropagation()
    return
  }

  const interactive = t.closest("a,button,input,select,textarea,label,summary,[role='button'],[onclick],iframe")
  const recentlyDropped = Date.now() <= suppressClickUntil && lastDraggedElement && (t === lastDraggedElement || lastDraggedElement.contains(t))

  if (interactive || recentlyDropped) {
    e.preventDefault()
    e.stopPropagation()
  }
}

function onDragStart(e) {
  if (!dragModeActive) return
  if (e.button !== 0) return
  if (carryActive) {
    e.preventDefault()
    e.stopPropagation()
    return
  }
  clickMoveArmed = false

  const el = e.target instanceof Element && e.target.closest("#__cksa_drag_handle")
    ? hoveredDragElement
    : resolveDragTarget(e.target)

  if (!el) {
    return
  }

  draggedEl = el
  selectedDragElement = el
  isCurrentlyDragging = false
  dragUndoPushed = false
  lastDraggedElement = null
  suppressClickUntil = 0
  dragAxisLock = null

  dragStartX = e.clientX
  dragStartY = e.clientY

  const currentTransform = el.getAttribute("data-cksa-transform") || "0,0"
  const [currentX, currentY] = currentTransform.split(",").map(Number)
  dragOffsetX = currentX || 0
  dragOffsetY = currentY || 0
}

function isContainerDropTarget(el) {
  if (!el || !el.tagName) return false
  return ["DIV","SPAN","SECTION","ARTICLE","ASIDE","MAIN","HEADER","FOOTER","NAV","UL","OL","FORM","TABLE","BUTTON"].includes(el.tagName)
}

function findDomDropTarget(x, y, dragged) {
  const stack = document.elementsFromPoint(x, y)
  return stack.find(el => {
    if (!isValidDragTarget(el)) return false
    if (el === dragged || dragged.contains(el)) return false
    if (el.closest && el.closest("#__cksa_drag_handle, #__cksa_panel, #__cksa_overlay, #__cksa_badge, #__cksa_drag_placeholder")) return false
    return true
  }) || null
}

function attemptDomReorder(el, clientX, clientY) {
  const dropTarget = findDomDropTarget(clientX, clientY, el)
  if (!dropTarget) return false

  const parent = el.parentElement
  if (!parent) return false

  const targetParent = dropTarget.parentElement
  const sameParent = targetParent && targetParent === parent

  if (sameParent) {
    const rect = dropTarget.getBoundingClientRect()
    const parentStyle = window.getComputedStyle(parent)
    const isRowLayout = parentStyle.display.includes("flex") && parentStyle.flexDirection.startsWith("row")
    const before = isRowLayout
      ? clientX < rect.left + rect.width / 2
      : clientY < rect.top + rect.height / 2
    if (before) parent.insertBefore(el, dropTarget)
    else parent.insertBefore(el, dropTarget.nextSibling)
    return true
  }

  if (isContainerDropTarget(dropTarget)) {
    dropTarget.appendChild(el)
    return true
  }

  return false
}

function onDragMove(e) {
  if (!dragModeActive) return

  // If already in carry mode (e.g., from double-click), continue updating position
  if (carryActive && carriedEl) {
    dragLastClientX = e.clientX
    dragLastClientY = e.clientY
    e.preventDefault()
    e.stopPropagation()
    updateCarriedPosition(e.clientX, e.clientY)
    return
  }

  // Normal drag flow from mousedown
  if (!draggedEl) return

  const deltaX = e.clientX - dragStartX
  const deltaY = e.clientY - dragStartY
  const distance = Math.hypot(deltaX, deltaY)
  dragLastClientX = e.clientX
  dragLastClientY = e.clientY

  // Don't start dragging until threshold exceeded - allows holding
  if (!isCurrentlyDragging && distance < DRAG_THRESHOLD) {
    return
  }

  // First movement beyond threshold - activate true carry drag.
  if (!isCurrentlyDragging) {
    isCurrentlyDragging = true
    if (e.altKey && dragEngineOptions.duplicateOnAlt && draggedEl) {
      const duplicate = draggedEl.cloneNode(true)
      if (duplicate.id) duplicate.id = `${duplicate.id}__cksa_alt_${Date.now()}`
      draggedEl.after(duplicate)
      draggedEl = duplicate
    }
    selectedDragElement = draggedEl

    beginCarryMode(draggedEl, e)
    dragUndoPushed = true
    lastDraggedElement = draggedEl
    draggedEl = null
    return
  }

  e.preventDefault()
  e.stopPropagation()

  if (carryActive && carriedEl) {
    updateCarriedPosition(e.clientX, e.clientY)
  }
}

function onDragEnd(e) {
  if (!dragModeActive) return

  if (carryActive && carriedEl) {
    e.preventDefault()
    e.stopPropagation()

    const finalX = Number.isFinite(e?.clientX) ? e.clientX : dragLastClientX
    const finalY = Number.isFinite(e?.clientY) ? e.clientY : dragLastClientY
    const droppedEl = carriedEl
    finishCarryAtCurrentPosition(false, finalX, finalY)

    if (droppedEl) {
      lastDraggedElement = droppedEl
      lastMovedElement = droppedEl
      selectedDragElement = droppedEl
    }
    suppressClickUntil = Date.now() + 220
  }

  if (draggedEl) draggedEl.style.transition = ""
  isCurrentlyDragging = false
  dragUndoPushed = false
  dragAxisLock = null
  draggedEl = null
  document.body.style.cursor = "grab"
  hideDragHandle()
  syncDragOverlay()
}

function resetLastMovedElement() {
  if (!lastMovedElement || !document.contains(lastMovedElement)) return false

  pushUndo("Reset selected move")
  restoreOriginalInlineStyle(lastMovedElement)
  lastMovedElement.style.transform = "translate(0px, 0px)"
  lastMovedElement.removeAttribute("data-cksa-transform")
  lastMovedElement.style.cursor = ""
  lastMovedElement.style.opacity = "1"
  lastMovedElement.style.boxShadow = ""
  lastMovedElement.style.transition = ""
  lastMovedElement.style.willChange = ""
  showUndoToast("↩ Selected move reset")
  selectedDragElement = lastMovedElement
  syncDragOverlay()
  return true
}

function resetAllMoves() {
  pushUndo("Reset all moves")
  
  document.querySelectorAll("[data-cksa-transform]").forEach(el => {
    el.style.transform = "translate(0px, 0px)"
    el.removeAttribute("data-cksa-transform")
    el.style.cursor = ""
    el.style.opacity = "1"
    el.style.boxShadow = ""
    el.style.transition = ""
    el.style.willChange = ""
  })

  document.querySelectorAll("[data-cksa-free-placement='true']").forEach(el => {
    restoreOriginalInlineStyle(el)
    el.style.position = ""
    el.style.left = ""
    el.style.top = ""
    el.style.width = ""
    el.style.height = ""
    el.style.margin = ""
    el.style.zIndex = ""
    el.style.pointerEvents = ""
    el.style.touchAction = ""
    el.style.willChange = ""
  })

  lastMovedElement = null
  selectedDragElement = null
  syncDragOverlay()
  
  showUndoToast("🔀 All moves reset")
}

/**
 * PRODUCTION FEATURE: Capture full page state with all drag changes
 * Includes: HTML structure + inline styles + theme CSS
 * Called when user clicks Download button
 */
function capturePageForDownload() {
  try {
    // Capture current DOM state with ALL applied modifications
    const html = document.documentElement.outerHTML || document.body.innerHTML
    
    // Capture all applied CSS
    let allStyles = ""
    
    // 1. Theme CSS from __cksa_theme style tag
    const themeEl = document.getElementById("__cksa_theme")
    if (themeEl) {
      allStyles += "/* Applied Theme CSS */\n" + themeEl.textContent + "\n\n"
    }
    
    // 2. Collect all inline styles that were applied to elements
    const styledElements = document.querySelectorAll("[style]")
    const inlineRules = new Map()
    styledElements.forEach(el => {
      const selector = buildSelector(el)
      if (selector && el.getAttribute("style")) {
        inlineRules.set(selector, el.getAttribute("style"))
      }
    })
    
    if (inlineRules.size > 0) {
      allStyles += "/* Applied Inline Styles */\n"
      inlineRules.forEach((styles, selector) => {
        if (styles.trim()) {
          allStyles += `${selector} { ${styles} }\n`
        }
      })
      allStyles += "\n"
    }
    
    // 3. Collect data attributes used for tracking
    const layoutMarkings = []
    document.querySelectorAll("[data-cksa-layout]").forEach(el => {
      layoutMarkings.push({
        selector: buildSelector(el),
        label: el.getAttribute("data-cksa-layout")
      })
    })
    
    // Clean up: remove extension UI elements from captured HTML
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = html
    tempDiv.querySelectorAll("[id^='__cksa_'], #__cksa_panel, #__cksa_overlay, #__cksa_badge, #__cksa_drag_handle, [data-cksa-drag-target-outline]")
      .forEach(el => el.remove())
    
    const cleanHTML = tempDiv.innerHTML
    
    // Create final HTML document with comprehensive styling
    const timestamp = new Date().toLocaleString()
    let finalHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${document.title || 'Downloaded Page'}</title>
  <!-- Exported by Chai Ke Sath AI UI Editor -->
  <!-- Generated: ${timestamp} -->
  <style>
    /* Reset & Base Styles */
    * {
      box-sizing: border-box;
    }
    
    html, body {
      margin: 0;
      padding: 0;
    }
    
    /* Applied Modifications */
    ${allStyles}
  </style>
</head>
<body>
${cleanHTML}
<script>
// Applied layout changes log for reference:
${layoutMarkings.length > 0 ? `console.log('Applied Layout Changes:', ${JSON.stringify(layoutMarkings, null, 2)})` : ''}
</script>
</body>
</html>`
    
    return { 
      success: true, 
      html: finalHTML,
      timestamp: timestamp,
      modifiedElements: styledElements.length,
      layoutChanges: layoutMarkings.length
    }
  } catch (e) {
    console.error("Download capture error:", e)
    return { success: false, error: "Download failed: " + e.message }
  }
}

// Inject global theme manager for cross-site theme persistence
injectGlobalThemeManager()

clearThemeOnReloadIfNeeded()
  .then(() => syncThemeForCurrentPage(true).catch(() => {}))
  .catch(() => syncThemeForCurrentPage(true).catch(() => {}))

let themePageWatchHref = location.href
setInterval(() => {
  if (location.href !== themePageWatchHref) {
    themePageWatchHref = location.href
    syncThemeForCurrentPage(true).catch(() => {})
  }
}, 800)
