"use client"

import { useEffect, useState } from "react"

const QUICK_PROMPTS = [
  "Improve the selected element layout",
  "Fix the WCAG contrast issues here",
  "Suggest a better theme for this page",
  "Make this image section move as a wrapper",
]

function Bubble({ role, text, plan, applied, onApplyTheme, onApplyPlan }) {
  const isUser = role === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm border shadow-sm ${
          isUser
            ? "bg-violet-600 text-white border-violet-400/30"
            : "bg-white/6 text-white border-white/10"
        }`}
      >
        <p className="whitespace-pre-wrap leading-relaxed">{text}</p>

        {!isUser && plan && (
          <div className="mt-3 space-y-3">
            {plan.layoutSuggestions?.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">Layout suggestions</p>
                <div className="space-y-2">
                  {plan.layoutSuggestions.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="rounded-xl border border-white/10 bg-black/20 p-2">
                      <div className="text-xs font-semibold text-white">{item.title || "Improve structure"}</div>
                      {item.selector && <div className="mt-1 font-mono text-[10px] text-cyan-300/80 break-all">{item.selector}</div>}
                      <p className="mt-1 text-[11px] text-white/55 leading-relaxed">{item.why || item.reason || item.change || "Suggested by the assistant."}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {plan.contrastSuggestions?.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">WCAG contrast</p>
                <div className="space-y-2">
                  {plan.contrastSuggestions.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="rounded-xl border border-amber-400/15 bg-amber-500/8 p-2">
                      <div className="text-xs font-semibold text-amber-200">{item.selector || item.target || "Selected element"}</div>
                      <p className="mt-1 text-[11px] text-amber-50/80 leading-relaxed">
                        {item.reason || `Use ${item.recommendedTextColor || item.color || "a higher-contrast color"} for better readability.`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {plan.themeSuggestions?.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">Theme suggestions</p>
                <div className="flex flex-wrap gap-2">
                  {plan.themeSuggestions.slice(0, 4).map((theme, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onApplyTheme?.(theme)}
                      className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/75 hover:bg-white/10 transition-colors"
                    >
                      {theme.name || theme.themeName || theme.id || "Theme"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {Array.isArray(plan.actions) && plan.actions.length > 0 && (
              <div className="flex items-center justify-between gap-2 rounded-xl border border-emerald-400/15 bg-emerald-500/8 p-2">
                <span className="text-[11px] text-emerald-200">
                  {applied ? "Changes applied" : `${plan.actions.length} change${plan.actions.length !== 1 ? "s" : ""} ready`}
                </span>
                {!applied && (
                  <button
                    type="button"
                    onClick={() => onApplyPlan?.(plan)}
                    className="rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-semibold text-black hover:bg-emerald-400 transition-colors"
                  >
                    Apply
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function AssistantDrawer({
  html,
  pageUrl,
  sessionId,
  selectedEl,
  activeTheme,
  themeOptions = [],
  onApplyPlan,
  onApplyTheme,
  onSessionId,
}) {
  const [open, setOpen] = useState(true)
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")
  const [activeSessionId, setActiveSessionId] = useState(sessionId || null)
  const [loaded, setLoaded] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Ask me to improve layout, fix contrast, suggest a theme, or edit the selected element. I can work from the current selection or the whole page.",
      plan: null,
      applied: false,
    },
  ])

  useEffect(() => {
    if (sessionId && sessionId !== activeSessionId) setActiveSessionId(sessionId)
  }, [sessionId, activeSessionId])

  useEffect(() => {
    let isCancelled = false

    async function loadHistory() {
      if (loaded) return
      try {
        const query = activeSessionId
          ? `sessionId=${encodeURIComponent(activeSessionId)}`
          : (pageUrl ? `url=${encodeURIComponent(pageUrl)}` : "")
        const res = await fetch(`/api/assistant${query ? `?${query}` : ""}`)
        const data = await res.json().catch(() => ({}))
        if (!res.ok || isCancelled) return

        if (data.sessionId && !activeSessionId) {
          setActiveSessionId(data.sessionId)
          onSessionId?.(data.sessionId)
        }

        if (Array.isArray(data.messages) && data.messages.length) {
          setMessages(data.messages.map(m => ({
            role: m.role,
            text: m.content,
            plan: m.meta || null,
            applied: false,
          })))
        }
      } catch {
        // Keep default assistant intro if DB load fails.
      } finally {
        if (!isCancelled) setLoaded(true)
      }
    }

    loadHistory()
    return () => { isCancelled = true }
  }, [activeSessionId, pageUrl, loaded, onSessionId])

  const selectedLabel = selectedEl
    ? `${selectedEl.effectiveTag || selectedEl.tag || "element"}${selectedEl.selectionMode === "wrapper" ? " wrapper" : ""}`
    : "Whole page"

  async function sendPrompt(text) {
    const prompt = (text ?? input).trim()
    if (!prompt || sending) return

    const userMessage = { role: "user", text: prompt }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setSending(true)
    setError("")

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: activeSessionId,
          instruction: prompt,
          html,
          url: pageUrl,
          selectedElement: selectedEl,
          activeTheme: activeTheme ? { id: activeTheme.id, name: activeTheme.name } : null,
          themeOptions: themeOptions.map(theme => ({ id: theme.id, name: theme.name, preview: theme.preview || [] })),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Assistant request failed")

      if (data.sessionId && data.sessionId !== activeSessionId) {
        setActiveSessionId(data.sessionId)
        onSessionId?.(data.sessionId)
      }

      let applied = false
      if (Array.isArray(data.actions) && data.actions.length && onApplyPlan) {
        const result = await onApplyPlan(data)
        applied = Boolean(result?.applied)
      }

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          text: data.reply || "Done.",
          plan: data,
          applied,
        },
      ])
    } catch (err) {
      setError(err.message || "Assistant failed")
      setMessages(prev => [
        ...prev,
        { role: "assistant", text: `I couldn't complete that request. ${err.message || "Try again."}`, plan: null, applied: false },
      ])
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-60 w-[min(420px,calc(100vw-1.25rem))] pointer-events-none">
      {open ? (
        <div className="pointer-events-auto overflow-hidden rounded-3xl border border-white/10 bg-[#08111fcc] backdrop-blur-2xl shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 bg-linear-to-r from-violet-500/20 via-fuchsia-500/10 to-cyan-500/10">
            <div>
              <p className="text-sm font-semibold text-white">AI Layout Assistant</p>
              <p className="text-[11px] text-white/50">{selectedLabel} · WCAG + theme guidance</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/70 hover:bg-white/10 transition-colors"
            >
              Minimize
            </button>
          </div>

          <div className="px-4 pt-3 space-y-2 max-h-144 overflow-y-auto">
            <div className="flex flex-wrap gap-2 pb-2">
              {QUICK_PROMPTS.map(prompt => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendPrompt(prompt)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/70 hover:bg-white/10 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {messages.map((message, idx) => (
              <Bubble
                key={idx}
                role={message.role}
                text={message.text}
                plan={message.plan}
                applied={message.applied}
                onApplyPlan={onApplyPlan}
                onApplyTheme={(theme) => onApplyTheme?.(theme)}
              />
            ))}

            {error && <p className="text-xs text-red-300 px-1">{error}</p>}
          </div>

          <div className="border-t border-white/10 p-3 bg-black/25">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell me what to change, suggest, or fix..."
              className="min-h-24 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-violet-400/70"
            />
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-[11px] text-white/35">
                {activeTheme ? `Theme: ${activeTheme.name}` : "No theme selected"}
              </span>
              <button
                type="button"
                onClick={() => sendPrompt()}
                disabled={sending}
                className="rounded-full bg-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 hover:bg-violet-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {sending ? "Thinking..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="pointer-events-auto ml-auto flex items-center gap-2 rounded-full border border-white/10 bg-[#08111f] px-4 py-3 text-sm text-white shadow-[0_16px_50px_rgba(0,0,0,0.4)] hover:bg-[#0b172a] transition-colors"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-violet-400 animate-pulse" />
          AI Assistant
        </button>
      )}
    </div>
  )
}
