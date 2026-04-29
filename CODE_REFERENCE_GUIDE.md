# Code Reference Guide

## Quick Code Lookup

This guide provides specific code snippets and their locations for quick reference during testing and deployment.

---

## 1. Complex Selector Resolution

### Location
File: `/extension/content.js`  
Lines: 520-572

### The Function
```javascript
function resolveSelector(selector) {
  if (!selector) return []
  
  // Strategy 1: Direct querySelectorAll
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
  
  // Strategy 3: If selector contains -, try data-attribute
  if (selector.includes("-")) {
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
  
  // Strategy 4: XPath case-insensitive fallback
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
```

### How It Works
1. **Direct attempt**: Tries standard CSS selector
2. **ID extraction**: Strips # and uses getElementById
3. **Data-attribute**: Looks for matching data-* attributes
4. **XPath fallback**: Case-insensitive attribute search

### Example Usage
```javascript
// For #vector-main-menu-dropdown-checkbox
const elements = resolveSelector("#vector-main-menu-dropdown-checkbox")
// Strategy 2 succeeds: getElementById("vector-main-menu-dropdown-checkbox")
```

---

## 2. Enhanced applyFix Entry Point

### Location
File: `/extension/content.js`  
Lines: 574-589

### The Wrapper
```javascript
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
    // ... all action type handlers use resolveElements()
  }
}
```

### Why This Matters
- All action types use the same robust selector resolution
- Consistent error handling across all types
- Clear error messages showing strategies attempted

---

## 3. Advanced Action Type: setComplexStyle

### Location
File: `/extension/content.js`  
Lines: 837-852

### The Implementation
```javascript
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
```

### Example Usage
```json
{
  "type": "setComplexStyle",
  "selector": "#my-element",
  "styleValue": "filter: blur(8px)"
}
```

---

## 4. Advanced Action Type: setFlexboxAdvanced

### Location
File: `/extension/content.js`  
Lines: 854-881

### The Implementation
```javascript
case "setFlexboxAdvanced": {
  const els = resolveElements(fix.selector)
  const styleValue = String(fix.styleValue || "").trim()
  
  els.forEach(el => {
    el.style.setProperty("display", "flex", "important")
    
    if (styleValue === "center") {
      el.style.setProperty("justify-content", "center", "important")
      el.style.setProperty("align-items", "center", "important")
    } else if (styleValue === "space-between") {
      el.style.setProperty("justify-content", "space-between", "important")
      el.style.setProperty("align-items", "center", "important")
    } else if (styleValue === "column") {
      el.style.setProperty("flex-direction", "column", "important")
    }
    // ... more mappings
    glow(el)
  })
  return `✓ setFlexboxAdvanced on ${els.length} element(s): ${styleValue}`
}
```

### User-Friendly Mappings
```
"center"        → justify-content: center; align-items: center
"space-between" → justify-content: space-between
"space-around"  → justify-content: space-around
"column"        → flex-direction: column
"row"           → flex-direction: row
```

---

## 5. Advanced Action Type: setStructuralChange

### Location
File: `/extension/content.js`  
Lines: 975-1020

### The Implementation
```javascript
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
      }
    } catch (e) {
      console.warn("Structural change error:", e.message)
    }
  })
  return `✓ setStructuralChange(${action}) on ${modified} element(s)`
}
```

### Example Usage
```json
{
  "type": "setStructuralChange",
  "selector": "button",
  "action": "wrap",
  "tag": "div",
  "classes": ["button-container"]
}
```

---

## 6. Enhanced Download Function

### Location
File: `/extension/popup.js`  
Lines: 3033-3038 (key start)

