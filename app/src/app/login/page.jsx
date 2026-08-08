"use client"
import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectBack = searchParams.get("redirectBack")
  const { login } = useAuth()

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    const result = await login(email, password)
    if (result.ok) {
      if (window.opener && window.opener.postMessage) {
        try {
          window.opener.postMessage({ type: "EXTENSION_LOGIN_SUCCESS" }, "*")
        } catch {
          // ignore
        }
        window.open("/", "_blank")
        window.close()
        return
      }
      if (redirectBack) {
        window.location.href = redirectBack
      } else {
        router.push("/")
      }
    } else {
      alert(result.error)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex bg-[#080810] text-white">

      <div className="hidden md:block md:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/login-bg.jpg')" }} />
        <div className="absolute inset-0 bg-black/50" />
        <button onClick={() => router.push("/")} className="absolute top-8 right-8 z-10 text-gray-400 hover:text-white transition text-sm border border-gray-700 hover:border-gray-500 px-4 py-2 rounded-lg">
          Back to website →
        </button>
        <div className="absolute bottom-12 left-8 right-8 z-10">
          <h2 className="text-3xl font-bold text-white leading-tight mb-2">
            Transform Your UI,<br />
            <span className="bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">Powered by AI</span>
          </h2>
          <p className="text-gray-400 text-sm">Analyse, theme, and improve any website in seconds</p>
          <div className="flex gap-2 mt-6">
            <div className="w-8 h-1 rounded-full bg-pink-400" />
            <div className="w-2 h-1 rounded-full bg-gray-600" />
            <div className="w-2 h-1 rounded-full bg-gray-600" />
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center px-6 md:px-16 bg-[#0d0d18]">
        <div className="w-full max-w-md">
          <button onClick={() => router.push("/")} className="mb-6 text-gray-500 hover:text-white transition text-sm flex items-center gap-1 md:hidden">
            ← Back to website
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-gray-500 text-sm mb-8">
            Don&apos;t have an account?{" "}
            <button onClick={() => router.push("/signup")} className="text-pink-400 hover:text-pink-300 transition">Sign up free</button>
          </p>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-[#1a1a2e] border border-gray-700 rounded-xl text-white p-4 text-sm outline-none focus:border-pink-400 transition placeholder-gray-600" />
            <div className="relative">
              <input type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-[#1a1a2e] border border-gray-700 rounded-xl text-white p-4 text-sm outline-none focus:border-pink-400 transition placeholder-gray-600 pr-12" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition text-xs">
                {showPassword ? "hide" : "show"}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-pink-500" />
                <span className="text-gray-500 text-xs">Remember me</span>
              </label>
              <button type="button" onClick={() => router.push("/forgot-password")} className="text-xs text-gray-500 hover:text-pink-400 transition">
                Forgot password?
              </button>
            </div>
            <button type="submit" disabled={loading} className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-sm hover:opacity-90 hover:scale-[1.02] transition disabled:opacity-50 disabled:scale-100 shadow-lg shadow-pink-500/20 mt-2">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>

    </div>
  )
}

export default function Login() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#080810] text-white">Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}