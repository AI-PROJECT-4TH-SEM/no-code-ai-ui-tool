import { randomUUID } from "crypto"
import { CohereClient } from "cohere-ai"
import connectDB from "@/lib/db"
import AssistantChat from "@/lib/models/AssistantChat"
import { themes } from "@/lib/themes"

const cohere = new CohereClient({ token: process.env.COHERE_KEY1 })

function clip(value, max = 4000) {
  if (!value) return ""
  const text = typeof value === "string" ? value : JSON.stringify(value, null, 2)
  return text.length > max ? `${text.slice(0, max)}...` : text
}

function safeJsonParse(raw) {
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    const match = raw.match(/\{[\s\S]*\}/)
    if (match) {
      try {
        return JSON.parse(match[0])
      } catch {
        return null
      }
    }
    return null
  }
}

export async function GET(req) {
  await connectDB()

  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get("sessionId")
  const pageUrl = searchParams.get("url")

  let doc = null
  if (sessionId) {
    doc = await AssistantChat.findOne({ sessionId })
  } else if (pageUrl) {
    doc = await AssistantChat.findOne({ pageUrl }).sort({ updatedAt: -1 })
  }

  if (!doc) {
    return Response.json({ sessionId: null, messages: [] })
  }

  return Response.json({
    sessionId: doc.sessionId,
    pageUrl: doc.pageUrl,
    selectedSelector: doc.selectedSelector,
    selectedTag: doc.selectedTag,
    messages: doc.messages || [],
  })
}

export async function POST(req) {
  try {
    await connectDB()
    const body = await req.json()
    const instruction = String(body.instruction || "").trim()

    if (!instruction) {
      return Response.json({ error: "Instruction required" }, { status: 400 })
    }

    const selectedElement = body.selectedElement || null
    const sessionId = String(body.sessionId || randomUUID())

    let chatDoc = await AssistantChat.findOne({ sessionId })
    if (!chatDoc) {
      chatDoc = await AssistantChat.create({
        sessionId,
        pageUrl: String(body.url || ""),
        selectedSelector: selectedElement?.effectiveSelector || selectedElement?.selector || "",
        selectedTag: selectedElement?.effectiveTag || selectedElement?.tag || "",
        messages: [],
      })
    }

    const activeTheme = body.activeTheme || null
    const themeOptions = Array.isArray(body.themeOptions) && body.themeOptions.length
      ? body.themeOptions
      : themes.map(theme => ({ id: theme.id, name: theme.name, preview: theme.preview || [] }))

    const payload = {
      instruction,
      pageUrl: body.url || "",
      selectedElement,
      activeTheme,
      htmlPreview: clip(body.html, 9000),
      availableThemes: themeOptions.slice(0, 12).map(theme => ({
        id: theme.id,
        name: theme.name,
        preview: theme.preview,
      })),
    }

    const prompt = `You are a precise UI modification assistant that applies ONLY requested changes.
Return ONLY valid JSON. No markdown, no code fences, no commentary.

**CRITICAL - READ THIS CAREFULLY:**
The user has selected an element and given you an instruction.
Apply ONLY the exact change they asked for. Nothing else.

**YOUR RESPONSE MUST:**
- Have a reply that is ONLY a simple confirmation (1 sentence max)
- NEVER mention suggestions, improvements, layout, contrast, or themes in the reply
- Example good reply: "Changed font size to 18px."

**RULES:**
- NEVER return ANY suggestions, themes, or additional information
- Only return actions for the EXACT change requested
- NEVER suggest, interpret, or add extra features
- NEVER apply, recommend, or mention themes

User instruction: "${instruction}"

Context:
${JSON.stringify(payload, null, 2)}

Return ONLY this JSON:
{
  "reply": "1-sentence confirmation. No suggestions.",
  "actions": [
    {
      "kind": "domFix",
      "fix": {
        "type": "setStyle | setStyleImportant | setAttribute",
        "selector": "css selector",
        "style": "property name",
        "styleValue": "value with unit"
      },
      "reason": "what changed"
    }
  ]
}
`

    const response = await cohere.chat({
      model: "command-a-03-2025",
      message: prompt,
    })

    const raw = String(response.text || "").replace(/```json|```/g, "").trim()
    const parsed = safeJsonParse(raw)

    if (!parsed || typeof parsed !== "object") {
      return Response.json({
        reply: "I could not parse your request. Please try again.",
        layoutSuggestions: [],
        contrastSuggestions: [],
        themeSuggestions: [],
        actions: [],
      })
    }

    // Check if user explicitly asked for theme changes with VERY strict keywords
    const instructionLower = instruction.toLowerCase()
    const askedForTheme = /\bapply\s+theme|\bchange\s+theme|\bswitch\s+theme|\buse\s+theme|\bdark\s+theme|\blight\s+theme|\bapply\s+dark|\bapply\s+light/.test(instructionLower)

    // Filter actions: only include theme actions if user explicitly asked for them
    const filteredActions = (Array.isArray(parsed.actions) ? parsed.actions : []).filter(action => {
      if (action.kind === "theme") {
        return askedForTheme
      }
      return true
    })

    // ALWAYS force empty suggestion arrays - never return suggestions
    const normalized = {
      reply: String(parsed.reply || "Done.").replace(/suggestions?.*(focus|improve|better|readability|contrast|layout|visual)/gi, "").trim(),
      layoutSuggestions: [],
      contrastSuggestions: [],
      themeSuggestions: [],
      actions: filteredActions,
    }

    chatDoc.pageUrl = String(body.url || chatDoc.pageUrl || "")
    chatDoc.selectedSelector = selectedElement?.effectiveSelector || selectedElement?.selector || chatDoc.selectedSelector
    chatDoc.selectedTag = selectedElement?.effectiveTag || selectedElement?.tag || chatDoc.selectedTag
    chatDoc.messages.push(
      { role: "user", content: instruction, meta: { selectedElement, activeTheme } },
      { role: "assistant", content: normalized.reply, meta: normalized }
    )
    await chatDoc.save()

    return Response.json({
      sessionId: chatDoc.sessionId,
      ...normalized,
      messages: chatDoc.messages.slice(-20),
    })
  } catch (err) {
    console.error("Assistant route failed:", err)
    return Response.json({ error: err.message || "Assistant failed" }, { status: 500 })
  }
}
