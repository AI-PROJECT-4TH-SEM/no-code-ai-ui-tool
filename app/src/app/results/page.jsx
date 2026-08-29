"use client"
import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import AssistantDrawer from "@/components/AssistantDrawer"
import { useAuth } from "@/context/AuthContext"
import { themes } from "@/lib/themes.js"
import { themeManager } from "@/lib/themeManager"
import { downloadUtils } from "@/lib/downloadUtils"

const STRUCTURAL_IDS = new Set([
  "region", "landmark-one-main", "heading-order", "page-has-heading-one",
])
const LANDMARK_GROUP = new Set(["region", "landmark-one-main"])

const INSPECTOR_SCRIPT = `
<script>
(function() {
  var highlighted = null;
  var inspectorOn  = false;

  function cssPath(el) {
    if (!el || el === document.body) return 'body';
    var path = [];
    var node = el;
    while (node && node !== document.body) {
      var tag = node.tagName ? node.tagName.toLowerCase() : '';
      var idx = 1;
      var sib = node.previousElementSibling;
      while (sib) { if (sib.tagName === node.tagName) idx++; sib = sib.previousElementSibling; }
      path.unshift(tag + ':nth-of-type(' + idx + ')');
      node = node.parentElement;
    }
    return 'body > ' + path.join(' > ');
  }

  function rgbToHex(str) {
    var m = str && str.match(/\\d+/g);
    if (!m) return '#000000';
    return '#' + m.slice(0,3).map(function(v){ return (+v).toString(16).padStart(2,'0'); }).join('');
  }

  function findBg(el) {
    var node = el;
    while (node) {
      var bg = window.getComputedStyle(node).backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return bg;
      node = node.parentElement;
    }
    return 'rgb(255,255,255)';
  }

  function clearHighlight() {
    if (highlighted) {
      highlighted.style.outline    = highlighted.__prevOutline    || '';
      highlighted.style.outlineOffset = highlighted.__prevOffset || '';
      highlighted = null;
    }
  }

  window.addEventListener('message', function(e) {
    if (!e.data) return;
    if (e.data.type === 'INSPECTOR_ON') {
      inspectorOn = true;
      document.body.style.cursor = 'crosshair';
    }
    if (e.data.type === 'INSPECTOR_OFF') {
      inspectorOn = false;
      document.body.style.cursor = '';
      clearHighlight();
    }
    if (e.data.type === 'APPLY_STYLE' && e.data.selector) {
      try {
        var el = document.querySelector(e.data.selector);
        if (!el) return;
        Object.keys(e.data.styles).forEach(function(prop) {
          var val = e.data.styles[prop];
          if (val !== null && val !== undefined) el.style[prop] = val;
        });
      } catch(err) {}
    }
    if (e.data.type === 'RESET_STYLE' && e.data.selector) {
      try {
        var el = document.querySelector(e.data.selector);
        if (el) el.removeAttribute('style');
      } catch(err) {}
    }
  });

  document.addEventListener('mouseover', function(e) {
    if (!inspectorOn) return;
    clearHighlight();
    e.target.__prevOutline = e.target.style.outline;
    e.target.__prevOffset  = e.target.style.outlineOffset;
    e.target.style.outline       = '2px dashed #a78bfa';
    e.target.style.outlineOffset = '2px';
    highlighted = e.target;
  }, true);

  document.addEventListener('mouseout', function(e) {
    if (!inspectorOn || e.target !== highlighted) return;
    clearHighlight();
  }, true);

  document.addEventListener('click', function(e) {
    if (!inspectorOn) return;
    e.preventDefault();
    e.stopPropagation();

    var el  = e.target;
    var cs  = window.getComputedStyle(el);
    var sel = cssPath(el);

    clearHighlight();
    el.style.outline       = '2px solid #a78bfa';
    el.style.outlineOffset = '2px';
    highlighted = el;

    window.parent.postMessage({
      type: 'ELEMENT_SELECTED',
      selector: sel,
      tag:      el.tagName ? el.tagName.toLowerCase() : 'unknown',
      text:     (el.textContent || '').trim().slice(0, 60),
      className:(el.className && typeof el.className === 'string') ? el.className : '',
      id:       el.id || '',
      styles: {
        fontSize:      parseFloat(cs.fontSize)      || 16,
        lineHeight:    parseFloat(cs.lineHeight)    || 24,
        letterSpacing: parseFloat(cs.letterSpacing) || 0,
        fontWeight:    parseInt(cs.fontWeight)      || 400,
        paddingTop:    parseFloat(cs.paddingTop)    || 0,
        paddingRight:  parseFloat(cs.paddingRight)  || 0,
        paddingBottom: parseFloat(cs.paddingBottom) || 0,
        paddingLeft:   parseFloat(cs.paddingLeft)   || 0,
        marginTop:     parseFloat(cs.marginTop)     || 0,
        marginRight:   parseFloat(cs.marginRight)   || 0,
        marginBottom:  parseFloat(cs.marginBottom)  || 0,
        marginLeft:    parseFloat(cs.marginLeft)    || 0,
        width:         parseFloat(cs.width)         || 0,
        height:        parseFloat(cs.height)        || 0,
        borderRadius:  parseFloat(cs.borderRadius)  || 0,
        color:         rgbToHex(cs.color),
        backgroundColor: rgbToHex(findBg(el)),
      }
    }, '*');
  }, true);
})();
<\/script>`

function buildNewSuppressed(fixedSuggestions, existing) {
  const updated = new Set(existing)
  for (const s of fixedSuggestions) {
    if (STRUCTURAL_IDS.has(s.id)) {
      updated.add(s.id)
      if (LANDMARK_GROUP.has(s.id)) LANDMARK_GROUP.forEach(id => updated.add(id))
    }
  }
  return updated
}

