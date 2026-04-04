const BASE_URL = "http://localhost:3000"

// ─── Install Handler ──────────────────────────────────────────────────────────
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    chrome.tabs.create({ url: chrome.runtime.getURL("welcome.html") })
  }

  // Right-click context menu
  chrome.contextMenus.create({
    id: "accessi-scan",
    title: "♿ Scan this page with Chai Ke Sath AI",
    contexts: ["page", "link"]
  })
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "accessi-scan") {
    chrome.action.openPopup().catch(() => {})
  }
})

// ─── External messages from website (externally_connectable) ─────────────────
chrome.runtime.onMessageExternal.addListener((msg, sender, sendResponse) => {
  if (msg.type === "EXTENSION_PING") {
    sendResponse({ installed: true, version: chrome.runtime.getManifest().version })
    return true
  }
  if (msg.type === "TRIGGER_SCAN") {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (tab) handleAnalyse(tab.url).then(sendResponse)
    })
    return true
  }
})

// ─── Internal Message Router ──────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  switch (msg.type) {
    case "ANALYSE":
      handleAnalyse(msg.url).then(sendResponse)
      return true

    case "GET_HISTORY":
      getHistory().then(sendResponse)
      return true

    case "SAVE_HISTORY":
      saveHistory(msg.entry).then(sendResponse)
      return true

    case "DELETE_HISTORY_ITEM":
      deleteHistoryItem(msg.id).then(sendResponse)
      return true

    case "CLEAR_HISTORY":
      clearHistory().then(sendResponse)
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

// ─── History — MongoDB via backend API ────────────────────────────────────────
// Falls back to chrome.storage.local if backend is unreachable

async function getHistory() {
  try {
    const res = await fetch(`${BASE_URL}/api/history`, {
      headers: { "Content-Type": "application/json" },
    })
    if (!res.ok) throw new Error("API error")
    const data = await res.json()
    // backend returns array directly or { history: [] }
    const list = Array.isArray(data) ? data : (data.history || data.sessions || [])
    return { history: list, source: "mongodb" }
  } catch {
    // fallback to local storage
    return new Promise((resolve) => {
      chrome.storage.local.get(["scanHistory"], (d) => {
        resolve({ history: d.scanHistory || [], source: "local" })
      })
    })
  }
}

async function saveHistory(entry) {
  const newEntry = {
    ...entry,
    id: Date.now().toString(),
    savedAt: new Date().toISOString(),
    source: "extension",
  }

  // 1. Try MongoDB via backend
  try {
    const res = await fetch(`${BASE_URL}/api/save-history`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEntry),
    })
    if (res.ok) {
      // also cache locally so history tab works offline
      _cacheLocally(newEntry)
      return { success: true, entry: newEntry, source: "mongodb" }
    }
  } catch { /* fall through */ }

  // 2. Fallback — save only to chrome.storage
  return new Promise((resolve) => {
    chrome.storage.local.get(["scanHistory"], (data) => {
      const history = data.scanHistory || []
      const updated = [newEntry, ...history].slice(0, 20)
      chrome.storage.local.set({ scanHistory: updated }, () => {
        resolve({ success: true, entry: newEntry, source: "local" })
      })
    })
  })
}

async function deleteHistoryItem(id) {
  // Try backend delete
  try {
    const res = await fetch(`${BASE_URL}/api/history/${id}`, { method: "DELETE" })
    if (res.ok) {
      _removeFromLocalCache(id)
      return { success: true }
    }
  } catch { /* fall through */ }

  // Fallback local
  return new Promise((resolve) => {
    chrome.storage.local.get(["scanHistory"], (data) => {
      const history = (data.scanHistory || []).filter((h) => h.id !== id)
      chrome.storage.local.set({ scanHistory: history }, () => resolve({ success: true }))
    })
  })
}

async function clearHistory() {
  // Try clearing on backend (best effort)
  try {
    await fetch(`${BASE_URL}/api/history/clear`, { method: "DELETE" })
  } catch { /* ignore */ }

  return new Promise((resolve) => {
    chrome.storage.local.set({ scanHistory: [] }, () => resolve({ success: true }))
  })
}

// ─── Local cache helpers ──────────────────────────────────────────────────────
function _cacheLocally(entry) {
  chrome.storage.local.get(["scanHistory"], (data) => {
    const history = data.scanHistory || []
    const updated = [entry, ...history].slice(0, 20)
    chrome.storage.local.set({ scanHistory: updated })
  })
}

function _removeFromLocalCache(id) {
  chrome.storage.local.get(["scanHistory"], (data) => {
    const history = (data.scanHistory || []).filter((h) => h.id !== id)
    chrome.storage.local.set({ scanHistory: history })
  })
}
