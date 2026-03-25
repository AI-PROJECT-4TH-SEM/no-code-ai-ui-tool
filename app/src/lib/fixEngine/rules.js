export function mapAxeToFix(issue) {
  const selector = issue.nodes?.[0]?.target?.[0] ?? null

  switch (issue.id) {

    case "html-has-lang":
      return {
        type: "setAttribute",
        selector: "html",
        attribute: "lang",
        value: "en"
      }

    case "region":
      return { type: "wrapMain" }

    case "page-has-heading-one":
      return { type: "ensureH1" }

    case "color-contrast":
      // handled upstream in route.js via buildContrastFix — not here
      return null

    case "image-alt":
      if (!selector) return null
      return {
        type: "setAttribute",
        selector,           // exact failing element, not all imgs
        attribute: "alt",
        value: ""           // empty string = decorative. route.js/AI should fill meaningful value
      }

    case "link-name":
      if (!selector) return null
      return {
        type: "setAttribute",
        selector,
        attribute: "aria-label",
        value: "link"       // AI in route.js will override with something meaningful
      }

    case "button-name":
      if (!selector) return null
      return {
        type: "setAttribute",
        selector,
        attribute: "aria-label",
        value: "button"
      }

    case "label":
      if (!selector) return null
      return {
        type: "setAttribute",
        selector,
        attribute: "aria-label",
        value: "input field"
      }

    case "document-title":
      return {
        type: "setAttribute",
        selector: "title",
        attribute: "innerText",
        value: "Page"
      }

    case "frame-title":
      if (!selector) return null
      return {
        type: "setAttribute",
        selector,
        attribute: "title",
        value: "frame"
      }

    default:
      return null
  }
}