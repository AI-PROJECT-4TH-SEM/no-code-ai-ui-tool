import puppeteer from "puppeteer"
import { AxePuppeteer } from "@axe-core/puppeteer"
import { CohereClient } from "cohere-ai"
import { mapAxeToFix } from "@/lib/fixEngine/rules"
import { buildContrastFix } from "@/lib/fixEngine/contrast"

const cohere = new CohereClient({ token: process.env.COHERE_KEY })

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

    // extract real computed colors — slice(0,10) to catch more failing nodes
    const contrastFixes = {}
    for (const v of axeResults.violations.filter(v => v.id === "color-contrast")) {
      for (const node of v.nodes.slice(0, 10)) {
        const rawTarget = node.target?.[0]
        const selector = typeof rawTarget === "string" ? rawTarget : rawTarget?.[0]
        if (!selector || typeof selector !== "string") continue

        try {
          const colors = await page.evaluate((sel) => {
            const el = document.querySelector(sel)
            if (!el) return null
            const fg = window.getComputedStyle(el).color

            let bg = "rgb(255, 255, 255)"
            let node = el
            while (node && node !== document.documentElement) {
              const nodeBg = window.getComputedStyle(node).backgroundColor
              if (nodeBg && nodeBg !== "rgba(0, 0, 0, 0)" && nodeBg !== "transparent") {
                bg = nodeBg
                break
              }
              node = node.parentElement
            }

            return { color: fg, background: bg }
          }, selector)

          if (colors) {
            const fix = buildContrastFix(selector, colors.color, colors.background)
            console.log("FIX BUILT:", selector, "→", fix?.styleValue ?? "null (already passes)")
            if (fix) contrastFixes[selector] = fix
          }
        } catch (err) {
          console.log("EVALUATE ERROR:", selector, err.message)
        }
      }
    }
    console.log("CONTRAST FIXES BUILT:", JSON.stringify(contrastFixes, null, 2))

    console.log("VIOLATIONS FOUND:", axeResults.violations.length)

    const violations = axeResults.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      help: v.help,
      helpUrl: v.helpUrl,
      nodes: v.nodes.slice(0, 10).map((n) => ({
        html: n.html,
        target: n.target,
        failureSummary: n.failureSummary,
      })),
    }))

    const impactWeights = { critical: 25, serious: 15, moderate: 8, minor: 3 }
    const totalDeductions = violations.reduce(
      (sum, v) => sum + (impactWeights[v.impact] || 0), 0
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
- No markdown, no explanation outside the JSON
- Use the selector exactly from the violation nodes target field
- Make values context aware based on the actual HTML
- For color-contrast violations always set domFix to null (handled separately)
- For "region" and "landmark-one-main" violations use type "wrapWithMain" and set
  selector to null. Do NOT select a specific child element. The fix engine will
  wrap all body content automatically.
- For "page-has-heading-one" use type "ensureH1" with no selector needed
- For "heading-order" violations use type "replaceTag", set selector to the 
  exact heading element, and set "tag" to the correct heading level (e.g. "h2").
  NEVER use setAttribute to change heading levels — it does not work.
`,
    })

    const rawText = (response.text ?? "").replace(/```json|```/g, "").trim()

    let parsed = []
    try {
      parsed = JSON.parse(rawText)
    } catch (err) {
      console.error("Cohere parse failed:", rawText)
      parsed = violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        title: v.help,
        explanation: v.description,
        fixDescription: v.nodes[0]?.failureSummary || "Fix manually",
        domFix: null,
      }))
    }

    // inject computed contrast fixes — collect ALL nodes
    const withContrastFixes = parsed.map(s => {
      if (s.id === "color-contrast") {
        const violation = violations.find(v => v.id === "color-contrast")

        const allFixes = []
        const failingSelectors = []

        for (const node of violation?.nodes ?? []) {
          const selector = node.target?.[0]
          if (selector && contrastFixes[selector]) {
            allFixes.push(contrastFixes[selector])
            failingSelectors.push(selector)
          }
        }

        if (allFixes.length > 0) {
          return {
            ...s,
            explanation: `${s.explanation} Failing elements: ${failingSelectors.join(", ")}`,
            domFix: {
              type: "multifix",
              fixes: allFixes
            }
          }
        }
      }
      return s
    })

    // deduplicate — also collapse duplicate wrapWithMain
    const seen = new Set()
    const dedupedSuggestions = withContrastFixes
      .filter(s => {
        const key = `${s.id}::${s.domFix?.selector ?? "no-selector"}`
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      .filter(s => {
        if (s.domFix?.type === "wrapWithMain" || s.domFix?.type === "wrapMain") {
          if (seen.has("wrapMain-done")) return false
          seen.add("wrapMain-done")
        }
        return true
      })
      .map(s => {
        if (!s.domFix) {
          const fallbackFix = mapAxeToFix(s)
          if (fallbackFix) return { ...s, domFix: fallbackFix }
        }
        return s
      })

    console.log("SUGGESTIONS:", JSON.stringify(dedupedSuggestions, null, 2))

    return Response.json({
      score,
      violations: violations.length,
      suggestions: dedupedSuggestions,
    })

  } catch (err) {
    console.error("Analyse error:", err)
    return Response.json({ error: err.message || "Analysis failed" }, { status: 500 })
  } finally {
    if (browser) await browser.close()
  }
}