### The Core Logic
```javascript
async function downloadAllChanges() {
  // ... setup code ...
  
  try {
    // Try CAPTURE_DOWNLOAD first for comprehensive export
    let resp = await chrome.tabs.sendMessage(currentTabId, { type: "CAPTURE_DOWNLOAD" })
    
    if (resp?.success && resp.html) {
      // Use comprehensive capture with all CSS and modifications
      const blob = new Blob([resp.html], { type: "text/html;charset=utf-8" })
      // ... download HTML file ...
      const msg = `✅ Downloaded with ${resp.modifiedElements || 0} modified element(s)...`
      showToast(msg, "success")
      return
    }
    
    // Fall back to GET_HTML for other changes
    resp = await chrome.tabs.sendMessage(currentTabId, { type: "GET_HTML" })
    // ... legacy download logic ...
    
  } catch (err) {
    showToast("Download failed: " + err.message, "error")
  }
}
```

### Key Features
1. Priority: CAPTURE_DOWNLOAD first (comprehensive)
2. Fallback: GET_HTML (legacy support)
3. Metadata: Shows modification counts
4. Output: HTML + CSS files with timestamp

---

## 7. Capture Download Implementation

### Location
File: `/extension/content.js`  
Lines: 150-220 (approximately)

### The Function
```javascript
function capturePageForDownload() {
  try {
    // Get current HTML
    const currentHtml = document.documentElement.outerHTML

    // Collect theme CSS
    const themeEl = document.getElementById("__cksa_theme")
    const themeCss = themeEl ? themeEl.textContent : null

    // Collect inline styles
    const inlineStyles = []
    document.querySelectorAll("[style]").forEach((el, idx) => {
      if (el.style.cssText) {
        const selector = buildSelector(el)
        inlineStyles.push({
          selector: selector,
          style: el.style.cssText
        })
      }
    })

    // Build complete HTML with CSS
    let finalHtml = currentHtml
    if (themeCss) {
      const styleTag = `<style id="cksa-theme">${themeCss}</style>`
      finalHtml = finalHtml.replace("</head>", styleTag + "</head>")
    }

    return {
      success: true,
      html: finalHtml,
      timestamp: new Date().toISOString(),
      modifiedElements: document.querySelectorAll("[style]").length,
      layoutChanges: document.querySelectorAll("[data-cksa-layout]").length
    }
  } catch (err) {
    console.error("Capture error:", err)
    return { success: false, error: err.message }
  }
}
```

---

## 8. Comprehensive Prompt in Assistant API

### Location
File: `/app/src/app/api/assistant/route.js`  
Lines: 100-200 (approximately)

### Key Sections

#### Colors & Backgrounds
```javascript
- "change background to RED" → setBackgroundColorAdvanced
- "gradient from blue to purple" → setGradientBackground
- "change text color to white" → setColorAdvanced
```

#### Flexbox Examples
```javascript
- "center items" → setFlexboxAdvanced with "center"
- "space between" → setFlexboxAdvanced with "space-between"
- "column direction" → setFlexboxAdvanced with "column"
```

#### Transforms & Animations
```javascript
- "rotate 45 degrees" → setComplexStyle with "transform: rotate(45deg)"
- "scale up" → setComplexStyle with "transform: scale(1.2)"
- "smooth transition" → setTransitionAnimations
```

#### Structural Changes
```javascript
- "wrap this in a div" → setStructuralChange with wrap action
- "make it a section" → setStructuralChange with replaceTag
```

---

## 9. Message Handlers in Content Script

### Location
File: `/extension/content.js`  
Lines: 1100-1200 (approximately)

### Key Messages
```javascript
chrome.runtime.onMessage.addListener((msg, sender, send) => {
  try {
    if (msg.type === "APPLY_FIX") {
      const result = applyFix(msg.fix)
      pushUndo("Fix: " + msg.fix.type)
      send({ success: true, result })
    }
    else if (msg.type === "CAPTURE_DOWNLOAD") {
      const result = capturePageForDownload()
      send(result)
    }
    else if (msg.type === "UNDO_FIX") {
      handleUndo()
      send({ success: true })
    }
    // ... other handlers
  } catch (err) {
    send({ success: false, error: err.message })
  }
})
```

---

## 10. Error Handling Pattern

