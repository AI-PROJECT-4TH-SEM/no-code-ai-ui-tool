# 💻 API Examples & Integration Guide

## Complete API Examples for Production

All examples use the `/api/assistant` endpoint which integrates with Cohere API.

---

## 📌 Basic Request Format

```javascript
{
  "instruction": "User's command in natural language",
  "url": "https://website.com",
  "sessionId": "optional-session-id (auto-generated if omitted)",
  "selectedElement": {
    "selector": "button.primary",      // Optional - current selected element
    "effectiveSelector": "button.primary",
    "tag": "button",
    "id": null,
    "className": "primary"
  },
  "html": "<full page HTML or preview>",  // Optional - page content
  "activeTheme": null,                     // Optional - current theme
  "themeOptions": []                       // Optional - available themes
}
```

---

## 🎯 Example 1: Move Element

### User Command
```
"Move the checkout button to the bottom of the form"
```

### Frontend Call
```javascript
const response = await fetch('/api/assistant', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    instruction: 'Move the checkout button to the bottom of the form',
    url: 'https://shop.example.com/checkout',
    selectedElement: {
      selector: 'button.checkout',
      tag: 'button'
    },
    html: '<form id="checkout"><input.../><button class="checkout">Pay</button></form>'
  })
})

const result = await response.json()
```

### Backend Processing
```javascript
// app/src/app/api/assistant/route.js
// Cohere API receives enhanced prompt with moveElementStructural examples
// Returns:
{
  "reply": "Done. Moved the checkout button to the bottom of the form.",
  "actions": [
    {
      "kind": "domFix",
      "fix": {
        "type": "moveElementStructural",
        "selector": "button.checkout",
        "targetSelector": "form#checkout",
        "position": "append"
      },
      "reason": "User requested button moved to form bottom"
    }
  ]
}
```

### Extension Processing
```javascript
// extension/content.js - applyFix() handler
// Case: moveElementStructural
// 1. Resolves source element: button.checkout
// 2. Resolves target: form#checkout
// 3. Appends button to form
// 4. Glows element for visual feedback
// 5. Returns success message
```

---

## ✍️ Example 2: Add Text to Element

### User Command
```
"Add 'Limited Time Offer' to all product titles"
```

### Frontend Call
```javascript
const response = await fetch('/api/assistant', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    instruction: 'Add "Limited Time Offer" to all product titles',
    url: 'https://shop.example.com/products',
    selectedElement: {
      selector: 'h2.product-title',
      tag: 'h2',
      currentText: 'Laptop Pro'
    },
    html: '<div class="products"><h2 class="product-title">Laptop Pro</h2>...'
  })
})

const result = await response.json()
```

### API Response
```json
{
  "reply": "Done. Added 'Limited Time Offer' to all product titles.",
  "actions": [
    {
      "kind": "domFix",
      "fix": {
        "type": "addTextContent",
        "selector": "h2.product-title",
        "text": "Limited Time Offer",
        "mode": "prepend"
      },
      "reason": "User requested text addition to product titles"
    }
  ]
}
```

### Extension Processing
```javascript
// extension/content.js - applyFix() handler
// Case: addTextContent
// 1. Finds all h2.product-title elements
// 2. Prepends "Limited Time Offer" to each
// 3. Marks with data-cksa-text-edited attribute
// 4. Glows each element
// 5. Returns count: "✓ addTextContent on 5 element(s)"
```

### Result on Page
```
Before: "Laptop Pro"
After:  "Limited Time Offer Laptop Pro"
```

---

## 🖊️ Example 3: Free-Form DOM Writing

### User Command
```
"Write a promotional banner saying 'Get 50% Off Today' and place it at the top of the page"
```

### Frontend Call
```javascript
const response = await fetch('/api/assistant', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    instruction: 'Write a promotional banner saying "Get 50% Off Today" and place it at the top of the page',
    url: 'https://shop.example.com',
    selectedElement: {
      selector: 'body',
      tag: 'body'
    },
    html: '<body><header>...</header>...</body>'
  })
})

const result = await response.json()
```

### API Response
```json
{
  "reply": "Done. Added promotional banner at the top.",
  "actions": [
    {
      "kind": "domFix",
      "fix": {
        "type": "freeFormDomWrite",
        "selector": "body",
        "html": "<div class='banner promotion' style='background:#ff6b6b;color:white;padding:20px;text-align:center;font-weight:bold;font-size:24px;'>Get 50% Off Today</div>",
        "mode": "prepend"
      },
      "reason": "User requested promotional banner at page top"
    }
  ]
}
```

