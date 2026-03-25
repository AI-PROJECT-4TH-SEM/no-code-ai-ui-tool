// contrast.js

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
  const bgLum = luminance(...bg)
  const darken = bgLum > 0.5
  let [r, g, b] = fg

  // if color is near-white/near-black with no real hue, just go straight to
  // a readable gray rather than nudging 200 steps to get near-gray anyway
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const isNeutral = (max - min) < 20  // no real hue — it's a gray/white/black

  if (isNeutral) {
    // just pick a known-good neutral that passes
    return darken ? [68, 68, 68] : [187, 187, 187]
  }

  // has real hue — scale proportionally to preserve it
  for (let i = 0; i < 200; i++) {
    if (contrastRatio([r, g, b], bg) >= target) break
    if (darken) {
      // scale toward black proportionally
      r = clamp(r * 0.93)
      g = clamp(g * 0.93)
      b = clamp(b * 0.93)
    } else {
      // scale toward white proportionally
      r = clamp(r + (255 - r) * 0.07)
      g = clamp(g + (255 - g) * 0.07)
      b = clamp(b + (255 - b) * 0.07)
    }
  }

  return [r, g, b]
}

export function buildContrastFix(selector, fgStr, bgStr) {
  const fg = parseRgb(fgStr)
  const bg = parseRgb(bgStr)
  if (!fg || !bg) return null
  if (contrastRatio(fg, bg) >= 4.5) return null
  const [r, g, b] = nudgeToTarget(fg, bg)
  return {
    type: "setStyle",
    selector,
    style: "color",
    styleValue: `rgb(${r}, ${g}, ${b})`,
  }
}

