"use client"
import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/context/AuthContext"

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const { isLoggedIn, loading } = useAuth()

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const navigate = (path) => {
    router.push(path)
    setMenuOpen(false)
  }

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Themes", path: "/themes" },
    { label: "Settings", path: "/settings" },
  ]

  const authPages = ["/login", "/signup"]
  if (authPages.includes(pathname)) return null

  // Don't flash login/signup while checking auth
  if (loading) return (
    <nav className="flex items-center justify-between px-6 md:px-10 py-5 md:py-7 border-b border-gray-800 bg-gradient-to-l from-cyan-900 to-black relative z-50">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
        <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent">
          UI Theme Lab
        </span>
      </div>
    </nav>
  )

  return (
    <nav className="flex items-center justify-between px-6 md:px-10 py-5 md:py-7 border-b border-gray-800 bg-gradient-to-l from-cyan-900 to-black relative z-50">

      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
        <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent">
          UI Theme Lab
        </span>
      </div>

      {/* DESKTOP RIGHT */}
      <div className="hidden md:flex items-center gap-4">
        {pathname !== "/" && (
          <button onClick={() => navigate("/")} className="px-6 py-3 rounded-xl text-base text-gray-300 hover:text-white hover:bg-white/5 transition">
            Home
          </button>
        )}
        <button onClick={() => navigate("/themes")} className={`px-6 py-3 rounded-xl text-base font-medium transition ${pathname === "/themes" ? "text-white bg-white/10" : "text-gray-300 hover:text-white hover:bg-white/5"}`}>
          Themes
        </button>
        <button onClick={() => navigate("/settings")} className={`px-6 py-3 rounded-xl text-base font-medium transition ${pathname === "/settings" ? "text-white bg-white/10" : "text-gray-300 hover:text-white hover:bg-white/5"}`}>
          Settings
        </button>

        {!isLoggedIn && (
          <>
            <div className="w-px h-8 bg-gray-700 mx-2" />
            <button onClick={() => navigate("/login")} className="px-6 py-3 rounded-xl text-base font-medium border-2 border-gray-600 text-gray-300 hover:border-pink-400 hover:text-pink-400 transition">
              Login
            </button>
            <button onClick={() => navigate("/signup")} className="px-7 py-3 rounded-xl text-base font-semibold bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90 hover:scale-105 transition">
              Sign Up
            </button>
          </>
        )}
      </div>

      {/* MOBILE RIGHT */}
      <div className="flex md:hidden items-center gap-2" ref={menuRef}>
        {!isLoggedIn && (
          <>
            <button onClick={() => navigate("/login")} className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-600 text-gray-300 hover:border-pink-400 hover:text-pink-400 transition">
              Login
            </button>
            <button onClick={() => navigate("/signup")} className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90 transition">
              Sign Up
            </button>
          </>
        )}

        <button onClick={() => setMenuOpen((prev) => !prev)} className="ml-1 p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition" aria-label="Toggle menu">
          {menuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {menuOpen && (
          <div className="absolute top-full right-4 mt-2 w-52 rounded-xl border border-gray-700 bg-gray-900/95 backdrop-blur-md shadow-xl overflow-hidden">
            {navLinks.map(({ label, path }) => {
              if (label === "Home" && pathname === "/") return null
              return (
                <button key={path} onClick={() => navigate(path)} className={`w-full text-left px-5 py-3.5 text-sm font-medium transition ${pathname === path ? "text-white bg-white/10" : "text-gray-300 hover:text-white hover:bg-white/5"}`}>
                  {label}
                </button>
              )
            })}
          </div>
        )}
      </div>

    </nav>
  )
}