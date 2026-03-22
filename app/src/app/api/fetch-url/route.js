import puppeteer from "puppeteer"

function isJsHeavySite(html) {
  const bodyContent = html.replace(/<[^>]*>/g, '').trim()
  const scriptCount = (html.match(/<script/g) || []).length
  return bodyContent.length < 500 || scriptCount > 10
}

export async function POST(request) {
  const { url } = await request.json()

  if (!url) {
    return Response.json({ error: "URL is required" }, { status: 400 })
  }

  try {
    const simpleRes = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    const simpleHtml = await simpleRes.text()

    if (isJsHeavySite(simpleHtml)) {
      console.log("JS heavy site detected, using Puppeteer...")
      const html = await fetchWithPuppeteer(url)
      return Response.json({ html, method: "puppeteer" })
    }

    return Response.json({ html: simpleHtml, method: "fetch" })

  } catch (error) {
    console.log("Simple fetch failed, trying Puppeteer...")
    try {
      const html = await fetchWithPuppeteer(url)
      return Response.json({ html, method: "puppeteer" })
    } catch (puppeteerError) {
      return Response.json({
        error: "Could not fetch this website. Try pasting HTML manually."
      }, { status: 400 })
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
    await page.setExtraHTTPHeaders({
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
})
    await page.setViewport({ width: 1280, height: 800 })
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000
    })
    const html = await page.content()
    return html
  } finally {
    await browser.close()
  }
}