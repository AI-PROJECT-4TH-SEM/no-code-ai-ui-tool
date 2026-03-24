import puppeteer from "puppeteer"
import { AxePuppeteer } from "@axe-core/puppeteer"
import { CohereClient } from "cohere-ai"
import { mapAxeToFix } from "@/lib/fixEngine/rules"
const cohere = new CohereClient({ token: process.env.COHERE_KEY })
 import { buildContrastFix } from "@/lib/fixEngine/contrast"

export async function POST(req) {
  let browser

  try {
    const { html, url } = await req.json()

    if (!html && !url) {
      return Response.json({ error: "No input" }, { status: 400 })
    }

    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })

    const page = await browser.newPage()

    if (html) {
      await page.setRequestInterception(true)
      page.on("request", (req) => req.abort())
      await page.setContent(html, { waitUntil: "domcontentloaded" })
    } else {
      const finalUrl = url.startsWith("http") ? url : "https://" + url
      await page.goto(finalUrl, { waitUntil: "networkidle2", timeout: 60000 })
    }

    const axeResults = await new AxePuppeteer(page).analyze()
   
// extract real colors for every color-contrast violation node
const contrastFixes = {}

for (const v of axeResults.violations.filter(v => v.id === "color-contrast")) {
  for (const node of v.nodes.slice(0, 3)) {
    const selector = node.target?.[0]
    if (!selector) continue
    try {
      const colors = await page.evaluate((sel) => {
        const el = document.querySelector(sel)
        if (!el) return null
        const s = window.getComputedStyle(el)
        return { color: s.color, background: s.backgroundColor }
      }, selector)

      if (colors) {
        const fix = buildContrastFix(selector, colors.color, colors.background)
        if (fix) contrastFixes[selector] = fix
      }
    } catch {}
  }
}

    console.log("VIOLATIONS FOUND:", axeResults.violations.length)
    console.log("VIOLATION IDS:", axeResults.violations.map(v => v.id))

    const violations = axeResults.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      help: v.help,
      helpUrl: v.helpUrl,
      nodes: v.nodes.slice(0, 3).map((n) => ({
        html: n.html,
        target: n.target,
        failureSummary: n.failureSummary,
      })),
    }))

    const impactWeights = { critical: 25, serious: 15, moderate: 8, minor: 3 }
    const totalDeductions = violations.reduce(
      (sum, v) => sum + (impactWeights[v.impact] || 0),
      0
    )
    const score = Math.max(0, 100 - totalDeductions)

    const response = await cohere.chat({
      model: "command-a-03-2025",
      message: `
You are an accessibility expert.

Here are axe-core violations found on a webpage:
${JSON.stringify(violations, null, 2)}

For each violation return a JSON array:

[
  {
    "id": "violation-id",
    "impact": "critical/serious/moderate/minor",
    "title": "short human friendly title",
    "explanation": "simple plain English explanation of why this is a problem",
    "fixDescription": "exactly what the developer needs to do to fix it",
    "domFix": {
      "type": "setAttribute",
      "selector": "exact css selector from the violation nodes target field",
      "attribute": "the attribute to set",
      "value": "meaningful value based on the actual HTML of the element"
    }
  }
]

Rules:
- Return ONLY the JSON array
- No markdown
- No explanation outside the JSON
- Use the selector exactly from the violation nodes target field
- If fix is too complex set domFix to null
- Make values context aware based on the actual HTML
      `,
    })

    const rawText = (response.text ?? "").replace(/```json|```/g, "").trim()

    const suggestions = parsed.map(s => {
  if (s.id === "color-contrast" && !s.domFix) {
    const selector = s.domFix?.selector ?? violations
      .find(v => v.id === "color-contrast")
      ?.nodes[0]?.target?.[0]
    if (selector && contrastFixes[selector]) {
      return { ...s, domFix: contrastFixes[selector] }
    }
  }
  return s
})

    // deduplicate by id
    const seen = new Set()
   const dedupedSuggestions = suggestions
  .filter((s) => {
    if (seen.has(s.id)) return false
    seen.add(s.id)
    return true
  })
  .map((s) => {
    // 🔥 fallback to heuristics if AI gives null
    if (!s.domFix) {
      const fallbackFix = mapAxeToFix(s)
      if (fallbackFix) {
        return { ...s, domFix: fallbackFix }
      }
    }
    return s
  })

    console.log("SUGGESTIONS:", JSON.stringify(dedupedSuggestions, null, 2))

    return Response.json({ score, violations: violations.length, suggestions: dedupedSuggestions })

  } catch (err) {
    console.error("Analyse error:", err)
    return Response.json({ error: err.message || "Analysis failed" }, { status: 500 })
  } finally {
    if (browser) await browser.close()
  }
}