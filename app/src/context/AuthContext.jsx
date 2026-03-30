"use client"
import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // On app load, try to get a new accessToken using the httpOnly refresh cookie
 useEffect(() => {
  async function tryRefresh() {
    try {
      const res = await fetch("/api/refresh", { 
        method: "GET", 
        credentials: "include",
        // add cache hint
        headers: { "Cache-Control": "no-cache" }
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
      credentials: "include", // important — lets the httpOnly cookie be set
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