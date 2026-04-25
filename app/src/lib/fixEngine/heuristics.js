export function ensureH1(container) {
  if (container.querySelector("h1")) return

  const text =
    container.querySelector("title")?.textContent ||
    container.querySelector("h2")?.textContent ||
    "Page title"

  const h1 = document.createElement("h1")
  h1.textContent = text
  container.querySelector("body")?.prepend(h1)
}

export function wrapMain(container) {
  if (container.querySelector("main")) return

  const body = container.querySelector("body")
  if (!body) return

  const main = document.createElement("main")
  Array.from(body.children).forEach(child => {
    if (!["HEADER", "NAV", "FOOTER"].includes(child.tagName)) {
      main.appendChild(child)
    }
  })
  body.appendChild(main)
}

export function wrapWithMain(container, selector) {
  if (container.querySelector("main")) return
  if (!selector) return wrapMain(container) 

  const el = container.querySelector(selector)
  if (!el) return wrapMain(container)

  const main = document.createElement("main")
  el.replaceWith(main)
  main.appendChild(el)
}