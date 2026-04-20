"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { themes } from "@/lib/themes.js"
import Navbar from "@/components/Navbar"

export default function Themes() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("sessionId")

  // ✅ LOAD THEME (MongoDB → local fallback)
  useEffect(() => {
    async function loadTheme() {
      const token = localStorage.getItem("token")

      // 🔥 Try MongoDB first
      if (token) {
        try {
          const res = await fetch("/api/theme", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          const data = await res.json()

          if (data?.theme) {
            document.documentElement.className = data.theme
            localStorage.setItem("themeClass", data.theme)
            return
          }
        } catch (err) {
          console.error("MongoDB load failed:", err)
        }
      }

      // ⚡ fallback
      const saved = localStorage.getItem("themeClass")
      if (saved) {
        document.documentElement.className = saved
      }
    }

    loadTheme()
  }, [])

  // ✅ 3D EFFECT
  function handleMouseMove(e) {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const rotateX = ((y / rect.height) - 0.5) * 10
    const rotateY = ((x / rect.width) - 0.5) * -10

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`
  }

  function handleMouseLeave(e) {
    e.currentTarget.style.transform =
      "perspective(800px) rotateX(0) rotateY(0) scale(1)"
  }

  // ✅ APPLY + SAVE THEME (MongoDB + local)
  async function handleSelect(theme) {
    console.log("CLICKED:", theme)

    // 🔥 apply instantly
    document.documentElement.className = theme.class
    localStorage.setItem("themeClass", theme.class)

    const token = localStorage.getItem("token")
    console.log("TOKEN:", token)

    // 🔥 save to MongoDB
    if (token) {
      try {
        const res = await fetch("/api/theme", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ themeName: theme.class }),
        })

        const data = await res.json()
        console.log("API RESPONSE:", data)
      } catch (err) {
        console.error("MongoDB save failed:", err)
      }
    } else {
      console.warn("No token → only localStorage used")
    }

    // 🔥 navigate
    router.push(
      `/results?sessionId=${sessionId}&theme=${encodeURIComponent(theme.name)}`
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] transition-all duration-300">

      <Navbar />

      {/* GRID */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {themes.map((theme) => (
            <div
              key={theme.name}
              onClick={() => handleSelect(theme)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="card cursor-pointer"
            >
              <div className="h-24 mb-4 flex items-center justify-center opacity-70">
                Preview
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{theme.name}</span>
                <span className="text-xs text-[var(--primary)]">
                  Apply →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* THEME ENGINE */}
      <style jsx global>{`
        :root {
          --bg: #0f172a;
          --text: #ffffff;
          --primary: #7c3aed;
          --card: rgba(255,255,255,0.05);
          --border: rgba(255,255,255,0.1);
          --radius: 16px;
          --font-weight: 400;
          --font-style: normal;
        }

        .theme-cyberpunk {
          --bg: radial-gradient(circle at top, #0a0015, #000);
          --text: #00f0ff;
          --primary: #ff00ff;
          --card: rgba(255, 0, 255, 0.08);
          --border: rgba(0, 255, 255, 0.3);
          --font-weight: 600;
          --font-style: italic;
        }

        .theme-glass .card {
          backdrop-filter: blur(20px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }

        .theme-electric .card {
          box-shadow: 0 0 20px #facc15;
        }

        .theme-matrix {
          text-shadow: 0 0 5px #00ff00;
          font-style: italic;
        }

        body {
          background: var(--bg);
          color: var(--text);
          font-weight: var(--font-weight);
          font-style: var(--font-style);
          transition: all 0.4s ease;
        }

        .card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 16px;
          transition: all 0.3s ease;
          transform-style: preserve-3d;
          pointer-events: auto;
        }

        .card:hover {
          transform: translateY(-8px) scale(1.05);
        }
      `}</style>
    </div>
  )
}