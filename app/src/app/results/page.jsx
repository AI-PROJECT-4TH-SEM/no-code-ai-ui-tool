"use client"
import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Navbar from "@/components/Navbar"
import { useAuth } from "@/context/AuthContext"

export default function Results() {
  const [html, setHtml] = useState("")
  const [session, setSession] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [score, setScore] = useState(null)
  const [violationCount, setViolationCount] = useState(0)
  const [analysing, setAnalysing] = useState(false)
  const [analysed, setAnalysed] = useState(false)
  const [changes, setChanges] = useState([])
  const [error, setError] = useState(null)
  const [openId, setOpenId] = useState(null)
  const [iframeKey, setIframeKey] = useState(0)
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("sessionId")
  const { accessToken } = useAuth()

  useEffect(() => {
    if (!accessToken || !sessionId) return

    async function loadSession() {
      try {
        const res = await fetch(`/api/session/${sessionId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        const data = await res.json()

        if (res.ok) {
          setSession(data)
          setHtml(data.currentHtml || "")
          setChanges(data.changes || [])
        } else {
          setError("Failed to load session")
        }
      } catch {
        setError("Failed to load session")
      }
    }

    loadSession()
  }, [accessToken, sessionId])

  const runAnalysis = useCallback(async () => {
    const currentHtml = html || session?.currentHtml
    const currentUrl = session?.url

    if (!currentHtml && !currentUrl) return

    setAnalysing(true)
    setError(null)
    setOpenId(null)

    try {
      const res = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html: currentHtml,
          url: currentUrl,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed")
      }

      setScore(data.score ?? 0)
      setViolationCount(data.violations ?? 0)
      setSuggestions(data.suggestions || [])
      setAnalysed(true)
    } catch (err) {
      console.error(err)
      setError(err.message || "Analysis failed")
    } finally {
      setAnalysing(false)
    }
  }, [html, session])

  useEffect(() => {
    if (session?.currentHtml && !analysed && !analysing) {
      runAnalysis()
    }
  }, [session, analysed, analysing, runAnalysis])

  function applyFix(suggestion) {
    console.log("domFix object:", JSON.stringify(suggestion.domFix))
    if (!suggestion.domFix) return

    const { type, selector, attribute, value, style, styleValue } = suggestion.domFix
    const noSelectorNeeded = ["wrapMain", "ensureH1", "fixContrast", "beautify"]

    if (!selector && !noSelectorNeeded.includes(type)) {
      alert("No selector provided for this fix")
      return
    }

    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")
    const elements = doc.querySelectorAll(selector)

    console.log("TRYING SELECTOR:", selector, "FOUND:", elements.length)

    if (!elements.length) {
      alert(`Element not found: ${selector}`)
      return
    }

    elements.forEach((el) => {
      if (type === "setAttribute") el.setAttribute(attribute, value)
      else if (type === "setStyle") el.style[style] = styleValue
      else if (type === "setInnerText") el.textContent = value
      else if (type === "addClass") el.classList.add(value)
      else if (type === "replaceHtml") el.outerHTML = value
    })

    const newHtml = doc.documentElement.outerHTML
    setHtml(newHtml)
    setIframeKey(prev => prev + 1) // force iframe to re-render

    setSuggestions((prev) =>
      prev.map((s, idx) =>
        idx === suggestions.indexOf(suggestion) ? { ...s, fixed: true } : s
      )
    )

    setChanges((prev) => [
      {
        _id: Date.now().toString(),
        themeName: `Fix: ${suggestion.title}`,
        html: newHtml,
        appliedAt: new Date(),
      },
      ...prev,
    ])
  }

  const safeScore = score ?? 0

  const scoreColor =
    safeScore >= 80
      ? "text-green-400"
      : safeScore >= 50
        ? "text-yellow-400"
        : "text-red-400"

  const impactColor = {
    critical: "text-red-400",
    serious: "text-orange-400",
    moderate: "text-yellow-400",
    minor: "text-blue-400",
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
      <div className="absolute inset-0 bg-black/50 z-0" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <div className="flex-1 flex flex-col md:grid md:grid-cols-[1fr_2fr_1fr] md:h-[calc(100vh-64px)] overflow-hidden">

          {/* LEFT PANEL */}
          <div className="order-2 md:order-1 flex flex-col p-4 border-t md:border-t-0 md:border-r border-white/10 overflow-y-auto bg-black/20 backdrop-blur-md">
            <h2 className="text-lg font-semibold mb-4">AI Suggestions</h2>

            {error && (
              <div className="mb-3 p-3 bg-red-900/30 backdrop-blur-sm border border-red-500/30 rounded text-sm text-red-300">
                {error}
                <button onClick={runAnalysis} className="block mt-2 text-xs underline">
                  Retry
                </button>
              </div>
            )}

            {analysing && (
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Analysing your page...
              </div>
            )}

            {!analysed && !analysing && !error && (
              <button
                onClick={runAnalysis}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded transition-colors"
              >
                Analyse
              </button>
            )}

            {analysed && !analysing && (
              <>
                {/* Score block */}
                <div className="mb-4 p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded">
                  <p className={`text-2xl font-bold ${scoreColor}`}>
                    {safeScore}
                    <span className="text-sm text-gray-400 font-normal">/100</span>
                  </p>
                  <p className="text-sm text-gray-400 mt-0.5">{violationCount} issues found</p>
                </div>

                <button
                  onClick={() => {
                    setAnalysed(false)
                    setSuggestions([])
                    setScore(null)
                    setViolationCount(0)
                    runAnalysis()
                  }}
                  className="mb-4 w-full py-1.5 text-sm border border-white/10 rounded hover:bg-white/10 transition-colors"
                >
                  Re-analyse
                </button>

                {suggestions.length === 0 && (
                  <p className="text-green-400 text-sm">No issues found ✓</p>
                )}

                {/* Accordion suggestions */}
                {suggestions.map((s, i) => (
                  <div
                    key={i}
                    className="mb-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded overflow-hidden"
                  >
                    {/* Header — always visible */}
                    <div
                      onClick={() => setOpenId(openId === i ? null : i)}
                      className="flex items-center justify-between p-3 cursor-pointer hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`text-xs font-medium shrink-0 ${impactColor[s.impact] ?? "text-gray-400"}`}>
                          {s.impact}
                        </span>
                        <p className="font-semibold text-sm truncate">{s.title}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {s.fixed && <span className="text-xs text-green-400">✓</span>}
                        <span className="text-gray-400 text-xs">
                          {openId === i ? "▲" : "▼"}
                        </span>
                      </div>
                    </div>

                    {/* Body — only when expanded */}
                    {openId === i && (
                      <div className="px-3 pb-3 border-t border-white/10">
                        <p className="text-sm text-gray-400 mt-2">{s.explanation}</p>
                        {s.fixDescription && (
                          <p className="text-xs text-gray-500 mt-1 italic">{s.fixDescription}</p>
                        )}
                        <div className="mt-2">
                          {s.fixed ? (
                            <span className="text-xs text-green-400">✓ Fixed</span>
                          ) : s.domFix ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                applyFix(s)
                              }}
                              className="text-sm px-3 py-1 rounded bg-purple-600 hover:bg-purple-700 transition-colors"
                            >
                              Fix →
                            </button>
                          ) : (
                            <div className="mt-1 p-2 bg-yellow-900/20 border border-yellow-500/20 rounded">
                              <p className="text-xs text-yellow-400 font-medium">⚠ Manual fix required</p>
                              <p className="text-xs text-gray-400 mt-0.5">{s.fixDescription}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>

          {/* CENTER PANEL */}
          <div className="order-1 md:order-2 flex flex-col h-[60vh] md:h-full md:border-x border-white/10">
            <div className="flex-1 bg-white overflow-hidden">
              {html ? (
                <iframe
                  key={iframeKey}
                  title="preview"
                  srcDoc={html}
                  className="w-full h-full border-none"
                  sandbox="allow-scripts allow-same-origin"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  No preview available
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="order-3 flex flex-col p-4 border-t md:border-t-0 md:border-l border-white/10 overflow-y-auto bg-black/20 backdrop-blur-md">
            <h2 className="text-lg font-semibold mb-4">Changes</h2>

            {changes.length === 0 ? (
              <p className="text-gray-500 text-sm">No changes yet</p>
            ) : (
              changes.map((c, i) => (
                <div
                  key={c._id ?? i}
                  onClick={() => setHtml(c.html)}
                  className="mb-2 p-2 bg-white/5 backdrop-blur-sm border border-white/10 cursor-pointer rounded transition-colors hover:bg-white/10"
                >
                  <p className="text-sm">{c.themeName}</p>
                  {c.appliedAt && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(c.appliedAt).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  )
}