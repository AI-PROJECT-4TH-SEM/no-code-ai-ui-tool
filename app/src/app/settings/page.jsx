"use client"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"

export default function Settings() {
  const router = useRouter()

  // TODO: replace with real user data from backend
  const user = {
    name: "John Doe",
    email: "john@example.com",
    joinedDate: "March 2026",
    totalAnalyses: 12,
  }

  // TODO: replace with real history from MongoDB
  const history = []

  function getInitials(name) {
    return name.split(" ").map(n => n[0]).join("").toUpperCase()
  }

  return (
    <div
      className="flex flex-col min-h-screen text-white relative"
      style={{ backgroundImage: "url('/settings-2-bg.avif')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}
    >
      {/* dark overlay */}
      <div className="absolute inset-0 bg-black/80 z-0"></div>

      <div className="relative z-10 flex flex-col min-h-screen">

        <Navbar />

        <div className="max-w-4xl mx-auto w-full px-8 py-12">

          {/* PAGE TITLE */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-gray-500 mt-1">Manage your account and preferences</p>
          </div>

          <div className="grid grid-cols-[1fr_1.5fr] gap-6">

            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-6">

              {/* PROFILE CARD */}
              <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">

                {/* AVATAR */}
                <div className="flex flex-col items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-2xl font-bold">
                    {getInitials(user.name)}
                  </div>
                  <div className="text-center">
                    <h2 className="text-lg font-semibold">{user.name}</h2>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                    <p className="text-gray-600 text-xs mt-1">Joined {user.joinedDate}</p>
                  </div>
                </div>

                {/* STATS */}
                <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                  <p className="text-2xl font-bold text-pink-400">{user.totalAnalyses}</p>
                  <p className="text-gray-500 text-xs mt-1">Total Analyses</p>
                </div>

              </div>

              {/* EDIT PROFILE */}
              <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-base font-semibold mb-4">Edit Profile</h3>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Full Name</label>
                    <input
                      type="text"
                      defaultValue={user.name}
                      className="w-full bg-white/5 border border-white/10 rounded-xl text-white p-3 text-sm outline-none focus:border-pink-400 transition"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Email</label>
                    <input
                      type="email"
                      defaultValue={user.email}
                      className="w-full bg-white/5 border border-white/10 rounded-xl text-white p-3 text-sm outline-none focus:border-pink-400 transition"
                    />
                  </div>
                  <button className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-medium hover:opacity-90 transition mt-2">
                    Save Changes
                  </button>
                </div>
              </div>

              {/* LOGOUT */}
              <button
                onClick={() => router.push("/login")}
                className="w-full py-4 rounded-2xl border border-white/10 text-gray-400 hover:border-pink-400 hover:text-pink-400 transition font-medium bg-black/20 backdrop-blur-sm"
              >
                Log Out
              </button>

            </div>

            {/* RIGHT COLUMN - HISTORY */}
            <div className="flex flex-col gap-6">

              <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold">Recent History</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-600 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                      {history.length} total
                    </span>
                    {history.length > 0 && (
                      <button
                        onClick={() => {
                          localStorage.removeItem("history")
                          window.location.reload()
                        }}
                        className="text-xs text-red-400 hover:text-red-300 transition"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                </div>

                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                    <span className="text-5xl opacity-10">📋</span>
                    <p className="text-gray-600 text-sm">No history yet</p>
                    <p className="text-gray-700 text-xs">Start analysing websites to see history here</p>
                    <button
                      onClick={() => router.push("/")}
                      className="mt-2 px-6 py-2 rounded-xl border border-white/10 text-gray-400 hover:border-pink-400 hover:text-pink-400 transition text-sm"
                    >
                      Start Analysing →
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {history.map((item, i) => (
                      <div
                        key={i}
                        className="bg-white/5 border border-white/10 rounded-xl p-4 cursor-pointer hover:border-pink-400 transition group"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-white text-sm font-medium">{item.label}</p>
                          <span className="text-xs text-gray-600 group-hover:text-pink-400 transition">
                            view →
                          </span>
                        </div>
                        <p className="text-gray-600 text-xs mt-1">{item.date}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  )
}