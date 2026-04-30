/**
 * Extension Session Manager
 * Handles automatic chat history storage and restoration
 * Auto-saves on every change, auto-loads on page return
 */

class ExtensionSessionManager {
  constructor() {
    this.currentSessionId = null
    this.currentUrl = ""
    this.autosaveInterval = null
    this.sessionCache = new Map()
  }

  /**
   * Initialize session for current URL/tab
   * Auto-loads previous session if available
   */
  async initSession(url, existingSessionId = null) {
    this.currentUrl = url

    try {
      // Try to load existing session first
      if (existingSessionId) {
        const existing = await this.loadSession(existingSessionId)
        if (existing?.sessionId) {
          this.currentSessionId = existing.sessionId
          console.log("✅ Restored existing session:", this.currentSessionId)
          return existing
        }
      }

      // Auto-load last session for this URL
      const autoLoaded = await this.loadSessionByUrl(url)
      if (autoLoaded?.sessionId) {
        this.currentSessionId = autoLoaded.sessionId
        console.log("🔄 Auto-loaded previous session for URL:", this.currentSessionId)
        return autoLoaded
      }

      // Create new session
      const newSessionId = this.generateSessionId()
      this.currentSessionId = newSessionId
      console.log("✨ Created new session:", newSessionId)
      return {
        sessionId: newSessionId,
        pageUrl: url,
        messages: [],
        isNew: true,
      }
    } catch (err) {
      console.error("❌ Session init failed:", err)
      return { sessionId: null, messages: [] }
    }
  }

  /**
   * Load session by ID
   */
  async loadSession(sessionId) {
    if (!sessionId) return null

    // Check cache first
    if (this.sessionCache.has(sessionId)) {
      console.log("📦 Session cache hit:", sessionId)
      return this.sessionCache.get(sessionId)
    }

    try {
      const resp = await fetch(
        `${window.location.origin}/api/extension-chat?sessionId=${sessionId}&action=load`
      )
      const data = await resp.json()

      if (data.success) {
        this.sessionCache.set(sessionId, data)
        return data
      }
      return null
    } catch (err) {
      console.error("❌ Load session failed:", err)
      return null
    }
  }

  /**
   * Auto-load last session for URL
   */
  async loadSessionByUrl(url) {
    if (!url) return null

    try {
      const resp = await fetch(
        `${window.location.origin}/api/extension-chat?url=${encodeURIComponent(url)}&action=load`
      )
      const data = await resp.json()

      if (data.success && data.sessionId) {
        this.sessionCache.set(data.sessionId, data)
        return data
      }
      return null
    } catch (err) {
      console.error("❌ Load session by URL failed:", err)
      return null
    }
  }

  /**
   * Send message and auto-save
   */
  async sendMessage(instruction, selectedElement = null) {
    if (!this.currentSessionId || !instruction) return null

    try {
      const resp = await fetch(`${window.location.origin}/api/extension-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: this.currentSessionId,
          instruction,
          url: this.currentUrl,
          selectedElement,
        }),
      })

      const data = await resp.json()

      if (data.success) {
        this.currentSessionId = data.sessionId
        this.sessionCache.set(data.sessionId, data)
        console.log("✅ Message saved to session:", this.currentSessionId)
        return data
      }

      throw new Error(data.error || "Send message failed")
    } catch (err) {
      console.error("❌ Send message failed:", err)
      return null
    }
  }

  /**
   * Get all sessions for current URL
   */
  async listSessionsForUrl(url = this.currentUrl) {
    if (!url) return []

    try {
      const resp = await fetch(
        `${window.location.origin}/api/extension-chat?url=${encodeURIComponent(url)}&action=list`
      )
      const data = await resp.json()
      return data.success ? data.sessions : []
    } catch (err) {
      console.error("❌ List sessions failed:", err)
      return []
    }
  }

  /**
   * Get current session ID
   */
  getCurrentSessionId() {
    return this.currentSessionId
  }

  /**
   * Generate unique session ID
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Clear cache for memory efficiency
   */
  clearCache() {
    this.sessionCache.clear()
    console.log("🗑️ Session cache cleared")
  }
}

// Export singleton instance
export const sessionManager = new ExtensionSessionManager()
