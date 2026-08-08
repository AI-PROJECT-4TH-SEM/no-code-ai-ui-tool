"use client"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import { useAuth } from "@/context/AuthContext"

export default function Settings() {
  const [user, setUser] = useState(null)
  const [loggedIn, setLoggedIn] = useState(null)
  const [sessions, setSessions] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const sessionsRef = useRef(null)
  const { accessToken, logout } = useAuth()
  const router = useRouter()

  function getInitials(name) {
    return name.split(" ").map(n => n[0]).join("").toUpperCase()
  }

  function formatJoinedDate(createdAt) {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(createdAt))
  }

  function formatSessionDate(createdAt) {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
    }).format(new Date(createdAt))
  }

  useEffect(() => {
    if (!accessToken) {
      const timeoutId = window.setTimeout(() => {
        setLoggedIn(false)
        setShowPopup(true)
      }, 0)

      return () => window.clearTimeout(timeoutId)
    }

    let isMounted = true

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        if (!res.ok) {
          if (isMounted) {
            setUser(null)
            setLoggedIn(false)
            setShowPopup(true)
          }
          return
        }
        const data = await res.json()
        if (isMounted) {
          if (data?.user) {
            setUser(data.user)
            setLoggedIn(true)
            setName(data.user.firstName + " " + data.user.lastName)
            setEmail(data.user.email)
          } else {
            setUser(null)
            setLoggedIn(false)
            setShowPopup(true)
          }
        }
      } catch {
        if (isMounted) {
          setUser(null)
          setLoggedIn(false)
          setShowPopup(true)
        }
      }
    }

    const loadSessions = async () => {
      try {
        const res = await fetch("/api/session", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        const data = await res.json()
        if (isMounted) {
          setSessions(data)
        }
      } catch {
        console.log("Failed to load sessions")
      }
    }

    fetchUser()
    loadSessions()

    return () => {
      isMounted = false
    }
  }, [accessToken])

  async function handleSave() {
    try {
      const firstName = name.split(" ")[0]
      const lastName = name.split(" ").slice(1).join(" ")
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ firstName, lastName, email }),
      })
      const data = await res.json()
      if (res.ok) {
        alert("Profile updated ")
        setUser(data.user)
        setName(data.user.firstName + " " + data.user.lastName)
        setEmail(data.user.email)
      } else {
        alert(data.error || "Update failed ")
      }
    } catch {
      alert("Update failed ")
    }
  }

  async function deleteSession(e, id) {
    e.stopPropagation()
    try {
      await fetch(`/api/session/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      setSessions(prev => prev.filter(s => s._id !== id))
    } catch {
      console.log("Delete failed")
    }
  }

  const scrollSessions = (direction) => {
    const el = sessionsRef.current
    if (!el) return
    el.scrollBy({ top: direction === 'up' ? -150 : 150, behavior: 'smooth' })
  }

  return (
    <div
      className="flex flex-col min-h-screen text-white relative"
      style={{
        backgroundImage: "url('/settings-2-bg.avif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/80 z-0" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <div className="max-w-4xl mx-auto w-full px-4 md:px-8 py-8 md:py-12">

          <div className="mb-8 md:mb-10">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-gray-500 mt-1">Manage your account and preferences</p>
          </div>

          {loggedIn && user && (
            <div className="flex flex-col md:grid md:grid-cols-[1fr_1.5fr] gap-6">

              {/* LEFT */}
              <div className="flex flex-col gap-6">

                {/* PROFILE */}
                <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="flex flex-col items-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-2xl font-bold">
                      {getInitials(name)}
                    </div>
                    <div className="text-center">
                      <h2 className="text-lg font-semibold">{name}</h2>
                      <p className="text-gray-500 text-sm">{email}</p>
                      <p className="text-gray-600 text-xs mt-1">
                        Joined {formatJoinedDate(user.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                    <p className="text-2xl font-bold text-pink-400">{user.totalAnalyses || 0}</p>
                    <p className="text-gray-500 text-xs mt-1">Total Analyses</p>
                  </div>
                </div>

                {/* EDIT */}
                <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <h3 className="text-base font-semibold mb-4">Edit Profile</h3>
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl text-white p-3 text-sm outline-none focus:border-pink-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Email</label>
                      <input
                        type="email"
                        value={email}
                        disabled
                        className="w-full bg-white/5 border border-white/10 rounded-xl text-gray-500 p-3 text-sm cursor-not-allowed"
                      />
                    </div>
                    <button
                      onClick={handleSave}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-medium hover:opacity-90 mt-2"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    logout()
                    setUser(null)
                    setLoggedIn(false)
                    setShowPopup(true)
                    router.push("/login")
                  }}
                  className="w-full py-4 rounded-2xl border border-white/10 text-gray-400 hover:border-pink-400 hover:text-pink-400"
                >
                  Log Out
                </button>
              </div>

              <div className="flex flex-col gap-6">
                <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex-1">

                  <div className="flex items-center justify-between mb-3">
               <h3 className="text-base font-semibold">Past Sessions</h3>

             <span className="text-xs text-gray-600 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                      {sessions.length} sessions
          </span>
                </div>

                  {sessions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                      <p className="text-gray-600 text-sm">No sessions yet</p>
                      <button
                        onClick={() => router.push("/")}
                        className="text-xs text-pink-400 hover:text-pink-300 transition"
                      >
                        Start analysing →
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      
                      <div ref={sessionsRef} className="flex flex-col gap-2 max-h-[640px] overflow-y-auto pr-1">
                        {sessions.map((session) => (
                          <div
                            key={session._id}
                            onClick={() => router.push(`/results?sessionId=${session._id}`)}
                            className="bg-white/5 border border-white/10 rounded-xl p-3 text-sm flex items-center justify-between group cursor-pointer hover:border-pink-400 transition"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium truncate">{session.label}</p>
                              <p className="text-gray-500 text-xs mt-1">
                                {formatSessionDate(session.createdAt)}
                              </p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className="text-xs text-gray-500 group-hover:text-pink-400 transition">
                                view →
                              </span>
                              <span
                                onClick={(e) => deleteSession(e, session._id)}
                                className="text-xs text-red-500 hover:text-red-400 cursor-pointer opacity-0 group-hover:opacity-100 transition"
                              >
                                delete ✕
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>
          )}

        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-[#1a1a1a] border border-yellow-400/40 rounded-2xl p-6 w-[320px] text-center">
            <h2 className="text-lg font-semibold text-yellow-400 mb-2">Login Required</h2>
            <p className="text-gray-400 text-sm mb-6">Please login to access settings</p>
            <button
              onClick={() => { setShowPopup(false); router.push("/login") }}
              className="px-6 py-2 rounded-full bg-yellow-400 text-black"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  )
}