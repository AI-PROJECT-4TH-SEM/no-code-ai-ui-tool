const THEME_ID   = "__cksa_theme"
const OVERLAY_ID = "__cksa_overlay"
const PANEL_ID   = "__cksa_panel"
const BADGE_ID   = "__cksa_badge"

let inspectorActive = false
let selectedEl      = null
let originalStyles  = {}

//  Messages
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  switch (msg.type) {
    case "PING":       sendResponse({ alive: true }); return true
    case "APPLY_FIX":
      try { sendResponse({ success: true, result: applyFix(msg.domFix) }) }
      catch (e) { sendResponse({ success: false, error: e.message }) }
      return true
    case "APPLY_THEME":
      try { injectCSS(msg.css); sendResponse({ success: true }) }
      catch (e) { sendResponse({ success: false, error: e.message }) }
      return true
    case "REMOVE_THEME": removeCSS(); sendResponse({ success: true }); return true
    case "TOGGLE_INSPECTOR":
      msg.active ? enableInspector() : disableInspector()
      sendResponse({ success: true }); return true
  }
})

// Theme 
function injectCSS(css) {
  let el = document.getElementById(THEME_ID)
  if (!el) { el = document.createElement("style"); el.id = THEME_ID; document.head.appendChild(el) }
  el.textContent = css
}
function removeCSS() { document.getElementById(THEME_ID)?.remove() }


//  LAYOUT INSPECTOR — click to edit


function enableInspector() {
  if (inspectorActive) return
  inspectorActive = true
  document.body.style.cursor = "crosshair"
  document.addEventListener("mouseover", onHover,        true)
  document.addEventListener("mouseout",  onHoverOut,     true)
  document.addEventListener("click",     onInspectorClick, true)
  document.addEventListener("keydown",   onEscKey,       true)
}

function disableInspector() {
  if (!inspectorActive) return
  inspectorActive = false
  document.body.style.cursor = ""
  document.removeEventListener("mouseover", onHover,         true)
  document.removeEventListener("mouseout",  onHoverOut,      true)
  document.removeEventListener("click",     onInspectorClick, true)
  document.removeEventListener("keydown",   onEscKey,        true)
  clearOverlay()
  closePanel()
}

function onEscKey(e) {
  if (e.key === "Escape") {
    closePanel()
    disableInspector()
    chrome.runtime.sendMessage({ type: "INSPECTOR_CLOSED" })
  }
}

// ─── Hover highlight ──────────────────────────────────────────────────────────
function onHover(e) {
  if (isPanelEl(e.target)) return
  clearOverlay()
  const rect = e.target.getBoundingClientRect()
  const ov   = document.createElement("div")
  ov.id = OVERLAY_ID
  Object.assign(ov.style, {
    position: "fixed",
    top:    rect.top  + "px",
    left:   rect.left + "px",
    width:  rect.width  + "px",
    height: rect.height + "px",
    outline: "2px solid #a78bfa",
    background: "rgba(167,139,250,0.06)",
    pointerEvents: "none",
    zIndex: "2147483644",
    boxSizing: "border-box",
    borderRadius: "2px",
    transition: "all 0.1s",
  })

  // tiny tag badge
  const badge = document.createElement("div")
  badge.id = BADGE_ID
  badge.textContent = e.target.tagName.toLowerCase()
  Object.assign(badge.style, {
    position: "fixed",
    top:  (rect.top - 20) + "px",
    left: rect.left + "px",
    background: "#a78bfa",
    color: "#fff",
    fontSize: "10px",
    fontWeight: "700",
    padding: "2px 6px",
    borderRadius: "4px 4px 0 0",
    pointerEvents: "none",
    zIndex: "2147483645",
    fontFamily: "monospace",
  })
  document.body.appendChild(ov)
  document.body.appendChild(badge)
}

function onHoverOut(e) {
  if (isPanelEl(e.target)) return
  clearOverlay()
}

function clearOverlay() {
  document.getElementById(OVERLAY_ID)?.remove()
  document.getElementById(BADGE_ID)?.remove()
}

function isPanelEl(el) {
  return el?.closest?.(`#${PANEL_ID}`)
}

