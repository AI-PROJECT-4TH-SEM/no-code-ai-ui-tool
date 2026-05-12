# 🚀 Production-Level AI Chatbot Features Guide

## Overview

Your chatbot now has **THREE POWERFUL NEW CAPABILITIES** that work seamlessly with the Cohere API (KEY1):

1. **Structural DOM Changes** - Move elements anywhere on the page
2. **Text Addition** - Add or modify text in any element
3. **Free-Form DOM Writing** - Write complete HTML and apply it to the page

All features maintain **backward compatibility** with your existing code and use the same undo/redo stack system.

---

## 🎯 Feature 1: Structural DOM Changes

### What It Does
Move, reorder, or copy elements, images, and spans to different locations on the page.

### Action Type
```json
{
  "kind": "domFix",
  "fix": {
    "type": "moveElementStructural",
    "selector": "CSS selector of element to move",
    "targetSelector": "CSS selector of destination",
    "position": "before|after|append|prepend"
  }
}
```

### Position Options
| Position | Behavior |
|----------|----------|
| `before` | Insert BEFORE target element |
| `after` | Insert AFTER target element |
| `append` | Add as LAST child of target |
| `prepend` | Add as FIRST child of target |

### User Commands (Examples)

```
✅ "Move the login button below the form"
   → Moves button element after form element

✅ "Send the hero image to the footer"
   → Moves image element to footer (appended)

✅ "Move span.badge above the header"
   → Inserts badge span before header element

✅ "Put this card in the sidebar"
   → Appends card to sidebar div
```

### API Request
```javascript
{
  "instruction": "move the button below the form",
  "url": "https://example.com",
  "selectedElement": {
    "selector": "button.primary",
    "effectiveSelector": "button.primary"
  },
  "html": "[page HTML]"
}
```

### AI Prompt Response
The Cohere API will return:
```json
{
  "reply": "Done. Moved the button below the form.",
  "actions": [
    {
      "kind": "domFix",
      "fix": {
        "type": "moveElementStructural",
        "selector": "button.primary",
        "targetSelector": "form.login-form",
        "position": "after"
      },
      "reason": "User requested button movement below form"
    }
  ]
}
```

### Implementation Details
- **File**: `extension/content.js` (lines ~1210-1253)
- **Function**: `applyFix()` case handler
- **Features**:
  - Multiple targets supported (clones for extra copies)
  - Single selector moves cleanly
  - Preserves all element attributes and event listeners
  - Auto-glows element after move
  - Full undo/redo support

---

## ✍️ Feature 2: Text Addition

### What It Does
Add, replace, or append text to any selected element.

### Action Type
```json
{
  "kind": "domFix",
  "fix": {
    "type": "addTextContent",
    "selector": "CSS selector of element",
    "text": "Text to add",
    "mode": "replace|append|prepend"
  }
}
```

### Mode Options
| Mode | Behavior |
|------|----------|
| `replace` | Replace ALL text in element |
| `append` | Add text to END of element |
| `prepend` | Add text to START of element |

### User Commands (Examples)

```
✅ "Add 'Buy Now' to the button"
   → Sets button text to "Buy Now"

✅ "Add footer text '© 2025 My Company'"
   → Appends copyright text to footer

✅ "Put 'Welcome!' in the h1"
   → Replaces h1 text with "Welcome!"

✅ "Write 'New Feature' before existing text in the span"
   → Prepends text to span
```

### API Request
```javascript
{
  "instruction": "add 'Click Here' to the button",
  "url": "https://example.com",
  "selectedElement": {
    "selector": "button.cta",
    "effectiveSelector": "button.cta"
  }
}
```

### AI Prompt Response
```json
{
  "reply": "Done. Added 'Click Here' to the button.",
  "actions": [
    {
      "kind": "domFix",
      "fix": {
        "type": "addTextContent",
        "selector": "button.cta",
        "text": "Click Here",
        "mode": "replace"
      }
    }
  ]
}
```

### Implementation Details
- **File**: `extension/content.js` (lines ~1255-1280)
- **Function**: `applyFix()` case handler
- **Features**:
  - HTML safely encoded
  - Supports all three modes
  - Auto-marks element with `data-cksa-text-edited`
  - Full undo/redo support
  - Multiple elements supported

