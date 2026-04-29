# 🚀 Deployment & Troubleshooting Guide

## ⚡ Quick Start Deployment

### Step 1: Verify Environment
```bash
# In project root, check .env file
cat .env

# Should contain:
COHERE_KEY1=uHCxt7ELt4YJjs6BhAjuCX0gnemcCDo31MV6zOoO
MONGO_URI=mongodb+srv://riteshjha1:9818756275Alex@cluster1.biefhez.mongodb.net/
```

### Step 2: Start Next.js Server
```bash
cd app/
npm run dev

# You should see:
# ▲ Next.js 16.2.4
# - Local: http://localhost:3000
# Ready in 1.5s
```

### Step 3: Reload Chrome Extension
1. Open `chrome://extensions/`
2. Find "Chai Ke Sath AI" extension
3. Click the **Reload** button (circular arrow icon)
4. You should see "Extension reloaded" message

### Step 4: Test the Chatbot
1. Go to any website (e.g., google.com)
2. Click extension icon → Click "💬 Chat"
3. Type: `change background to red`
4. Press Enter or click Send button
5. **Expected Result**: Page background turns red, console shows logs

### Step 5: Verify Logging
1. Right-click on page → Inspect (or press F12)
2. Go to **Console** tab
3. Perform step 4 again
4. **Expected Logs**:
   ```
   📤 Sending chat instruction to Cohere... "change background to red"
   📥 Received response from background: {success: true, ...}
   📦 Actions to apply: 1
   🔧 Applying action: domFix selector: body
   ✅ Applied: Changed background-color to #FF0000
   📊 Results: 1 applied, 0 failed
   ```

---

## 🧪 Complete Feature Testing

### Test 1: Basic Color Change
```
Action: Open extension → Chat tab → "change h1 to blue"
Expected: All H1 elements turn blue (#0066FF)
Verify: 
  ✓ Blue is #0066FF (not orange/green)
  ✓ Only H1 elements changed
  ✓ Logs show applied
```

### Test 2: Multiple Changes
```
Action: "make all buttons bigger and bold"
Expected: Multiple changes applied
Verify:
  ✓ Logs show "2+ applied"
  ✓ Buttons are visibly larger
  ✓ Text appears bold
```

### Test 3: History Feature
```
Action: 
  1. Send 3 different chat messages
  2. Click "📋 History" button
  3. See all 3 messages in modal
  4. Click one to restore
  5. Click "🗑 Clear All"

Verify:
  ✓ Modal opens smoothly
  ✓ All messages shown with timestamps
  ✓ Can restore any message
  ✓ Clear all removes all history
```

### Test 4: Error Handling
```
Action: Send invalid instruction or intentionally cause error
Expected: 
  ✓ User sees error message
  ✓ Console shows error with ❌ symbol
  ✓ Chatbot recovers for next message
```

### Test 5: Auto-Apply Toggle
```
Action: 
  1. Toggle "🤖 Auto Apply" checkbox
  2. Send chat message
  3. Verify behavior

Verify:
  ✓ With toggle ON: Changes apply automatically
  ✓ With toggle OFF: Changes don't apply
```

---

## 🆘 Troubleshooting

### Issue: "Chatbot shows 'Applied' but nothing happens"

**Debug Steps**:
1. Open DevTools Console (F12)
2. Look for logs with 📤 symbol
3. Check if you see ❌ error logs

**If you see logs but no change**:
- Element selector might be wrong
- Check: `🔧 Applying action: selector: body` 
- Try selecting the element with element picker first
- Verify element exists on page

**If no logs appear**:
- Cohere API not being called
- Check: `.env` file has `COHERE_KEY1`
- Check: `npm run dev` is running in `app/` folder
- Reload extension from `chrome://extensions/`

---

### Issue: "History button shows no sessions"

**Debug Steps**:
1. Open DevTools Console
2. Look for: `📊 Loaded 0 sessions from MongoDB`
3. Check Network tab → XHR/Fetch calls

**If MongoDB error**:
- Check: `.env` has `MONGO_URI`
- Test connection:
  ```bash
  cd app/
  node -e "
    require('dotenv').config()
    const mongoose = require('mongoose')
    mongoose.connect(process.env.MONGO_URI)
      .then(() => console.log('✅ MongoDB connected'))
      .catch(e => console.log('❌ MongoDB error:', e.message))
  "
  ```

**If sessions not saving**:
- Check: `npm run dev` console shows no errors
- Verify: First chat is working (check logs)
- MongoDB connection might be dropping
- Try: Restart `npm run dev`

---

### Issue: "Cohere API Error - API failed"

**Debug Steps**:
1. Check DevTools Console
2. Look for: `❌ Cohere API Error: ...`

**If "Invalid API key"**:
- Check: `.env` file has exact key
- Verify: No extra spaces or quotes
- Test key at: https://dashboard.cohere.com/api-keys
- Get new key if expired

