const BASE_URL       = "http://localhost:3000"
const EXTENSION_KEY  = "chai-ke-sath-extension-2025"

// ─── Install ──────────────────────────────────────────────────────────────────
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    chrome.tabs.create({ url: chrome.runtime.getURL("welcome.html") })
  }
  chrome.contextMenus.create({
    id: "accessi-scan",
    title: "♿ Scan this page with Chai Ke Sath AI",
    contexts: ["page", "link"]
  })
  // Set side panel to open on action click — stays open until user closes it
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {})
})

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "accessi-scan") {
    try {
      await chrome.sidePanel.open({ tabId: tab.id })
    } catch { /* ignore */ }
  }
})

// External messages from website
chrome.runtime.onMessageExternal.addListener((msg, sender, sendResponse) => {
  if (msg.type === "EXTENSION_PING") {
    sendResponse({ installed: true, version: chrome.runtime.getManifest().version })
    return true
  }
})

// ─── Internal Message Router ──────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  switch (msg.type) {
    case "ANALYSE":
      handleAnalyse(msg.url).then(sendResponse)
      return true
    case "ANALYSE_HTML":
      handleAnalyseHtml(msg.html).then(sendResponse)
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
    case "SAVE_THEME":
      saveThemeMongo(msg.themeId).then(sendResponse)
      return true
    case "LOAD_THEME":
      loadThemeMongo().then(sendResponse)
      return true
  }
})

// ─── Analyse by URL ───────────────────────────────────────────────────────────
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

// ─── Analyse fixed HTML (post-fix rescore) ────────────────────────────────────
async function handleAnalyseHtml(html) {
  try {
    const res = await fetch(`${BASE_URL}/api/analyse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return { error: err.error || `Server error (${res.status})` }
    }
    return await res.json()
  } catch (err) {
    return { error: "Cannot reach server. " + err.message }
  }
}

// ─── History ──────────────────────────────────────────────────────────────────
async function getHistory() {
  // Always use local storage as source of truth.
  // MongoDB fetch was causing stale data to reappear after clear/delete.
  return new Promise((resolve) => {
    chrome.storage.local.get(["scanHistory"], (d) => {
      const history = d.scanHistory || []
      resolve({ history, source: history.length > 0 ? "local" : "local" })
    })
  })
}

async function saveHistory(entry) {
  const newEntry = { ...entry, id: Date.now().toString(), savedAt: new Date().toISOString(), source: "extension" }
  // Always save to local storage (source of truth)
  await new Promise(resolve => {
    chrome.storage.local.get(["scanHistory"], (data) => {
      const history = data.scanHistory || []
      const updated = [newEntry, ...history].slice(0, 20)
      chrome.storage.local.set({ scanHistory: updated }, resolve)
    })
  })
  // Best-effort save to backend
  try {
    const res = await fetch(`${BASE_URL}/api/save-history`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEntry),
    })
    if (res.ok) return { success: true, entry: newEntry, source: "mongodb" }
  } catch { /* fall through */ }
  return { success: true, entry: newEntry, source: "local" }
}

async function deleteHistoryItem(id) {
  // Delete from local first — authoritative
  await new Promise(resolve => {
    chrome.storage.local.get(["scanHistory"], (data) => {
      const history = (data.scanHistory || []).filter((h) => h.id !== id)
      chrome.storage.local.set({ scanHistory: history }, resolve)
    })
  })
  // Best-effort delete from backend
  try { await fetch(`${BASE_URL}/api/history/${id}`, { method: "DELETE" }) } catch { /* ignore */ }
  return { success: true }
}

async function clearHistory() {
  // Clear local storage first — this is the authoritative source
  await new Promise(resolve => chrome.storage.local.set({ scanHistory: [] }, resolve))
  // Best-effort clear on backend
  try { await fetch(`${BASE_URL}/api/history/clear`, { method: "DELETE" }) } catch { /* ignore */ }
  return { success: true }
}

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

// ─── Theme Storage — Extension Theme Server (port 3001) ──────────────────────
// Uses standalone extension-theme-server.js (run: npm install && npm start)
// Falls back to chrome.storage.local if server not running

const THEME_SERVER  = "http://localhost:3001"
const DEVICE_ID_KEY = "extensionDeviceId"

async function getDeviceId() {
  return new Promise(resolve => {
    chrome.storage.local.get([DEVICE_ID_KEY], d => {
      if (d[DEVICE_ID_KEY]) { resolve(d[DEVICE_ID_KEY]); return }
      const id = "ext-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8)
      chrome.storage.local.set({ [DEVICE_ID_KEY]: id }, () => resolve(id))
    })
  })
}

async function saveThemeMongo(themeId) {
  // Store theme in MongoDB ONLY via extension theme server
  // No local storage — MongoDB is the single source of truth for theme
  try {
    const deviceId = await getDeviceId()
    const res = await fetch(`${THEME_SERVER}/theme`, {
      method: "POST",
      headers: {
        "Content-Type":    "application/json",
        "x-extension-key": EXTENSION_KEY,
        "x-device-id":     deviceId,
      },
      body: JSON.stringify({ themeId, themeName: themeId }),
    })
    if (res.ok) return { success: true, source: "mongodb" }
  } catch { /* server may not be running */ }

  return { success: false, source: "none", error: "Theme server not reachable" }
}

async function loadThemeMongo() {
  // Load theme from MongoDB only
  try {
    const deviceId = await getDeviceId()
    const res = await fetch(`${THEME_SERVER}/theme`, {
      headers: {
        "x-extension-key": EXTENSION_KEY,
        "x-device-id":     deviceId,
      },
    })
    if (res.ok) {
      const data    = await res.json()
      const themeId = data.themeId || null
      return { themeId, source: "mongodb" }
    }
  } catch { /* server not running */ }

  return { themeId: null, source: "none" }
}
