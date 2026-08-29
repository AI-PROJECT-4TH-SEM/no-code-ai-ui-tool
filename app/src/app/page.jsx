"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { themes } from "@/lib/themes"
import ThemeGrid from "@/components/ThemeGrid"
import Navbar from "@/components/Navbar"
import { useAuth } from "@/context/AuthContext"

export default function Home() {
  const [html, setHtml] = useState("")
  const [mode, setMode] = useState("html")
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [analysing, setAnalysing] = useState(false)
  const [fetchMethod, setFetchMethod] = useState("")
  const router = useRouter()
  const { accessToken } = useAuth()

  async function saveHtml(content) {
    if (!accessToken) return
    try {
      await fetch("/api/html", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ content }),
      })
    } catch {
      console.log("Failed to save HTML")
    }
  }

  async function handleAnalyse() {
    if (analysing) return
    if (!html) { alert("Please paste some HTML first!"); return }
    if (!accessToken) { alert("Please login first!"); router.push("/login"); return }

    setAnalysing(true)
    try {

      await fetch("/api/html", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ content: html }),
      })

      const sessionLabel = url
        ? new URL(url.startsWith("http") ? url : "https://" + url).hostname.replace("www.", "")
        : `Paste ${new Date().toLocaleTimeString()}`

      const res = await fetch("/api/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ label: sessionLabel, html, url: url || undefined }),
      })

      const data = await res.json()
      if (!res.ok) { alert("Failed to create session"); return }

      router.push(`/results?sessionId=${data.sessionId}`)
    } catch (err) {
      console.error(err)
      alert("Something went wrong!")
    } finally {
      setAnalysing(false)
    }
  }
  async function fetchUrl() {
    if (!url) { alert("Enter a URL"); return }
    if (loading) return
    setLoading(true)
    try {
      const res = await fetch("/api/fetch-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })

      const text = await res.text()

      let data
      try {
        data = JSON.parse(text)
      } catch {
        console.error("NOT JSON RESPONSE:", text)
        alert("Fetch failed — invalid response")
        return
      }

      if (data.method === "failed") { alert("This site blocks scraping or failed to load"); return }
      if (!data.html) { alert("No HTML returned"); return }

      setHtml(data.html)
      setFetchMethod(data.method)
      await saveHtml(data.html)
    } catch (err) {
      console.error(err)
      alert("Fetch failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="flex flex-col min-h-screen text-white relative"
      style={{
        backgroundImage: "url('/hero-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/75 z-0" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <div className="flex flex-col items-center justify-center text-center px-6 md:px-8 py-12 md:py-16 border-b border-gray-800 relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-gray-400 mb-6">
              <span className="text-pink-400">✦</span>
              AI powered UI transformation
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              Transform Your Website&apos;s UI
              <br />
              <span className="bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
                within Seconds
              </span>
            </h1>
            <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto">
              Paste your HTML, pick a theme, and let AI suggest design improvements — no coding headache.
            </p>
          </div>
        </div>

        <div className="relative z-10">
          ...
        </div>

        <div className="flex flex-col md:grid md:grid-cols-2 flex-1 md:overflow-hidden">

          <div className="flex flex-col gap-4 p-6 md:p-8 md:border-r border-b md:border-b-0 border-gray-800 bg-black/30">
            <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
              <button
                onClick={() => setMode("html")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${mode === "html" ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
              >
                Paste your Code
              </button>
              <button
                onClick={() => setMode("url")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${mode === "url" ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
              >
                Enter URL
              </button>
            </div>

            {mode === "html" && (
              <textarea
                className="flex-1 min-h-[280px] md:min-h-[400px] bg-white/5 border border-gray-700 rounded-xl text-white p-4 text-sm resize-none outline-none focus:border-pink-400 transition placeholder-gray-600"
                placeholder="Paste your Code here..."
                value={html}
                onChange={async (e) => {
                  setHtml(e.target.value)
                }}
              />
            )}

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
                      {fetchMethod === "puppeteer" ? "⚡ Used deep browser fetch" : "✓ Used fast fetch"}
                    </p>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleAnalyse}
              disabled={analysing}
              aria-busy={analysing}
              className="w-full py-4 rounded-xl text-white font-semibold text-base bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 hover:scale-[1.02] transition shadow-lg shadow-pink-500/20 disabled:cursor-wait disabled:opacity-70 disabled:hover:scale-100"
            >
              {analysing ? "Analysing..." : "Analyse"}
            </button>
          </div>

          <div className="flex flex-col gap-4 p-6 md:p-8 md:overflow-y-auto bg-black/20">
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
              onSelect={async (theme) => {
                const styledHtml = html + `<style>${theme.css}</style>`
                setHtml(styledHtml)
                await saveHtml(styledHtml)
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

