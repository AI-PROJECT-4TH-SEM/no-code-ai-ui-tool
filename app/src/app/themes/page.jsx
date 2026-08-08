"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { themes } from "@/lib/themes.js"
import { themeManager } from "@/lib/themeManager"
import Navbar from "@/components/Navbar"
import { useAuth } from "@/context/AuthContext"

export default function Themes() {
  const router = useRouter()
  const { accessToken } = useAuth()
  const sessionId = useMemo(() => {
    if (typeof window === "undefined") return null
    return new URLSearchParams(window.location.search).get("sessionId") || null
  }, [])
  const availableThemes = useMemo(() => themes.slice(0, 12), [])

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

  async function handleSelect(theme) {
    themeManager.saveActiveTheme(theme)

    if (accessToken) {
      try {
        await fetch("/api/theme", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ themeName: theme.name }),
        })
      } catch {
        // Silent fallback: local theme selection still works for anonymous users
      }
    }

    router.push(`/results?sessionId=${sessionId}&theme=${encodeURIComponent(theme.name)}`)
  }

  return (
    <div className="min-h-screen flex flex-col bg-(--bg) text-(--text) transition-all duration-300">

      <Navbar />

      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-5 gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Themes</h1>
            <p className="text-sm text-white/50">
            
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {availableThemes.map((theme) => (
            <div
              key={theme.id || theme.name}
              role="button"
              tabIndex={0}
              onClick={() => handleSelect(theme)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  handleSelect(theme)
                }
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="card cursor-pointer"
            >
              <div className="h-24 mb-4 flex items-center justify-center opacity-70">
                Preview
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{theme.name}</span>
                <span className="text-xs text-(--primary)">
                  Use In Results →
                </span>
              </div>
              {theme.description && (
                <p className="mt-2 text-[11px] text-white/45 leading-relaxed line-clamp-3">{theme.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>

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