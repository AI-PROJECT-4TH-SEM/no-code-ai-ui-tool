"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"

export default function ResetPassword() {
  const { token } = useParams()
  const router = useRouter()

  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
const [confirm, setConfirm] = useState("")
  async function handleReset() {
    if (!password) {
      setMessage("Enter new password")
      return
    }

    if (password !== confirm) {
  setMessage("Passwords do not match ❌")
  return
}

    setLoading(true)
    setMessage("")

    try {
      const res = await fetch(`/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage("Password updated successfully ✅")

        // redirect to login after 2 sec
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        setMessage(data.error || "Something went wrong ❌")
      }

    } catch (err) {
      setMessage("Server error ❌")
    }

    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 w-[350px] backdrop-blur">

        <h1 className="text-xl font-semibold mb-4 text-center">
          Reset Password
        </h1>

        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-xl bg-white/5 border border-white/10 outline-none mb-4"
        />

        <input
  type="password"
  placeholder="Confirm password"
  value={confirm}
  onChange={(e) => setConfirm(e.target.value)}
  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 outline-none mb-4"
/>

        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

        {message && (
          <p className="text-sm text-center mt-4 text-gray-400">
            {message}
          </p>
        )}

      </div>
    </div>
  )
}