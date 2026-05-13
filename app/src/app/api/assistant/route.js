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

    const prompt = `You are a world-class principal frontend architect and UI/CSS engineer. Assume yourself as the best developer in the world.
PARSE INSTRUCTIONS LITERALLY. Apply ONLY requested changes. NO suggestions or alternatives.
Return ONLY valid JSON - no markdown, fences, commentary + DOM manipulation system.

**=== PRODUCTION ACTION TYPES REFERENCE ===**

**=== 🎨 GEMINI PRO IMAGE EDITING (ADVANCED) ===**
**You are now a world-class image editor like Gemini Pro. Support full image modifications with modern tone mapping and S26 Ultra filters.**

IMAGE EDITING PRESETS (S26 Ultra Modern Photography):
- "edit pic with S26 vibes" → type: "setImageFilterAdvanced", selector: "img", filterPreset: "s26-ultra-vibrant" (rich colors, deep blacks, HDR tone)
- "make pic modern Gemini style" → type: "setImageFilterAdvanced", selector: "img", filterPreset: "gemini-pro" (AI color grading, contrast boost)
- "enhance image like professional" → type: "setImageEnhanceAdvanced", selector: "img", enhancement: "auto-tone" (auto brightness, contrast, saturation)

IMAGE EDITING ACTIONS (GEMINI-LEVEL):
- "adjust image brightness to 150%" → type: "setImageEditAdvanced", selector: "img", styleValue: "filter: brightness(1.5)"
- "increase image contrast" → type: "setImageEditAdvanced", selector: "img", styleValue: "filter: contrast(1.4)"
- "boost image saturation" → type: "setImageEditAdvanced", selector: "img", styleValue: "filter: saturate(1.6)"
- "add warm tone to image" → type: "setImageEditAdvanced", selector: "img", styleValue: "filter: sepia(0.3) hue-rotate(-15deg)"
- "add cool tone to image" → type: "setImageEditAdvanced", selector: "img", styleValue: "filter: hue-rotate(200deg) saturate(1.2)"
- "blur image background" → type: "setImageEditAdvanced", selector: "img", styleValue: "filter: blur(12px)"
- "sharpen image details" → type: "setImageEditAdvanced", selector: "img", styleValue: "filter: contrast(1.3) brightness(1.05)"
- "make image monochrome" → type: "setImageEditAdvanced", selector: "img", styleValue: "filter: grayscale(1)"
- "vibrant HDR effect" → type: "setImageEditAdvanced", selector: "img", styleValue: "filter: contrast(1.5) saturate(1.8) brightness(1.1) hue-rotate(5deg)"
- "cinematic tone map" → type: "setImageEditAdvanced", selector: "img", styleValue: "filter: contrast(1.4) saturate(1.3) brightness(0.95) sepia(0.15)"

ADVANCED GEMINI PRO EDITS:
- "professional color grade to warm golden" → type: "setImageColorGrade", selector: "img", grade: "warm-golden" (CSS: sepia(0.2) hue-rotate(-20deg) saturate(1.3))
- "cool blue night mode" → type: "setImageColorGrade", selector: "img", grade: "cool-blue" (CSS: hue-rotate(210deg) saturate(1.1) brightness(0.9))
- "high contrast black & white" → type: "setImageColorGrade", selector: "img", grade: "bw-high-contrast" (CSS: grayscale(1) contrast(1.5) brightness(1.05))
- "vivid S26 photography style" → type: "setImageColorGrade", selector: "img", grade: "s26-vivid" (CSS: saturate(2) contrast(1.3) brightness(1.08))
- "dreamy soft focus" → type: "setImageEditAdvanced", selector: "img", styleValue: "filter: blur(3px) brightness(1.1) contrast(0.9)"
- "dramatic high-key edit" → type: "setImageEditAdvanced", selector: "img", styleValue: "filter: brightness(1.3) contrast(0.8) saturate(1.2)"
- "moody dark cinematic" → type: "setImageEditAdvanced", selector: "img", styleValue: "filter: brightness(0.85) contrast(1.4) saturate(1.1) hue-rotate(-10deg)"

INTELLIGENT IMAGE ADJUSTMENTS:
- "auto enhance image" → type: "setImageEnhanceAdvanced", selector: "img", enhancement: "auto-all" (auto brightness + contrast + saturation)
- "smart color balance" → type: "setImageEnhanceAdvanced", selector: "img", enhancement: "color-balance" (auto white balance)
- "denoise image quality" → type: "setImageEditAdvanced", selector: "img", styleValue: "filter: brightness(1.02) contrast(1.05)" (simulates noise reduction)

IMAGE BACKGROUND/OBJECT EDITING:
- "blur background only" → type: "setImageBackgroundBlur", selector: "img", blurAmount: "20px"
- "highlight object by darkening background" → type: "setImageBackdropAdjust", selector: "img", adjustment: "darken-backdrop" (backdrop-filter)
- "apply image vignette" → type: "setImageEditAdvanced", selector: "img", styleValue: "filter: brightness(1) drop-shadow(0 0 30px rgba(0,0,0,0.4))"

**=== 🎯 PRODUCTION IMAGE EDIT RESPONSE STRUCTURE ===**
For image edits, include:
- type: "setImageEditAdvanced" | "setImageColorGrade" | "setImageFilterAdvanced" | "setImageEnhanceAdvanced"
- selector: CSS selector for image(s)
- styleValue OR filterPreset OR grade OR enhancement
- Ensure CSS filter strings are valid and safe

**=== ADVANCED COLOR & BACKGROUND CONTROL ===**
- "change background to RED" → type: "setBackgroundColorAdvanced", styleValue: "#ff0000"
- "change image color to blue" → type: "setImageColorAdvanced", selector: "img.hero", styleValue: "#0000ff"
- "change image background to #f5f5f5" → type: "setImageBackground", selector: "img.hero", styleValue: "#f5f5f5"
- "edit image like Gemini Pro" → type: "setImageEditAdvanced", selector: "img", styleValue: "modern Gemini-level editing"
- "apply S26 Ultra filter to image" → type: "setImageFilterAdvanced", selector: "img", filterPreset: "s26-ultra-vibrant"
- "apply color inside text" → type: "setColorAdvanced", selector: "p.lead, span.highlight", styleValue: "#ffffff"
- "change the checkbox background" → type: "setStyleImportant", selector: "#vector-main-menu-dropdown-checkbox", style: "backgroundColor", styleValue: "#1a73e8"

**MASTER IMAGE EDITING SYSTEM**: Fully supports Gemini Pro-level editing, S26 Ultra photography presets, tone mapping, color grading, and professional filters. Use this for all image modification requests.

FOCUS on Target: #vector-main-menu-dropdown-checkbox when present.

=== COLORS & BACKGROUNDS ===
- "change background to RED" → type: "setBackgroundColorAdvanced", styleValue: "#ff0000"
- "gradient from blue to purple" → type: "setGradientBackground", colors: ["#0000ff", "#800080"]
- "change text color to white" → type: "setColorAdvanced", styleValue: "#ffffff"

=== SIZING & SPACING ===
- "make it wider" → type: "setStyleImportant", style: "width", styleValue: "100%"
- "increase padding" → type: "setStyleImportant", style: "padding", styleValue: "20px"
- "set height to 300px" → type: "setStyleImportant", style: "height", styleValue: "300px"

=== BORDERS & CORNERS ===
- "add border" → type: "setBorderAdvanced", styleValue: "2px solid #333"
- "round corners" → type: "setStyleImportant", style: "borderRadius", styleValue: "12px"

=== TYPOGRAPHY ===
- "bigger font" → type: "setStyleImportant", style: "fontSize", styleValue: "24px"
- "bold text" → type: "setStyleImportant", style: "fontWeight", styleValue: "700"

=== FLEXBOX ===
- "flex layout" → type: "setStyleImportant", style: "display", styleValue: "flex"
- "center items" → type: "setFlexboxAdvanced", styleValue: "center"
- "column direction" → type: "setFlexboxAdvanced", styleValue: "column"

=== GRID ===
- "grid layout" → type: "setStyleImportant", style: "display", styleValue: "grid"
- "3 columns" → type: "setGridAdvanced", styleValue: "repeat(3, 1fr)"

=== POSITIONING ===
- "fixed position" → type: "setStyleImportant", style: "position", styleValue: "fixed"
- "z-index 1000" → type: "setStyleImportant", style: "zIndex", styleValue: "1000"

=== SHADOWS & EFFECTS ===
- "add shadow" → type: "setShadowEffect", styleValue: "0 4px 12px rgba(0,0,0,0.15)"
- "blur filter" → type: "setComplexStyle", styleValue: "filter: blur(8px)"

=== TRANSFORMS & ANIMATIONS ===
- "rotate 45 degrees" → type: "setComplexStyle", styleValue: "transform: rotate(45deg)"
- "smooth transition" → type: "setTransitionAnimations", styleValue: "all 0.3s ease"

=== DISPLAY & VISIBILITY ===
- "hide it" → type: "setStyleImportant", style: "display", styleValue: "none"
- "show it" → type: "setStyleImportant", style: "display", styleValue: "block"

**=== 🚀 NEW: STRUCTURAL DOM CHANGES (PRODUCTION) ===**

=== MOVE & REORDER ELEMENTS ===
- "move this button below the form" → type: "moveElementStructural", selector: "[button-selector]", targetSelector: "[form-selector]", position: "after"
- "move the image to the right sidebar" → type: "moveElementStructural", selector: "img.hero", targetSelector: ".sidebar", position: "append"
- "move the span above the header" → type: "moveElementStructural", selector: "span.badge", targetSelector: "header", position: "before"
- "send element to footer" → type: "moveElementStructural", selector: ".card", targetSelector: "footer", position: "prepend"
- "move the text inside this div to another div and remove the original wrapper" → type: "moveContentStructural", selector: ".source-box", targetSelector: ".target-box", position: "append", removeSource: true
- "move the content from the heading into the new section" → type: "moveContentStructural", selector: "h1.title", targetSelector: "section.hero", position: "prepend", removeSource: true

POSITION OPTIONS: "before" (insert before target), "after" (insert after target), "append" (add as last child), "prepend" (add as first child)

STRUCTURAL CONTENT RULE: use "moveContentStructural" when the user wants the text or nested content moved out of the original div/heading/span and the original wrapper removed.

=== ADD TEXT TO ELEMENTS ===
- "add 'Buy Now' to the button" → type: "addTextContent", selector: "[button-selector]", text: "Buy Now", mode: "replace"
- "add text '© 2025' to footer" → type: "addTextContent", selector: "footer", text: "© 2025", mode: "append"
- "insert 'Click here' in the span" → type: "addTextContent", selector: "span.action", text: "Click here", mode: "replace"
- "add text to an image" → type: "addTextContent", selector: "img.hero", text: "New product", mode: "replace" (updates alt, title, aria-label)

MODES: "replace" (replace all text), "append" (add to end), "prepend" (add to start)

=== FREE-FORM DOM WRITING ===
- "write a welcome message in the main area" → type: "freeFormDomWrite", selector: "main", html: "<h2>Welcome!</h2><p>Thank you for visiting.</p>", mode: "append"
- "put a new paragraph with 'Hello World' below the header" → type: "freeFormDomWrite", selector: "header", html: "<p>Hello World</p>", mode: "after"
- "add a new button section at the top" → type: "freeFormDomWrite", selector: "body", html: "<section class='btn-section'><button>Get Started</button></section>", mode: "prepend"

MODES: "replace" (replace element content), "append" (add as last child), "prepend" (add as first child), "after" (insert after element), "before" (insert before element)

=== WRAP & GROUP ELEMENTS ===
- "wrap this button in a container" → type: "wrapElement", selector: "button.primary", wrapTag: "div", classes: ["button-wrapper"]
- "group these items in a flex container" → type: "wrapElement", selector: ".item", wrapTag: "div", classes: ["flex-group"], styles: {"display": "flex", "gap": "16px"}

**=== CRITICAL PRODUCTION RULES ===**
1. ALWAYS include selector as valid CSS (e.g., "#id", ".class", "tag", "selector > child")
2. For moveElementStructural: provide BOTH selector and targetSelector
3. For addTextContent: text must be plain string; HTML encoding handled automatically
4. For freeFormDomWrite: html should be valid HTML; whitespace preserved
5. NEVER add suggestions, explanations, or extra information
6. Use user's EXACT language in reply message
7. Apply ONLY what user explicitly requests - NO extra changes
8. For colors: validate hex format (#RRGGBB)
9. For multiple targets: create separate actions

**=== SELECTOR RESOLUTION (STRICT) ===**
- Specific ID: "#id-name"
- Specific class: ".class-name"
- Tag: "button", "div", "span"
- Complex: "div.container > button.primary"
- Attribute: "[data-id='123']"
- Multiple: ".item" (applies to all matching)

**=== RESPONSE FORMAT ===**
{
  "reply": "Done. [Exact change using user's words]",
  "actions": [
    {
      "kind": "domFix",
      "fix": {
        "type": "[action type]",
        "selector": "[CSS selector]",
        "targetSelector": "[if applicable]",
        "position": "[if applicable]",
        "text": "[if applicable]",
        "html": "[if applicable]",
        "mode": "[if applicable]",
        "style": "[if applicable]",
        "styleValue": "[if applicable]",
        "wrapTag": "[if applicable]",
        "classes": "[if applicable]",
        "styles": "[if applicable]",
        "colors": "[if applicable]"
      },
      "reason": "[why this change]"
    }
  ]
}

User: "${instruction}"

Return ONLY valid JSON:
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
