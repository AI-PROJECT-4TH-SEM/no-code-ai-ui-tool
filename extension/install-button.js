const EXTENSION_ID = "agkigmoblgmnknebhjihfkonjgghjdbm"

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
   
    setTimeout(() => resolve(false), 1000)
  })
}

export function triggerScanFromWebsite() {
  if (typeof chrome === "undefined" || !chrome.runtime?.sendMessage) return
  chrome.runtime.sendMessage(EXTENSION_ID, { type: "TRIGGER_SCAN" }, (response) => {
    if (response?.error) console.warn("Scan error:", response.error)
  })
}

export function AccessiScanButton() {
 
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
           Scan This Page
        </button>
      )
    }

    return (
      <a
        href="https://chrome.google.com/webstore/detail/YOUR_EXTENSION_ID"
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
