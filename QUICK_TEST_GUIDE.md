# Quick Start Testing Guide

## 🚀 One-Minute Setup

### 1. Install Extension
```
1. Chrome: chrome://extensions/
2. Developer mode: ON (top right)
3. Load unpacked → Select /extension folder
4. Pin extension to toolbar
```

### 2. Start Backend
```bash
cd app
npm run dev
# Should show: Ready on http://localhost:3000
```

### 3. Open Test Page
```
Navigate to ANY website in Chrome
Click CHAI KE SATH AI extension icon
```

---

## ✅ 5-Minute Test Suite

### Test 1: Complex Selector (PRIMARY)
```
Target: #vector-main-menu-dropdown-checkbox (or any element with hyphenated ID)

Steps:
1. Right-click element → Inspect
2. Copy selector: #vector-main-menu-dropdown-checkbox
3. In chat: "change background to blue for #vector-main-menu-dropdown-checkbox"
4. Expected: Element background changes to blue

Advanced:
- Try: "add 5px border"
- Try: "center content inside"
- Try: "add box shadow"
```

### Test 2: Download Button
```
Steps:
1. Chat: "change header background to red"
2. Wait for element to glow
3. Click "Download All Changes" button
4. Expected: File downloads with name like "example-com-modified-2024-01-15.html"
5. Open HTML file in browser → should show your changes

Verify:
- Open downloaded HTML in browser
- Should see changes preserved
- Check file size (should contain CSS styles)
```

### Test 3: Advanced CSS Features
```
Test setComplexStyle:
- Chat: "add blur effect to images"
- Chat: "add 45 degree rotation"
- Chat: "add gradient background"

Test setFlexboxAdvanced:
- Chat: "center all buttons"
- Chat: "space out navigation items"
- Chat: "arrange items in column"

Test setTextAdvanced:
- Chat: "make all text uppercase"
- Chat: "add underline to links"
- Chat: "change text color to white"

Test setStructuralChange:
- Chat: "wrap all buttons in a container"
- Chat: "change all divs to sections"
```

### Test 4: Multiple Modifications
```
Steps:
1. Chat: "change background to light blue"
2. Chat: "make heading white"
3. Chat: "add shadow to all buttons"
4. Chat: "center navigation"
5. Download changes
6. Verify: All 4 changes in downloaded HTML
```

### Test 5: Undo/Redo
```
Steps:
1. Make a change
2. Click UNDO button (bottom left)
3. Expected: Change reverted
4. Click REDO button
5. Expected: Change restored
6. Verify: Max 20 undo states work
```

---

## 🔍 Advanced Debugging

### Check Selector Resolution
```javascript
// In browser console:
// Test direct selector
document.querySelectorAll("#vector-main-menu-dropdown-checkbox")

// Test ID extraction
document.getElementById("vector-main-menu-dropdown-checkbox")

// Test data-attribute fallback
document.querySelectorAll('[data-vector]')
```

### View Applied Styles
```javascript
// In browser console:
const el = document.querySelector("#vector-main-menu-dropdown-checkbox")
console.log(el.style.cssText)
```

### Check Cohere API Response
```javascript
// Look in Network tab (F12)
// Find POST to /api/assistant
// Check Response → should have "actions" array
// Each action should have: type, selector, style, styleValue
```

### View Downloaded HTML
```
1. Right-click downloaded file
2. Open with → Chrome
3. View → Developer Tools
4. Check <style> tags in <head>
5. Should contain all your modifications
```

---

## 🎯 Expected Results

### Test 1 Results
```
✓ Complex selector resolved
✓ Element glows (visual feedback)
✓ CSS property applied (check computed styles)
✓ No console errors
```

### Test 2 Results
```
✓ File downloads with correct naming
✓ HTML file opens in browser correctly
✓ Modifications visible in downloaded file
✓ CSS styles embedded in <style> tag
```

### Test 3 Results
```
✓ Each action type applies correct CSS
✓ Multiple properties applied where needed
✓ No errors in console
✓ Visual changes immediate on page
```

### Test 4 Results
```
✓ All 4 modifications applied sequentially
✓ Download file contains all changes
✓ File readable and functional
✓ No CSS conflicts between changes
```

### Test 5 Results
```
✓ Undo reverts to previous state
✓ Redo restores changes
✓ Stack limit of 20 works
✓ No memory issues
```

---

## ⚠️ Common Issues & Fixes

### Issue: "Selector not found" error
```
Cause: Element doesn't exist or selector wrong
Fix:
1. Verify element exists: F12 → Elements tab
2. Copy exact selector from DevTools
3. Try without pseudo-selectors (::before, :hover)
```

### Issue: Download button disabled
```
Cause: No modifications applied
Fix:
1. Make at least one modification first
2. Wait for element to glow
3. Then click download
```

### Issue: Cohere API not responding
```
Cause: API key missing or network issue
Fix:
1. Check environment variables
2. Verify .env.local has COHERE_API_KEY
3. Check browser network tab for error
4. Verify internet connection
```

### Issue: Downloaded file is empty
```
Cause: Page capture failed
Fix:
1. Check browser console for errors
2. Try simpler modification first
3. Refresh page and retry
4. Check file size (should be >1KB)
```

### Issue: Complex selector not working
```
Cause: Selector strategy mismatch
Fix:
1. Try simpler selector first (.class or tag)
2. Check element in DevTools
3. Try with #id if available
4. Check console for "Selector parse error"
```

---

## 📊 What to Measure

### Performance
- [ ] Time to apply change: < 500ms
- [ ] Download generation: < 2 seconds
- [ ] Undo/redo: Instant
- [ ] No UI freezing

### Functionality
- [ ] All 8 action types work
- [ ] Complex selectors resolve
- [ ] Download button generates valid HTML
- [ ] Modifications persist in downloaded file

### Quality
- [ ] No console errors
- [ ] Visual feedback (glow) appears
- [ ] Toast notifications show
- [ ] Undo/redo works reliably

### User Experience
- [ ] Chat response time < 3s
- [ ] Clear error messages
- [ ] File names are descriptive
- [ ] Downloaded HTML is readable

---

## ✅ Sign-Off Checklist

Before declaring "production ready", verify:

- [ ] All 5 tests pass without errors
- [ ] Complex selector #vector-main-menu-dropdown-checkbox works
- [ ] Download button generates valid HTML files
- [ ] All 8 action types tested and working
- [ ] No console errors during testing
- [ ] Undo/redo works smoothly
- [ ] Downloaded HTML opens correctly in browser
- [ ] File naming includes domain and timestamp
- [ ] Performance acceptable (< 2s for most operations)
- [ ] Team sign-off obtained

---

## 📞 Questions?

**For Developers:**
1. Check console (F12 → Console tab)
2. Look for red error messages
3. Review Network tab for API calls
4. Enable verbose logging in resolveSelector()

**For End Users:**
1. Ensure extension is installed and enabled
2. Check internet connection
3. Try simpler modifications first
4. Reload page if issues persist

---

Ready to test? Start with Test 1 (Complex Selector) - it's the key validation!
