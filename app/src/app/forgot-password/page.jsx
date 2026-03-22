"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [password, setPassword] = useState("")
  const [step, setStep] = useState(1)
  const [message, setMessage] = useState("")
  const [timer, setTimer] = useState(0)
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  // 🔥 SEND OTP
  async function sendOtp() {
    if (!email) {
      setMessage("Enter email ❌")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // ✅ FIXED
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage(data.error || "Failed to send OTP ❌")
        return
      }

      setStep(2)
      setMessage("OTP sent to your email 📩")

      // ⏱️ timer
      setTimer(30)
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)

    } catch {
      setMessage("Server error ❌")
    }

    setLoading(false)
  }

  // 🔥 RESET PASSWORD
  async function resetPassword() {
    if (!otp || !password) {
      setMessage("Fill all fields ❌")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage("Password updated ✅")

        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        setMessage(data.error || "Reset failed ❌")
      }

    } catch {
      setMessage("Server error ❌")
    }

    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">

      <div className="p-6 bg-white/5 border border-white/10 rounded-xl w-[350px] backdrop-blur">

        <h1 className="text-lg font-semibold mb-4 text-center">
          Forgot Password
        </h1>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-3 rounded-xl bg-white/5 border border-white/10 outline-none"
            />

            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 mb-3 rounded-xl bg-white/5 border border-white/10"
            />

            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-3 rounded-xl bg-white/5 border border-white/10"
            />

            <button
              onClick={resetPassword}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600"
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>

            {/* 🔁 RESEND */}
            <button
              onClick={sendOtp}
              disabled={timer > 0}
              className="text-xs text-gray-400 hover:text-pink-400 mt-3"
            >
              {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
            </button>
          </>
        )}

        {/* MESSAGE */}
        {message && (
          <p className="mt-4 text-sm text-center text-gray-400">
            {message}
          </p>
        )}

        {/* BACK TO LOGIN */}
        <p
          onClick={() => router.push("/login")}
          className="text-xs text-center mt-6 text-gray-500 hover:text-pink-400 cursor-pointer"
        >
          ← Back to Login
        </p>

      </div>
    </div>
  )
}