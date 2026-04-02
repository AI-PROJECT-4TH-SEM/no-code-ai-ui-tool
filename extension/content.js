// ─── AccessiScan Content Script v2 ───────────────────────────────────────────
const STYLE_TAG_ID = "__accessi_theme_style"

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  switch (msg.type) {
    case "PING":
      sendResponse({ alive: true })
      return true
    case "APPLY_FIX":
      try { sendResponse({ success: true, result: applyFix(msg.domFix) }) }
      catch (e) { sendResponse({ success: false, error: e.message }) }
      return true
    case "APPLY_THEME":
      try { injectCSS(msg.css); sendResponse({ success: true }) }
      catch (e) { sendResponse({ success: false, error: e.message }) }
      return true
    case "REMOVE_THEME":
      removeCSS(); sendResponse({ success: true })
      return true
  }
})

function injectCSS(css) {
  let el = document.getElementById(STYLE_TAG_ID)
  if (!el) { el = document.createElement("style"); el.id = STYLE_TAG_ID; document.head.appendChild(el) }
  el.textContent = css
}
function removeCSS() { document.getElementById(STYLE_TAG_ID)?.remove() }

// ─── Fix Engine ───────────────────────────────────────────────────────────────
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
      const els = document.querySelectorAll(fix.selector)
      els.forEach(el => el.removeAttribute(fix.attribute))
      els.forEach(glow); return `removeAttribute(${fix.attribute})`
    }
    case "setStyle": {
      const els = document.querySelectorAll(fix.selector)
      els.forEach(el => { el.style[fix.style] = fix.styleValue })
      els.forEach(glow); return `setStyle`
    }
    case "setStyleImportant": {
      const els = document.querySelectorAll(fix.selector)
      els.forEach(el => el.style.setProperty(fix.style, fix.styleValue, "important"))
      els.forEach(glow); return `setStyleImportant`
    }
    case "setInnerText": {
      document.querySelectorAll(fix.selector).forEach(el => { el.textContent = fix.value })
      return `setInnerText`
    }
    case "addClass": {
      document.querySelectorAll(fix.selector).forEach(el => el.classList.add(fix.value))
      return `addClass`
    }
    case "replaceHtml": {
      const el = document.querySelector(fix.selector)
      if (el) el.outerHTML = fix.value
      return `replaceHtml`
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
    case "multifix": {
      return (fix.fixes || []).map(f => { try { return applyFix(f) } catch(e) { return "FAIL:" + e.message } })
    }
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