// ─── Click — open editor ──────────────────────────────────────────────────────
function onInspectorClick(e) {
  if (isPanelEl(e.target)) return
  e.preventDefault()
  e.stopPropagation()
  clearOverlay()
  selectedEl = e.target
  snapshotStyles(selectedEl)
  buildEditorPanel(selectedEl)
}

// Snapshot original computed styles 
function snapshotStyles(el) {
  const cs = window.getComputedStyle(el)
  originalStyles = {
    fontSize:     parseFloat(cs.fontSize)     || 16,
    lineHeight:   parseFloat(cs.lineHeight)   || 24,
    paddingTop:   parseFloat(cs.paddingTop)   || 0,
    paddingRight: parseFloat(cs.paddingRight) || 0,
    paddingBottom:parseFloat(cs.paddingBottom)|| 0,
    paddingLeft:  parseFloat(cs.paddingLeft)  || 0,
    marginTop:    parseFloat(cs.marginTop)    || 0,
    marginRight:  parseFloat(cs.marginRight)  || 0,
    marginBottom: parseFloat(cs.marginBottom) || 0,
    marginLeft:   parseFloat(cs.marginLeft)   || 0,
    borderRadius: parseFloat(cs.borderRadius) || 0,
    letterSpacing:parseFloat(cs.letterSpacing)|| 0,
    color:        rgbToHex(cs.color),
    background:   rgbToHex(findBg(el)),
    fontWeight:   cs.fontWeight,
    width:        parseFloat(cs.width)  || 0,
    height:       parseFloat(cs.height) || 0,
  }
}