function applyDomFix(doc, fix) {
  if (!fix?.type) return
  switch (fix.type) {
    case "setAttribute":
      doc.querySelectorAll(fix.selector).forEach(el => el.setAttribute(fix.attribute, fix.value)); break
    case "setStyle":
      doc.querySelectorAll(fix.selector).forEach(el => { el.style[fix.style] = fix.styleValue }); break
    case "setStyleImportant":
      doc.querySelectorAll(fix.selector).forEach(el => el.style.setProperty(fix.style, fix.styleValue, "important")); break
    case "setInnerText":
      doc.querySelectorAll(fix.selector).forEach(el => { el.textContent = fix.value }); break
    case "addClass":
      doc.querySelectorAll(fix.selector).forEach(el => el.classList.add(fix.value)); break
    case "replaceHtml": {
      const el = doc.querySelector(fix.selector); if (el) el.outerHTML = fix.value; break
    }
    case "wrapMain": {
      if (doc.querySelector("main")) break
      const body = doc.querySelector("body"); if (!body) break
      const main = doc.createElement("main")
      Array.from(body.children).forEach(c => { if (!["HEADER","NAV","FOOTER"].includes(c.tagName)) main.appendChild(c) })
      body.appendChild(main); break
    }
    case "wrapWithMain": {
      if (doc.querySelector("main")) break
      const body = doc.querySelector("body"); if (!body) break
      const main = doc.createElement("main")
      Array.from(body.children).forEach(c => { if (!["HEADER","NAV","FOOTER","MAIN","ASIDE"].includes(c.tagName)) main.appendChild(c) })
      const footer = body.querySelector("footer")
      footer ? body.insertBefore(main, footer) : body.appendChild(main); break
    }
    case "multifix": fix.fixes.forEach(f => applyDomFix(doc, f)); break
    case "ensureH1": {
      if (doc.querySelector("h1")) break
      const h1 = doc.createElement("h1")
      h1.textContent = doc.querySelector("title")?.textContent || doc.querySelector("h2")?.textContent || "Page title"
      doc.querySelector("body")?.prepend(h1); break
    }
    case "replaceTag":
      if (!fix.selector || !fix.tag) break
      doc.querySelectorAll(fix.selector).forEach(el => {
        const n = doc.createElement(fix.tag)
        n.innerHTML = el.innerHTML
        Array.from(el.attributes).forEach(a => n.setAttribute(a.name, a.value))
        el.replaceWith(n)
      }); break
    default: console.warn("Unknown fix type:", fix.type)
  }
}

function buildCssPath(el) {
  if (!el || el === document.body) return "body"
  const path = []
  let node = el
  while (node && node !== document.body) {
    const tag = node.tagName ? node.tagName.toLowerCase() : ""
    let idx = 1
    let sib = node.previousElementSibling
    while (sib) {
      if (sib.tagName === node.tagName) idx++
      sib = sib.previousElementSibling
    }
    path.unshift(`${tag}:nth-of-type(${idx})`)
    node = node.parentElement
  }
  return `body > ${path.join(" > ")}`
}

function buildAssistantSelectionContext(html, selectedEl) {
  if (!html || !selectedEl?.selector) return null

  try {
    const doc = new DOMParser().parseFromString(html, "text/html")
    const selectedNode = doc.querySelector(selectedEl.selector)
    if (!selectedNode) return { ...selectedEl, selectedHtml: "", selectionMode: "element" }

    const wrapper = selectedNode.closest(".thumbinner, figure, .gallerybox, .mw-file-element, .mw-file-description")
    const effectiveNode = wrapper || selectedNode

    return {
      ...selectedEl,
      effectiveSelector: wrapper ? buildCssPath(effectiveNode) : selectedEl.selector,
      effectiveTag: effectiveNode.tagName ? effectiveNode.tagName.toLowerCase() : selectedEl.tag,
      effectiveClassName: typeof effectiveNode.className === "string" ? effectiveNode.className : "",
      selectedHtml: (effectiveNode.outerHTML || "").slice(0, 3500),
      selectionMode: wrapper ? "wrapper" : "element",
    }
  } catch {
    return { ...selectedEl, selectedHtml: "", selectionMode: "element" }
  }
}

function SliderRow({ label, id, value, min, max, step = 1, unit = "px", onChange }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wide">{label}</span>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={typeof value === "number" ? value.toFixed(step < 1 ? 1 : 0) : value}
            min={min} max={max} step={step}
            onChange={e => onChange(parseFloat(e.target.value))}
            className="w-12 bg-white/5 border border-white/10 rounded text-[11px] text-center text-white/80 py-0.5 px-1 outline-none focus:border-purple-500"
          />
          <span className="text-[9px] text-white/25">{unit}</span>
        </div>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-1 accent-purple-500 cursor-pointer"
        style={{ accentColor: "#a78bfa" }}
      />
    </div>
  )
}

