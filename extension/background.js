const BASE_URL       = "http://localhost:3000"
const EXTENSION_KEY  = "chai-ke-sath-extension-2025"
const THEME_PAGE_MAP_KEY = "themeByPageKey"

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    chrome.tabs.create({ url: chrome.runtime.getURL("welcome.html") })
  }
  chrome.contextMenus.create({
    id: "accessi-scan",
    title: "♿ Scan this page with Chai Ke Sath AI",
    contexts: ["page", "link"]
  })
 
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {})
})

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "accessi-scan") {
    try {
      await chrome.sidePanel.open({ tabId: tab.id })
    } catch { }
  }
})

chrome.runtime.onMessageExternal.addListener((msg, sender, sendResponse) => {
  if (msg.type === "EXTENSION_PING") {
    sendResponse({ installed: true, version: chrome.runtime.getManifest().version })
    return true
  }
})

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
      saveThemeMongo(msg.themeId, msg.pageKey, msg.theme).then(sendResponse)
      return true
    case "LOAD_THEME":
      loadThemeMongo(msg.pageKey).then(sendResponse)
      return true
    case "CLEAR_THEME":
      clearThemeMongo(msg.pageKey).then(sendResponse)
      return true
    case "EXT_CHAT_SEND":
      sendExtensionChat(msg.payload).then(sendResponse)
      return true
    case "EXT_CHAT_LOAD":
      loadExtensionChat(msg.payload).then(sendResponse)
      return true
  }
})