### Extension Processing
```javascript
// extension/content.js - applyFix() handler
// Case: freeFormDomWrite
// 1. Parses HTML safely via temp container
// 2. Creates DOM nodes from HTML string
// 3. Prepends to body (adds as first child)
// 4. Marks with data-cksa-dom-written attribute
// 5. Glows container
// 6. Returns: "✓ freeFormDomWrite: wrote HTML to 1 element(s)"
```

---

## 🎨 Example 4: Complex Multi-Action

### User Command
```
"Create a footer section with copyright and links, then move it to the bottom of the page"
```

### Frontend Call
```javascript
const response = await fetch('/api/assistant', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    instruction: 'Create a footer section with copyright and links, then move it to the bottom of the page',
    url: 'https://example.com',
    html: '<body>...</body>'
  })
})

const result = await response.json()
```

### API Response (Multiple Actions)
```json
{
  "reply": "Done. Created footer section and moved it to page bottom.",
  "actions": [
    {
      "kind": "domFix",
      "fix": {
        "type": "freeFormDomWrite",
        "selector": "body",
        "html": "<footer class='site-footer'><p>&copy; 2025 My Company</p><nav><a href='/privacy'>Privacy</a><a href='/terms'>Terms</a></nav></footer>",
        "mode": "append"
      }
    },
    {
      "kind": "domFix",
      "fix": {
        "type": "moveElementStructural",
        "selector": "footer.site-footer",
        "targetSelector": "body",
        "position": "append"
      }
    }
  ]
}
```

---

## 🔗 Example 5: Session Management

### Continuing Conversation

```javascript
// First message
const response1 = await fetch('/api/assistant', {
  method: 'POST',
  body: JSON.stringify({
    instruction: 'Change header color to blue',
    url: 'https://example.com',
    sessionId: 'user-session-123'
  })
})

const result1 = await response1.json()
const sessionId = result1.sessionId  // Returned from server

// Second message in same session
const response2 = await fetch('/api/assistant', {
  method: 'POST',
  body: JSON.stringify({
    instruction: 'Move the logo to the right',
    url: 'https://example.com',
    sessionId: sessionId  // Reuse session
  })
})

const result2 = await response2.json()

// Get conversation history
const historyResponse = await fetch(`/api/assistant?sessionId=${sessionId}`)
const history = await historyResponse.json()

console.log(history.messages)  // Full conversation
```

---

## 📊 Example 6: Error Handling

### Handling Different Response Cases

```javascript
async function updateDOM(instruction, selectedElement) {
  try {
    const response = await fetch('/api/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instruction,
        url: window.location.href,
        selectedElement,
        html: document.documentElement.innerHTML.substring(0, 9000)
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('API Error:', errorData.error)
      showNotification('Error: ' + errorData.error, 'error')
      return null
    }

    const result = await response.json()

    // Validate response structure
    if (!Array.isArray(result.actions)) {
      console.error('Invalid response:', result)
      showNotification('Invalid response from API', 'error')
      return null
    }

    // Process each action
    let successCount = 0
    for (const action of result.actions) {
      try {
        // Send to content script for execution
        chrome.tabs.query({active: true}, tabs => {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: 'APPLY_FIX',
            domFix: action.fix
          }, response => {
            if (response?.success) {
              successCount++
            }
          })
        })
      } catch (actionError) {
        console.error('Action error:', actionError)
      }
    }

    // Show result
    showNotification(`${result.reply} (${successCount}/${result.actions.length} applied)`)
    return result

  } catch (error) {
    console.error('Network error:', error)
    showNotification('Network error: ' + error.message, 'error')
    return null
  }
}
```

---

## 🎯 Example 7: Advanced Selectors

### Complex Selection Patterns