function FourSides({ label, keys, values, onChange }) {
  const sides = ["Top","Right","Bottom","Left"]
  return (
    <div className="mb-3">
      <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wide mb-2">{label}</div>
      <div className="grid grid-cols-2 gap-2">
        {sides.map((side, i) => (
          <div key={side}>
            <div className="text-[9px] text-white/30 mb-0.5">{side}</div>
            <div className="flex items-center gap-1">
              <input
                type="range" min={0} max={80} step={1} value={values[i]}
                onChange={e => onChange(keys[i], parseFloat(e.target.value))}
                className="flex-1 h-1 cursor-pointer" style={{ accentColor: "#a78bfa" }}
              />
              <input
                type="number" value={values[i]} min={0} max={200} step={1}
                onChange={e => onChange(keys[i], parseFloat(e.target.value))}
                className="w-10 bg-white/5 border border-white/10 rounded text-[10px] text-center text-white/80 py-0.5 outline-none focus:border-purple-500"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ColorRow({ label, propKey, value, onChange }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wide">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-white/25 font-mono">{value}</span>
        <input
          type="color" value={value || "#000000"}
          onChange={e => onChange(propKey, e.target.value)}
          className="w-7 h-6 rounded cursor-pointer border border-white/10 bg-transparent p-0.5"
        />
      </div>
    </div>
  )
}

export default function Results() {
 
  const [html, setHtml]                     = useState("")
  const [session, setSession]               = useState(null)
  const [suggestions, setSuggestions]       = useState([])
  const [score, setScore]                   = useState(null)
  const [violationCount, setViolationCount] = useState(0)
  const [analysing, setAnalysing]           = useState(false)
  const [analysed, setAnalysed]             = useState(false)
  const [isFreshSession, setIsFreshSession] = useState(false)
  const [changes, setChanges]               = useState([])
  const [undoStack, setUndoStack]           = useState([])
  const [redoStack, setRedoStack]           = useState([])
  const [error, setError]                   = useState(null)
  const [openId, setOpenId]                 = useState(null)
  const [saving, setSaving]                 = useState(false)

  const router       = useRouter()
  const [sessionId, setSessionId] = useState(null)
  const [themeParam, setThemeParam] = useState(null)
  const { accessToken } = useAuth()
  const pageUrl = session?.url || ""

  const [suppressedIds, setSuppressedIds]   = useState(new Set())
  const [activeTheme, setActiveTheme]       = useState(null)
  const iframeKey = useMemo(() => `${html.length}-${activeTheme?.id ?? "none"}`, [html, activeTheme])

  const [layoutMode, setLayoutMode]         = useState(false)
  const [selectedEl, setSelectedEl]         = useState(null)
  const [pendingStyles, setPendingStyles]   = useState({})
  const [layoutText, setLayoutText]         = useState("")
  const [layoutTextMode, setLayoutTextMode] = useState("replace")
  const [layoutTab, setLayoutTab]           = useState("typography")
  const [layoutApplied, setLayoutApplied]   = useState(false)

  const suppressedIdsRef = useRef(new Set())
  const htmlRef          = useRef("")
  const sessionRef       = useRef(null)
  const activeThemeRef   = useRef(null)
  const iframeRef        = useRef(null)

  useEffect(() => { suppressedIdsRef.current = suppressedIds }, [suppressedIds])
  useEffect(() => { htmlRef.current = html },           [html])
  useEffect(() => { sessionRef.current = session },     [session])
  useEffect(() => { activeThemeRef.current = activeTheme }, [activeTheme])

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(window.location.search)
      setSessionId(params.get("sessionId"))
      setThemeParam(params.get("theme"))
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (themeParam) {
        setActiveTheme(themes.find(t => t.name === decodeURIComponent(themeParam)) || null)
        return
      }
      const savedTheme = themeManager.getActiveTheme()
      setActiveTheme(savedTheme ? themes.find(t => t.name === savedTheme.name) || savedTheme : null)
    }, 0)
    return () => clearTimeout(timer)
  }, [themeParam])

  useEffect(() => {
    function onMsg(e) {
      if (e.data?.type === "ELEMENT_SELECTED") {
        setSelectedEl(e.data)
        setPendingStyles({ ...e.data.styles })
        setLayoutText(e.data.text || "")
        setLayoutTextMode("replace")
        setLayoutApplied(false)
        setLayoutTab("typography")
      }
    }
    window.addEventListener("message", onMsg)
    return () => window.removeEventListener("message", onMsg)
  }, [])

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe?.contentWindow) return
    iframe.contentWindow.postMessage({ type: layoutMode ? "INSPECTOR_ON" : "INSPECTOR_OFF" }, "*")
  }, [layoutMode, iframeKey])

  useEffect(() => {
    if (!accessToken || !sessionId) return
    async function loadSession() {
      try {
        const res  = await fetch(`/api/session/${sessionId}`, { headers: { Authorization: `Bearer ${accessToken}` } })
        const data = await res.json()
        if (res.ok) {
          setSession(data); sessionRef.current = data
          const hasChanges = data.changes?.length > 0
          const latestHtml = hasChanges ? data.changes[0].html : data.originalHtml
          setHtml(latestHtml || ""); htmlRef.current = latestHtml || ""
          setChanges(data.changes || [])
          setUndoStack([]); setRedoStack([])
          setIsFreshSession(!hasChanges)
          const restored = new Set(data.suppressedIds || [])
          setSuppressedIds(restored); suppressedIdsRef.current = restored
        } else { setError("Failed to load session") }
      } catch { setError("Failed to load session") }
    }
    loadSession()
  }, [accessToken, sessionId])

  const runAnalysis = useCallback(async () => {
    const currentHtml = htmlRef.current || sessionRef.current?.originalHtml
    const currentUrl  = sessionRef.current?.url
    if (!currentHtml && !currentUrl) return
    const htmlWithTheme = activeThemeRef.current
      ? currentHtml + `<style>${activeThemeRef.current.css}</style>`
      : currentHtml
    setAnalysing(true); setError(null); setOpenId(null)
    try {
      const res  = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: htmlWithTheme, url: currentUrl }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Analysis failed")
      const filtered = (data.suggestions || []).filter(s => !suppressedIdsRef.current.has(s.id))
      setScore(data.score ?? 0); setViolationCount(data.violations ?? 0)
      setSuggestions(filtered); setAnalysed(true)
    } catch (err) {
      console.error(err); setError(err.message || "Analysis failed")
    } finally { setAnalysing(false) }
  }, [])

  useEffect(() => {
    if (isFreshSession && sessionRef.current?.originalHtml && !analysed && !analysing) runAnalysis()
  }, [isFreshSession, analysed, analysing, runAnalysis])

  async function saveToBackend(htmlToSave, themeName = "Saved", newSuppressedIds = suppressedIds) {
    setSaving(true)
    try {
      await fetch(`/api/session/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ html: htmlToSave, themeName, suppressedIds: [...newSuppressedIds] }),
      })
    } catch (err) { console.error("Save failed:", err) }
    finally { setSaving(false) }
  }

  function fixAll() {
    const fixable = suggestions.filter(s => s.domFix && !s.fixed)
    if (!fixable.length) return
    const doc = new DOMParser().parseFromString(htmlRef.current, "text/html")
    for (const s of fixable) {
      const noSel = ["wrapMain","wrapWithMain","ensureH1","multifix"]
      if (!noSel.includes(s.domFix.type) && !doc.querySelectorAll(s.domFix.selector).length) continue
      applyDomFix(doc, s.domFix)
    }
    const newHtml = doc.documentElement.outerHTML
    const newSup  = buildNewSuppressed(fixable, suppressedIdsRef.current)
    suppressedIdsRef.current = newSup; htmlRef.current = newHtml
    setSuppressedIds(newSup); setUndoStack(p => [...p, html]); setRedoStack([])
    setHtml(newHtml); saveToBackend(newHtml, "Fix All", newSup)
    setSuggestions(p => p.map(s => s.domFix ? { ...s, fixed: true } : s))
    setChanges(p => [{ _id: Date.now().toString(), themeName: "Fix All", html: newHtml, appliedAt: new Date() }, ...p])
  }

  function applyFix(suggestion) {
    if (!suggestion.domFix) return
    const noSel = ["wrapMain","wrapWithMain","ensureH1","multifix"]
    const doc   = new DOMParser().parseFromString(htmlRef.current, "text/html")
    if (!noSel.includes(suggestion.domFix.type)) {
      const { selector } = suggestion.domFix
      if (!selector) { alert("No selector provided"); return }
      if (!doc.querySelectorAll(selector).length) { alert(`Element not found: ${selector}`); return }
    }
    applyDomFix(doc, suggestion.domFix)
    const newHtml = doc.documentElement.outerHTML
    const newSup  = buildNewSuppressed([suggestion], suppressedIdsRef.current)
    suppressedIdsRef.current = newSup; htmlRef.current = newHtml
    setSuppressedIds(newSup); setUndoStack(p => [...p, html]); setRedoStack([])
    setHtml(newHtml); saveToBackend(newHtml, `Fix: ${suggestion.title}`, newSup)
    setSuggestions(p => p.map((s, idx) => idx === suggestions.indexOf(suggestion) ? { ...s, fixed: true } : s))
    setChanges(p => [{ _id: Date.now().toString(), themeName: `Fix: ${suggestion.title}`, html: newHtml, appliedAt: new Date() }, ...p])
  }

  function undo() {
    if (!undoStack.length) return
    const prev = undoStack[undoStack.length - 1]
    setRedoStack(p => [html, ...p]); setUndoStack(p => p.slice(0,-1))
    setHtml(prev); htmlRef.current = prev
  }
  function redo() {
    if (!redoStack.length) return
    const next = redoStack[0]
    setUndoStack(p => [...p, html]); setRedoStack(p => p.slice(1))
    setHtml(next); htmlRef.current = next
  }

  // Enhanced theme injection with wrapper
  function injectTheme(html, theme) {
    if (!theme) return html
    return `<div class="theme-wrapper"><style>${theme.css}
      .theme-wrapper *{transition:all 0.3s ease!important}
      .theme-wrapper h1{font-size:2.2em!important}
      .theme-wrapper h2{font-size:1.8em!important}
      .theme-wrapper h3{font-size:1.4em!important}
      .theme-wrapper button:hover{transform:scale(1.05)}
    </style>${html}</div>`
  }

  // Download HTML with theme applied
  function downloadHtml() {
    const finalHtml = activeTheme ? injectTheme(html, activeTheme) : html
    downloadUtils.downloadSelfContainedHtml(finalHtml, activeTheme, `fixed-page-${new Date().getTime()}.html`)
  }

  // Download complete package with HTML, CSS, and modifications
  function downloadCompletePackage() {
    const modificationsCss = themeManager.extractModificationsCss(html)
    downloadUtils.downloadAllModifications(html, modificationsCss, activeTheme)
  }

  // Download CSS modifications separately
  function downloadCssOnly() {
    const modificationsCss = themeManager.extractModificationsCss(html)
    const timestamp = new Date().toISOString().slice(0, 10)
    downloadUtils.downloadCssFile(modificationsCss, `modifications-${timestamp}.css`)
  }

  // Theme change handler - uses sessionStorage
  function handleThemeChange(theme) {
    setActiveTheme(theme)
    // Save to sessionStorage (cleared on page reload)
    themeManager.saveActiveTheme(theme)
  }

  // Remove theme handler
  function removeTheme() {
    setActiveTheme(null)
    themeManager.clearActiveTheme()
  }

  // Clean up theme on component unmount
  useEffect(() => {
    return () => {
      // Cleanup function - sessionStorage will auto-clear on page reload
    }
  }, [])

 
  function liveUpdate(cssProp, rawValue, unit = "px") {
    const val = typeof rawValue === "number" ? rawValue + unit : rawValue
    iframeRef.current?.contentWindow?.postMessage({
      type: "APPLY_STYLE",
      selector: selectedEl.selector,
      styles: { [cssProp]: val }
    }, "*")
  }

  function handleSlider(stateKey, cssProp, value, unit = "px") {
    setPendingStyles(p => ({ ...p, [stateKey]: value }))
    liveUpdate(cssProp, value, unit)
  }

  function handleSideProp(stateKey, cssProp, value) {
    setPendingStyles(p => ({ ...p, [stateKey]: value }))
    liveUpdate(cssProp, value, "px")
  }

  function handleColor(cssProp, value) {
    const stateKey = cssProp === "color" ? "color" : "backgroundColor"
    setPendingStyles(p => ({ ...p, [stateKey]: value }))
    iframeRef.current?.contentWindow?.postMessage({
      type: "APPLY_STYLE",
      selector: selectedEl.selector,
      styles: { [cssProp]: value }
    }, "*")
  }

  function bakeLayoutStyles() {
    if (!selectedEl) return
    const doc = new DOMParser().parseFromString(htmlRef.current, "text/html")
    try {
      const el = doc.querySelector(selectedEl.selector)
      if (!el) return
      const ps = pendingStyles
      const styleMap = {
        fontSize:      ps.fontSize      != null ? ps.fontSize + "px"      : null,
        lineHeight:    ps.lineHeight    != null ? ps.lineHeight + "px"    : null,
        letterSpacing: ps.letterSpacing != null ? ps.letterSpacing + "px" : null,
        fontWeight:    ps.fontWeight    != null ? String(ps.fontWeight)   : null,
        paddingTop:    ps.paddingTop    != null ? ps.paddingTop + "px"    : null,
        paddingRight:  ps.paddingRight  != null ? ps.paddingRight + "px"  : null,
        paddingBottom: ps.paddingBottom != null ? ps.paddingBottom + "px" : null,
        paddingLeft:   ps.paddingLeft   != null ? ps.paddingLeft + "px"   : null,
        marginTop:     ps.marginTop     != null ? ps.marginTop + "px"     : null,
        marginRight:   ps.marginRight   != null ? ps.marginRight + "px"   : null,
        marginBottom:  ps.marginBottom  != null ? ps.marginBottom + "px"  : null,
        marginLeft:    ps.marginLeft    != null ? ps.marginLeft + "px"    : null,
        width:         ps.width         != null ? ps.width + "px"         : null,
        height:        ps.height        != null ? ps.height + "px"        : null,
        borderRadius:  ps.borderRadius  != null ? ps.borderRadius + "px"  : null,
        color:         ps.color         || null,
        backgroundColor: ps.backgroundColor || null,
      }
      Object.entries(styleMap).forEach(([prop, val]) => {
        if (val !== null) el.style[prop] = val
      })
    } catch {}
    const newHtml = doc.documentElement.outerHTML
    htmlRef.current = newHtml
    setUndoStack(p => [...p, html]); setRedoStack([])
    setHtml(newHtml)
    saveToBackend(newHtml, `Layout: ${selectedEl.tag}`)
    setChanges(p => [{
      _id: Date.now().toString(),
      themeName: `Layout: <${selectedEl.tag}>`,
      html: newHtml, appliedAt: new Date(),
    }, ...p])
    setLayoutApplied(true)
  }

  function applyLayoutText() {
    if (!selectedEl?.selector) return
    const doc = new DOMParser().parseFromString(htmlRef.current, "text/html")
    try {
      const el = doc.querySelector(selectedEl.selector)
      if (!el) return

      const nextText = String(layoutText || "")
      const mode = layoutTextMode === "append" ? "append" : layoutTextMode === "prepend" ? "prepend" : "replace"

      if (el.tagName === "IMG") {
        const existingAlt = el.getAttribute("alt") || ""
        const current = mode === "append" ? `${existingAlt}${nextText}` : mode === "prepend" ? `${nextText}${existingAlt}` : nextText
        el.setAttribute("alt", current)
        el.setAttribute("title", current)
        el.setAttribute("aria-label", current)
      } else if (mode === "append") {
        el.appendChild(doc.createTextNode(nextText))
      } else if (mode === "prepend") {
        el.insertBefore(doc.createTextNode(nextText), el.firstChild)
      } else {
        el.textContent = nextText
      }

      const newHtml = doc.documentElement.outerHTML
      htmlRef.current = newHtml
      setUndoStack(p => [...p, html])
      setRedoStack([])
      setHtml(newHtml)
      saveToBackend(newHtml, `Layout Text: ${selectedEl.tag}`)
      setChanges(p => [{
        _id: Date.now().toString(),
        themeName: `Layout Text: <${selectedEl.tag}>`,
        html: newHtml,
        appliedAt: new Date(),
      }, ...p])
      setLayoutApplied(true)
    } catch {
      // Keep the editor stable if the selector cannot be resolved.
    }
  }

  function createLayoutTextBlock() {
    try {
      const doc = new DOMParser().parseFromString(htmlRef.current || "", "text/html")
      const body = doc.querySelector('body') || doc

      const wrapper = doc.createElement('div')
      const id = '__cksa_text_' + Date.now()
      wrapper.id = id
      wrapper.setAttribute('data-cksa-text-block', 'true')
      wrapper.setAttribute('data-cksa-created', 'true')
      // basic inline styles so block is visible in preview/download
      wrapper.style.position = 'absolute'
      const safeLeft = Math.max(16, Math.round((doc.documentElement?.clientWidth || 800) * 0.25))
      const safeTop = Math.max(16, 100)
      wrapper.style.left = safeLeft + 'px'
      wrapper.style.top = safeTop + 'px'
      wrapper.style.zIndex = '2147483644'
      wrapper.style.padding = '8px'
      wrapper.style.background = 'transparent'
      wrapper.style.color = '#000'
      wrapper.style.borderRadius = '6px'
      wrapper.style.boxShadow = '0 6px 20px rgba(0,0,0,0.12)'

      const content = String(layoutText || 'New text')
      const lines = content.split(/\r?\n/)
      lines.forEach((ln, idx) => {
        wrapper.appendChild(doc.createTextNode(ln))
        if (idx < lines.length - 1) wrapper.appendChild(doc.createElement('br'))
      })

      body.appendChild(wrapper)

      const newHtml = doc.documentElement.outerHTML
      htmlRef.current = newHtml
      setUndoStack(p => [...p, html])
      setRedoStack([])
      setHtml(newHtml)
      saveToBackend(newHtml, 'Layout: created text block')
      setChanges(p => [{ _id: Date.now().toString(), themeName: 'Layout: created text block', html: newHtml, appliedAt: new Date() }, ...p])
      setLayoutApplied(true)
    } catch (e) {
      console.error('Create text block failed', e)
    }
  }

  function resetLayoutStyles() {
    if (!selectedEl) return
    iframeRef.current?.contentWindow?.postMessage({ type: "RESET_STYLE", selector: selectedEl.selector }, "*")
    setPendingStyles({ ...selectedEl.styles })
    setLayoutApplied(false)
  }

  async function applyAssistantPlan(plan) {
    if (!plan || !Array.isArray(plan.actions)) return { applied: false }

    const currentHtml = htmlRef.current
    const doc = new DOMParser().parseFromString(currentHtml, "text/html")
    let htmlChanged = false
    let themeChanged = false
    let nextTheme = null

    for (const action of plan.actions) {
      if (action?.kind === "domFix" && action.fix) {
        applyDomFix(doc, action.fix)
        htmlChanged = true
      }

      if (action?.kind === "theme" && action.themeId) {
        nextTheme = themes.find(theme => theme.id === action.themeId || theme.name === action.themeId) || null
      }
    }

    if (htmlChanged) {
      const newHtml = doc.documentElement.outerHTML
      htmlRef.current = newHtml
      setUndoStack(prev => [...prev, currentHtml])
      setRedoStack([])
      setHtml(newHtml)
      setChanges(prev => [{
        _id: Date.now().toString(),
        themeName: plan.reply ? `AI Chat: ${plan.reply.slice(0, 40)}` : "AI Chat",
        html: newHtml,
        appliedAt: new Date(),
      }, ...prev])
      await saveToBackend(newHtml, plan.reply ? `AI Chat: ${plan.reply.slice(0, 40)}` : "AI Chat")
    }

    if (nextTheme) {
      setActiveTheme(nextTheme)
      themeChanged = true
    }

    return { applied: htmlChanged || themeChanged, htmlChanged, themeChanged }
  }

  const iframeSrcDoc = (() => {
    if (!html) return ""
    const themeStyle = activeTheme ? `<style>${activeTheme.css}</style>` : ""
    return html + themeStyle + (layoutMode ? INSPECTOR_SCRIPT : "")
  })()
  const showOriginalPage = Boolean(pageUrl && !activeTheme && !changes.length && !layoutMode)

  const safeScore  = score ?? 0
  const scoreColor = safeScore >= 80 ? "text-green-400" : safeScore >= 50 ? "text-yellow-400" : "text-red-400"
  const impactColor = { critical:"text-red-400", serious:"text-orange-400", moderate:"text-yellow-400", minor:"text-blue-400" }

  const LAYOUT_TABS = ["typography","spacing","size","colors","text"]
  const assistantSelection = buildAssistantSelectionContext(html, selectedEl)

  return (
    <div className="flex flex-col min-h-screen text-white relative"
      style={{ backgroundImage:"url('/hero-bg.jpg')", backgroundSize:"cover", backgroundPosition:"center", backgroundAttachment:"fixed" }}>
      <div className="absolute inset-0 bg-black/50 z-0" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <div className="flex-1 flex flex-col md:grid md:grid-cols-[1fr_2fr_1fr] md:h-[calc(100vh-64px)] overflow-hidden">

          
          <div className="order-2 md:order-1 flex flex-col p-4 border-t md:border-t-0 md:border-r border-white/10 overflow-y-auto bg-black/20 backdrop-blur-md">
            <h2 className="text-lg font-semibold mb-4">AI Suggestions</h2>

            {error && (
              <div className="mb-3 p-3 bg-red-900/30 backdrop-blur-sm border border-red-500/30 rounded text-sm text-red-300">
                {error}
                <button onClick={runAnalysis} className="block mt-2 text-xs underline">Retry</button>
              </div>
            )}

            {analysing && (
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Analysing your page...
              </div>
            )}

            {!analysed && !analysing && !error && (
              <button onClick={runAnalysis} className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded transition-colors">
                Analyse
              </button>
            )}

            {analysed && !analysing && (
              <>
                <div className="mb-4 p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded">
                  <p className={`text-2xl font-bold ${scoreColor}`}>
                    {safeScore}<span className="text-sm text-gray-400 font-normal">/100</span>
                  </p>
                  <p className="text-sm text-gray-400 mt-0.5">{violationCount} issues found</p>
                </div>

                <button onClick={() => { setAnalysed(false); setSuggestions([]); setScore(null); setViolationCount(0); runAnalysis() }}
                  className="mb-2 w-full py-1.5 text-sm border border-white/10 rounded hover:bg-white/10 transition-colors">
                  Re-analyse
                </button>

                {suggestions.some(s => s.domFix && !s.fixed) && (
                  <button onClick={fixAll}
                    className="mb-4 w-full py-1.5 text-sm rounded bg-green-600 hover:bg-green-700 transition-colors font-medium">
                    ⚡ Fix All ({suggestions.filter(s => s.domFix && !s.fixed).length})
                  </button>
                )}

                {suggestions.length === 0 && <p className="text-green-400 text-sm">No issues found ✓</p>}

                {suggestions.map((s, i) => (
                  <div key={i} className="mb-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded overflow-hidden">
                    <div onClick={() => setOpenId(openId === i ? null : i)}
                      className="flex items-center justify-between p-3 cursor-pointer hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`text-xs font-medium shrink-0 ${impactColor[s.impact] ?? "text-gray-400"}`}>{s.impact}</span>
                        <p className="font-semibold text-sm truncate">{s.title}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {s.fixed && <span className="text-xs text-green-400">✓</span>}
                        <span className="text-gray-400 text-xs">{openId === i ? "▲" : "▼"}</span>
                      </div>
                    </div>
                    {openId === i && (
                      <div className="px-3 pb-3 border-t border-white/10">
                        <p className="text-sm text-gray-400 mt-2">{s.explanation}</p>
                        {s.fixDescription && <p className="text-xs text-gray-500 mt-1 italic">{s.fixDescription}</p>}
                        <div className="mt-2">
                          {s.fixed ? (
                            <span className="text-xs text-green-400">✓ Fixed</span>
                          ) : s.domFix ? (
                            <button onClick={e => { e.stopPropagation(); applyFix(s) }}
                              className="text-sm px-3 py-1 rounded bg-purple-600 hover:bg-purple-700 transition-colors">
                              Fix →
                            </button>
                          ) : (
                            <div className="mt-2 space-y-2">
                              <div className="p-2 bg-yellow-900/20 border border-yellow-500/20 rounded">
                                <p className="text-xs text-yellow-400 font-medium">⚠ Manual fix required</p>
                                <p className="text-xs text-gray-400 mt-0.5">{s.fixDescription}</p>
                              </div>
                              {s.codeExample && (
                                <div className="rounded overflow-hidden border border-white/10">
                                  <div className="px-3 py-1.5 bg-white/5 border-b border-white/10">
                                    <span className="text-xs text-gray-400 font-medium">How to fix</span>
                                  </div>
                                  <pre className="text-xs text-green-300 bg-black/40 p-3 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                                    {s.codeExample}
                                  </pre>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="order-1 md:order-2 flex flex-col h-[60vh] md:h-full md:border-x border-white/10 relative">
            <div className="flex items-center gap-2 px-3 py-2 bg-black/30 border-b border-white/10 shrink-0">
              <button onClick={undo} disabled={!undoStack.length}
                className="px-2 py-1 text-xs rounded border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                ← Undo
              </button>
              <button onClick={redo} disabled={!redoStack.length}
                className="px-2 py-1 text-xs rounded border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                Redo →
              </button>
              {layoutMode && (
                <span className="flex items-center gap-1.5 text-xs text-purple-400 bg-purple-900/30 border border-purple-500/30 rounded px-2 py-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"/>
                  Inspector active — click any element
                </span>
              )}
              <div className="flex-1"/>
              {saving && <span className="text-xs text-gray-400">Saving...</span>}
              <div className="flex gap-1.5">
                <button onClick={downloadHtml}
                  className="px-2 py-1 text-xs rounded bg-purple-600 hover:bg-purple-700 transition-colors">
                  💾 HTML
                </button>
                <button onClick={downloadCssOnly}
                  className="px-2 py-1 text-xs rounded border border-purple-500 text-purple-300 hover:bg-purple-900/20 transition-colors">
                  📄 CSS
                </button>
                <button onClick={downloadCompletePackage}
                  className="px-2 py-1 text-xs rounded border border-green-500 text-green-300 hover:bg-green-900/20 transition-colors">
                  📦 Package
                </button>
              </div>
            </div>

            <div className="flex-1 bg-white overflow-hidden relative">
              {html ? (
                <iframe
                  ref={iframeRef}
                  key={iframeKey}
                  title="preview"
                  src={showOriginalPage ? pageUrl : undefined}
                  srcDoc={showOriginalPage ? undefined : iframeSrcDoc}
                  allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                  className="w-full h-full border-none"
                  sandbox={showOriginalPage ? undefined : "allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"}
                  onLoad={() => {
                   
                    if (layoutMode) {
                      setTimeout(() => {
                        iframeRef.current?.contentWindow?.postMessage({ type: "INSPECTOR_ON" }, "*")
                      }, 100)
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  No preview available
                </div>
              )}
              {analysing && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10">
                  <svg className="animate-spin h-8 w-8 text-purple-600" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  <p className="text-gray-600 text-sm font-medium">Scanning for accessibility issues...</p>
                  <p className="text-gray-400 text-xs">This usually takes 20–30 seconds</p>
                </div>
              )}
            </div>
          </div>

          <div className="order-3 flex flex-col p-4 border-t md:border-t-0 md:border-l border-white/10 overflow-y-auto bg-black/20 backdrop-blur-md">

            
            <h2 className="text-lg font-semibold mb-3">Theme</h2>
            {activeTheme ? (
              <div className="mb-5 p-3 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">{activeTheme.name}</span>
                  <button onClick={removeTheme} className="text-xs text-gray-500 hover:text-red-400 transition-colors">✕ Remove</button>
                </div>
                <div className="space-y-2 mb-3">
                  <button onClick={() => router.push(`/themes?sessionId=${sessionId}`)}
                    className="w-full py-1.5 text-xs border border-white/10 rounded hover:bg-white/10 transition-colors">
                    Change Theme
                  </button>
                  <button onClick={downloadHtml}
                    className="w-full py-1.5 text-xs bg-purple-600/30 border border-purple-500/30 text-purple-300 rounded hover:bg-purple-600/40 transition-colors">
                    💾 Download with Theme
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => router.push(`/themes?sessionId=${sessionId}`)}
                className="mb-5 w-full py-2 text-sm border border-white/10 rounded hover:bg-white/10 transition-colors">
                🎨 Pick a Theme
              </button>
            )}

            <div className="mb-5 border-t border-white/10 pt-4">
              <h3 className="text-sm font-semibold mb-3">📥 Download Options</h3>
              <div className="space-y-2">
                <button onClick={downloadHtml}
                  className="w-full py-2 text-xs border border-white/10 rounded hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
                  ✓ HTML + Theme
                </button>
                <button onClick={downloadCssOnly}
                  className="w-full py-2 text-xs border border-white/10 rounded hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
                  📄 CSS Only
                </button>
                <button onClick={downloadCompletePackage}
                  className="w-full py-2 text-xs bg-green-600/20 border border-green-500/20 text-green-300 rounded hover:bg-green-600/30 transition-colors">
                  📦 Complete Package
                </button>
              </div>
              <p className="text-xs text-white/30 mt-2 leading-relaxed">
                Download your modified page with applied theme, CSS modifications, and more.
              </p>
            </div>
            <div className="mb-5">
              
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold"> Layout</h2>
                <button
                  onClick={() => setLayoutMode(m => {
                    if (m) setSelectedEl(null)
                    return !m
                  })}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                    layoutMode
                      ? "bg-purple-600/20 border-purple-500/50 text-purple-300"
                      : "bg-white/5 border-white/10 text-white/40 hover:text-white/70"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full transition-colors ${layoutMode ? "bg-purple-400 animate-pulse" : "bg-white/20"}`}/>
                  {layoutMode ? "ON" : "OFF"}
                </button>
              </div>

              {!layoutMode && (
                <div className="p-3 bg-white/3 border border-white/8 rounded-lg text-center">
                  <div className="text-2xl mb-1">📐</div>
                  <p className="text-xs text-white/40 leading-relaxed">
                    Enable inspector then click any element in the preview to edit its styles live.
                  </p>
                  <button onClick={() => setLayoutMode(true)}
                    className="mt-3 w-full py-2 text-xs font-semibold bg-purple-600/30 border border-purple-500/30 text-purple-300 rounded-lg hover:bg-purple-600/40 transition-colors">
                    Enable Layout Inspector
                  </button>
                </div>
              )}

             
              {layoutMode && !selectedEl && (
                <div className="p-3 bg-purple-900/10 border border-purple-500/20 rounded-lg text-center">
                  <div className="text-xl mb-1">🖱</div>
                  <p className="text-xs text-purple-300/70 leading-relaxed">
                    Click any element in the preview panel to inspect and edit it.
                  </p>
                </div>
              )}

            
              {layoutMode && selectedEl && (
                <div className="bg-white/4 border border-white/10 rounded-xl overflow-hidden">

                  
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-white/5 border-b border-white/10">
                    <span className="text-xs font-mono font-bold text-purple-400 bg-purple-900/30 border border-purple-500/30 px-1.5 py-0.5 rounded">
                      &lt;{selectedEl.tag}&gt;
                    </span>
                    <span className="text-[10px] text-white/30 truncate flex-1">
                      {selectedEl.text ? `"${selectedEl.text.slice(0,28)}…"` : selectedEl.className ? `.${selectedEl.className.split(" ")[0]}` : ""}
                    </span>
                    <button onClick={resetLayoutStyles} title="Reset styles" className="text-white/20 hover:text-red-400 text-xs transition-colors">↩</button>
                  </div>

                  
                  <div className="flex border-b border-white/10">
                    {LAYOUT_TABS.map(tab => (
                      <button key={tab} onClick={() => setLayoutTab(tab)}
                        className={`flex-1 py-2 text-[10px] font-semibold capitalize transition-colors border-b-2 ${
                          layoutTab === tab
                            ? "text-purple-300 border-purple-500"
                            : "text-white/30 border-transparent hover:text-white/50"
                        }`}>
                        {tab === "typography" ? "Type" : tab === "spacing" ? "Space" : tab === "text" ? "Text" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>

                  <div className="p-3">

                    
                    {layoutTab === "typography" && (
                      <>
                        <SliderRow label="Font Size"    value={pendingStyles.fontSize     ?? 16} min={8}  max={72}  step={1}   unit="px"
                          onChange={v => handleSlider("fontSize", "fontSize", v, "px")} />
                        <SliderRow label="Line Height"  value={pendingStyles.lineHeight    ?? 24} min={10} max={80}  step={1}   unit="px"
                          onChange={v => handleSlider("lineHeight", "lineHeight", v, "px")} />
                        <SliderRow label="Letter Space" value={pendingStyles.letterSpacing ?? 0}  min={-2} max={10}  step={0.1} unit="px"
                          onChange={v => handleSlider("letterSpacing", "letterSpacing", v, "px")} />
                        <div className="mb-1">
                          <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wide mb-1">Font Weight</div>
                          <select value={pendingStyles.fontWeight ?? 400}
                            onChange={e => { setPendingStyles(p => ({...p, fontWeight: e.target.value})); liveUpdate("fontWeight", e.target.value, "") }}
                            className="w-full bg-white/5 border border-white/10 text-white/80 text-xs rounded px-2 py-1.5 outline-none focus:border-purple-500">
                            {[["100","Thin"],["200","Extra Light"],["300","Light"],["400","Normal"],["500","Medium"],["600","Semi Bold"],["700","Bold"],["800","Extra Bold"],["900","Black"]]
                              .map(([v,l]) => <option key={v} value={v} style={{background:"#0d1117"}}>{l} ({v})</option>)}
                          </select>
                        </div>
                      </>
                    )}

                   
                    {layoutTab === "spacing" && (
                      <>
                        <FourSides
                          label="Padding"
                          keys={["paddingTop","paddingRight","paddingBottom","paddingLeft"]}
                          values={[pendingStyles.paddingTop??0, pendingStyles.paddingRight??0, pendingStyles.paddingBottom??0, pendingStyles.paddingLeft??0]}
                          onChange={(key, val) => handleSideProp(key, key.replace(/([A-Z])/g, c => "-"+c.toLowerCase()), val)}
                        />
                        <div className="my-2 border-t border-white/5"/>
                        <FourSides
                          label="Margin"
                          keys={["marginTop","marginRight","marginBottom","marginLeft"]}
                          values={[pendingStyles.marginTop??0, pendingStyles.marginRight??0, pendingStyles.marginBottom??0, pendingStyles.marginLeft??0]}
                          onChange={(key, val) => handleSideProp(key, key.replace(/([A-Z])/g, c => "-"+c.toLowerCase()), val)}
                        />
                      </>
                    )}

                    {layoutTab === "size" && (
                      <>
                        <SliderRow label="Width"         value={pendingStyles.width        ?? 0} min={0}  max={1200} step={1} unit="px"
                          onChange={v => handleSlider("width", "width", v, "px")} />
                        <SliderRow label="Height"        value={pendingStyles.height       ?? 0} min={0}  max={800}  step={1} unit="px"
                          onChange={v => handleSlider("height", "height", v, "px")} />
                        <SliderRow label="Border Radius" value={pendingStyles.borderRadius ?? 0} min={0}  max={100}  step={1} unit="px"
                          onChange={v => handleSlider("borderRadius", "borderRadius", v, "px")} />
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => { liveUpdate("width", "fit-content", ""); setPendingStyles(p=>({...p,width:0})) }}
                            className="flex-1 py-1.5 text-xs border border-white/10 rounded hover:bg-white/10 transition-colors text-white/50">
                            Fit Content
                          </button>
                          <button onClick={() => { liveUpdate("width", "100%", ""); setPendingStyles(p=>({...p,width:100})) }}
                            className="flex-1 py-1.5 text-xs border border-white/10 rounded hover:bg-white/10 transition-colors text-white/50">
                            Full Width
                          </button>
                        </div>
                      </>
                    )}

                    {layoutTab === "colors" && (
                      <>
                        <ColorRow label="Text Color" propKey="color" value={pendingStyles.color || "#000000"} onChange={handleColor} />
                        <ColorRow label="Background" propKey="backgroundColor" value={pendingStyles.backgroundColor || "#ffffff"} onChange={handleColor} />

                        {(() => {
                          const fg = pendingStyles.color?.match(/[\da-f]{2}/gi)?.map(h => parseInt(h, 16)) || [0, 0, 0]
                          const bg = pendingStyles.backgroundColor?.match(/[\da-f]{2}/gi)?.map(h => parseInt(h, 16)) || [255, 255, 255]
                          const lum = ([r, g, b]) => [r, g, b].reduce((s, v, i) => {
                            v /= 255
                            v = v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
                            return s + v * [0.2126, 0.7152, 0.0722][i]
                          }, 0)
                          const ratio = ((Math.max(lum(fg), lum(bg)) + 0.05) / (Math.min(lum(fg), lum(bg)) + 0.05)).toFixed(2)
                          const pass = parseFloat(ratio) >= 4.5

                          return (
                            <div className={`mt-2 p-2.5 rounded-lg border text-center transition-all duration-300 ${pass ? "bg-green-900/20 border-green-500/20" : "bg-red-900/20 border-red-500/20"}`}>
                              <div className={`text-lg font-black ${pass ? "text-green-400" : "text-red-400"}`}>
                                {ratio}:1
                              </div>
                              <div className={`text-[10px] font-semibold ${pass ? "text-green-400" : "text-red-400"}`}>
                                {pass ? "✓ WCAG AA Pass" : "✗ WCAG AA Fail — min 4.5:1"}
                              </div>
                            </div>
                          )
                        })()}
                      </>
                    )}

                    {layoutTab === "text" && (
                      <>
                        <div className="mb-2">
                          <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wide mb-1">Text Editor</div>
                          <p className="mb-2 text-[11px] text-white/35 leading-relaxed">Write new text here and apply it to the selected element.</p>
                          <textarea
                            value={layoutText}
                            onChange={e => setLayoutText(e.target.value)}
                            placeholder="Write the new text you want to add here"
                            className="w-full min-h-24 rounded-lg bg-white/5 border border-white/10 text-white/80 text-sm px-3 py-2 outline-none focus:border-purple-500 resize-y"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-3">
                          {[
                            ["replace", "Replace"],
                            ["append", "Append"],
                            ["prepend", "Prepend"],
                          ].map(([mode, label]) => (
                            <button
                              key={mode}
                              type="button"
                              onClick={() => setLayoutTextMode(mode)}
                              className={`py-1.5 text-xs border rounded transition-colors ${
                                layoutTextMode === mode
                                  ? "bg-purple-600/35 border-purple-400/40 text-purple-200"
                                  : "border-white/10 text-white/50 hover:bg-white/10"
                              }`}>
                              {label}
                            </button>
                          ))}
                        </div>

                        <div className="flex items-center justify-end gap-3 mb-3">
                          <button
                            type="button"
                            onClick={() => createLayoutTextBlock()}
                            className="py-1.5 px-3 text-sm font-semibold rounded-lg bg-indigo-600/30 border border-indigo-400/30 text-indigo-200 hover:bg-indigo-600/40 transition-colors"
                          >
                            ➕ Create Text Block
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={applyLayoutText}
                          className="w-full py-2 text-sm font-semibold rounded-lg bg-emerald-600/30 border border-emerald-400/30 text-emerald-200 hover:bg-emerald-600/40 transition-colors"
                        >
                          Apply Text to Selected Element
                        </button>
                      </>
                    )}

                    <AssistantDrawer
                      html={html}
                      pageUrl={pageUrl}
                      sessionId={sessionId}
                      selectedEl={assistantSelection}
                      activeTheme={activeTheme}
                      themeOptions={themes}
                      onApplyPlan={applyAssistantPlan}
                      onSessionId={() => {}}
                      onApplyTheme={(theme) => {
                        const nextTheme = themes.find(
                          item =>
                            item.id === theme?.id ||
                            item.name === theme?.name ||
                            item.id === theme?.themeId ||
                            item.name === theme?.themeId
                        )

                        if (nextTheme) {
                          setActiveTheme(nextTheme)
                          setChanges(prev => [
                            {
                              _id: Date.now().toString(),
                              themeName: `AI Theme: ${nextTheme.name}`,
                              html: htmlRef?.current || html,
                              appliedAt: new Date(),
                            },
                            ...prev
                          ])
                        }
                      }}
                    />


                   </div>

                  <div className="flex gap-2 px-3 pb-3">
                    <button onClick={resetLayoutStyles}
                      className="flex-1 py-2 text-xs font-semibold text-red-400/70 border border-red-500/20 rounded-lg hover:bg-red-900/20 transition-colors">
                      ↩ Reset
                    </button>
                    <button onClick={bakeLayoutStyles}
                      disabled={layoutApplied}
                      className={`flex-2 flex-grow py-2 text-xs font-bold rounded-lg transition-all ${
                        layoutApplied
                          ? "bg-green-900/20 border border-green-500/20 text-green-400 cursor-default"
                          : "bg-purple-600 hover:bg-purple-700 text-white"
                      }`}>
                      {layoutApplied ? "✓ Applied to HTML" : "Apply to HTML"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <h2 className="text-lg font-semibold mb-4">Changes</h2>
            {changes.length === 0 ? (
              <p className="text-gray-500 text-sm">No changes yet</p>
            ) : (
              changes.map((c, i) => (
                <div key={c._id ?? i}
                  onClick={() => { setUndoStack(p=>[...p,html]); setRedoStack([]); setHtml(c.html); htmlRef.current = c.html }}
                  className="mb-2 p-2 bg-white/5 backdrop-blur-sm border border-white/10 cursor-pointer rounded transition-colors hover:bg-white/10">
                  <p className="text-sm">{c.themeName}</p>
                  {c.appliedAt && <p className="text-xs text-gray-500 mt-0.5">{new Date(c.appliedAt).toLocaleTimeString()}</p>}
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  )
}