---

## 🖊️ Feature 3: Free-Form DOM Writing

### What It Does
Write any valid HTML and inject it into selected locations on the page.

### Action Type
```json
{
  "kind": "domFix",
  "fix": {
    "type": "freeFormDomWrite",
    "selector": "CSS selector of target location",
    "html": "Valid HTML to inject",
    "mode": "replace|append|prepend|before|after"
  }
}
```

### Mode Options
| Mode | Behavior |
|------|----------|
| `replace` | Replace element's innerHTML |
| `append` | Add HTML as last child |
| `prepend` | Add HTML as first child |
| `before` | Insert HTML before element |
| `after` | Insert HTML after element |

### User Commands (Examples)

```
✅ "Write a welcome message in the main area"
   → Creates <h2> and <p> in main element

✅ "Add a new button section at the top"
   → Injects button section as first child of body

✅ "Put a signup form below the header"
   → Adds complete form after header element

✅ "Write a footer with contact info"
   → Replaces footer content with new HTML
```

### API Request
```javascript
{
  "instruction": "write a welcome message in the main area",
  "url": "https://example.com",
  "selectedElement": {
    "selector": "main"
  }
}
```

### AI Prompt Response
```json
{
  "reply": "Done. Wrote a welcome message in the main area.",
  "actions": [
    {
      "kind": "domFix",
      "fix": {
        "type": "freeFormDomWrite",
        "selector": "main",
        "html": "<h2>Welcome!</h2><p>Thank you for visiting our site.</p>",
        "mode": "append"
      }
    }
  ]
}
```

### Implementation Details
- **File**: `extension/content.js` (lines ~1282-1327)
- **Function**: `applyFix()` case handler
- **Features**:
  - Safe HTML parsing via temp container
  - Prevents XSS (not directly used for innerHTML)
  - Supports all five modes
  - Auto-marks with `data-cksa-dom-written`
  - Full undo/redo support
  - Preserves all DOM structure

---

## 🎨 Feature 4: Wrap Element

### What It Does
Wrap elements in custom containers with specific classes and inline styles.

### Action Type
```json
{
  "kind": "domFix",
  "fix": {
    "type": "wrapElement",
    "selector": "CSS selector to wrap",
    "wrapTag": "div|section|article|etc",
    "classes": ["class1", "class2"],
    "styles": {
      "display": "flex",
      "gap": "16px"
    }
  }
}
```

### User Commands (Examples)

```
✅ "Wrap this button in a container"
   → Creates div wrapper with classes

✅ "Group these items in a flex container"
   → Adds flex display and gap styling
```

---

## 🔄 How It Works Together

### Flow Diagram
```
User Types Command in Chatbot
    ↓
extension/popup.js sends to API
    ↓
app/api/assistant/route.js (Enhanced Prompt)
    ↓
Cohere API (command-a-03-2025 model)
    ↓
Returns JSON with action types
    ↓
extension/content.js applyFix() handler
    ↓
Executes moveElementStructural | addTextContent | freeFormDomWrite
    ↓
DOM Modified + Element Glows
    ↓
Undo Stack Updated
    ↓
User Sees Changes Instantly
```

---

## 🔑 Cohere API Integration

### Configuration
- **Model**: `command-a-03-2025`
- **Max Tokens**: `800`
- **Temperature**: `0.3` (low for consistency)
- **API Key**: `process.env.COHERE_KEY1`

### Prompt Structure
The enhanced prompt in `app/api/assistant/route.js` includes:

1. **Comprehensive Action Types Reference** - All 40+ action types documented
2. **Structural Changes Section** - NEW moveElementStructural, addTextContent, freeFormDomWrite
3. **Critical Production Rules** - Strict parsing and validation
4. **Selector Resolution** - Handles IDs, classes, complex paths
5. **JSON Response Format** - Validated before execution

### Response Validation
```javascript
// Auto-validates JSON
const parsed = safeJsonParse(raw)
const filteredActions = validated actions only
return normailzed response
```

---

## 💾 Backward Compatibility

