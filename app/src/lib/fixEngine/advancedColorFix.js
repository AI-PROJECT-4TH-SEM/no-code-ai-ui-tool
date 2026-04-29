/**
 * Advanced Color Fix Engine
 * Handles background colors, icon colors, and image colors with intelligent detection
 */

// Color conversion utilities
export function hexToRgb(hex) {
  if (!hex) return null
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

export function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? "0" + hex : hex
  }).join("").toUpperCase()
}

export function getContrastColor(hexColor) {
  const rgb = hexToRgb(hexColor)
  if (!rgb) return "#000000"
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
  return luminance > 0.5 ? "#000000" : "#FFFFFF"
}

export function adjustColorBrightness(hex, percent) {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  const r = Math.min(255, Math.max(0, Math.round(rgb.r * (1 + percent / 100))))
  const g = Math.min(255, Math.max(0, Math.round(rgb.g * (1 + percent / 100))))
  const b = Math.min(255, Math.max(0, Math.round(rgb.b * (1 + percent / 100))))
  return rgbToHex(r, g, b)
}

/**
 * Intelligently apply color fix considering child elements
 * Updates SVG icons, images, and text colors for accessibility
 */
export function applyAdvancedColorFix(element, color, type = 'background') {
  if (!element || !color) return false

  try {
    const fixes = []

    if (type === 'background' || type === 'backgroundColor') {
      // Apply background color
      element.style.backgroundColor = color
      fixes.push({ target: 'element', type: 'backgroundColor', value: color })

      // Auto-detect and update nested SVGs
      const svgs = element.querySelectorAll('svg')
      if (svgs.length > 0) {
        const svgColor = adjustColorBrightness(color, -30)
        svgs.forEach(svg => {
          svg.style.fill = svgColor
          svg.style.color = svgColor
          svg.querySelectorAll('path, circle, rect, line, polygon, polyline').forEach(shape => {
            shape.style.fill = svgColor
            shape.style.stroke = svgColor
          })
        })
        fixes.push({ target: 'svg', type: 'fill', value: svgColor, count: svgs.length })
      }

      // Auto-detect and update nested images with overlay
      const images = element.querySelectorAll('img')
      if (images.length > 0) {
        const hue = getHueRotation(color)
        const filter = `hue-rotate(${hue}deg) saturate(1.3) brightness(1.05)`
        images.forEach(img => {
          img.style.filter = filter
          img.style.WebkitFilter = filter
          img.style.mixBlendMode = 'screen'
        })
        fixes.push({ target: 'img', type: 'filter', count: images.length })
      }

      // Update text color for accessibility (WCAG)
      const textColor = getContrastColor(color)
      const textElements = element.querySelectorAll('p, span, a, li, h1, h2, h3, h4, h5, h6')
      if (textElements.length > 0) {
        textElements.forEach(el => {
          if (window.getComputedStyle(el).backgroundColor.includes('rgb')) {
            el.style.color = textColor
          }
        })
        fixes.push({ target: 'text', type: 'color', value: textColor, count: textElements.length })
      }
    } 
    else if (type === 'color' || type === 'textColor') {
      element.style.color = color
      fixes.push({ target: 'element', type: 'color', value: color })

      // Update SVG strokes for icons
      const svgs = element.querySelectorAll('svg')
      svgs.forEach(svg => {
        svg.style.stroke = color
        svg.querySelectorAll('path, circle, rect, line').forEach(shape => {
          if (!shape.style.fill || shape.style.fill === 'none') {
            shape.style.stroke = color
          }
        })
      })
      fixes.push({ target: 'svg-stroke', type: 'stroke', value: color, count: svgs.length })
    }
    else if (type === 'iconColor' || type === 'fill') {
      // Specifically for icons
      const svgs = element.querySelectorAll('svg, i, [class*="icon"]')
      svgs.forEach(svg => {
        svg.style.color = color
        svg.style.fill = color
        if (svg.tagName === 'svg') {
          svg.querySelectorAll('*').forEach(child => {
            child.style.fill = color
            child.style.color = color
          })
        }
      })
      fixes.push({ target: 'icon', type: 'fill', value: color, count: svgs.length })
    }
    else if (type === 'imageColor' || type === 'logoColor') {
      // Specifically for images and logos
      const imageCount = applyColorToImages(element, color)
      // Also apply to the element itself if it's an img
      if (element.tagName === 'IMG' || element.tagName === 'img') {
        applyImageColorFilter(element, color)
      }
      fixes.push({ target: 'image/logo', type: 'filter', value: color, count: imageCount + 1 })
    }

    return { success: true, fixes, element: element.tagName }
  } catch (err) {
    console.error('Advanced color fix failed:', err)
    return { success: false, error: err.message }
  }
}

export function getHueRotation(targetColor) {
  const rgb = hexToRgb(targetColor)
  if (!rgb) return 0
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  return Math.round(hsl.h)
}

function rgbToHsl(r, g, b) {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 }
}

export function createGradientColor(colors) {
  if (!Array.isArray(colors) || colors.length === 0) return '#000000'
  if (colors.length === 1) return colors[0]
  const angle = 135
  return `linear-gradient(${angle}deg, ${colors.join(', ')})`
}

/**
 * Apply image/logo color using CSS filters
 * Converts target color to filter values for hue-rotate, saturate, brightness
 */
export function applyImageColorFilter(element, targetColor) {
  if (!element || !targetColor) return false

  try {
    // For images and logos, use CSS filters
    const rgb = hexToRgb(targetColor)
    if (!rgb) return false

    const hue = getHueRotation(targetColor)
    
    // Create sophisticated filter string
    // Brighten slightly to make colors more vibrant
    const filter = `hue-rotate(${hue}deg) saturate(1.3) brightness(1.05)`
    
    element.style.filter = filter
    element.style.WebkitFilter = filter // Safari support
    
    // For images, also set opacity/blend mode for better results
    if (element.tagName === 'IMG' || element.tagName === 'img') {
      element.style.mixBlendMode = 'screen'
    }
    
    return true
  } catch (err) {
    console.error('Image color filter failed:', err)
    return false
  }
}

/**
 * Apply color to all images in element
 */
export function applyColorToImages(element, color) {
  if (!element || !color) return 0

  try {
    let count = 0
    const images = element.querySelectorAll('img, [class*="logo"], [class*="icon"]')
    const hue = getHueRotation(color)
    const filter = `hue-rotate(${hue}deg) saturate(1.3) brightness(1.05)`
    
    images.forEach(img => {
      img.style.filter = filter
      img.style.WebkitFilter = filter
      if (img.tagName === 'IMG') {
        img.style.mixBlendMode = 'screen'
      }
      count++
    })
    
    return count
  } catch (err) {
    console.error('Apply color to images failed:', err)
    return 0
  }
}