// ─── Build the floating editor panel ─────────────────────────────────────────
function buildEditorPanel(el) {
  closePanel()
  const tag = el.tagName.toLowerCase()
  const cs  = window.getComputedStyle(el)
  const rect = el.getBoundingClientRect()

  // quick issue count
  const issues = getQuickIssues(el, cs, rect)
  const issueCount = issues.filter(i => !i.pass).length

  const panel = document.createElement("div")
  panel.id = PANEL_ID

  // position panel smartly
  const top  = Math.min(rect.bottom + 10, window.innerHeight - 460)
  const left = Math.max(8, Math.min(rect.left, window.innerWidth - 310))

  Object.assign(panel.style, {
    position:   "fixed",
    top:        Math.max(8, top) + "px",
    left:       left + "px",
    width:      "295px",
    zIndex:     "2147483647",
    fontFamily: "system-ui,-apple-system,sans-serif",
    userSelect: "none",
  })

  panel.innerHTML = `
    <div id="__p_root" style="
      background:#0d1117;
      border:1px solid #30363d;
      border-radius:12px;
      overflow:hidden;
      box-shadow:0 16px 50px rgba(0,0,0,0.7),0 0 0 1px rgba(167,139,250,0.15);
    ">

      <!-- Header -->
      <div style="
        display:flex;align-items:center;gap:8px;
        padding:10px 12px;
        background:#161b22;
        border-bottom:1px solid #21262d;
      ">
        <span style="
          font-size:11px;font-weight:800;font-family:monospace;
          color:#a78bfa;background:#1e1040;border:1px solid #3b1f7a;
          padding:2px 7px;border-radius:5px;letter-spacing:0.5px;
        ">&lt;${tag}&gt;</span>
        <span style="flex:1;font-size:10px;color:#484f58;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
          ${(el.className||"").toString().split(" ").filter(Boolean).slice(0,2).map(c=>"."+c).join(" ") || (el.id ? "#"+el.id : "")}
        </span>
        ${issueCount > 0 ? `<span style="font-size:9.5px;font-weight:700;color:#f0883e;background:#2d1b00;border:1px solid #3d2400;padding:2px 7px;border-radius:20px">${issueCount} issue${issueCount>1?"s":""}</span>` : `<span style="font-size:9.5px;font-weight:700;color:#3fb950;background:#0d1f12;border:1px solid #1a4723;padding:2px 7px;border-radius:20px">✓ OK</span>`}
        <button id="__p_close" style="
          background:transparent;border:none;color:#484f58;
          cursor:pointer;font-size:14px;padding:0 2px;line-height:1;
        ">✕</button>
      </div>

      <!-- Tabs -->
      <div style="display:flex;border-bottom:1px solid #21262d;background:#0d1117">
        <button class="__ptab __ptab-active" data-tab="typography"  style="${tabStyle(true)}">Typography</button>
        <button class="__ptab"               data-tab="spacing"     style="${tabStyle()}">Spacing</button>
        <button class="__ptab"               data-tab="size"        style="${tabStyle()}">Size</button>
        <button class="__ptab"               data-tab="colors"      style="${tabStyle()}">Colors</button>
      </div>

      <!-- Panels -->
      <div id="__p_body" style="padding:12px;max-height:340px;overflow-y:auto;">

        <!-- TYPOGRAPHY -->
        <div id="__tab_typography">
          ${slider("Font Size",    "__fs",  originalStyles.fontSize,     8,  72, 1, "px")}
          ${slider("Line Height",  "__lh",  originalStyles.lineHeight,   10, 80, 1, "px")}
          ${slider("Letter Space", "__ls",  originalStyles.letterSpacing,-2, 10, 0.1, "px")}
          ${selectRow("Font Weight", "__fw", originalStyles.fontWeight, [
            ["100","Thin"],["300","Light"],["400","Normal"],["500","Medium"],["600","Semi Bold"],["700","Bold"],["800","Extra Bold"],["900","Black"]
          ])}
        </div>

        <!-- SPACING -->
        <div id="__tab_spacing" style="display:none">
          <div style="${sectionLabel()}">PADDING</div>
          ${fourSides("Padding", "__pt","__pr","__pb","__pl",
            originalStyles.paddingTop, originalStyles.paddingRight,
            originalStyles.paddingBottom, originalStyles.paddingLeft)}
          <div style="${sectionLabel()}">MARGIN</div>
          ${fourSides("Margin", "__mt","__mr","__mb","__ml",
            originalStyles.marginTop, originalStyles.marginRight,
            originalStyles.marginBottom, originalStyles.marginLeft)}
        </div>

        <!-- SIZE -->
        <div id="__tab_size" style="display:none">
          ${slider("Width",         "__w",  originalStyles.width,  0, 1200, 1, "px")}
          ${slider("Height",        "__h",  originalStyles.height, 0, 800,  1, "px")}
          ${slider("Border Radius", "__br", originalStyles.borderRadius, 0, 100, 1, "px")}
          <div style="display:flex;gap:8px;margin-top:10px">
            <button id="__fit_content" style="${quickBtn()}">Fit Content</button>
            <button id="__full_width"  style="${quickBtn()}">Full Width</button>
          </div>
        </div>

        <!-- COLORS -->
        <div id="__tab_colors" style="display:none">
          ${colorRow("Text Color", "__color", originalStyles.color)}
          ${colorRow("Background", "__bg", originalStyles.background)}
          <div style="${sectionLabel()}">CONTRAST RATIO</div>
          <div id="__contrast_display" style="
            background:#161b22;border:1px solid #21262d;border-radius:7px;
            padding:8px 10px;font-size:12px;text-align:center;
          ">Loading…</div>
        </div>

      </div>

      <!-- Footer -->
      <div style="
        display:flex;gap:6px;padding:10px 12px;
        border-top:1px solid #21262d;background:#161b22;
      ">
        <button id="__p_reset"  style="${footBtn("danger")}">↩ Reset</button>
        <button id="__p_copy"   style="${footBtn("ghost")}">📋 Copy CSS</button>
        <button id="__p_keepon" style="${footBtn("primary")}">✓ Keep & Next</button>
      </div>

    </div>
  `

  document.body.appendChild(panel)
  setupPanelEvents(el, panel)
  updateContrast(el)
}