async function sendExtensionChat(payload) {
  try {
    const res = await fetch(`${BASE_URL}/api/extension-chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload || {}),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return { success: false, error: data.error || `Server error (${res.status})` }
    }
    return { success: true, ...data }
  } catch (err) {
    return { success: false, error: "Cannot reach chat API. " + err.message }
  }
}

async function loadExtensionChat(payload) {
  try {
    const sessionId = payload?.sessionId ? encodeURIComponent(payload.sessionId) : null
    const url = payload?.url ? encodeURIComponent(payload.url) : null
    let query = ""
    if (sessionId) {
      query = `?sessionId=${sessionId}`
    } else if (url) {
      query = `?url=${url}`
    }
    const res = await fetch(`${BASE_URL}/api/extension-chat${query}`)
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return { success: false, error: data.error || `Server error (${res.status})` }
    }
    return { success: true, ...data }
  } catch (err) {
    return { success: false, error: "Cannot load chat history. " + err.message }
  }
}

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
    return { error: "Cannot reach the deployed server. " + err.message }
  }
}

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

async function getHistory() {
 
  return new Promise((resolve) => {
    chrome.storage.local.get(["scanHistory"], (d) => {
      const history = d.scanHistory || []
      resolve({ history, source: history.length > 0 ? "local" : "local" })
    })
  })
}

async function saveHistory(entry) {
  const newEntry = { ...entry, id: Date.now().toString(), savedAt: new Date().toISOString(), source: "extension" }
  
  await new Promise(resolve => {
    chrome.storage.local.get(["scanHistory"], (data) => {
      const history = data.scanHistory || []
      const updated = [newEntry, ...history].slice(0, 20)
      chrome.storage.local.set({ scanHistory: updated }, resolve)
    })
  })
 
  try {
    const res = await fetch(`${BASE_URL}/api/save-history`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEntry),
    })
    if (res.ok) return { success: true, entry: newEntry, source: "mongodb" }
  } catch { }
  return { success: true, entry: newEntry, source: "local" }
}

async function deleteHistoryItem(id) {
  
  await new Promise(resolve => {
    chrome.storage.local.get(["scanHistory"], (data) => {
      const history = (data.scanHistory || []).filter((h) => h.id !== id)
      chrome.storage.local.set({ scanHistory: history }, resolve)
    })
  })
 
  try { await fetch(`${BASE_URL}/api/history/${id}`, { method: "DELETE" }) } catch { /* ignore */ }
  return { success: true }
}

async function clearHistory() {
 
  await new Promise(resolve => chrome.storage.local.set({ scanHistory: [] }, resolve))
 
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


const THEME_SERVER  = BASE_URL
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

function normalizePageKey(url) {
  if (!url) return ""
  try {
    const parsed = new URL(url)
    return parsed.origin
  } catch {
    const raw = String(url)
    const match = raw.match(/^https?:\/\/[^/]+/i)
    return match ? match[0] : raw.split("#")[0].split("?")[0]
  }
}

async function saveThemeMongo(themeId, pageKey, theme) {
  const key = normalizePageKey(pageKey)
  if (!key) {
    return { success: false, source: "none", error: "Missing page key" }
  }

  // Save to local session storage first
  await new Promise(resolve => {
    chrome.storage.session.get([THEME_PAGE_MAP_KEY], data => {
      const map = data[THEME_PAGE_MAP_KEY] || {}
      if (theme) {
        map[key] = {
          id: theme.id || themeId || null,
          name: theme.name || themeId || null,
          css: theme.css || null,
          preview: theme.preview || null,
          mood: theme.mood || null,
          savedAt: new Date().toISOString(),
        }
      } else {
        delete map[key]
      }
      chrome.storage.session.set({ [THEME_PAGE_MAP_KEY]: map }, resolve)
    })
  })

  // Save to MongoDB via new API endpoint
  try {
    const deviceId = await getDeviceId()
    const res = await fetch(`${THEME_SERVER}/api/extension-theme`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-extension-key": EXTENSION_KEY,
        "x-device-id": deviceId,
      },
      body: JSON.stringify({
        pageKey: key,
        themeName: (theme && theme.name) || themeId || null,
        themeId: themeId || (theme && theme.id) || null,
      }),
    })
    if (res.ok) {
      console.log("✅ Theme saved to MongoDB:", key)
      return { success: true, source: "mongodb" }
    }
  } catch (err) {
    console.warn("⚠️ Failed to save theme to MongoDB, using local storage:", err)
  }

  return { success: true, source: "local" }
}

async function loadThemeMongo(pageKey) {
  const key = normalizePageKey(pageKey)
  if (!key) {
    return { theme: null, source: "none" }
  }

  // Check local session storage first
  const localTheme = await new Promise(resolve => {
    chrome.storage.session.get([THEME_PAGE_MAP_KEY], data => {
      const map = data[THEME_PAGE_MAP_KEY] || {}
      resolve(map[key] || null)
    })
  })

  if (localTheme) {
    return { theme: localTheme, source: "local" }
  }

  // Try to load from MongoDB
  try {
    const deviceId = await getDeviceId()
    const res = await fetch(
      `${THEME_SERVER}/api/extension-theme?pageKey=${encodeURIComponent(key)}`,
      {
        headers: {
          "x-extension-key": EXTENSION_KEY,
          "x-device-id": deviceId,
        },
      }
    )

    if (res.ok) {
      const data = await res.json()
      if (data.success && data.theme) {
        console.log("✅ Theme loaded from MongoDB:", key)
        // Cache it locally
        await new Promise(resolve => {
          chrome.storage.session.get([THEME_PAGE_MAP_KEY], sessionData => {
            const map = sessionData[THEME_PAGE_MAP_KEY] || {}
            map[key] = {
              name: data.theme,
              themeId: data.themeId,
              savedAt: new Date().toISOString(),
            }
            chrome.storage.session.set({ [THEME_PAGE_MAP_KEY]: map }, resolve)
          })
        })
        return { theme: { name: data.theme }, source: "mongodb" }
      }
    }
  } catch (err) {
    console.warn("⚠️ Failed to load theme from MongoDB:", err)
  }

  return { theme: null, source: "none" }
}

async function clearThemeMongo(pageKey) {
  const key = normalizePageKey(pageKey)
  if (!key) {
    return { success: false, source: "none", error: "Missing page key" }
  }

  await new Promise(resolve => {
    chrome.storage.session.get([THEME_PAGE_MAP_KEY], data => {
      const map = data[THEME_PAGE_MAP_KEY] || {}
      delete map[key]
      chrome.storage.session.set({ [THEME_PAGE_MAP_KEY]: map }, resolve)
    })
  })

  return { success: true, source: "session" }
}
