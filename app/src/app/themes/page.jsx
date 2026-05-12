"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { themes } from "@/lib/themes.js"
import { themeManager } from "@/lib/themeManager"
import Navbar from "@/components/Navbar"

export default function Themes() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("sessionId")
  const [liveThemes, setLiveThemes] = useState([])
  const [loadingThemes, setLoadingThemes] = useState(false)
  const [themeError, setThemeError] = useState("")
  const [scanSummary, setScanSummary] = useState(null)

  const fallbackThemes = useMemo(() => themes.slice(0, 12), [])

  async function loadLiveThemes({ randomize = true } = {}) {
    const token = localStorage.getItem("token")
    if (!token || !sessionId) {
      setLiveThemes(fallbackThemes)
      return
    }

    setLoadingThemes(true)
    setThemeError("")

    try {
      const sessionRes = await fetch(`/api/session/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const sessionData = await sessionRes.json()
      if (!sessionRes.ok) throw new Error(sessionData.error || "Failed to load session")

      const html = sessionData.currentHtml || sessionData.originalHtml || ""
      const url = sessionData.url || ""

      const analysisRes = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html, url }),
      })
      const analysisData = await analysisRes.json()
      if (!analysisRes.ok) throw new Error(analysisData.error || "Failed to analyse page")

      setScanSummary({
        score: analysisData.score ?? 0,
        violations: analysisData.violations ?? 0,
        suggestionCount: (analysisData.suggestions || []).length,
      })

      const themeRes = await fetch("/api/ai-themes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInput: "Generate the best live theme for this scanned page.",
          scanResults: analysisData,
          url,
          randomize,
        }),
      })
      const themeData = await themeRes.json()
      if (!themeRes.ok) throw new Error(themeData.error || "Failed to generate live themes")

      setLiveThemes(Array.isArray(themeData.themes) && themeData.themes.length ? themeData.themes : fallbackThemes)
    } catch (err) {
      console.error("Live theme generation failed:", err)
      setThemeError(err.message || "Could not generate live themes")
      setLiveThemes(fallbackThemes)
    } finally {
      setLoadingThemes(false)
    }
  }

  useEffect(() => {
    loadLiveThemes({ randomize: true })
  }, [sessionId])

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
    console.log("CLICKED:", theme)

    if (theme?.css) {
      const existing = document.getElementById("live-theme-preview-style")
      if (existing) existing.remove()
      const styleEl = document.createElement("style")
      styleEl.id = "live-theme-preview-style"
      styleEl.textContent = theme.css
      document.head.appendChild(styleEl)
    }

    themeManager.saveActiveTheme(theme)

    const token = localStorage.getItem("token")
    console.log("TOKEN:", token)

    if (token) {
      try {
        const res = await fetch("/api/theme", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ themeName: theme.name }),
        })

        const data = await res.json()
        console.log("API RESPONSE:", data)
      } catch (err) {
        console.error("MongoDB save failed:", err)
      }
    } else {
      console.warn("No token → only localStorage used")
    }

    router.push(`/results?sessionId=${sessionId}&theme=${encodeURIComponent(theme.name)}`)
  }

  return (
    <div className="min-h-screen flex flex-col bg-(--bg) text-(--text) transition-all duration-300">

      <Navbar />

      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-5 gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Live AI Themes</h1>
            <p className="text-sm text-white/50">
              Themes are generated from the current scan. Refresh to get a different runtime result.
            </p>
            {scanSummary && (
              <p className="mt-1 text-xs text-white/35">
                Score {scanSummary.score}/100 · {scanSummary.violations} violations · {scanSummary.suggestionCount} suggestions
              </p>
            )}
          </div>
          <button
            onClick={() => loadLiveThemes({ randomize: true })}
            className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-sm"
          >
            🔄 Regenerate
          </button>
        </div>

        {themeError && (
          <div className="mb-4 p-3 rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-200 text-sm">
            {themeError}
          </div>
        )}

        {loadingThemes ? (
          <div className="p-8 text-center text-white/50">Generating live palettes and CSS for this page...</div>
        ) : null}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {liveThemes.map((theme) => (
            <div
              key={theme.id || theme.name}
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
                <span className="text-xs text-(--primary)">
                  Apply →
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