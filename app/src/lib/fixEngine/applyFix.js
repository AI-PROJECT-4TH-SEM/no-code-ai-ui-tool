import { ensureH1, wrapMain } from "./heuristics"
import { fixContrast } from "./contrast"

export function applyFix(container, fix) {
  if (!fix || !fix.type) return

  try {
    switch (fix.type) {

      case "setAttribute": {
        const elements = container.querySelectorAll(fix.selector)
        elements.forEach(el => {
          el.setAttribute(fix.attribute, fix.value)
        })
        break
      }
      case "beautify": {
  const body = container.querySelector("body")
  if (body) {
    body.style.background = "#121212"
    body.style.color = "#ffffff"
    body.style.fontFamily = "Arial, sans-serif"
    body.style.padding = "20px"
  }
  break
}

      case "wrapMain":
        wrapMain(container)
        break

      case "ensureH1":
        ensureH1(container)
        break

      case "fixContrast":
        fixContrast(container)
        break

      default:
        console.warn("Unknown fix:", fix)
    }

  } catch (err) {
    console.error("Fix failed:", fix, err)
  }
}