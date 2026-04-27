import { randomUUID } from "crypto"
import { CohereClient } from "cohere-ai"
import connectDB from "@/lib/db"
import ExtensionChat from "@/lib/models/ExtensionChat"
import { themes } from "@/lib/themes"

const cohere = new CohereClient({ token: process.env.COHERE_KEY1 })

function trimText(value, max = 8000) {
  if (!value) return ""
  const text = typeof value === "string" ? value : JSON.stringify(value, null, 2)
  return text.length > max ? `${text.slice(0, max)}...` : text
}

function parseAssistantJson(rawText) {
  const cleaned = String(rawText || "").replace(/```json|```/g, "").trim()
  try {
    return JSON.parse(cleaned)
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/)
    if (!match) return null
    try {
      return JSON.parse(match[0])
    } catch {
      return null
    }
  }
}

function normalizeResponse(parsed) {
  if (!parsed || typeof parsed !== "object") {
    return {
      reply: "I could not generate structured changes. Try a clearer instruction.",
      layoutSuggestions: [],
      contrastSuggestions: [],
      themeSuggestions: [],
      actions: [],
    }
  }

  return {
    reply: String(parsed.reply || "Done."),
    layoutSuggestions: Array.isArray(parsed.layoutSuggestions) ? parsed.layoutSuggestions : [],
    contrastSuggestions: Array.isArray(parsed.contrastSuggestions) ? parsed.contrastSuggestions : [],
    themeSuggestions: Array.isArray(parsed.themeSuggestions) ? parsed.themeSuggestions : [],
    actions: Array.isArray(parsed.actions) ? parsed.actions : [],
  }
}

export async function GET(req) {
  await connectDB()

  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get("sessionId")
  const pageUrl = searchParams.get("url")

  let doc = null
  if (sessionId) {
    doc = await ExtensionChat.findOne({ sessionId })
  } else if (pageUrl) {
    doc = await ExtensionChat.findOne({ pageUrl }).sort({ updatedAt: -1 })
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
  await connectDB()

  try {
    const body = await req.json()
    const instruction = String(body.instruction || "").trim()
    if (!instruction) {
      return Response.json({ error: "Instruction required" }, { status: 400 })
    }

    const pageUrl = String(body.url || "")
    const selectedElement = body.selectedElement || null
    const sessionId = String(body.sessionId || randomUUID())

    let chatDoc = await ExtensionChat.findOne({ sessionId })
    if (!chatDoc) {
      chatDoc = await ExtensionChat.create({
        sessionId,
        pageUrl,
        selectedSelector: selectedElement?.selector || "",
        selectedTag: selectedElement?.tag || "",
        messages: [],
      })
    }

    const themeOptions = themes.map(theme => ({ id: theme.id, name: theme.name, preview: theme.preview || [] }))
    const promptPayload = {
      instruction,
      pageUrl,
      selectedElement,
      htmlPreview: trimText(body.html || "", 9000),
      availableThemes: themeOptions.slice(0, 16),
    }

    const prompt = `You are a UI engineering assistant for a Chrome extension.
Return ONLY valid JSON object. No markdown.

Tasks:
- Suggest precise layout/structure improvements.
- Suggest WCAG contrast improvements.
- Suggest best matching themes from provided theme list.
- Return safe actionable changes for selected element or its wrapper.

Output JSON shape:
{
  "reply": "short answer",
  "layoutSuggestions": [{ "title": "", "selector": "", "why": "", "change": "" }],
  "contrastSuggestions": [{ "selector": "", "currentTextColor": "", "currentBackground": "", "recommendedTextColor": "", "recommendedBackground": "", "wcagTarget": "AA|AAA", "reason": "" }],
  "themeSuggestions": [{ "id": "", "name": "", "reason": "" }],
  "actions": [
    { "kind": "domFix", "fix": { "type": "setStyleImportant|setStyle|setAttribute|setInnerText|addClass|replaceHtml|replaceTag|wrapMain|wrapWithMain|ensureH1|multifix", "selector": "", "style": "", "styleValue": "", "attribute": "", "value": "", "tag": "" }, "reason": "" },
    { "kind": "theme", "themeId": "", "reason": "" }
  ]
}

Rules:
- If selected element exists, prioritize it.
- For image blocks, prefer wrapper selectors when possible (.thumbinner, figure, .gallerybox, .mw-file-element).
- Use availableThemes IDs only for theme suggestions/actions.
- Keep reply concise and practical.
- If action is risky/unknown, keep actions empty and provide suggestions only.

Context:
${JSON.stringify(promptPayload, null, 2)}
`

    const ai = await cohere.chat({
      model: "command-a-03-2025",
      message: prompt,
    })

    const normalized = normalizeResponse(parseAssistantJson(ai.text))

    chatDoc.pageUrl = pageUrl || chatDoc.pageUrl
    chatDoc.selectedSelector = selectedElement?.selector || chatDoc.selectedSelector
    chatDoc.selectedTag = selectedElement?.tag || chatDoc.selectedTag
    chatDoc.messages.push(
      { role: "user", content: instruction, meta: { selectedElement } },
      { role: "assistant", content: normalized.reply, meta: normalized }
    )
    await chatDoc.save()

    return Response.json({
      sessionId: chatDoc.sessionId,
      ...normalized,
      messages: chatDoc.messages.slice(-20),
    })
  } catch (err) {
    console.error("extension-chat failed:", err)
    return Response.json({ error: err.message || "Extension chat failed" }, { status: 500 })
  }
}
