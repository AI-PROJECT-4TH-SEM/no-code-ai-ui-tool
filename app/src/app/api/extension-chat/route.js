import { randomUUID } from "crypto"
import { CohereClient } from "cohere-ai"
import connectDB from "@/lib/db"
import ExtensionChat from "@/lib/models/ExtensionChat"
import { themes } from "@/lib/themes"

const cohere = new CohereClient({ token: process.env.COHERE_KEY1})

// WCAG 2.1 Color validation & mapping
const colorMap = {
  blue: ["#0066FF", "#1E90FF", "#0052CC", "#0078D4"],
  yellow: ["#FFD700", "#FFEB3B", "#FFC107", "#FFE082"],
  green: ["#00AA00", "#228B22", "#00CC00", "#00AA55"],
  red: ["#FF0000", "#DC143C", "#E74C3C", "#FF3333"],
  orange: ["#FF8C00", "#FF9500", "#FFA500", "#FF9D00"],
  black: ["#000000", "#0D0D0D", "#1A1A1A", "#0F0F0F"],
  white: ["#FFFFFF", "#FAFAFA", "#F5F5F5", "#EEEEEE"],
  purple: ["#9C27B0", "#7C3AED", "#8B3A8E", "#A020F0"],
  cyan: ["#00BCD4", "#00D4FF", "#00E5FF", "#17A2B8"],
  pink: ["#FF1493", "#FF69B4", "#FF6B9D", "#FB0099"],
  brown: ["#8B4513", "#A0522D", "#8B6F47", "#966633"],
  gray: ["#808080", "#999999", "#AAAAAA", "#999999"],
  navy: ["#000080", "#0E1B3C", "#1B3A5C", "#112D66"],
  teal: ["#008080", "#20B2AA", "#48D1CC", "#00B4B4"],
  lime: ["#00FF00", "#32CD32", "#7FFF00", "#00FF7F"],
  indigo: ["#4B0082", "#6A5ACD", "#7851A9", "#5D4E84"],
}

// Contrast ratio calculator (WCAG 2.1)
function getContrastRatio(color1, color2) {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)
  const lum1 = getRelativeLuminance(rgb1)
  const lum2 = getRelativeLuminance(rgb2)
  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)
  return (lighter + 0.05) / (darker + 0.05)
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : { r: 0, g: 0, b: 0 }
}

function getRelativeLuminance(rgb) {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b]
  const rsRGB = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4)
  const gsRGB = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4)
  const bsRGB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4)
  return 0.2126 * rsRGB + 0.7152 * gsRGB + 0.0722 * bsRGB
}

// Get appropriate color based on request
function getColorFromRequest(instruction, userColor = "") {
  const lower = (instruction + userColor).toLowerCase()
  
  for (const [color, hexes] of Object.entries(colorMap)) {
    if (lower.includes(color)) {
      return hexes[0] // Return primary hex for this color
    }
  }
  
  return null
}