// ─── Panel Event Wiring ───────────────────────────────────────────────────────
function setupPanelEvents(el, panel) {

  // close
  panel.querySelector("#__p_close").addEventListener("click", () => {
    closePanel()
    disableInspector()
    chrome.runtime.sendMessage({ type: "INSPECTOR_CLOSED" })
  })

  // tabs
  panel.querySelectorAll(".__ptab").forEach(btn => {
    btn.addEventListener("click", () => {
      panel.querySelectorAll(".__ptab").forEach(t => {
        t.style.cssText = tabStyle()
        t.classList.remove("__ptab-active")
      })
      btn.style.cssText = tabStyle(true)
      btn.classList.add("__ptab-active")
      panel.querySelectorAll("[id^='__tab_']").forEach(t => t.style.display = "none")
      panel.querySelector(`#__tab_${btn.dataset.tab}`).style.display = "block"
    })
  })

  // ── Typography ──────────────────────────────────────────────────────────────
  wireProp(el, panel, "__fs",  v => el.style.fontSize = v + "px")
  wireProp(el, panel, "__lh",  v => el.style.lineHeight = v + "px")
  wireProp(el, panel, "__ls",  v => el.style.letterSpacing = v + "px")
  const fwSel = panel.querySelector("#__fw_select")
  if (fwSel) fwSel.addEventListener("change", () => { el.style.fontWeight = fwSel.value })

  // ── Spacing ─────────────────────────────────────────────────────────────────
  wireProp(el, panel, "__pt", v => el.style.paddingTop    = v + "px")
  wireProp(el, panel, "__pr", v => el.style.paddingRight  = v + "px")
  wireProp(el, panel, "__pb", v => el.style.paddingBottom = v + "px")
  wireProp(el, panel, "__pl", v => el.style.paddingLeft   = v + "px")
  wireProp(el, panel, "__mt", v => el.style.marginTop     = v + "px")
  wireProp(el, panel, "__mr", v => el.style.marginRight   = v + "px")
  wireProp(el, panel, "__mb", v => el.style.marginBottom  = v + "px")
  wireProp(el, panel, "__ml", v => el.style.marginLeft    = v + "px")

  // ── Size ────────────────────────────────────────────────────────────────────
  wireProp(el, panel, "__w",  v => el.style.width = v + "px")
  wireProp(el, panel, "__h",  v => el.style.height = v + "px")
  wireProp(el, panel, "__br", v => el.style.borderRadius = v + "px")
  panel.querySelector("#__fit_content")?.addEventListener("click", () => {
    el.style.width = "fit-content"; el.style.height = "auto"
  })
  panel.querySelector("#__full_width")?.addEventListener("click", () => {
    el.style.width = "100%"
  })

  // ── Colors ──────────────────────────────────────────────────────────────────
  const colorPicker = panel.querySelector("#__color_input")
  const bgPicker    = panel.querySelector("#__bg_input")
  colorPicker?.addEventListener("input", () => {
    el.style.color = colorPicker.value
    updateContrast(el, panel)
  })
  bgPicker?.addEventListener("input", () => {
    el.style.backgroundColor = bgPicker.value
    updateContrast(el, panel)
  })

  // ── Footer ──────────────────────────────────────────────────────────────────
  panel.querySelector("#__p_reset").addEventListener("click", () => {
    Object.entries(originalStyles).forEach(([prop, val]) => {
      try { el.style[prop] = "" } catch {}
    })
    closePanel()
    buildEditorPanel(el) // reopen with fresh values
  })

  panel.querySelector("#__p_copy").addEventListener("click", () => {
    const css = el.getAttribute("style") || ""
    navigator.clipboard.writeText(css).then(() => flashMsg(panel, "CSS copied!"))
  })

  panel.querySelector("#__p_keepon").addEventListener("click", () => {
    closePanel()
    flashPage("✓ Styles applied — click next element")
  })
}

// ─── Wire a slider+number pair to a live style property ──────────────────────
function wireProp(el, panel, id, setter) {
  const slider = panel.querySelector(`#${id}_slider`)
  const input  = panel.querySelector(`#${id}_num`)
  if (!slider || !input) return

  const apply = (v) => {
    const num = parseFloat(v)
    if (isNaN(num)) return
    slider.value = num
    input.value  = num
    setter(num)
  }

  slider.addEventListener("input", () => apply(slider.value))
  input.addEventListener("change", () => apply(input.value))
  input.addEventListener("input",  () => apply(input.value))
}

