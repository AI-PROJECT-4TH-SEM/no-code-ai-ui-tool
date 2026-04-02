# AccessiScan Extension v2

Chrome extension for your accessibility analysis backend — no login required.

## Features
- **Scan Tab** — scan any page, animated score ring, sorted violation cards with Apply Fix buttons
- **Themes Tab** — 8 live themes injected into the current page (Cyberpunk, AI Minimal, Glass, Electric, Colorful, Ocean, Nature, Matrix)
- **History Tab** — last 20 scans stored locally, rescan or delete any entry

## Install
1. `chrome://extensions` → enable Developer Mode
2. Click **Load unpacked** → select this folder
3. Backend must be running at `http://localhost:3000`

## File Overview
| File | Purpose |
|---|---|
| `manifest.json` | MV3 config |
| `background.js` | Service worker — `/api/analyse`, history via `chrome.storage.local` |
| `content.js` | Injected into pages — applies DOM fixes + injects theme CSS |
| `popup.html` | 3-tab popup shell |
| `popup.js` | All UI logic — scan, themes, history, fix engine calls |
| `styles.css` | Dark UI styles |

## Fix Types Supported
`setAttribute`, `removeAttribute`, `setStyle`, `setStyleImportant`, `setInnerText`, `addClass`, `replaceHtml`, `replaceTag`, `wrapMain`, `wrapWithMain`, `ensureH1`, `multifix`

## Change Backend URL
Edit line 1 of `background.js`:
```js
const BASE_URL = "http://localhost:3000"
```
