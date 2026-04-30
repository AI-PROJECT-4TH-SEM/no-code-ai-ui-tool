import puppeteer from "puppeteer"

// detect JS heavy
function isJsHeavySite(html) {
  const bodyContent = html.replace(/<[^>]*>/g, '').trim()
  const scriptCount = (html.match(/<script/g) || []).length
  return bodyContent.length < 500 || scriptCount > 10
}

// ✅ ensure full HTML (fix blank iframe + relative paths)
function ensureFullHTML(html, url) {
  let safeHtml = html

  if (!html.includes("<html")) {
    safeHtml = `<html><head></head><body>${html}</body></html>`
  }

  // 🔥 FIX: base tag (IMPORTANT)
  const baseTag = `<base href="${url}" />`

  if (safeHtml.includes("<head>")) {
    safeHtml = safeHtml.replace("<head>", `<head>${baseTag}`)
  } else {
    safeHtml = safeHtml.replace("<html>", `<html><head>${baseTag}</head>`)
  }

  return safeHtml
}

export async function POST(request) {
  const { url } = await request.json()

  if (!url) {
    return Response.json({ error: "URL is required" }, { status: 400 })
  }

  try {
    const simpleRes = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })

    const simpleHtml = await simpleRes.text()

    if (isJsHeavySite(simpleHtml)) {
      console.log("JS heavy site detected, using Puppeteer...")

      const html = await fetchWithPuppeteer(url)
      const safeHtml = ensureFullHTML(html, url) 

      return Response.json({
        html: safeHtml,
        method: "puppeteer"
      })
    }

    const safeHtml = ensureFullHTML(simpleHtml, url) 

    return Response.json({
      html: safeHtml,
      method: "fetch"
    })

  } catch (error) {
    console.log("Simple fetch failed, trying Puppeteer...")

    try {
      const html = await fetchWithPuppeteer(url)
      const safeHtml = ensureFullHTML(html, url) 

      return Response.json({
        html: safeHtml,
        method: "puppeteer"
      })

    } catch (puppeteerError) {
      console.log("Puppeteer failed:", puppeteerError.message)

      return Response.json({
        error: "Could not fetch website",
        html: "<h1 style='color:black'>Failed to load site</h1>",
        method: "failed"
      })
    }
  }
}

async function fetchWithPuppeteer(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
    ]
  })

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
      console.log("Goto failed, continuing anyway...")
    }

    
    await new Promise(r => setTimeout(r, 4000))

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await new Promise(r => setTimeout(r, 2000))

    return await page.content()

  } finally {
    await browser.close()
  }
}