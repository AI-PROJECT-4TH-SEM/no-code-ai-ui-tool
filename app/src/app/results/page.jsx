"use client"
import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import Navbar from "@/components/Navbar"
import { useAuth } from "@/context/AuthContext"

function applyDomFix(doc, fix) {
  if (!fix?.type) return

  switch (fix.type) {
    case "setAttribute": {
      doc.querySelectorAll(fix.selector).forEach(el =>
        el.setAttribute(fix.attribute, fix.value)
      )
      break
    }
    case "setStyle": {
      doc.querySelectorAll(fix.selector).forEach(el => {
        el.style[fix.style] = fix.styleValue
      })
      break
    }
    case "setStyleImportant": {
      doc.querySelectorAll(fix.selector).forEach(el => {
        el.style.setProperty(fix.style, fix.styleValue, "important")
      })
      break
    }
    case "setInnerText": {
      doc.querySelectorAll(fix.selector).forEach(el => {
        el.textContent = fix.value
      })
      break
    }
    case "addClass": {
      doc.querySelectorAll(fix.selector).forEach(el =>
        el.classList.add(fix.value)
      )
      break
    }
    case "replaceHtml": {
      const el = doc.querySelector(fix.selector)
      if (el) el.outerHTML = fix.value
      break
    }
    case "wrapMain": {
      if (doc.querySelector("main")) break
      const body = doc.querySelector("body")
      if (!body) break
      const main = doc.createElement("main")
      Array.from(body.children).forEach(child => {
        if (!["HEADER", "NAV", "FOOTER"].includes(child.tagName)) {
          main.appendChild(child)
        }
      })
      body.appendChild(main)
      break
    }
    case "wrapWithMain": {
      if (doc.querySelector("main")) break
      const body = doc.querySelector("body")
      if (!body) break
      const main = doc.createElement("main")
      const landmarks = ["HEADER", "NAV", "FOOTER", "MAIN", "ASIDE"]
      Array.from(body.children).forEach(child => {
        if (!landmarks.includes(child.tagName)) {
          main.appendChild(child)
        }
      })
      // insert before footer if it exists, otherwise append
      const footer = body.querySelector("footer")
      if (footer) {
        body.insertBefore(main, footer)
      } else {
        body.appendChild(main)
      }
      break
    }
    case "multifix": {
      fix.fixes.forEach(f => applyDomFix(doc, f))
      break
    }
    case "ensureH1": {
      if (doc.querySelector("h1")) break
      const text =
        doc.querySelector("title")?.textContent ||
        doc.querySelector("h2")?.textContent ||
        "Page title"
      const h1 = doc.createElement("h1")
      h1.textContent = text
      doc.querySelector("body")?.prepend(h1)
      break
    }

    case "replaceTag": {
      if (!fix.selector || !fix.tag) break
      doc.querySelectorAll(fix.selector).forEach(el => {
        const newEl = doc.createElement(fix.tag)
        newEl.innerHTML = el.innerHTML
        Array.from(el.attributes).forEach(attr =>
          newEl.setAttribute(attr.name, attr.value)
        )
        el.replaceWith(newEl)
      })
      break
    }
    default:
      console.warn("Unknown fix type:", fix.type)
  }
}

