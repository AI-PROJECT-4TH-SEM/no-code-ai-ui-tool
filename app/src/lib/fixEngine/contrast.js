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

// your original — keep this for the "beautify" nuclear fix
export function fixContrast(container) {
  const elements = container.querySelectorAll("*")
  const body = container.querySelector("body")
  if (body) {
    body.style.setProperty("background", "#ffffff", "important")
    body.style.setProperty("color", "#111111", "important")
  }
  elements.forEach(el => {
    const style = window.getComputedStyle(el)
    const color = style.color.match(/\d+/g)?.map(Number)
    const bg = style.backgroundColor.match(/\d+/g)?.map(Number)
    if (!color || !bg) return
    if (contrastRatio(color, bg) < 4.5) {
      el.style.setProperty("color", "#111", "important")
      el.style.setProperty("background-color", "#fff", "important")
    }
  })
}

// 🔥 NEW — smart per-element fix, called from route.js on the server
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
  const darken = bgLum > 0.5   // light bg → push text darker
  let [r, g, b] = fg

  for (let i = 0; i < 200; i++) {
    if (contrastRatio([r, g, b], bg) >= target) break
    r = clamp(darken ? r - 2 : r + 2)
    g = clamp(darken ? g - 2 : g + 2)
    b = clamp(darken ? b - 2 : b + 2)
  }

  return [r, g, b]
}

// called from route.js with strings like "rgb(150, 150, 150)"
export function buildContrastFix(selector, fgStr, bgStr) {
  const fg = parseRgb(fgStr)
  const bg = parseRgb(bgStr)
  if (!fg || !bg) return null

  // already passes — no fix needed
  if (contrastRatio(fg, bg) >= 4.5) return null

  const [r, g, b] = nudgeToTarget(fg, bg)

  return {
    type: "setStyle",
    selector,
    style: "color",
    styleValue: `rgb(${r}, ${g}, ${b})`,
  }
}