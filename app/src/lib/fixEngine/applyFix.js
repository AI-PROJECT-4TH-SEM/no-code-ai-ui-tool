import { ensureH1, wrapMain, wrapWithMain } from "./heuristics"

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

      default:
        console.warn("Unknown fix type:", fix.type, fix)
    }

  } catch (err) {
    console.error("applyFix failed:", fix, err)
  }
}