export default function Results() {
  const [html, setHtml] = useState("")
  const [session, setSession] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [score, setScore] = useState(null)
  const [violationCount, setViolationCount] = useState(0)
  const [analysing, setAnalysing] = useState(false)
  const [analysed, setAnalysed] = useState(false)
  const [changes, setChanges] = useState([])
  const [undoStack, setUndoStack] = useState([])
  const [redoStack, setRedoStack] = useState([])
  const [error, setError] = useState(null)
  const [openId, setOpenId] = useState(null)
  const [iframeKey, setIframeKey] = useState(0)
  const [saving, setSaving] = useState(false)

  const searchParams = useSearchParams()
  const sessionId = searchParams.get("sessionId")
  const { accessToken } = useAuth()

  // remount iframe every time html changes — this is what makes undo/redo visible
  useEffect(() => {
    setIframeKey(prev => prev + 1)
  }, [html])

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
          setHtml(data.changes?.[0]?.html || data.originalHtml || "")  // always start from original
          setChanges(data.changes || [])
          setUndoStack([])
          setRedoStack([])
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
    const currentHtml = html || session?.originalHtml
    console.log("ANALYSING HTML LENGTH:", currentHtml?.length)
    console.log("HAS MAIN:", currentHtml?.includes("<main>"))
    const currentUrl = session?.url
    if (!currentHtml && !currentUrl) return

    setAnalysing(true)
    setError(null)
    setOpenId(null)

    try {
      const res = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: currentHtml, url: currentUrl }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Analysis failed")

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
    if (session?.originalHtml && !analysed && !analysing) {
      runAnalysis()
    }
  }, [session, analysed, analysing, runAnalysis])

  async function saveToBackend(htmlToSave, themeName = "Saved") {
    setSaving(true)
    try {
      await fetch(`/api/session/${sessionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ html: htmlToSave, themeName }),
      })
    } catch (err) {
      console.error("Save failed:", err)
    } finally {
      setSaving(false)
    }
  }

  function downloadHtml() {
    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "fixed-page.html"
    a.click()
    URL.revokeObjectURL(url)
  }

  function undo() {
    if (undoStack.length === 0) return
    const previous = undoStack[undoStack.length - 1]
    setRedoStack(prev => [html, ...prev])
    setUndoStack(prev => prev.slice(0, -1))
    setHtml(previous)  // useEffect will remount iframe
  }

  function redo() {
    if (redoStack.length === 0) return
    const next = redoStack[0]
    setUndoStack(prev => [...prev, html])
    setRedoStack(prev => prev.slice(1))
    setHtml(next)  // useEffect will remount iframe
  }

  function applyFix(suggestion) {
    if (!suggestion.domFix) return

    const { type } = suggestion.domFix
    const noSelectorNeeded = ["wrapMain", "wrapWithMain", "ensureH1", "multifix"]

    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")

    if (!noSelectorNeeded.includes(type)) {
      const { selector } = suggestion.domFix
      if (!selector) { alert("No selector provided for this fix"); return }
      const elements = doc.querySelectorAll(selector)
      if (!elements.length) { alert(`Element not found: ${selector}`); return }
    }

    applyDomFix(doc, suggestion.domFix)
    const newHtml = doc.documentElement.outerHTML
    console.log("HAS MAIN:", newHtml.includes("<main>"))
    console.log("HAS NAV:", newHtml.includes("<nav>"))



    setUndoStack(prev => [...prev, html])
    setRedoStack([])
    setHtml(newHtml)  // useEffect will remount iframe
    saveToBackend(newHtml, `Fix: ${suggestion.title}`)

    setSuggestions(prev =>
      prev.map((s, idx) =>
        idx === suggestions.indexOf(suggestion) ? { ...s, fixed: true } : s
      )
    )

    setChanges(prev => [
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
    safeScore >= 80 ? "text-green-400" :
      safeScore >= 50 ? "text-yellow-400" :
        "text-red-400"

  const impactColor = {
    critical: "text-red-400",
    serious: "text-orange-400",
    moderate: "text-yellow-400",
    minor: "text-blue-400",
  }

  const canUndo = undoStack.length > 0
  const canRedo = redoStack.length > 0

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
                <button onClick={runAnalysis} className="block mt-2 text-xs underline">Retry</button>
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
              <button onClick={runAnalysis} className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded transition-colors">
                Analyse
              </button>
            )}

            {analysed && !analysing && (
              <>
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

                {suggestions.map((s, i) => (
                  <div key={i} className="mb-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded overflow-hidden">
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
                        <span className="text-gray-400 text-xs">{openId === i ? "▲" : "▼"}</span>
                      </div>
                    </div>

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
                              onClick={(e) => { e.stopPropagation(); applyFix(s) }}
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
          <div className="order-1 md:order-2 flex flex-col h-[60vh] md:h-full md:border-x border-white/10 relative">
            <div className="flex items-center gap-2 px-3 py-2 bg-black/30 border-b border-white/10 shrink-0">
              <button
                onClick={undo}
                disabled={!canUndo}
                className="px-2 py-1 text-xs rounded border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ← Undo
              </button>
              <button
                onClick={redo}
                disabled={!canRedo}
                className="px-2 py-1 text-xs rounded border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Redo →
              </button>
              <div className="flex-1" />
              {saving && <span className="text-xs text-gray-400">Saving...</span>}
              <button
                onClick={downloadHtml}
                className="px-3 py-1 text-xs rounded bg-purple-600 hover:bg-purple-700 transition-colors"
              >
                Download HTML
              </button>
            </div>

            <div className="flex-1 bg-white overflow-hidden relative">
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

              {analysing && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10">
                  <svg className="animate-spin h-8 w-8 text-purple-600" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  <p className="text-gray-600 text-sm font-medium">Scanning for accessibility issues...</p>
                  <p className="text-gray-400 text-xs">This usually takes 20–30 seconds</p>
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
                  onClick={() => {
                    setUndoStack(prev => [...prev, html])
                    setRedoStack([])
                    setHtml(c.html)  // useEffect will remount iframe
                  }}
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