import { ensureH1, wrapMain, wrapWithMain } from "./heuristics"
import { applyAdvancedColorFix, createGradientColor } from "./advancedColorFix"

export function applyFix(container, fix) {
  if (!fix || !fix.type) return

  try {
    switch (fix.type) {

      case "setAttribute": {
        const elements = container.querySelectorAll(fix.selector)
        elements.forEach(el => el.setAttribute(fix.attribute, fix.value))
        break
      }

      case "setStyle": {
        const elements = container.querySelectorAll(fix.selector)
        elements.forEach(el => {
          el.style[fix.style] = fix.styleValue
        })
        break
      }

      case "setStyleImportant": {
        container.querySelectorAll(fix.selector).forEach(el => {
          el.style.setProperty(fix.style, fix.styleValue, "important")
        })
        break
      }

      case "setInnerText": {
        const elements = container.querySelectorAll(fix.selector)
        elements.forEach(el => { el.textContent = fix.value })
        break
      }

      case "addClass": {
        const elements = container.querySelectorAll(fix.selector)
        elements.forEach(el => el.classList.add(fix.value))
        break
      }

      case "replaceHtml": {
        const el = container.querySelector(fix.selector)
        if (el) el.outerHTML = fix.value
        break
      }

      case "wrapMain":
        wrapMain(container)
        break

      case "wrapWithMain": {
       
        wrapWithMain(container, fix.selector)
        break
      }

      case "ensureH1":
        ensureH1(container)
        break

      // Advanced color fixes with WCAG compliance
      case "setColorAdvanced": {
        const elements = container.querySelectorAll(fix.selector)
        elements.forEach(el => {
          applyAdvancedColorFix(el, fix.styleValue, 'color')
        })
        break
      }

      case "setBackgroundColorAdvanced": {
        const elements = container.querySelectorAll(fix.selector)
        elements.forEach(el => {
          applyAdvancedColorFix(el, fix.styleValue, 'background')
        })
        break
      }

      case "setIconColorAdvanced": {
        const elements = container.querySelectorAll(fix.selector)
        elements.forEach(el => {
          applyAdvancedColorFix(el, fix.styleValue, 'iconColor')
        })
        break
      }

      case "setGradientBackground": {
        const elements = container.querySelectorAll(fix.selector)
        if (Array.isArray(fix.colors)) {
          const gradient = createGradientColor(fix.colors)
          elements.forEach(el => {
            el.style.backgroundImage = gradient
            el.style.setProperty('background-image', gradient, 'important')
          })
        }
        break
      }

      // Image and Logo Color Fixes
      case "setImageColorAdvanced": {
        const elements = container.querySelectorAll(fix.selector)
        elements.forEach(el => {
          applyAdvancedColorFix(el, fix.styleValue, 'imageColor')
        })
        break
      }

      // Universal text color for ALL text elements
      case "setTextColorUniversal": {
        const elements = container.querySelectorAll(fix.selector)
        elements.forEach(el => {
          // Apply to element itself
          el.style.color = fix.styleValue
          el.style.setProperty('color', fix.styleValue, 'important')
          
          // Apply to all text nodes and children
          const textElements = el.querySelectorAll('*')
          textElements.forEach(textEl => {
            const isTextNode = textEl.childNodes.some(node => node.nodeType === 3 && node.textContent.trim())
            if (textEl.textContent && (textEl.children.length === 0 || isTextNode)) {
              textEl.style.color = fix.styleValue
              textEl.style.setProperty('color', fix.styleValue, 'important')
            }
          })
        })
        break
      }

      // Header-specific text color
      case "setHeaderTextColorAdvanced": {
        const headerSelectors = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', '[role="banner"]', '.header', '.navbar']
        const elements = container.querySelectorAll(headerSelectors.join(','))
        elements.forEach(el => {
          applyAdvancedColorFix(el, fix.styleValue, 'color')
        })
        break
      }

      default:
        console.warn("Unknown fix type:", fix.type, fix)
    }

  } catch (err) {
    console.error("applyFix failed:", fix, err)
  }
}