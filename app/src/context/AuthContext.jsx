"use client"
import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function tryRefresh() {
      const hasRefreshToken = document.cookie
        .split(";")
        .some((cookie) => cookie.trim().startsWith("refreshToken="))

      if (!hasRefreshToken) {
        setAccessToken(null)
        setLoading(false)
        return
      }

      try {
        const res = await fetch("/api/refresh", {
          method: "GET",
          credentials: "include",
          headers: { "Cache-Control": "no-cache" },
        })
        const data = await res.json()
        if (res.ok) {
          setAccessToken(data.accessToken)
        } else {
          setAccessToken(null)
        }
      } catch {
        setAccessToken(null)
      } finally {
        setLoading(false)
      }
    }

    tryRefresh()
  }, [])
  async function login(email, password) {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (res.ok) {
      setAccessToken(data.accessToken)
      return { ok: true }
    }
    return { ok: false, error: data.error }
  }

  async function logout() {
    try {
      await fetch("/api/logout", { method: "POST", credentials: "include" })
    } catch {}
    setAccessToken(null)
  }

  return (
    <AuthContext.Provider value={{ accessToken, isLoggedIn: !!accessToken, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}