// ─── Contrast helper ─────────────────────────────────────────────────────────
function updateContrast(el, panel) {
  panel = panel || document.getElementById(PANEL_ID)
  const display = panel?.querySelector("#__contrast_display")
  if (!display) return
  const cs    = window.getComputedStyle(el)
  const fgRgb = parseRgb(cs.color)
  const bgRgb = parseRgb(findBg(el))
  if (!fgRgb || !bgRgb) { display.textContent = "Cannot detect"; return }
  const ratio = calcContrastRatio(fgRgb, bgRgb)
  const pass  = ratio >= 4.5
  display.innerHTML = `
    <span style="font-size:18px;font-weight:900;color:${pass ? "#3fb950" : "#f85149"}">${ratio.toFixed(2)}:1</span>
    <span style="font-size:11px;color:${pass ? "#3fb950" : "#f85149"};margin-left:8px">${pass ? "✓ WCAG AA Pass" : "✗ WCAG AA Fail"}</span>
  `
}

// ─── Quick issues for header badge ────────────────────────────────────────────
function getQuickIssues(el, cs, rect) {
  const issues = []
  const tag    = el.tagName.toLowerCase()
  const isIntr = ["a","button","input"].includes(tag) || el.getAttribute("role") === "button"
  if (isIntr) {
    issues.push({ pass: rect.width >= 44 && rect.height >= 44 })
  }
  const fgRgb = parseRgb(cs.color)
  const bgRgb = parseRgb(findBg(el))
  if (fgRgb && bgRgb) {
    issues.push({ pass: calcContrastRatio(fgRgb, bgRgb) >= 4.5 })
  }
  if (tag === "img") {
    issues.push({ pass: el.getAttribute("alt") !== null })
  }
  return issues
}

// ─── Panel close / flash helpers ─────────────────────────────────────────────
function closePanel() {
  document.getElementById(PANEL_ID)?.remove()
}

function flashMsg(panel, msg) {
  const el = document.createElement("div")
  Object.assign(el.style, {
    position: "absolute", bottom: "50px", left: "50%",
    transform: "translateX(-50%)",
    background: "#3fb950", color: "#0d1117",
    fontSize: "11px", fontWeight: "700",
    padding: "4px 12px", borderRadius: "6px",
    zIndex: "9999", pointerEvents: "none",
  })
  el.textContent = msg
  panel.appendChild(el)
  setTimeout(() => el.remove(), 1800)
}

function flashPage(msg) {
  const el = document.createElement("div")
  Object.assign(el.style, {
    position: "fixed", top: "20px", left: "50%",
    transform: "translateX(-50%)",
    background: "#1e1040", border: "1px solid #a78bfa",
    color: "#c4b5fd", fontSize: "12px", fontWeight: "700",
    padding: "8px 18px", borderRadius: "8px",
    zIndex: "2147483647", pointerEvents: "none",
    boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
  })
  el.textContent = "♿ " + msg
  document.body.appendChild(el)
  setTimeout(() => el.remove(), 2000)
}

// ─── HTML builders ────────────────────────────────────────────────────────────
function tabStyle(active = false) {
  return `
    flex:1;background:transparent;border:none;
    color:${active ? "#c4b5fd" : "#484f58"};
    font-size:10.5px;font-weight:${active ? "700" : "600"};
    padding:7px 4px;cursor:pointer;
    border-bottom:2px solid ${active ? "#a78bfa" : "transparent"};
    transition:color 0.15s;white-space:nowrap;
  `
}

function sectionLabel() {
  return `font-size:9px;font-weight:700;color:#484f58;letter-spacing:0.8px;margin:10px 0 6px;`
}

function footBtn(type) {
  const styles = {
    primary: "flex:1;background:#1e1040;border:1px solid #a78bfa;color:#c4b5fd;",
    danger:  "flex:1;background:#1a0505;border:1px solid #5a1a1a;color:#f85149;",
    ghost:   "flex:1;background:transparent;border:1px solid #21262d;color:#484f58;",
  }
  return `${styles[type]}padding:6px 4px;border-radius:7px;font-size:10.5px;font-weight:700;cursor:pointer;transition:opacity 0.15s;`
}

function quickBtn() {
  return `flex:1;background:#161b22;border:1px solid #30363d;color:#8b949e;padding:6px;border-radius:6px;font-size:10.5px;font-weight:600;cursor:pointer;`
}