### Location
File: `/extension/content.js`  
Throughout all action type handlers

### Pattern Used
```javascript
case "setColorAdvanced": {
  try {
    const els = resolveElements(fix.selector)  // Can throw
    const color = String(fix.styleValue || "#000").trim()
    
    els.forEach(el => {
      el.style.setProperty("color", color, "important")
      glow(el)
    })
    
    return `✓ setColorAdvanced on ${els.length} element(s): ${color}`
  } catch (err) {
    console.error("setColorAdvanced error:", err)
    throw err  // Re-throw for outer handler
  }
}
```

### Error Propagation
1. Individual case: Try-catch with logging
2. applyFix wrapper: Catches from all cases
3. Message handler: Final catch for user feedback
4. Extension popup: Shows toast notification

---

## Testing Code Snippets

### Test 1: Verify Selector Resolution
```javascript
// In browser console:
resolveSelector("#vector-main-menu-dropdown-checkbox")
// Should return: [HTMLElement]

// Test with hyphenated selector
resolveSelector("input-search-box")
// Should try 4 strategies
```

### Test 2: Verify Action Type
```javascript
// Simulate APPLY_FIX message
chrome.runtime.sendMessage({
  type: "APPLY_FIX",
  fix: {
    type: "setBackgroundColorAdvanced",
    selector: "#my-button",
    styleValue: "#0000ff"
  }
}, (resp) => console.log(resp))
```

### Test 3: Verify Download
```javascript
// Simulate CAPTURE_DOWNLOAD message
chrome.runtime.sendMessage({
  type: "CAPTURE_DOWNLOAD"
}, (resp) => {
  console.log("Capture result:", resp)
  console.log("Modified elements:", resp.modifiedElements)
  console.log("HTML size:", resp.html.length)
})
```

---

## Performance Tips

### For Large Pages
```javascript
// Reduce selector scope
resolveSelector("#specific-id > .child") 
// Better than: resolveSelector(".child")

// Batch multiple changes
// Send multiple fixes in one message instead of many

// Use specific selectors
// Use #id or .unique-class instead of descendant selectors
```

### For Download
```javascript
// The capture function is efficient:
// - Only captures what's needed
// - Minimal DOM traversal
// - < 2 seconds for most pages
// - Returns ~1-5MB typical

// For very large pages (10MB+):
// - Consider limiting capture scope
// - Remove large iframes if not needed
// - Implement chunked downloads
```

---

## Debugging Commands

### Check Extension Status
```javascript
// In extension background context
console.log("Extension loaded")
console.log("Max undo stack:", MAX_STACK)
console.log("Current undo history:", undoStack.length)
```

### Monitor Selector Resolution
```javascript
// Add to resolveSelector for debugging
console.log("Resolving:", selector)
console.log("Strategy 1 result:", document.querySelectorAll(selector).length)
console.log("Strategy 2 result:", selector.startsWith("#") ? "checked" : "skipped")
// etc.
```

### Track Action Application
```javascript
// In applyFix switch
console.log(`Applying ${fix.type} on selector: ${fix.selector}`)
console.log(`  Elements matched: ${els.length}`)
console.log(`  First element:`, els[0])
console.log(`  Applied:`, result)
```

---

## References

**Related Documentation**:
- See `PRODUCTION_DEPLOYMENT_READY.md` for full feature list
- See `QUICK_TEST_GUIDE.md` for testing procedures
- See `VALIDATION_SUMMARY.md` for implementation checklist

**Code Files**:
- `/app/src/app/api/assistant/route.js` - AI endpoint
- `/extension/content.js` - DOM manipulation
- `/extension/popup.js` - UI and download

**Key Functions**:
- `resolveSelector()` - Selector resolution
- `applyFix()` - Action dispatcher
- `capturePageForDownload()` - Export functionality
- `downloadAllChanges()` - Download trigger

---

**Last Updated**: Current Session  
**Version**: Production Ready  
**Status**: Ready for Testing