**If "Rate limited"**:
- Cohere quota exceeded
- Wait 1 hour for quota reset
- Check Cohere dashboard for usage stats

**If "Empty response"**:
- Cohere returned null/undefined
- Check: `npm run dev` is running
- Check: Node logs for "🤖 Calling Cohere API..."
- Try: Different instruction (e.g., "hello")

---

### Issue: "Extension not loading"

**Debug Steps**:
1. Go to `chrome://extensions/`
2. Look for red "Error" badge on extension
3. Click extension name to see error details
4. Check: Files are in `extension/` folder

**If error about manifest**:
- Verify: `extension/manifest.json` exists
- Verify: Valid JSON syntax (use JSONLint.com)
- Reload extension

**If error about missing files**:
- Check: All these files exist:
  - `extension/popup.js`
  - `extension/popup.html`
  - `extension/content.js`
  - `extension/background.js`
  - `extension/styles.css`
- Reload extension

---

### Issue: "Content script not loading on page"

**Symptoms**:
- Element picker doesn't work
- DOM changes don't apply
- Console shows: "Could not establish connection"

**Fix**:
1. Reload extension from `chrome://extensions/`
2. Refresh page (F5)
3. Try element picker again
4. If still fails: Try different page (e.g., google.com)

---

### Issue: "History modal opens but nothing shows"

**Debug Steps**:
1. Open DevTools Network tab
2. Send a chat message
3. Look for request to `localhost:3000/api/extension-chat/sessions`
4. Check response status and data

**If 404 error**:
- Endpoint doesn't exist
- Check: API route file exists
- Check: `npm run dev` is running
- Reload extension

**If 500 error**:
- Server error
- Check: `npm run dev` console for errors
- Check: MongoDB is connected
- Restart `npm run dev`

**If empty response**:
- No sessions saved yet
- This is normal - send first chat message
- Sessions should appear after first chat

---

## 📋 Verification Checklist

Before declaring deployment complete:

```
Setup Verification:
  [ ] .env file has COHERE_KEY1
  [ ] .env file has MONGO_URI
  [ ] npm run dev is running (port 3000)
  [ ] Extension is loaded in Chrome
  [ ] No errors in chrome://extensions/

Feature Tests:
  [ ] Can open extension popup
  [ ] Can see "💬 Chat" tab
  [ ] Can send chat message
  [ ] Chat shows response
  [ ] Console shows debug logs with 📤📥✅ symbols
  [ ] Can click "📋 History" button
  [ ] History modal opens with previous chats
  [ ] Can restore chat from history
  [ ] Can clear all history
  [ ] Element picker works
  [ ] DOM changes apply correctly
  [ ] Color changes are accurate (blue = #0066FF, not orange)

Error Handling:
  [ ] Invalid instruction shows error message
  [ ] Error doesn't crash chatbot
  [ ] Can recover and send next message
  [ ] Console shows error with ❌ symbol

Performance:
  [ ] Chats respond within 5 seconds
  [ ] No browser lag when applying fixes
  [ ] History modal loads quickly
  [ ] Auto-apply works smoothly
```

---

## 🔄 Rollback Instructions

If something breaks and you need to revert:

```bash
# Check git status
git status

# See what changed
git diff app/src/app/api/extension-chat/route.js
git diff extension/popup.js
git diff extension/styles.css
git diff extension/popup.html

# Revert specific file
git checkout app/src/app/api/extension-chat/route.js

# Or revert all changes
git checkout .

# Reload extension from chrome://extensions/
```

---

## 📞 Support Information

### Where to Check for Issues

1. **Chrome Console** (F12 → Console):
   - Look for logs starting with: 📤 📥 📦 🔧 ✅ ❌ ⚠️
   - Error messages will have ❌ prefix
   - Warnings will have ⚠️ prefix

2. **Network Tab** (F12 → Network):
   - Filter by "Fetch/XHR"
   - Look for requests to `localhost:3000/api/extension-chat`
   - Check status codes (200 = success, 500 = server error, 404 = not found)

3. **Terminal** (`npm run dev` output):
   - Watch for errors when chatbot sends message
   - Should show `✅ API called successfully` or `❌ Error`

4. **MongoDB Connection**:
   - Verify MONGO_URI works
   - Check if sessions are being saved
   - Query database directly if needed

---

## 🎉 Success Indicators

You'll know it's working when you see:

1. **Chat works**: Type message → Get response → See console logs
2. **DOM changes apply**: Visual changes appear on page
3. **Colors accurate**: "blue" → #0066FF (not orange/green)
4. **History works**: Click "📋 History" → Modal shows past chats
5. **Restoration works**: Click history item → Old chat comes back
6. **Logging works**: Console shows 📤 📥 ✅ symbols
7. **Errors handled**: Invalid input shows error message, recovers

---

**🚀 Ready to deploy! Follow the Quick Start Deployment section above.**

**Questions? Check the Troubleshooting section that matches your issue.**

**All tests passing? You're good to go!** ✅