function slider(label, id, val, min, max, step, unit) {
  return `
    <div style="margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <span style="font-size:10.5px;font-weight:600;color:#8b949e">${label}</span>
        <div style="display:flex;align-items:center;gap:4px">
          <input id="${id}_num" type="number" value="${val.toFixed(1)}" min="${min}" max="${max}" step="${step}" style="
            width:52px;background:#161b22;border:1px solid #30363d;
            color:#e6edf3;font-size:11px;font-weight:700;
            padding:3px 6px;border-radius:5px;text-align:center;
          "/>
          <span style="font-size:9.5px;color:#484f58">${unit}</span>
        </div>
      </div>
      <input id="${id}_slider" type="range" min="${min}" max="${max}" step="${step}" value="${val}" style="
        width:100%;accent-color:#a78bfa;height:4px;cursor:pointer;
      "/>
    </div>
  `
}

function fourSides(label, tid, rid, bid, lid, tv, rv, bv, lv) {
  return `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px">
      ${sideInput("Top",    tid, tv)}
      ${sideInput("Right",  rid, rv)}
      ${sideInput("Bottom", bid, bv)}
      ${sideInput("Left",   lid, lv)}
    </div>
  `
}

function sideInput(label, id, val) {
  return `
    <div>
      <div style="font-size:9px;color:#484f58;margin-bottom:3px;font-weight:600">${label.toUpperCase()}</div>
      <div style="display:flex;align-items:center;gap:3px">
        <input id="${id}_slider" type="range" min="0" max="80" step="1" value="${val}" style="flex:1;accent-color:#a78bfa;height:3px;cursor:pointer"/>
        <input id="${id}_num" type="number" value="${val}" min="0" max="200" step="1" style="
          width:40px;background:#161b22;border:1px solid #30363d;
          color:#e6edf3;font-size:10px;padding:2px 4px;
          border-radius:4px;text-align:center;
        "/>
      </div>
    </div>
  `
}

function selectRow(label, id, current, opts) {
  const options = opts.map(([v, l]) =>
    `<option value="${v}" ${current == v ? "selected" : ""}>${l}</option>`
  ).join("")
  return `
    <div style="margin-bottom:10px">
      <div style="font-size:10.5px;font-weight:600;color:#8b949e;margin-bottom:4px">${label}</div>
      <select id="${id}_select" style="
        width:100%;background:#161b22;border:1px solid #30363d;
        color:#e6edf3;font-size:11px;padding:5px 8px;
        border-radius:6px;cursor:pointer;
      ">${options}</select>
    </div>
  `
}

function colorRow(label, id, hex) {
  const safeHex = (hex && hex.startsWith("#") && hex.length >= 4) ? hex : "#ffffff"
  return `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
      <span style="font-size:10.5px;font-weight:600;color:#8b949e">${label}</span>
      <div style="display:flex;align-items:center;gap:6px">
        <span style="font-size:10px;color:#484f58;font-family:monospace">${safeHex}</span>
        <input id="${id}_input" type="color" value="${safeHex}" style="
          width:30px;height:26px;border:1px solid #30363d;
          border-radius:6px;cursor:pointer;padding:1px;
          background:#161b22;
        "/>
      </div>
    </div>
  `
}

// ─── Color utils ─────────────────────────────────────────────────────────────
function rgbToHex(str) {
  const m = str?.match(/\d+/g)
  if (!m) return "#000000"
  const [r,g,b] = m.map(Number)
  return "#" + [r,g,b].map(v => v.toString(16).padStart(2,"0")).join("")
}

function parseRgb(str) {
  if (!str || str === "transparent") return null
  const m = str.match(/\d+(\.\d+)?/g)
  return m ? m.slice(0,3).map(Number) : null
}

function luminance(r,g,b) {
  return [r,g,b].reduce((s,v,i) => {
    v /= 255
    v = v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4)
    return s + v * [0.2126,0.7152,0.0722][i]
  }, 0)
}

function calcContrastRatio([r1,g1,b1],[r2,g2,b2]) {
  const l1 = luminance(r1,g1,b1), l2 = luminance(r2,g2,b2)
  return (Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05)
}

function findBg(el) {
  let node = el
  while (node && node !== document.documentElement) {
    const bg = window.getComputedStyle(node).backgroundColor
    if (bg && bg !== "rgba(0,0,0,0)" && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)") return bg
    node = node.parentElement
  }
  return "rgb(255,255,255)"
}

// ═════════════════════════════════════════════════════════════════════════════
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
