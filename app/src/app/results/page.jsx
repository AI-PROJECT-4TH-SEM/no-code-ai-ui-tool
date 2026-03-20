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
    const savedHistory = localStorage.getItem("history")
    if (savedHistory) setHistory(JSON.parse(savedHistory))
  }, [])

  function applyTheme(theme) {
    const originalHtml = localStorage.getItem("htmlToAnalyse")
    const newHistory = [...history, { label: theme.name, html: html }]
    setHistory(newHistory)
    localStorage.setItem("history", JSON.stringify(newHistory))
    const styledHtml = originalHtml + `<style>${theme.css}</style>`
    setHtml(styledHtml)
  }

  function restoreHistory(item) {
    setHtml(item.html)
  }

  return (
   <div className="flex flex-col h-screen bg-[#080810] text-white overflow-hidden">

    <Navbar />

{/* SUBHEADER */}
<div className="flex items-center justify-between px-8 py-3 bg-[#0a0a18] border-b border-gray-800">
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

      {/* MAIN 3 COLUMN GRID */}
      <div className="grid grid-cols-[1fr_2fr_1fr] flex-1 overflow-hidden">

        {/* LEFT - suggestions */}
        <div className="flex flex-col gap-4 p-6 border-r border-gray-800 overflow-y-auto bg-[#0a0a18]">
          
          {/* AI SUGGESTIONS */}
          <div>
            <h2 className="text-lg font-semibold">AI Suggestions</h2>
            <p className="text-gray-500 text-sm mt-1">Coming soon...</p>
            
            {/* placeholder cards */}
            <div className="flex flex-col gap-2 mt-4">
              {["Color improvements", "Font suggestions", "Spacing fixes", "Accessibility"].map((item) => (
                <div
                  key={item}
                  className="bg-[#1a1a2e] border border-gray-700 rounded-lg p-3 text-sm text-gray-600 flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-gray-700"></span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* THEME SUGGESTIONS */}
          <div className="border-t border-gray-800 pt-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">
              Theme Suggestions
            </h3>
            <ThemeGrid
              themes={themes.slice(0, 4)}
              onSelect={(theme) => applyTheme(theme)}
            />
            <button
              onClick={() => router.push("/themes")}
              className="mt-3 w-full py-2.5 rounded-lg border border-gray-700 text-gray-500 hover:border-pink-400 hover:text-pink-400 transition text-xs"
            >
              Explore all {themes.length} themes →
            </button>
          </div>

        </div>

      {/* MIDDLE - live preview */}
<div className="flex flex-col border-x border-gray-800">
  <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1a2e] border-b border-gray-800">
    <div className="w-3 h-3 rounded-full bg-red-500"></div>
    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
    <div className="w-3 h-3 rounded-full bg-green-500"></div>
    <span className="text-gray-600 text-xs ml-2 bg-[#0a0a18] px-3 py-1 rounded-full border border-gray-700 flex-1 text-center">
      preview
    </span>
  </div>
  <div className="flex-1 bg-white">
    <iframe
      title="preview"
      srcDoc={html}
      className="w-full h-full border-none"
    />
  </div>
</div>

        {/* RIGHT - history */}
        <div className="flex flex-col gap-4 p-6 border-l border-gray-800 overflow-y-auto bg-[#0a0a18]">
          
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">History</h2>
            {history.length > 0 && (
              <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full border border-white/10">
                {history.length} changes
              </span>
            )}
          </div>

          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center">
              <span className="text-4xl opacity-20">⏱</span>
              <p className="text-gray-600 text-sm">No changes yet</p>
              <p className="text-gray-700 text-xs">Apply a theme to see history</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                {history.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => restoreHistory(item)}
                    className="bg-[#1a1a2e] border border-gray-700 rounded-lg p-3 text-sm cursor-pointer hover:border-pink-400 transition group"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-white font-medium">{item.label}</p>
                      <span className="text-xs text-gray-600 group-hover:text-pink-400 transition">restore →</span>
                    </div>
                    <p className="text-gray-600 text-xs mt-1">#{history.length - i} change</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setHistory([])
                  localStorage.removeItem("history")
                }}
                className="mt-2 w-full py-2.5 rounded-lg border border-gray-800 text-gray-600 hover:border-red-500 hover:text-red-400 transition text-xs"
              >
                Clear all history
              </button>
            </>
          )}

        </div>

      </div>
    </div>
  )
}