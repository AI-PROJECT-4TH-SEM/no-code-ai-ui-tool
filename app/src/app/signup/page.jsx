"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Signup() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSignup(e) {
  e.preventDefault();
  if (password !== confirmPassword) { alert("Passwords don't match"); return; }
  setLoading(true);

  try {
    const res = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify({ firstName, lastName, email, password }),
    });
    const data = await res.json();
    if (res.ok) router.push("/login");
    else alert(data.error);
  } catch {
    alert("Signup failed");
  } finally { setLoading(false); }
}

  return (
    <div className="min-h-screen flex bg-[#080810] text-white">

      {/* LEFT - image side */}
      <div className="w-1/2 relative overflow-hidden">

        {/* background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/login-bg.jpg')" }}
        ></div>

        {/* dark overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* top left logo */}
        {/* <div className="absolute top-8 left-8 flex items-center gap-2 z-10">
          <span className="text-pink-400 text-xl">✦</span>
          <span className="text-lg font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
            UI Theme Lab
          </span>
        </div> */}

        {/* top right back button */}
        <button
          onClick={() => router.push("/")}
          className="absolute top-8 right-8 z-10 text-gray-400 hover:text-white transition text-sm border border-gray-700 hover:border-gray-500 px-4 py-2 rounded-lg"
        >
          Back to website →
        </button>

        {/* bottom text */}
        <div className="absolute bottom-12 left-8 right-8 z-10">
          <h2 className="text-3xl font-bold text-white leading-tight mb-2">
            Start Transforming
            <br />
            <span className="bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
              Your Websites Today
            </span>
          </h2>
          <p className="text-gray-400 text-sm">
            Join thousands of designers using AI to improve their UI
          </p>
          <div className="flex gap-2 mt-6">
            <div className="w-2 h-1 rounded-full bg-gray-600"></div>
            <div className="w-2 h-1 rounded-full bg-gray-600"></div>
            <div className="w-8 h-1 rounded-full bg-pink-400"></div>
          </div>
        </div>

      </div>

      {/* RIGHT - form side */}
      <div className="w-1/2 flex items-center justify-center px-16 bg-[#0d0d18]">
        <div className="w-full max-w-md">

          <h1 className="text-3xl font-bold text-white mb-2">Create an account</h1>
          <p className="text-gray-500 text-sm mb-8">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/login")}
              className="text-pink-400 hover:text-pink-300 transition"
            >
              Sign in
            </button>
          </p>

          <form onSubmit={handleSignup} className="flex flex-col gap-4">

            {/* NAME ROW */}
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full bg-[#1a1a2e] border border-gray-700 rounded-xl text-white p-4 text-sm outline-none focus:border-pink-400 transition placeholder-gray-600"
              />
              <input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full bg-[#1a1a2e] border border-gray-700 rounded-xl text-white p-4 text-sm outline-none focus:border-pink-400 transition placeholder-gray-600"
              />
            </div>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#1a1a2e] border border-gray-700 rounded-xl text-white p-4 text-sm outline-none focus:border-pink-400 transition placeholder-gray-600"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#1a1a2e] border border-gray-700 rounded-xl text-white p-4 text-sm outline-none focus:border-pink-400 transition placeholder-gray-600 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition text-xs"
              >
                {showPassword ? "hide" : "show"}
              </button>
            </div>

            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full bg-[#1a1a2e] border border-gray-700 rounded-xl text-white p-4 text-sm outline-none focus:border-pink-400 transition placeholder-gray-600"
            />

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" required className="accent-pink-500" />
              <span className="text-gray-500 text-xs">
                I agree to the{" "}
                <span className="text-pink-400 hover:text-pink-300 cursor-pointer">
                  Terms & Conditions
                </span>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-sm hover:opacity-90 hover:scale-[1.02] transition disabled:opacity-50 disabled:scale-100 shadow-lg shadow-pink-500/20 mt-2"
            >
              {loading ? "Creating account..." : "Create Account "}
            </button>

          </form>

        </div>
      </div>

    </div>
  )
}