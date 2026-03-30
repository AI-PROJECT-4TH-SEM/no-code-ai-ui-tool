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
      page.on("request", (interceptedReq) => {
        const type = interceptedReq.resourceType()
        // allow stylesheets and fonts, block everything else
        if (type === "stylesheet" || type === "font") {
          interceptedReq.continue()
        } else {
          interceptedReq.abort()
        }
      })
      await page.setContent(html, { waitUntil: "domcontentloaded" })
    } else {
      const finalUrl = url.startsWith("http") ? url : "https://" + url
      await page.goto(finalUrl, { waitUntil: "networkidle2", timeout: 60000 })
    }

    const axeResults = await new AxePuppeteer(page).analyze()

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
- For ANY violation where id is "landmark-one-main" or "region", you MUST return
  domFix with type "wrapWithMain" and selector set to null. No exceptions.
  NEVER return domFix: null for these — the fix engine handles it automatically.
  Example: { "type": "wrapWithMain", "selector": null }
- For "page-has-heading-one" use type "ensureH1" with no selector needed
- For "heading-order" violations, you MUST return a domFix with type "replaceTag".
  Look at the nodes array to find which heading element has the wrong level.
  Set "selector" to the exact CSS selector from node.target[0].
  Set "tag" to the correct heading level it should be changed to (e.g. if an h3
  appears after an h1 with no h2, it should become "h2").
  Example: { "type": "replaceTag", "selector": "h3.some-class", "tag": "h2" }
  NEVER return domFix: null for heading-order. NEVER use setAttribute.
- For "image-alt" violations, ALWAYS return a domFix with type "setAttribute",
  attribute "alt", and selector from node.target[0].
  For the value, use the image's filename, surrounding context, or nearby text
  to make a best-guess descriptive alt text. For example if the src is
  "hero-banner.jpg" use "Hero banner". If src is "logo.png" use "Site logo".
  NEVER return domFix: null for image-alt — a guessed alt is always better
  than no fix at all. If truly no context exists, use "Decorative image".
`,
    })

    const rawText = (response.text ?? "").replace(/```json|```/g, "").trim()

    let parsed = []
    try {
      parsed = JSON.parse(rawText)
    } catch (err) {
      // Try to salvage malformed JSON by extracting the array portion
      try {
        const match = rawText.match(/\[[\s\S]*\]/)
        if (match) {
          parsed = JSON.parse(match[0])
        } else {
          throw new Error("No JSON array found")
        }
      } catch (salvageErr) {
        console.error("Cohere parse failed entirely:", rawText)
        // Smart fallback — reconstruct domFix for known violation types
        parsed = violations.map((v) => {
          let domFix = null

          if (v.id === "heading-order") {
            const target = v.nodes[0]?.target?.[0]
            if (target) {
              domFix = { type: "replaceTag", selector: target, tag: "h2" }
            }
          } else if (v.id === "region" || v.id === "landmark-one-main") {
            domFix = { type: "wrapWithMain", selector: null }
          } else if (v.id === "page-has-heading-one") {
            domFix = { type: "ensureH1" }
          } else if (v.id === "image-alt") {
            const target = v.nodes[0]?.target?.[0]
            if (target) {
              domFix = { type: "setAttribute", selector: target, attribute: "alt", value: "Decorative image" }
            }
          }

          return {
            id: v.id,
            impact: v.impact,
            title: v.help,
            explanation: v.description,
            fixDescription: v.nodes[0]?.failureSummary || "Fix manually",
            domFix,
          }
        })
      }
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
              fixes: allFixes,
            },
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