// WCAG AAA contrast verification
function verifyContrast(textColor, bgColor) {
  const ratio = getContrastRatio(textColor, bgColor)
  return {
    ratio: parseFloat(ratio.toFixed(2)),
    passesAAA: ratio >= 7, // AAA = 7:1
    passesAA: ratio >= 4.5, // AA = 4.5:1
  }
}

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
    console.warn("⚠️ Invalid parsed response:", parsed)
    return {
      reply: "I could not generate structured changes. Try a clearer instruction.",
      layoutSuggestions: [],
      contrastSuggestions: [],
      actions: [],
    }
  }

  // Validate and format actions
  const validatedActions = (Array.isArray(parsed.actions) ? parsed.actions : [])
    .filter(action => {
      // Remove theme actions (not for chatbot)
      if (action?.kind === "theme") return false
      
      // Keep domFix actions only
      if (action?.kind !== "domFix" && action?.fix?.type !== "setStyleImportant") {
        // Some actions might have fix but no kind
        if (!action?.fix) return false
      }
      
      return true
    })
    .map(action => {
      // Normalize action structure
      if (!action?.fix?.type) {
        // Add type if missing
        if (action?.fix?.style) {
          action.fix.type = "setStyleImportant"
        }
      }
      
      // Validate selector exists
      if (!action?.fix?.selector) {
        console.warn("⚠️ Action missing selector:", action)
        return null
      }
      
      // Validate style value for color changes
      if (action.fix?.style === "color" && action.fix?.styleValue) {
        const hex = String(action.fix.styleValue).trim()
        if (!/^#[0-9A-F]{6}$/i.test(hex) && !hex.match(/^rgba?|^hsl/i)) {
          console.warn("⚠️ Invalid color value:", hex)
          // Don't skip, let browser handle it
        }
      }
      
      // Ensure !important is applied
      if (!action?.fix?.type) {
        action.fix.type = "setStyleImportant"
      }
      
      return action
    })
    .filter(Boolean) // Remove nulls

  console.log("✅ Validated", validatedActions.length, "actions for DOM application")

  return {
    reply: String(parsed.reply || "Done."),
    layoutSuggestions: Array.isArray(parsed.layoutSuggestions) ? parsed.layoutSuggestions : [],
    contrastSuggestions: Array.isArray(parsed.contrastSuggestions) ? parsed.contrastSuggestions : [],
    actions: validatedActions,
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

    const prompt = `You are a UI/CSS modification expert for webpages. Generate DOM fixes for the user's request.
Return ONLY valid JSON with no markdown or commentary.

INSTRUCTION: "${instruction}"

${selectedElement ? `
**CRITICAL: SELECTED ELEMENT MODE**
You MUST only modify the selected element:
- Element: <${selectedElement.tag}> ${selectedElement.className ? `class="${selectedElement.className}"` : ""} ${selectedElement.id ? `id="${selectedElement.id}"` : ""}
- Selector to use: "${selectedElement.selector}"
- RULE: Every action MUST use this exact selector: "${selectedElement.selector}"
- NEVER create actions for siblings, parent, or other elements
- Apply ONLY to the selected element, nothing else
` : `
**WHOLE PAGE MODE**
Generate fixes for matching elements across the entire page.
Consider: headers (h1-h6), buttons, images, text, navigation, cards, etc.
`}

SUPPORTED FIX TYPES (in order of preference):
1. **setStyleImportant** ⭐ Most Reliable
   - Apply any CSS property with !important
   - Properties: color, background-color, font-size, margin, padding, width, height, display, position, border, border-radius, box-shadow, opacity, transform, etc.
   - Example: { type: "setStyleImportant", style: "color", styleValue: "#FF0000" }
   - Example: { type: "setStyleImportant", style: "padding", styleValue: "20px" }
   - Example: { type: "setStyleImportant", style: "font-size", styleValue: "18px" }

2. **setColorAdvanced** - For text colors
   - Use for: text, foreground colors, link colors
   - Example: { type: "setColorAdvanced", styleValue: "#FF0000" }

3. **setBackgroundColorAdvanced** - For background colors
   - Use for: background, container colors
   - Example: { type: "setBackgroundColorAdvanced", styleValue: "#FF0000" }

4. **setHeaderTextColorAdvanced** - For all header elements
   - Applies to: h1, h2, h3, h4, h5, h6, header, [role="banner"], .header, .navbar
   - Example: { type: "setHeaderTextColorAdvanced", styleValue: "#FF0000" }

5. **setImageColorAdvanced** - For images (uses CSS filters)
   - Example: { type: "setImageColorAdvanced", styleValue: "#FF0000" }

6. **setIconColorAdvanced** - For SVG icons
   - Example: { type: "setIconColorAdvanced", styleValue: "#FF0000" }

7. **setTextColorUniversal** - Apply color to ALL text in element
   - Example: { type: "setTextColorUniversal", styleValue: "#FF0000" }

INSTRUCTION INTERPRETATION:
- "make it red" → color: #FF0000
- "make background blue" → background-color: #0066FF
- "add padding" → padding: 20px
- "make text bigger" → font-size: 18px or 24px
- "make bold" → font-weight: 700
- "center" → text-align: center or margin: auto with width
- "increase spacing" → margin or padding with appropriate value
- "hide" → display: none
- "round corners" → border-radius: 12px or 8px
- "add shadow" → box-shadow: 0 4px 12px rgba(0,0,0,0.2)
- "change border" → border: 2px solid #color

COLOR NAMES MAPPING:
- red: #FF0000, blue: #0066FF, green: #00CC00, yellow: #FFD700
- purple: #9C27B0, pink: #FF1493, orange: #FF8C00, gray: #808080
- black: #000000, white: #FFFFFF, cyan: #00BCD4, brown: #8B4513

ACTION FORMAT (ALWAYS JSON):
{
  "kind": "domFix",
  "fix": {
    "type": "FIX_TYPE_HERE",
    "selector": "CSS_SELECTOR_HERE",
    "style": "css-property" OR "styleValue": "value_here"
  }
}

${selectedElement ? `
SELECTED ELEMENT MODE RULES:
- Use ONLY selector: "${selectedElement.selector}"
- Generate 1-3 focused actions
- Match the fix type to the instruction
- Every action must have selector: "${selectedElement.selector}"
` : `
WHOLE PAGE MODE RULES:
- Generate 1-5 actions for different element types
- For "apply red to all text": use universal selectors or multiple actions
- For "style everything": create actions for headers, text, buttons, backgrounds
- Use selectors like: "h1, h2, h3", "p, span, a", "button", "img", etc.
`}

RESPONSE FORMAT (STRICT JSON):
{
  "reply": "Brief explanation of what was applied",
  "actions": [
    { "kind": "domFix", "fix": { "type": "setStyleImportant", "selector": "${selectedElement ? selectedElement.selector : "p"}", "style": "color", "styleValue": "#FF0000" } }
  ],
  "layoutSuggestions": [],
  "contrastSuggestions": []
}

CRITICAL REMINDERS:
1. Always include "kind": "domFix" for each action
2. Always include a "selector" in the fix object
3. Always include "type" and at least "style"+"styleValue" or just "styleValue"
4. Return valid JSON only - no markdown, no code blocks
5. For unknown instructions, default to setStyleImportant
`

    const response = await cohere.chat({
      model: "command-a-03-2025",
      message: prompt,
      max_tokens: 1000,
      temperature: 0.4,
    })

    const raw = String(response.text || "").replace(/```json|```/g, "").trim()
    const parsed = parseAssistantJson(raw)
    const normalized = normalizeResponse(parsed)

    // Update session
    chatDoc.pageUrl = pageUrl
    chatDoc.selectedSelector = selectedElement?.selector || chatDoc.selectedSelector
    chatDoc.selectedTag = selectedElement?.tag || chatDoc.selectedTag
    chatDoc.messages.push(
      { role: "user", content: instruction },
      { role: "assistant", content: normalized.reply }
    )
    if (chatDoc.messages.length > 100) {
      chatDoc.messages = chatDoc.messages.slice(-100)
    }
    await chatDoc.save()

    return Response.json({
      success: true,
      sessionId,
      pageUrl,
      ...normalized,
      messages: chatDoc.messages.slice(-20),
    })
  } catch (err) {
    console.error("Extension chat POST failed:", err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
