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

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const isNeutral = (max - min) < 20

  if (isNeutral) {
    // pick direction based on bg luminance and verify it actually passes
    const candidate = darken ? [68, 68, 68] : [187, 187, 187]
    if (contrastRatio(candidate, bg) >= target) return candidate
    // if it doesn't pass, force to black or white
    return darken ? [0, 0, 0] : [255, 255, 255]
  }

  // has real hue — scale proportionally
  for (let i = 0; i < 200; i++) {
    if (contrastRatio([r, g, b], bg) >= target) break
    if (darken) {
      r = clamp(r * 0.93)
      g = clamp(g * 0.93)
      b = clamp(b * 0.93)
    } else {
      r = clamp(r + (255 - r) * 0.07)
      g = clamp(g + (255 - g) * 0.07)
      b = clamp(b + (255 - b) * 0.07)
    }
  }

  // final safety check — if still failing after 200 steps, force it
  if (contrastRatio([r, g, b], bg) < target) {
    return darken ? [0, 0, 0] : [255, 255, 255]
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

