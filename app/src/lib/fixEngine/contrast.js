function luminance(r, g, b) {
  const a = [r, g, b].map(v => {
    v /= 255
    return v <= 0.03928
      ? v / 12.92
      : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]
}

export function contrastRatio(rgb1, rgb2) {
  const lum1 = luminance(...rgb1)
  const lum2 = luminance(...rgb2)
  return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05)
}

function parseRgb(str) {
  if (!str || str === "transparent") return null
  const m = str.match(/\d+(\.\d+)?/g)
  return m ? m.slice(0, 3).map(Number) : null
}

function clamp(v) {
  return Math.max(0, Math.min(255, Math.round(v)))
}

function nudgeToTarget(fg, bg, target = 4.5) {
  const darkResult = tryNudge(fg, bg, target, true)
  const lightResult = tryNudge(fg, bg, target, false)
  const darkPasses = contrastRatio(darkResult, bg) >= target
  const lightPasses = contrastRatio(lightResult, bg) >= target
  if (darkPasses && lightPasses) {
    const darkDist = Math.abs(darkResult[0] - fg[0])
    const lightDist = Math.abs(lightResult[0] - fg[0])
    return darkDist < lightDist ? darkResult : lightResult
  }
  if (darkPasses) return darkResult
  if (lightPasses) return lightResult
  return luminance(...bg) > 0.18 ? [0, 0, 0] : [255, 255, 255]
}

function tryNudge(fg, bg, target, darken) {
  let [r, g, b] = fg
  for (let i = 0; i < 200; i++) {
    if (contrastRatio([r, g, b], bg) >= target) break
    if (darken) {
      r = clamp(r * 0.93); g = clamp(g * 0.93); b = clamp(b * 0.93)
    } else {
      r = clamp(r + (255 - r) * 0.07)
      g = clamp(g + (255 - g) * 0.07)
      b = clamp(b + (255 - b) * 0.07)
    }
  }
  return [r, g, b]
}

function nudgeFallback(selector, fg, bg) {
  const [r, g, b] = nudgeToTarget(fg, bg)
  return {
    type: "setStyleImportant",
    selector,
    style: "color",
    styleValue: `rgb(${r}, ${g}, ${b})`,
  }
}

export async function buildContrastFixesBatch(elements, cohereClient, useAi = false) {
  
  const failing = elements
    .map(({ selector, fgStr, bgStr }) => {
      const fg = parseRgb(fgStr)
      const bg = parseRgb(bgStr)
      if (!fg || !bg) return null
      if (contrastRatio(fg, bg) >= 4.5) return null
      return { selector, fg, bg, bgIsDark: luminance(...bg) < 0.18 }
    })
    .filter(Boolean)

  if (failing.length === 0) return {}

  if (!useAi) {
    return Object.fromEntries(
      failing.map(el => [el.selector, nudgeFallback(el.selector, el.fg, el.bg)])
    )
  }

  try {
    const response = await cohereClient.chat({
      model: "command-a-03-2025",
      message: `
You are a UI color expert. Multiple text elements have color contrast accessibility failures.

Here are the failing elements:
${failing.map((el, i) =>
  `${i + 1}. selector: "${el.selector}"
   current color: rgb(${el.fg[0]}, ${el.fg[1]}, ${el.fg[2]})
   background: rgb(${el.bg[0]}, ${el.bg[1]}, ${el.bg[2]})
   background luminance: ${luminance(...el.bg).toFixed(3)} (0=black, 1=white)
   REQUIRED: pick a color with contrast ratio >= 7:1 against rgb(${el.bg[0]}, ${el.bg[1]}, ${el.bg[2]})
   RULE: if luminance < 0.18, color MUST be light (r,g,b all > 180). If luminance > 0.5, color MUST be dark (r,g,b all < 80).`
).join("\n\n")}

For EACH element, pick a new text color that:
1. Has a contrast ratio of AT LEAST 7:1 against its background
2. Looks visually beautiful and professional
3. Keeps a similar hue to the original if possible
4. If background is dark, go much lighter — near white range (200-255)
5. If background is light, go much darker — near black range (20-100)
6. For links prefer a vivid saturated color like a nice blue or teal
7. NEVER return grey unless the original was grey

Return ONLY a JSON array in this exact format, one entry per element, in the same order:
[
  { "selector": "exact selector", "color": "rgb(r, g, b)" },
  { "selector": "exact selector", "color": "rgb(r, g, b)" }
]
No markdown, no explanation, ONLY the JSON array.
`,
    })

    const raw = (response.text ?? "").replace(/```json|```/g, "").trim()
    let parsed = []

    try {
      parsed = JSON.parse(raw)
    } catch {
      const match = raw.match(/\[[\s\S]*\]/)
      if (match) parsed = JSON.parse(match[0])
    }

    const fixes = {}

    for (const item of parsed) {
      const match = item.color?.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/)
      if (!match) continue

      const picked = [Number(match[1]), Number(match[2]), Number(match[3])]
      const original = failing.find(f => f.selector === item.selector)
      if (!original) continue

      if (contrastRatio(picked, original.bg) >= 4.5) {
        fixes[item.selector] = {
          type: "setStyleImportant",
          selector: item.selector,
          style: "color",
          styleValue: `rgb(${picked[0]}, ${picked[1]}, ${picked[2]})`,
        }
      } else {
        
        fixes[item.selector] = nudgeFallback(item.selector, original.fg, original.bg)
      }
    }

    for (const el of failing) {
      if (!fixes[el.selector]) {
        fixes[el.selector] = nudgeFallback(el.selector, el.fg, el.bg)
      }
    }

    return fixes

  } catch (err) {
    console.warn("Batch AI color pick failed, falling back to nudge for all:", err.message)
   
    const fixes = {}
    for (const el of failing) {
      fixes[el.selector] = nudgeFallback(el.selector, el.fg, el.bg)
    }
    return fixes
  }
}