export function ensureH1(container) {
  if (container.querySelector("h1")) return

  const text =
    container.querySelector("title")?.innerText ||
    container.querySelector("h2")?.innerText ||
    "Page Title"

  const h1 = document.createElement("h1")
  h1.textContent = text

  container.querySelector("body").prepend(h1)
}

export function wrapMain(container) {
  if (container.querySelector("main")) return

  const body = container.querySelector("body")
  const main = document.createElement("main")

  Array.from(body.children).forEach(child => {
    if (!["HEADER", "NAV", "FOOTER"].includes(child.tagName)) {
      main.appendChild(child)
    }
  })

  body.appendChild(main)
}