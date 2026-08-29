import { isValidUrl } from "@/lib/validation"
import { rateLimit } from "@/lib/rateLimit"
import { launchPuppeteer } from "@/lib/puppeteer"

// detect JS heavy
function isJsHeavySite(html) {
  const bodyContent = html.replace(/<[^>]*>/g, '').trim()
  const scriptCount = (html.match(/<script/g) || []).length
  return bodyContent.length < 500 || scriptCount > 10
}

// ✅ ensure full HTML (fix blank iframe + relative paths)
async function ensureFullHTML(html, url) {
  let safeHtml = html

  if (!html.includes("<html")) {
    safeHtml = `<html><head></head><body>${html}</body></html>`
  }

  const baseUrl = new URL(url)
  const baseTag = `<base href="${baseUrl.href}" />`

  if (/<base\b/i.test(safeHtml)) {
    safeHtml = safeHtml.replace(/<base\b[^>]*>/i, baseTag)
  } else if (/<head\b[^>]*>/i.test(safeHtml)) {
    safeHtml = safeHtml.replace(/<head\b[^>]*>/i, match => `${match}${baseTag}`)
  } else {
    safeHtml = safeHtml.replace(/<html\b[^>]*>/i, match => `${match}<head>${baseTag}</head>`)
  }

  safeHtml = safeHtml.replace(/\s(?:src|href)=(['"])(?!data:|https?:|\/\/|#|mailto:|javascript:)([^'"]+)\1/gi, (match, quote, value) => {
    try {
      return match.replace(value, new URL(value, baseUrl).href)
    } catch {
      return match
    }
  }).replace(/\s(srcset)=(['"])([^'"]+)\2/gi, (match, attribute, quote, value) => {
    const absoluteSources = value.split(',').map(source => {
      const parts = source.trim().split(/\s+/)
      try {
        parts[0] = new URL(parts[0], baseUrl).href
      } catch {
        return source
      }
      return parts.join(' ')
    })
    return ` ${attribute}=${quote}${absoluteSources.join(', ')}${quote}`
  })

  const stylesheetLinks = [...safeHtml.matchAll(/<link\b([^>]*\brel\s*=\s*["'][^"']*stylesheet[^"']*["'][^>]*)>/gi)]
  for (const link of stylesheetLinks) {
    const hrefMatch = link[1].match(/\bhref\s*=\s*(["'])([^"']+)\1/i)
    if (!hrefMatch) continue

    try {
      const stylesheetUrl = new URL(hrefMatch[2], baseUrl).href
      const response = await fetch(stylesheetUrl)
      if (!response.ok) continue
      const css = await response.text()
      const rebasedCss = css.replace(/url\(\s*(["']?)(?!data:|https?:|\/\/|#)([^)"']+)\1\s*\)/gi, (match, quote, value) => {
        try {
          return `url(${quote}${new URL(value.trim(), stylesheetUrl).href}${quote})`
        } catch {
          return match
        }
      })
      const styleTag = `<style data-fetched-stylesheet="true">${rebasedCss}</style>`
      safeHtml = safeHtml.replace(link[0], `${styleTag}${link[0]}`)
    } catch {
      // Keep the original stylesheet link as a fallback.
    }
  }

  return safeHtml
}

export async function POST(request) {
  const ip = request.headers.get("x-forwarded-for") || "local";
  const rateCheck = rateLimit({ key: `fetch-url:${ip}`, limit: 20, windowMs: 60_000 });
  if (!rateCheck.allowed) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json().catch(() => ({}))
  const url = typeof body.url === "string" ? body.url.trim() : ""

  if (!isValidUrl(url)) {
    return Response.json({ error: "A valid http(s) URL is required" }, { status: 400 })
  }

  try {
    const simpleRes = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      redirect: 'follow'
    })

    const simpleHtml = await simpleRes.text()

    if (isJsHeavySite(simpleHtml)) {

      const html = await fetchWithPuppeteer(url)
      const safeHtml = await ensureFullHTML(html, url)

      return Response.json({
        html: safeHtml,
        method: "puppeteer"
      })
    }

    const safeHtml = await ensureFullHTML(simpleHtml, url) 

    return Response.json({
      html: safeHtml,
      method: "fetch"
    })

  } catch (error) {

    try {
      const html = await fetchWithPuppeteer(url)
      const safeHtml = await ensureFullHTML(html, url) 

      return Response.json({
        html: safeHtml,
        method: "puppeteer"
      })

    } catch (puppeteerError) {

      return Response.json({
        error: "Could not fetch website",
        html: "<h1 style='color:black'>Failed to load site</h1>",
        method: "failed"
      })
    }
  }
}

async function fetchWithPuppeteer(url) {
  const browser = await launchPuppeteer({ headless: true })

  try {
    const page = await browser.newPage()

    await page.setViewport({ width: 1280, height: 800 })

    await page.setExtraHTTPHeaders({
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    })

    try {
      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 30000
      })
    } catch {
      // continue with partial content if the page remains responsive
    }

    
    await new Promise(r => setTimeout(r, 4000))

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await new Promise(r => setTimeout(r, 2000))

    return await page.content()

  } finally {
    await browser.close()
  }
}