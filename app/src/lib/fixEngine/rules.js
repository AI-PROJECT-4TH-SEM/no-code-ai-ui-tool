export function mapAxeToFix(issue) {
  switch (issue.id) {

    case "html-has-lang":
      return {
        type: "setAttribute",
        selector: "html",
        attribute: "lang",
        value: "en"
      }

    case "region":
      return {
        type: "wrapMain"
      }

    case "page-has-heading-one":
      return {
        type: "ensureH1"
      }

    case "color-contrast":
      return {
        type: "fixContrast"
      }
    case "image-alt":
      return {
        type: "setAttribute",
        selector: "img",
        attribute: "alt",
        value: "image description"
      }

    case "link-name":
      return {
        type: "setStyle",
        selector: "a",
        style: {
          color: "blue",
          textDecoration: "underline",
          fontWeight: "bold"
        }
      }

    case "color-contrast":
      return {
        type: "fixContrast"
      }

    default:
      return null
  }

}
