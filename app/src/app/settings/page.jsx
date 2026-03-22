"use client"
import { useState, useEffect } from "react"
import Navbar from "@/components/Navbar"

export default function Settings() {
  const [user, setUser] = useState(null)
  const [loggedIn, setLoggedIn] = useState(null)
  const [history, setHistory] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  function getInitials(name) {
    return name.split(" ").map(n => n[0]).join("").toUpperCase()
  }

  useEffect(() => {
    const token = localStorage.getItem("accessToken")

    if (!token) {
      setLoggedIn(false)
      setShowPopup(true)
      return
    }

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) {
          setLoggedIn(false)
          setShowPopup(true)
          return
        }

        const data = await res.json()

        if (data?.user) {
          setUser(data.user)
          setLoggedIn(true)

          // ✅ SET INPUT VALUES
          setName(data.user.firstName + " " + data.user.lastName)
          setEmail(data.user.email)
        } else {
          setLoggedIn(false)
          setShowPopup(true)
        }
      } catch (err) {
        setLoggedIn(false)
        setShowPopup(true)
      }
    }

    const loadHistory = async () => {
      try {
        const res = await fetch("/api/history")
        const data = await res.json()
        setHistory(data)
      } catch {
        console.log("Failed to load history")
      }
    }

    fetchUser()
    loadHistory()
  }, [])


 async function handleSave() {
  try {
    const token = localStorage.getItem("accessToken")

    const firstName = name.split(" ")[0]
    const lastName = name.split(" ").slice(1).join(" ")

    const res = await fetch("/api/user", {
      method: "PATCH", // ✅ USE PATCH (not POST)
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email // optional (you can remove later)
      }),
    })

    const data = await res.json()

    if (res.ok) {
      alert("Profile updated ✅")

      // update UI instantly
      setUser(data.user)
      setName(data.user.firstName + " " + data.user.lastName)
      setEmail(data.user.email)

    } else {
      alert(data.error || "Update failed ❌")
    }

  } catch (err) {
    alert("Update failed ❌")
  }
}
 
async function deleteHistory(id) {
  try {
    await fetch(`/api/history/${id}`, {
      method: "DELETE",
    })

    setHistory(prev => prev.filter(item => item._id !== id))
  } catch {
    console.log("Delete failed")
  }
}
async function clearAllHistory() {
  try {
    await fetch("/api/history", {
      method: "DELETE",
    })

    setHistory([])
  } catch {
    console.log("Clear failed")
  }
}

  return (
    <div
      className="flex flex-col min-h-screen text-white relative"
      style={{
        backgroundImage: "url('/settings-2-bg.avif')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-black/80 z-0"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <div className="max-w-4xl mx-auto w-full px-8 py-12">

          <div className="mb-10">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-gray-500 mt-1">Manage your account and preferences</p>
          </div>

          {loggedIn && user && (
            <div className="grid grid-cols-[1fr_1.5fr] gap-6">

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
                        Joined {new Date(user.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' })}
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

                {/* LOGOUT */}
                <button
                  onClick={() => {
                    localStorage.removeItem("accessToken")
                    setUser(null)
                    setLoggedIn(false)
                    setShowPopup(true)
                  }}
                  className="w-full py-4 rounded-2xl border border-white/10 text-gray-400 hover:border-pink-400 hover:text-pink-400"
                >
                  Log Out
                </button>
              </div>

              {/* RIGHT */}
              <div className="flex flex-col gap-6">

                <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex-1">

                  <div className="flex items-center justify-between mb-4">
  <h3 className="text-base font-semibold">Recent History</h3>

  {history.length > 0 && (
    <button
      onClick={clearAllHistory}
      className="text-xs text-red-400 hover:text-red-300"
    >
      Clear all
    </button>
  )}
</div>

                  {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                      <p className="text-gray-600 text-sm">No history yet</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {history.map((item) => (
  <div
    key={item._id}
    className="bg-white/5 border border-white/10 rounded-xl p-3 text-sm flex items-center justify-between group"
  >
    {/* LEFT */}
    <div className="flex-1">
      <p>{item.label}</p>
      <p className="text-gray-500 text-xs mt-1">
        {new Date(item.createdAt).toLocaleString()}
      </p>
    </div>

    {/* RIGHT ACTIONS */}
    <div className="flex items-center gap-3">

      <span
        onClick={() => deleteHistory(item._id)}
        className="text-xs text-red-500 hover:text-red-400 cursor-pointer opacity-0 group-hover:opacity-100 transition"
      >
        delete ✕
      </span>

    </div>
  </div>
))}
                    </div>
                  )}

                </div>

              </div>

            </div>
          )}

        </div>
      </div>

      {/* POPUP */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-[#1a1a1a] border border-yellow-400/40 rounded-2xl p-6 w-[320px] text-center">
            <h2 className="text-lg font-semibold text-yellow-400 mb-2">
              Login Required
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Please login to access settings
            </p>
            <button
              onClick={() => setShowPopup(false)}
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