```javascript
// Single by ID
{
  "fix": {
    "type": "addTextContent",
    "selector": "#main-button",
    "text": "Click Me"
  }
}

// Multiple by class
{
  "fix": {
    "type": "addTextContent",
    "selector": ".card",  // Affects ALL .card elements
    "text": "New",
    "mode": "append"
  }
}

// Nested path
{
  "fix": {
    "type": "moveElementStructural",
    "selector": "header nav > ul > li:first-child",
    "targetSelector": "aside.sidebar",
    "position": "append"
  }
}

// Attribute selector
{
  "fix": {
    "type": "addTextContent",
    "selector": "[data-type='product']",
    "text": "Best Seller",
    "mode": "prepend"
  }
}

// Pseudo-selector
{
  "fix": {
    "type": "setColorAdvanced",
    "selector": "button:hover",
    "styleValue": "#00ff00"
  }
}
```

---

## 🔄 Example 8: Undo/Redo Flow

### Complete Undo Stack Management

```javascript
// Track stack state
chrome.tabs.sendMessage(tabId, {type: 'GET_STACK_STATE'}, response => {
  console.log('Can undo:', response.canUndo)
  console.log('Can redo:', response.canRedo)
  console.log('Undo label:', response.undoLabel)  // "Theme: Gradient"
})

// Perform undo
chrome.tabs.sendMessage(tabId, {type: 'UNDO_FIX'}, response => {
  if (response.success) {
    console.log('Undid:', response.undoLabel)
    updateUndoRedoButtons(response)
  }
})

// Perform redo
chrome.tabs.sendMessage(tabId, {type: 'REDO_FIX'}, response => {
  if (response.success) {
    console.log('Redid:', response.redoLabel)
    updateUndoRedoButtons(response)
  }
})

// Stack info: Max 20 snapshots per tab
```

---

## 📋 Example 9: Full Integration in Popup

```javascript
// extension/popup.js - complete flow
document.getElementById('send-button').addEventListener('click', async () => {
  const instruction = document.getElementById('input').value
  
  // Get current tab
  const [tab] = await chrome.tabs.query({active: true})
  
  // Get selected element from content script
  const elementResponse = await chrome.tabs.sendMessage(tab.id, {
    type: 'GET_SELECTED_ELEMENT'
  }).catch(() => ({}))
  
  // Send to API
  const apiResponse = await fetch('/api/assistant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      instruction,
      url: tab.url,
      selectedElement: elementResponse.element,
      html: await getPageHTML(tab.id)
    })
  })
  
  const result = await apiResponse.json()
  
  // Apply each action
  for (const action of result.actions) {
    chrome.tabs.sendMessage(tab.id, {
      type: 'APPLY_FIX',
      domFix: action.fix
    })
  }
  
  // Show reply
  document.getElementById('reply').textContent = result.reply
})
```

---

## 🚀 Production Best Practices

### 1. Always Validate Input
```javascript
function validateInstruction(instruction) {
  if (!instruction || typeof instruction !== 'string') return false
  if (instruction.length > 500) return false
  if (instruction.length < 3) return false
  return true
}
```

### 2. Handle Rate Limiting
```javascript
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 500  // ms

async function throttledAPICall(data) {
  const now = Date.now()
  if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
    await new Promise(r => setTimeout(r, MIN_REQUEST_INTERVAL))
  }
  lastRequestTime = Date.now()
  return fetch('/api/assistant', {method: 'POST', body: JSON.stringify(data)})
}
```

### 3. Log Important Events
```javascript
function logAPICall(instruction, result) {
  console.log({
    timestamp: new Date().toISOString(),
    instruction,
    actionCount: result.actions.length,
    success: result.actions.every(a => a.fix.type)
  })
}
```

### 4. Cache Selectors
```javascript
const selectorCache = new Map()

function getOrCreateSelector(element) {
  const key = element.id || element.className
  if (selectorCache.has(key)) return selectorCache.get(key)
  const selector = buildSelector(element)
  selectorCache.set(key, selector)
  return selector
}
```

---

## 📚 Quick Reference

| Action Type | Used For | Example |
|------------|----------|---------|
| `moveElementStructural` | Relocate elements | Move button below form |
| `addTextContent` | Modify text | Add "New" to titles |
| `freeFormDomWrite` | Inject HTML | Create banner |
| `wrapElement` | Container wrapping | Group in flex |
| `setStyleImportant` | CSS changes | Make bold |
| `setColorAdvanced` | Color text | Change to blue |
| `setBackgroundColorAdvanced` | Background color | Set to red |

---

**Last Updated**: May 13, 2025
**Version**: 2.0.0 - Production Ready
