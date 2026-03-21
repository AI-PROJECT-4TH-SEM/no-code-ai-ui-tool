"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { themes } from "@/lib/themes"
import ThemeGrid from "@/components/ThemeGrid"
import Navbar from "@/components/Navbar"

export default function Home() {
  const [html, setHtml] = useState("")
  const [mode, setMode] = useState("html")
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [fetchMethod, setFetchMethod] = useState("")
  useEffect(() => {
    const saved = localStorage.getItem("htmlToAnalyse")
    if (saved) setHtml(saved)
  }, [])

  function handleAnalyse() {
    if (!html) {
      alert("Please paste some HTML first!")
      return
    }
    localStorage.setItem("htmlToAnalyse", html)
    router.push("/results")
  }

  async function fetchUrl() {
  if (!url) return
  setLoading(true)

  try {
    const res = await fetch("/api/fetch-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    })

    // Parse JSON first
    const data = await res.json()

    if (!res.ok) {
      alert(data.error || "Failed to fetch the URL")
      return
    }

    if (data.html) {
      setHtml(data.html)
      setFetchMethod(data.method || "fetch")
      localStorage.setItem("htmlToAnalyse", data.html)
    }

  } catch (err) {
    console.error(err)
    alert("Something went wrong!")
  } finally {
    setLoading(false)
  }
}
  return (
 <div 
  className="flex flex-col min-h-screen text-white relative"
  style={{ backgroundImage: "url('/hero-bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}
>
  {/* dark overlay for whole page */}
  <div className="absolute inset-0 bg-black/75 z-0"></div>

  {/* all content needs z-10 */}
  <div className="relative z-10 flex flex-col min-h-screen">

    <Navbar />

    {/* HERO SECTION - no background needed now */}
    <div className="flex flex-col items-center justify-center text-center px-8 py-16 border-b border-gray-800 relative overflow-hidden">
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-gray-400 mb-6">
          <span className="text-pink-400">✦</span>
          AI powered UI transformation
        </div>
        <h1 className="text-5xl font-bold mb-4 leading-tight">
          Transform Your Website's UI
          <br />
          <span className="bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
            with AI in Seconds
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Paste your HTML, pick a theme, and let AI suggest design improvements — no coding required.
        </p>
      </div>
    </div>

    {/* MAIN GRID */}
    <div className="grid grid-cols-2 flex-1 overflow-hidden">

      {/* LEFT */}
      <div className="flex flex-col gap-4 p-8 border-r border-gray-800 min-h-0 bg-black/30">
        {/* TABS */}
        <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
          <button
            onClick={() => setMode("html")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${mode === "html"
              ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
              : "text-gray-400 hover:text-white"
              }`}
          >
            Paste HTML
          </button>
          <button
            onClick={() => setMode("url")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${mode === "url"
              ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
              : "text-gray-400 hover:text-white"
              }`}
          >
            Enter URL
          </button>
        </div>

        {/* HTML MODE */}
        {mode === "html" && (
          <textarea
            className="flex-1 min-h-[400px] bg-white/5 border border-gray-700 rounded-xl text-white p-4 text-sm resize-none outline-none focus:border-pink-400 transition placeholder-gray-600"
            placeholder="Paste your HTML here..."
            value={html}
            onChange={(e) => {
              setHtml(e.target.value)
              localStorage.setItem("htmlToAnalyse", e.target.value)
            }}
          />
        )}

        {/* URL MODE */}
        {mode === "url" && (
          <div className="flex flex-col gap-3 flex-1">
            <input
              type="text"
              className="bg-white/5 border border-gray-700 rounded-xl text-white p-4 text-sm outline-none focus:border-pink-400 transition placeholder-gray-600"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              onClick={fetchUrl}
              disabled={loading}
              className="w-full py-3 rounded-xl border border-gray-700 text-gray-400 hover:border-pink-400 hover:text-pink-400 transition text-sm disabled:opacity-50"
            >
              {loading ? "Fetching..." : "Fetch HTML →"}
            </button>
            {html && (
              <div className="flex-1 bg-white/5 border border-gray-700 rounded-xl p-4 text-xs text-gray-500 overflow-y-auto">
                {html.substring(0, 300)}...
                <p className="text-green-400 mt-2">✓ HTML fetched successfully!</p>
                <p className="text-gray-600 mt-1">
                  {fetchMethod === "puppeteer"
                    ? "⚡ Used deep browser fetch"
                    : "✓ Used fast fetch"}
                </p>
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleAnalyse}
          className="w-full py-4 rounded-xl text-white font-semibold text-base bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 hover:scale-[1.02] transition shadow-lg shadow-pink-500/20"
        >
           Analyse 
        </button>

      </div>

      {/* RIGHT */}
      <div className="flex flex-col gap-4 p-8 overflow-y-auto bg-black/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Sample Themes</h2>
            <p className="text-gray-500 text-sm mt-1">Click any theme to preview it</p>
          </div>
          <span className="text-xs text-gray-600 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            {themes.length} themes available
          </span>
        </div>

        <ThemeGrid
          themes={themes.slice(0, 4)}
          onSelect={(theme) => {
            const styledHtml = html + `<style>${theme.css}</style>`
            setHtml(styledHtml)
            localStorage.setItem("htmlToAnalyse", styledHtml)
          }}
        />

        <button
          onClick={() => router.push("/themes")}
          className="mt-2 w-full py-3 rounded-xl border border-gray-700 text-gray-400 hover:border-pink-400 hover:text-pink-400 transition text-sm flex items-center justify-center gap-2"
        >
          Explore all {themes.length} themes →
        </button>
      </div>

    </div>
  </div>
</div>
  )
}