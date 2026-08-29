import axe from "axe-core"
import { CohereClient } from "cohere-ai"
import { mapAxeToFix } from "@/lib/fixEngine/rules"
import { buildContrastFixesBatch } from "@/lib/fixEngine/contrast"
import { launchPuppeteer } from "@/lib/puppeteer"


const cohere = new CohereClient({ token: process.env.COHERE_KEY })


const IMPACT_BASE_PENALTY = {
  critical: 15,
  serious: 9,
  moderate: 4,
  minor: 1.5,
}

const IMPACT_NODE_PENALTY = {
  critical: 4,
  serious: 2.5,
  moderate: 1.2,
  minor: 0.4,
}

const IMPACT_CAP = {
  critical: 25,
  serious: 18,
  moderate: 10,
  minor: 4,
}

const ANALYSIS_TIMEOUT_MS = 15000

export const maxDuration = 30

function withTimeout(promise, timeoutMs, message) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(message)), timeoutMs)),
  ])
}

function calcDeduction(violation) {
  const base = IMPACT_BASE_PENALTY[violation.impact] ?? 5
  const perNode = IMPACT_NODE_PENALTY[violation.impact] ?? 1
  const cap = IMPACT_CAP[violation.impact] ?? 10
  const nodes = violation.nodes.length

  const raw = base + perNode * Math.log1p(nodes)
  return Math.min(raw, cap)
}


function resolveHeadingFixes(violations) {
  const headingViolation = violations.find(v => v.id === "heading-order")
  if (!headingViolation) return []
  const fixes = []
  for (const node of headingViolation.nodes) {
    const target = node.target?.[0]
    if (!target) continue
    const match = node.html?.match(/^<(h[1-6])/i)
    const currentTag = match?.[1]?.toLowerCase()
    if (!currentTag) continue
    const correctTag = currentTag === "h1" ? "h1" : "h2"
    fixes.push({
      id: "heading-order",
      impact: headingViolation.impact,
      title: "Incorrect Heading Order",
      explanation: "A heading is skipping levels which confuses screen reader users and breaks document structure.",
      fixDescription: `Change <${currentTag}> to <${correctTag}> to maintain logical heading order.`,
      codeExample: `BEFORE:\n<${currentTag}>Your heading text</${currentTag}>\n\nAFTER:\n<${correctTag}>Your heading text</${correctTag}>`,
      domFix: null,
    })
  }
  return fixes
}

