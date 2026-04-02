const BASE_URL = "http://localhost:3000"
const MAX_HISTORY = 20

// ─── Message Router ───────────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  switch (msg.type) {
    case "ANALYSE":
      handleAnalyse(msg.url).then(sendResponse)
      return true

    case "GET_HISTORY":
      chrome.storage.local.get(["scanHistory"], (d) => {
        sendResponse({ history: d.scanHistory || [] })
      })
      return true

    case "SAVE_HISTORY":
      saveHistory(msg.entry).then(sendResponse)
      return true

    case "CLEAR_HISTORY":
      chrome.storage.local.set({ scanHistory: [] }, () => sendResponse({ success: true }))
      return true

    case "DELETE_HISTORY_ITEM":
      deleteHistoryItem(msg.id).then(sendResponse)
      return true
  }
})

// ─── Analyse ──────────────────────────────────────────────────────────────────
async function handleAnalyse(url) {
  try {
    const res = await fetch(`${BASE_URL}/api/analyse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return { error: err.error || `Server error (${res.status})` }
    }
    return await res.json()
  } catch (err) {
    return { error: "Cannot reach server. Is localhost:3000 running? " + err.message }
  }
}

// ─── History ──────────────────────────────────────────────────────────────────
async function saveHistory(entry) {
  return new Promise((resolve) => {
    chrome.storage.local.get(["scanHistory"], (data) => {
      const history = data.scanHistory || []
      const newEntry = {
        ...entry,
        id: Date.now().toString(),
        savedAt: new Date().toISOString(),
      }
      const updated = [newEntry, ...history].slice(0, MAX_HISTORY)
      chrome.storage.local.set({ scanHistory: updated }, () => {
        resolve({ success: true, entry: newEntry })
      })
    })
  })
}

async function deleteHistoryItem(id) {
  return new Promise((resolve) => {
    chrome.storage.local.get(["scanHistory"], (data) => {
      const history = (data.scanHistory || []).filter((h) => h.id !== id)
      chrome.storage.local.set({ scanHistory: history }, () => {
        resolve({ success: true })
      })
    })
  })
}
