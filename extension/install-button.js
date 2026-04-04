/**
 * install-button.js
 * ─────────────────
 * Drop this script into your Next.js site (pages/_app.js or any component).
 * It renders a smart "Add to Chrome" button that:
 *   - Shows "Installed ✓" if the extension is already active
 *   - Shows a download/install button if not installed
 *   - Can trigger a scan from your website via postMessage
 *
 * Usage in Next.js:
 *   import { AccessiScanButton } from './install-button'
 *   <AccessiScanButton />
 */

// ── Extension ID — update this after publishing or sideloading ──────────────
// Find it at chrome://extensions after loading the extension
const EXTENSION_ID = "agkigmoblgmnknebhjihfkonjgghjdbm"

// ── Check if extension is installed ─────────────────────────────────────────
export async function checkExtensionInstalled() {
  return new Promise((resolve) => {
    if (typeof chrome === "undefined" || !chrome.runtime?.sendMessage) {
      resolve(false)
      return
    }
    try {
      chrome.runtime.sendMessage(EXTENSION_ID, { type: "EXTENSION_PING" }, (response) => {
        if (chrome.runtime.lastError) { resolve(false); return }
        resolve(response?.installed === true)
      })
    } catch {
      resolve(false)
    }
    // Timeout fallback
    setTimeout(() => resolve(false), 1000)
  })
}

// ── Trigger a scan from your website ────────────────────────────────────────
export function triggerScanFromWebsite() {
  if (typeof chrome === "undefined" || !chrome.runtime?.sendMessage) return
  chrome.runtime.sendMessage(EXTENSION_ID, { type: "TRIGGER_SCAN" }, (response) => {
    if (response?.error) console.warn("Scan error:", response.error)
  })
}

// ── React Component ──────────────────────────────────────────────────────────
// Paste this into your Next.js component (requires React)
export function AccessiScanButton() {
  // NOTE: Copy-paste this into a React component file in your Next.js project
  // This is plain JS for portability — convert to JSX as needed
  return `
    // In your component:
    const [installed, setInstalled] = React.useState(null)

    React.useEffect(() => {
      checkExtensionInstalled().then(setInstalled)
    }, [])

    if (installed === null) return null // loading

    if (installed) {
      return (
        <button
          onClick={triggerScanFromWebsite}
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
            color: '#fff', border: 'none', padding: '10px 20px',
            borderRadius: '8px', fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}
        >
          ♿ Scan This Page
        </button>
      )
    }

    return (
      <a
        href="https://chrome.google.com/webstore/detail/agkigmoblgmnknebhjihfkonjgghjdbm"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
          color: '#fff', padding: '10px 20px', borderRadius: '8px',
          fontWeight: 700, textDecoration: 'none', display: 'inline-flex',
          alignItems: 'center', gap: '8px',
        }}
      >
        ♿ Add to Chrome
      </a>
    )
  `
}

// ── Vanilla JS version (no React needed) ────────────────────────────────────
// Call this function anywhere on your website to inject the button
export function injectInstallButton(targetSelector = "#install-btn-container") {
  const container = document.querySelector(targetSelector)
  if (!container) return

  checkExtensionInstalled().then(installed => {
    container.innerHTML = ""

    const btn = document.createElement(installed ? "button" : "a")
    btn.textContent = installed ? "♿ Scan This Page" : "♿ Add to Chrome"
    btn.style.cssText = `
      background: linear-gradient(135deg, #7c3aed, #a78bfa);
      color: white; border: none; padding: 10px 20px;
      border-radius: 8px; font-weight: 700; cursor: pointer;
      font-size: 14px; text-decoration: none; display: inline-block;
    `

    if (installed) {
      btn.addEventListener("click", triggerScanFromWebsite)
    } else {
      btn.href = `https://chrome.google.com/webstore/detail/${EXTENSION_ID}`
      btn.target = "_blank"
    }

    container.appendChild(btn)

    if (installed) {
      const tag = document.createElement("span")
      tag.textContent = "Extension active ✓"
      tag.style.cssText = "font-size:11px;color:#4ade80;display:block;margin-top:6px;text-align:center"
      container.appendChild(tag)
    }
  })
}

/*
 ┌─────────────────────────────────────────────────────────────────┐
 │  HOW TO GET THE EXTENSION ID FOR SIDELOADING (Dev Mode)         │
 │                                                                 │
 │  1. Go to chrome://extensions                                   │
 │  2. Enable Developer Mode (top right toggle)                    │
 │  3. Click "Load unpacked" → select your extension folder        │
 │  4. Copy the ID shown under the extension name                  │
 │  5. Paste it as EXTENSION_ID at the top of this file            │
 │                                                                 │
 │  For production: publish to Chrome Web Store, then update ID    │
 └─────────────────────────────────────────────────────────────────┘
*/