function buildLocalSuggestions(violations, contrastFixes) {
  const suggestions = violations.flatMap((violation) => {
    if (violation.id === "heading-order") {
      return resolveHeadingFixes([violation])
    }

    const firstNode = violation.nodes[0]
    const selector = firstNode?.target?.[0]
    let domFix = null
    if (violation.id === "region" || violation.id === "landmark-one-main") {
      domFix = { type: "wrapWithMain", selector: null }
    } else if (violation.id === "page-has-heading-one") {
      domFix = { type: "ensureH1" }
    } else if (violation.id === "color-contrast") {
      const fixes = violation.nodes
        .map(node => contrastFixes[node.target?.[0]])
        .filter(Boolean)
      if (fixes.length) domFix = { type: "multifix", fixes }
    } else if (selector) {
      domFix = mapAxeToFix({ id: violation.id, target: selector, nodes: violation.nodes })
    }

    return [{
      id: violation.id,
      impact: violation.impact,
      title: violation.help,
      explanation: violation.description,
      fixDescription: firstNode?.failureSummary || "Fix manually",
      codeExample: `BEFORE:\n${firstNode?.html || "Problematic element"}\n\nAFTER:\nReview the accessibility guidance and update this element.`,
      domFix,
    }]
  })

  const seen = new Set()
  return suggestions.filter(suggestion => {
    const key = `${suggestion.id}::${suggestion.domFix?.selector ?? "no-selector"}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export async function POST(req) {
  let browser

  try {
    const { html, url } = await req.json()
    if (!html && !url) {
      return Response.json({ error: "No input" }, { status: 400 })
    }

    browser = await withTimeout(
      launchPuppeteer({ headless: true }),
      ANALYSIS_TIMEOUT_MS,
      "Browser startup timed out. Please retry the scan."
    )

    let page = await browser.newPage()
    page.setDefaultTimeout(5000)
    page.setDefaultNavigationTimeout(10000)

    async function loadAnalysisPage(targetPage) {
      if (html) {
        await targetPage.setContent(html, { waitUntil: "domcontentloaded" })
      } else {
        const finalUrl = url.startsWith("http") ? url : "https://" + url
        try {
          await targetPage.goto(finalUrl, { waitUntil: "domcontentloaded", timeout: 10000 })
        } catch (navigationError) {
          console.warn("Analysis navigation incomplete:", navigationError.message)
        }
      }
      await targetPage.waitForFunction(() => document.readyState !== "loading", { timeout: 5000 })
    }

    await loadAnalysisPage(page)

    const axeResults = await withTimeout(
      page.evaluate((axeSource) => {
        const moduleContext = { exports: {} }
        const loadAxe = new Function("module", "exports", axeSource)
        loadAxe(moduleContext, moduleContext.exports)
        return window.axe.run()
      }, axe.source),
      ANALYSIS_TIMEOUT_MS,
      "Accessibility scan timed out. Please retry with a smaller page."
    )

    const contrastElements = []
    const contrastViolations = axeResults.violations.filter(v => v.id === "color-contrast")
    for (const v of contrastViolations) {
      const elements = await Promise.all(v.nodes.slice(0, 10).map(async (node) => {
        const rawTarget = node.target?.[0]
        const selector = typeof rawTarget === "string" ? rawTarget : rawTarget?.[0]
        if (!selector || typeof selector !== "string") return null

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
            return { selector, fgStr: colors.color, bgStr: colors.background }
          }
        } catch (err) {
          console.log("EVALUATE ERROR:", selector, err.message)
        }
        return null
      }))
      contrastElements.push(...elements.filter(Boolean))
    }

    const contrastFixes = await buildContrastFixesBatch(
      contrastElements,
      cohere,
      process.env.ANALYSIS_AI_CONTRAST === "true"
    )
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

    const totalDeductions = violations.reduce((sum, v) => sum + calcDeduction(v), 0)
    const score = Math.round(Math.max(0, 100 - totalDeductions))

    if (process.env.ANALYSIS_AI_EXPLANATIONS !== "true") {
      return Response.json({
        score,
        violations: violations.length,
        suggestions: buildLocalSuggestions(violations, contrastFixes),
        source: "axe-local",
      })
    }


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
    "codeExample": "a short before/after HTML code snippet showing exactly how to fix it. Use \\n for newlines. Always include both a BEFORE and AFTER example.",
    "domFix": { ... }
  }
]
Rules:
- Return ONLY the JSON array
- No markdown, no explanation outside the JSON
- Use the selector exactly from the violation nodes target field
- Make values context aware based on the actual HTML
- ALWAYS populate codeExample for every violation, especially ones with no domFix
- For color-contrast violations always set domFix to null (handled separately)
- For ANY violation where id is "landmark-one-main" or "region", you MUST return
  domFix with type "wrapWithMain" and selector set to null. No exceptions.
  NEVER return domFix: null for these — the fix engine handles it automatically.
  Example: { "type": "wrapWithMain", "selector": null }
- For "page-has-heading-one" use type "ensureH1" with no selector needed
- For "heading-order" violations, look at ALL nodes in the violation.
  Return one separate entry in the array for EACH node that has a wrong heading level.
  For each node, set domFix to null — heading order is explained, not auto-fixed.
  ALWAYS populate codeExample showing the wrong heading and the corrected version.
  Example codeExample: "BEFORE:\\n<h4>Section Title</h4>\\n\\nAFTER:\\n<h2>Section Title</h2>"
- For "landmark-uniquelabel" violations, set domFix to null.
  ALWAYS populate codeExample like:
  "BEFORE:\\n<nav>...</nav>\\n<nav>...</nav>\\n\\nAFTER:\\n<nav aria-label=\\"Main navigation\\">...</nav>\\n<nav aria-label=\\"Footer navigation\\">...</nav>"
- For "aria-hidden-focus" violations, set domFix to null.
  ALWAYS populate codeExample like:
  "BEFORE:\\n<div aria-hidden=\\"true\\"><button>Click</button></div>\\n\\nAFTER:\\n<div aria-hidden=\\"true\\"><button tabindex=\\"-1\\">Click</button></div>"
- For "image-alt" violations, ALWAYS return a domFix with type "setAttribute",
  attribute "alt", and selector from node.target[0].
  For the value, use the image filename or context to write descriptive alt text.
  NEVER return domFix: null for image-alt.
`,
    })

    const rawText = (response.text ?? "").replace(/```json|```/g, "").trim()

    let parsed = []
    try {
      parsed = JSON.parse(rawText)
    } catch (err) {
      try {
        const match = rawText.match(/\[[\s\S]*\]/)
        if (match) {
          parsed = JSON.parse(match[0])
        } else {
          throw new Error("No JSON array found")
        }
      } catch (salvageErr) {
        console.error("Cohere parse failed entirely:", rawText)
        parsed = violations.flatMap((v) => {
          if (v.id === "heading-order") {
            return v.nodes.map((node, ni) => {
              const target = node.target?.[0]
              return {
                id: v.id,
                impact: v.impact,
                title: `${v.help} (${ni + 1}/${v.nodes.length})`,
                explanation: v.description,
                fixDescription: node.failureSummary || "Fix manually",
                domFix: target ? { type: "replaceTag", selector: target, tag: "h2" } : null,
              }
            })
          }

          let domFix = null
          if (v.id === "region" || v.id === "landmark-one-main") {
            domFix = { type: "wrapWithMain", selector: null }
          } else if (v.id === "page-has-heading-one") {
            domFix = { type: "ensureH1" }
          } else if (v.id === "image-alt") {
            const target = v.nodes[0]?.target?.[0]
            if (target) {
              domFix = { type: "setAttribute", selector: target, attribute: "alt", value: "Decorative image" }
            }
          }

          return [{
            id: v.id,
            impact: v.impact,
            title: v.help,
            explanation: v.description,
            fixDescription: v.nodes[0]?.failureSummary || "Fix manually",
            domFix,
          }]
        })
      }
    }

    const headingFixes = resolveHeadingFixes(violations)
    const parsedWithHeadings = [
      ...parsed.filter(s => s.id !== "heading-order"),
      ...headingFixes,
    ]

    const withContrastFixes = parsedWithHeadings.map(s => {
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