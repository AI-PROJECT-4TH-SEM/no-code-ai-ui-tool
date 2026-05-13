import { NextResponse } from 'next/server'
// Optimize any theme (stored or generated) using APIVerve color palettes
export async function POST(request) {
  try {
    const { theme, userInput, scanResults } = await request.json()
    if (!theme) {
      return NextResponse.json({ error: 'Theme is required' }, { status: 400 })
    }
    const apiVerveKey = process.env.APIVERVE_API_KEY
    if (!apiVerveKey) {
      return NextResponse.json({ error: 'APIVerve key not configured' }, { status: 500 })
    }
    const currentPreview = theme.preview || []
    const [currentBg, currentPrimary, currentAccent] = currentPreview
    const score = scanResults?.score || 75
    const variation = score < 50 ? 'hard' : score < 80 ? 'default' : 'light'
    let scheme = 'triade'
    const input = (userInput || '').toLowerCase()
    if (input.includes('luxury') || input.includes('premium')) scheme = 'analogic'
    else if (input.includes('modern') || input.includes('clean')) scheme = 'mono'
    else if (input.includes('vibrant') || input.includes('energy')) scheme = 'tetrade'
    else if (input.includes('calm') || input.includes('smooth')) scheme = 'analogic'
    else if (input.includes('professional') || input.includes('business')) scheme = 'contrast'
    else if (input.includes('dark') || input.includes('light')) scheme = 'mono'
    const baseColor = currentPrimary?.replace('#', '') || '7c3aed'
    const apiUrl = 'https://api.apiverve.com/v1/colorpalette?'
    const params = new URLSearchParams({
      color: baseColor,
      count: '5',
      scheme: scheme,
      variation: variation,
      webSafe: 'false'
    })
    const response = await fetch(apiUrl + params.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-API-Key': apiVerveKey
      }
    })
    if (!response.ok) {
      return NextResponse.json({ error: `APIVerve error: ${response.status}` }, { status: response.status })
    }
    const data = await response.json()
    const colorPalette = data?.colorPalette || data?.data?.colorPalette || data?.colors || data?.palette || data?.data?.palette || extractColorsDeep(data)
    if (!Array.isArray(colorPalette) || colorPalette.length === 0) {
      return NextResponse.json({ error: 'No palettes generated' }, { status: 500 })
    }
    const colors = colorPalette.map(color => {
      if (typeof color === 'string') return color.startsWith('#') ? color : `#${color}`
      return color?.hex || color || ''
    }).filter(Boolean)
    const [bgHex, primaryHex, secondaryHex, accentHex, textHex] = [
      colors[0] || currentBg || '#0f172a',
      colors[1] || currentPrimary || '#7c3aed',
      colors[2] || colors[0] || '#f8fafc',
      colors[3] || colors[colors.length - 1] || currentAccent || '#f97316',
      colors[colors.length - 1] || colors[0] || '#e5e7eb'
    ]
    const enhancedBg = enhanceContrast(bgHex, 'bg')
    const enhancedPrimary = enhanceContrast(primaryHex, 'primary')
    const enhancedAccent = enhanceContrast(accentHex, 'accent')
    const optimizedCSS = enhanceThemeCSS(theme.css || '', {
      background: enhancedBg,
      primary: enhancedPrimary,
      secondary: secondaryHex,
      accent: enhancedAccent,
      text: textHex
    })
    return NextResponse.json({
      success: true,
      optimizedTheme: {
        ...theme,
        preview: [enhancedBg, enhancedPrimary, enhancedAccent],
        palette: [enhancedBg, enhancedPrimary, secondaryHex, enhancedAccent, textHex],
        css: optimizedCSS,
        optimized: true,
        source: 'apiverve'
      }
    })
  } catch (error) {
    console.error('Theme optimization error:', error)
    return NextResponse.json({ error: error.message || 'Failed to optimize theme' }, { status: 500 })
  }
}
function enhanceContrast(hex, role) {
  try {
    const [r, g, b] = hexToRgb(hex)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    if (role === 'bg') {
      if (brightness > 100) return adjustBrightness(hex, -40)
      return hex
    } else if (role === 'accent' || role === 'primary') {
      return saturateColor(hex, 1.2)
    }
    return hex
  } catch {
    return hex
  }
}
function enhanceThemeCSS(css, colors) {
  if (!css) return ''
  let enhanced = css
  const replacements = {
    '--bg': colors.background,
    '--primary': colors.primary,
    '--accent': colors.accent,
    '--secondary': colors.secondary,
    '--text': colors.text
  }
  Object.entries(replacements).forEach(([key, value]) => {
    const regex = new RegExp(`(?:var\\()?${key}(?:\\))?`, 'g')
    enhanced = enhanced.replace(regex, value)
  })
  const contrastRules = `/* APIVerve Contrast Enhancement */ body, html { background: ${colors.background} !important; color: ${colors.text} !important; } h1, h2, h3, h4, h5, h6 { color: ${colors.primary} !important; } button, [type=button], [type=submit], [role=button] { background: linear-gradient(135deg, ${colors.primary}, ${colors.accent}) !important; } a { color: ${colors.accent} !important; }`
  return enhanced + contrastRules
}
function saturateColor(hex, factor) {
  const [r, g, b] = hexToRgb(hex)
  const max = Math.max(r, g, b) / 255
  const min = Math.min(r, g, b) / 255
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r / 255) {
      h = (g / 255 - b / 255) / d + (g < b ? 6 : 0)
    } else if (max === g / 255) {
      h = (b / 255 - r / 255) / d + 2
    } else {
      h = (r / 255 - g / 255) / d + 4
    }
    h /= 6
  }
  s = Math.min(1, s * factor)
  let c = (1 - Math.abs(2 * l - 1)) * s
  let x = c * (1 - Math.abs(((h * 6) % 2) - 1))
  let m = l - c / 2
  let r_new = 0, g_new = 0, b_new = 0
  if (h < 1 / 6) { r_new = c; g_new = x; b_new = 0 }
  else if (h < 2 / 6) { r_new = x; g_new = c; b_new = 0 }
  else if (h < 3 / 6) { r_new = 0; g_new = c; b_new = x }
  else if (h < 4 / 6) { r_new = 0; g_new = x; b_new = c }
  else if (h < 5 / 6) { r_new = x; g_new = 0; b_new = c }
  else { r_new = c; g_new = 0; b_new = x }
  return rgbToHex(Math.round((r_new + m) * 255), Math.round((g_new + m) * 255), Math.round((b_new + m) * 255))
}
function adjustBrightness(hex, amount) {
  let [r, g, b] = hexToRgb(hex)
  r = Math.max(0, Math.min(255, r + amount))
  g = Math.max(0, Math.min(255, g + amount))
  b = Math.max(0, Math.min(255, b + amount))
  return rgbToHex(r, g, b)
}
function hexToRgb(hex) {
  const clean = String(hex || '').trim().replace('#', '')
  const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean.padEnd(6, '0').slice(0, 6)
  const n = Number.parseInt(full, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => { const hex = x.toString(16); return hex.length === 1 ? '0' + hex : hex }).join('')
}

function extractColorsDeep(value) {
  const colors = []
  const seen = new Set()

  function walk(node) {
    if (!node || seen.has(node)) return
    if (typeof node === 'string') {
      if (/^#?[0-9a-fA-F]{6}$/.test(node)) colors.push(node)
      return
    }
    if (Array.isArray(node)) {
      node.forEach(walk)
      return
    }
    if (typeof node === 'object') {
      seen.add(node)
      Object.values(node).forEach(walk)
    }
  }

  walk(value)
  return colors
}