✅ **All Existing Features Intact**:
- Color changes (setColorAdvanced, setBackgroundColorAdvanced)
- Sizing & spacing (setStyleImportant)
- Flexbox layouts (setFlexboxAdvanced)
- Grid layouts (setGridAdvanced)
- Borders, shadows, transforms
- Undo/redo stack system
- Inspector mode
- Drag mode
- Theme application

❌ **No Breaking Changes**:
- Same API format
- Same content.js message handlers
- Same undo/redo mechanism
- Same glow effect system

---

## 📋 Selector Examples

The AI can understand many selector formats:

```
✅ "#button-id" → Direct ID
✅ ".primary-button" → Class selector
✅ "button" → Tag selector
✅ "div.container > button" → Complex path
✅ "[data-id='123']" → Attribute selector
✅ "header nav ul li" → Descendant
✅ ".card:nth-child(2)" → Pseudo-selectors
```

---

## 🐛 Error Handling

### Production-Level Safety

1. **Selector Not Found**
   - Error: `Selector not found: "{selector}"`
   - Fallback: Returns error message to user
   - User can try another selector

2. **Invalid HTML**
   - Safe parsing via temp container
   - XSS prevention
   - Only valid HTML injected

3. **Multiple Targets**
   - First target: Moves cleanly
   - Extra targets: Auto-cloned
   - Each operation tracked separately

---

## 🧪 Testing Examples

### Test 1: Move Button
```
User: "Move the submit button below the form"
Expected: Button moves after form element
```

### Test 2: Add Text
```
User: "Add 'Save Changes' to the button"
Expected: Button text becomes "Save Changes"
```

### Test 3: Write HTML
```
User: "Add a new section with heading 'Features' and a list"
Expected: Complete HTML structure injected
```

### Test 4: Wrap Element
```
User: "Wrap all paragraphs in a content container with flex layout"
Expected: Each paragraph wrapped with flex styling
```

---

## 🚀 Production Deployment

### Pre-Deployment Checklist

✅ Updated prompt in `app/src/app/api/assistant/route.js`
✅ New handlers in `extension/content.js`
✅ COHERE_KEY1 configured in `.env.local`
✅ Undo/redo system working
✅ Glow effect visible
✅ Error handling in place
✅ No console errors

### Environment Variables
```env
COHERE_KEY1=your-actual-cohere-api-key-here
```

### Testing Production
1. Open extension on test page
2. Try all three new commands
3. Test undo/redo
4. Verify no console errors
5. Check element styling applied correctly

---

## 📚 Quick Reference

| Feature | Type | Example |
|---------|------|---------|
| Move Element | `moveElementStructural` | "Move button below form" |
| Add Text | `addTextContent` | "Add 'Click' to button" |
| Write HTML | `freeFormDomWrite` | "Write welcome message" |
| Wrap Element | `wrapElement` | "Wrap in container" |

---

## 🎓 Advanced Usage

### Combining Features
```
User: "Add a new section with a button, then move it to the sidebar"

Step 1: freeFormDomWrite creates section
Step 2: moveElementStructural moves to sidebar
```

### Complex Selectors
```
User: "Add text to the first button in the header navigation"

AI understands: "header nav button:first-of-type"
```

### Conditional Logic
```
User: "If there's a footer, add copyright text, otherwise create one"

AI returns: conditional multiple actions
```

---

## 🔗 Integration Points

### Backend
- **File**: `app/src/app/api/assistant/route.js`
- **Function**: POST handler
- **Integration**: Cohere API via CohereClient

### Frontend (Extension)
- **File**: `extension/content.js`
- **Function**: `applyFix()` main dispatcher
- **Integration**: Runtime message handlers

### Database
- **Model**: `AssistantChat` (MongoDB)
- **Stores**: Conversation history with actions
- **Query**: By sessionId or pageUrl

---

## 💡 Tips for Best Results

1. **Be Specific**: "Move button below form" is better than "move it"
2. **Use IDs**: Elements with IDs are faster: "#submit-btn"
3. **HTML Structure**: Valid HTML needed for freeFormDomWrite
4. **One Action Per Command**: Simpler for AI to parse
5. **Use Undo**: Test with undo/redo first

---

**Last Updated**: May 13, 2025
**Version**: 2.0.0 - Production Ready
**API**: Cohere (command-a-03-2025)
