"use client"
import { useRouter, usePathname } from "next/navigation"

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <nav className="flex items-center justify-between px-10 py-7 border-b border-gray-800 bg-gradient-to-l from-cyan-900 to-black">

      {/* LEFT - logo */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
        <span className="text-pink-400 text-3xl">✦</span>
        <span className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent">
          UI Theme Lab
        </span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {pathname !== "/" && (
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 rounded-xl text-base text-gray-300 hover:text-white hover:bg-white/5 transition"
          >
            Home
          </button>
        )}
        <button
          onClick={() => router.push("/themes")}
          className={`px-6 py-3 rounded-xl text-base font-medium transition ${
            pathname === "/themes"
              ? "text-white bg-white/10"
              : "text-gray-300 hover:text-white hover:bg-white/5"
          }`}
        >
          Themes
        </button>
        <button
          onClick={() => router.push("/settings")}
          className={`px-6 py-3 rounded-xl text-base font-medium transition ${
            pathname === "/settings"
              ? "text-white bg-white/10"
              : "text-gray-300 hover:text-white hover:bg-white/5"
          }`}
        >
          Settings
        </button>
        <div className="w-px h-8 bg-gray-700 mx-2"></div>
        <button
          onClick={() => router.push("/login")}
          className="px-6 py-3 rounded-xl text-base font-medium border-2 border-gray-600 text-gray-300 hover:border-pink-400 hover:text-pink-400 transition"
        >
          Login
        </button>
        <button
          onClick={() => router.push("/signup")}
          className="px-7 py-3 rounded-xl text-base font-semibold bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90 hover:scale-105 transition"
        >
          Sign Up ✦
        </button>
      </div>

    </nav>
  )
}