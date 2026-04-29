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

    const prompt = `You are a comprehensive UI/UX modification system supporting ALL modern CSS features and structural DOM changes.
Parse user instructions literally. Apply ONLY requested changes. No suggestions or alternatives.
Return ONLY valid JSON with no markdown, code fences, or commentary.

**COMPREHENSIVE ACTION TYPES REFERENCE:**

=== COLORS & BACKGROUNDS ===
- "change background to RED" → type: "setBackgroundColorAdvanced", styleValue: "#ff0000"
- "gradient from blue to purple" → type: "setGradientBackground", colors: ["#0000ff", "#800080"]
- "change text color to white" → type: "setColorAdvanced", styleValue: "#ffffff"
- "change icon color to green" → type: "setIconColorAdvanced", styleValue: "#00ff00"

=== SIZING & SPACING ===
- "make it wider" → type: "setStyleImportant", style: "width", styleValue: "100%"
- "increase padding" → type: "setStyleImportant", style: "padding", styleValue: "20px"
- "add margin" → type: "setStyleImportant", style: "margin", styleValue: "16px"
- "set height to 300px" → type: "setStyleImportant", style: "height", styleValue: "300px"
- "max-width 500px" → type: "setStyleImportant", style: "maxWidth", styleValue: "500px"

=== BORDERS & CORNERS ===
- "add border" → type: "setBorderAdvanced", styleValue: "2px solid #333"
- "round corners" → type: "setStyleImportant", style: "borderRadius", styleValue: "12px"
- "dashed border" → type: "setBorderAdvanced", styleValue: "2px dashed #999"

=== TYPOGRAPHY ===
- "bigger font" → type: "setStyleImportant", style: "fontSize", styleValue: "24px"
- "bold text" → type: "setStyleImportant", style: "fontWeight", styleValue: "700"
- "line height 1.8" → type: "setStyleImportant", style: "lineHeight", styleValue: "1.8"
- "letter spacing" → type: "setStyleImportant", style: "letterSpacing", styleValue: "1px"
- "uppercase" → type: "setTextAdvanced", styleValue: "uppercase"

=== FLEXBOX ===
- "flex layout" → type: "setStyleImportant", style: "display", styleValue: "flex"
- "center items" → type: "setFlexboxAdvanced", styleValue: "center"
- "space between" → type: "setFlexboxAdvanced", styleValue: "space-between"
- "column direction" → type: "setFlexboxAdvanced", styleValue: "column"
- "gap 16px" → type: "setStyleImportant", style: "gap", styleValue: "16px"

=== GRID ===
- "grid layout" → type: "setStyleImportant", style: "display", styleValue: "grid"
- "3 columns" → type: "setGridAdvanced", styleValue: "repeat(3, 1fr)"
- "gap between items" → type: "setStyleImportant", style: "gap", styleValue: "20px"

=== POSITIONING ===
- "fixed position" → type: "setStyleImportant", style: "position", styleValue: "fixed"
- "absolute" → type: "setStyleImportant", style: "position", styleValue: "absolute"
- "z-index 1000" → type: "setStyleImportant", style: "zIndex", styleValue: "1000"
- "sticky" → type: "setStyleImportant", style: "position", styleValue: "sticky"

=== SHADOWS & EFFECTS ===
- "add shadow" → type: "setShadowEffect", styleValue: "0 4px 12px rgba(0,0,0,0.15)"
- "text shadow" → type: "setStyleImportant", style: "textShadow", styleValue: "2px 2px 4px rgba(0,0,0,0.3)"
- "blur filter" → type: "setComplexStyle", styleValue: "filter: blur(8px)"
- "opacity" → type: "setStyleImportant", style: "opacity", styleValue: "0.8"
- "backdrop blur" → type: "setComplexStyle", styleValue: "backdrop-filter: blur(10px)"

=== TRANSFORMS & ANIMATIONS ===
- "rotate 45 degrees" → type: "setComplexStyle", styleValue: "transform: rotate(45deg)"
- "scale up" → type: "setComplexStyle", styleValue: "transform: scale(1.2)"
- "smooth transition" → type: "setTransitionAnimations", styleValue: "all 0.3s ease"
- "animation" → type: "setTransitionAnimations", styleValue: "spin 2s linear infinite"

=== DISPLAY & VISIBILITY ===
- "hide it" → type: "setStyleImportant", style: "display", styleValue: "none"
- "show it" → type: "setStyleImportant", style: "display", styleValue: "block"
- "invisible" → type: "setStyleImportant", style: "visibility", styleValue: "hidden"

=== STRUCTURAL CHANGES (DOM) ===
- "wrap this in a div" → type: "setStructuralChange", action: "wrap", tag: "div"
- "make it a section" → type: "setStructuralChange", action: "replaceTag", tag: "section"
- "add a container" → type: "setStructuralChange", action: "wrapElement", tag: "div", classes: ["container"]

**CRITICAL RULES:**
1. ALWAYS include selector as CSS path (e.g., "#vector-main-menu-dropdown-checkbox" or ".button-primary" or "header > nav > ul")
2. For complex selectors, try direct ID/class first, then nth-child fallback
3. NEVER suggest themes, layouts redesigns, or additional changes
4. Use exact user instruction language in reply
5. Apply ONLY what user explicitly requests
6. For colors: validate hex format (#RRGGBB)
7. Multiple selectors: create separate actions

**SELECTOR RESOLUTION:**
- If user says "the button": use closest button selector
- If user says "#id-name": use exactly "#id-name"  
- If user says "the header": try "header", "header", ".header", "[role='banner']"
- Complex paths: "div.container > button.primary"

**YOUR RESPONSE:**
- reply: 1 sentence confirming EXACTLY what you changed (use user's words)
- actions: array of domFix objects with complete fix specifications

User: "${instruction}"

Return ONLY valid JSON (no markdown):
{
  "reply": "Done. [Specific change description]",
  "actions": [
    {
      "kind": "domFix",
      "fix": {
        "type": "action type from above",
        "selector": "valid css selector string",
        "style": "css property name or null",
        "styleValue": "complete value including units",
        "colors": ["#color1", "#color2"] (if gradient)
      },
      "reason": "why this change"
    }
  ]
}
`

    const response = await cohere.chat({
      model: "command-a-03-2025",
      message: prompt,
      max_tokens: 800,
      temperature: 0.3,
    })

    const raw = String(response.text || "").replace(/```json|```/g, "").trim()
    const parsed = safeJsonParse(raw)

    if (!parsed || typeof parsed !== "object") {
      return Response.json({
        reply: "I could not parse your request. Please try again.",
        layoutSuggestions: [],
        contrastSuggestions: [],
        actions: [],
      })
    }

    // Filter and validate actions with advanced color support
    const filteredActions = (Array.isArray(parsed.actions) ? parsed.actions : []).filter(action => {
      return action.kind === "domFix" && action.fix && action.fix.type
    }).map(action => {
      // Normalize action structure
      return {
        kind: "domFix",
        fix: {
          type: action.fix.type,
          selector: action.fix.selector || "",
          style: action.fix.style || null,
          styleValue: action.fix.styleValue || "",
          colors: action.fix.colors || [],
        },
        reason: action.reason || ""
      }
    })

    // Return optimized response
    const normalized = {
      reply: String(parsed.reply || "Done.").replace(/suggestions?.*(focus|improve|better|readability|contrast|layout|visual)/gi, "").trim(),
      layoutSuggestions: [],
      contrastSuggestions: [],
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
