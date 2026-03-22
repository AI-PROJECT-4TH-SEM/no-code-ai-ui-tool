"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { themes } from "@/lib/themes"
import ThemeGrid from "@/components/ThemeGrid"
import Navbar from "@/components/Navbar"

export default function Results() {
  const [html, setHtml] = useState("")
  const [history, setHistory] = useState([])
  const router = useRouter()

  useEffect(() => {
    const saved = localStorage.getItem("htmlToAnalyse")
    if (saved) setHtml(saved)

    // ✅ NEW: load history from Mongo
    async function loadHistory() {
      try {
        const res = await fetch("/api/history")
        const data = await res.json()
        setHistory(data)
      } catch (err) {
        console.log("Failed to load history")
      }
    }

    loadHistory()
  }, [])

  async function applyTheme(theme) {
    const originalHtml = localStorage.getItem("htmlToAnalyse")
    const styledHtml = originalHtml + `<style>${theme.css}</style>`

    setHtml(styledHtml)

    // ✅ SAVE TO MONGO instead of localStorage
    try {
      await fetch("/api/save-history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label: theme.name,
          html: styledHtml,
        }),
      })

      // reload history
      const res = await fetch("/api/history")
      const data = await res.json()
      setHistory(data)

    } catch (err) {
      console.log("Failed to save history")
    }
  }

  function restoreHistory(item) {
    setHtml(item.html)
  }

  async function deleteHistory(id) {
  try {
    await fetch(`/api/history/${id}`, {
      method: "DELETE",
    })

    // update UI instantly
    setHistory(prev => prev.filter(item => item._id !== id))

  } catch (err) {
    console.log("Delete failed")
  }
}
async function clearAllHistory() {
  try {
    await fetch("/api/history", {
      method: "DELETE",
    })

    setHistory([])
  } catch (err) {
    console.log("Clear failed")
  }
}


  return (
    <div
      className="flex flex-col h-screen text-white overflow-hidden relative"
      style={{
        backgroundImage: "url('/themes-bg.avif')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-black/80 z-0"></div>

      <div className="relative z-10 flex flex-col h-screen overflow-hidden">

        <Navbar />

        {/* HEADER */}
        <div className="flex items-center justify-between px-8 py-3 bg-black/30 backdrop-blur-sm border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className="text-gray-500 hover:text-white transition text-sm flex items-center gap-1"
            >
              ← Back
            </button>
            <span className="text-gray-700">|</span>
            <span className="text-gray-400 text-sm">Results</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-gray-500 text-xs">Live preview active</span>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_2fr_1fr] flex-1 min-h-0">

          {/* LEFT */}
          <div className="flex flex-col gap-4 p-6 border-r border-white/10 overflow-y-auto bg-black/30 backdrop-blur-sm h-full">

            <div>
              <h2 className="text-lg font-semibold">AI Suggestions</h2>
              <p className="text-gray-500 text-sm mt-1">Coming soon...</p>

              <div className="flex flex-col gap-2 mt-4">
                {["Color improvements", "Font suggestions", "Spacing fixes", "Accessibility"].map((item) => (
                  <div
                    key={item}
                    className="bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-gray-500 flex items-center gap-2 backdrop-blur-sm"
                  >
                    <span className="w-2 h-2 rounded-full bg-gray-600"></span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <h3 className="text-sm font-semibold text-gray-400 mb-3">
                Theme Suggestions
              </h3>

              <ThemeGrid
                themes={themes.slice(0, 4)}
                onSelect={(theme) => applyTheme(theme)}
              />

              <button
                onClick={() => router.push("/themes")}
                className="mt-3 w-full py-2.5 rounded-lg border border-white/10 text-gray-500 hover:border-pink-400 hover:text-pink-400 transition text-xs"
              >
                Explore all {themes.length} themes →
              </button>
            </div>

          </div>

          {/* MIDDLE */}
          <div className="flex flex-col min-h-0 h-full">
            <div className="flex-1 min-h-0 overflow-hidden bg-white">
              <iframe
                title="preview"
                srcDoc={html}
                className="w-full h-full border-none block"
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-4 p-6 border-l border-white/10 overflow-y-auto bg-black/30 backdrop-blur-sm h-full">

            <div className="flex items-center justify-between">
  <h2 className="text-lg font-semibold">History</h2>

  {history.length > 0 && (
    <button
      onClick={clearAllHistory}
      className="text-xs text-red-400 hover:text-red-300"
    >
      Clear all
    </button>
  )}
</div>

            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center">
                <span className="text-4xl opacity-20">⏱</span>
                <p className="text-gray-600 text-sm">No changes yet</p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                {history.map((item) => (
  <div
    key={item._id}
    className="bg-white/5 border border-white/10 rounded-lg p-3 text-sm backdrop-blur-sm flex items-center justify-between group"
  >
    {/* LEFT */}
    <div
      onClick={() => restoreHistory(item)}
      className="cursor-pointer flex-1"
    >
      <p className="text-white font-medium">{item.label}</p>
    </div>

    {/* RIGHT */}
    <div className="flex items-center gap-3">

      <span
        onClick={() => restoreHistory(item)}
        className="text-xs text-gray-500 hover:text-pink-400 cursor-pointer"
      >
        restore →
      </span>

      <span
        onClick={() => deleteHistory(item._id)}
        className="text-xs text-red-500 hover:text-red-400 cursor-pointer opacity-0 group-hover:opacity-100 transition"
      >
        delete ✕
      </span>

    </div>
  </div>
))}
                </div>
              </>
            )}

          </div>

        </div>
      </div>
    </div>
  )
}