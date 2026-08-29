import fs from "node:fs"
import puppeteer from "puppeteer"
import puppeteerCore from "puppeteer-core"
import chromium from "@sparticuz/chromium"


const linuxChromePaths = [
  "/usr/bin/google-chrome-stable",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
]

async function findChromeExecutable() {
  const configuredPath = process.env.PUPPETEER_EXECUTABLE_PATH
  if (configuredPath && fs.existsSync(/* turbopackIgnore: true */ configuredPath)) return configuredPath

  let bundledPath = ""
  try {
    bundledPath = await puppeteer.executablePath()
  } catch {
    bundledPath = ""
  }
  if (bundledPath && fs.existsSync(/* turbopackIgnore: true */ bundledPath)) return bundledPath

  const systemPath = linuxChromePaths.find(path => fs.existsSync(path))
  return systemPath || null
}

export async function launchPuppeteer(options = {}) {
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    return puppeteerCore.launch({
      ...options,
      args: [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox", ...(options.args || [])],
      defaultViewport: options.defaultViewport || { width: 1280, height: 800 },
      executablePath: await chromium.executablePath(),
    })
  }

  const executablePath = await findChromeExecutable()
  if (!executablePath) {
    throw new Error(
      "Chrome is unavailable. Run `npx puppeteer browsers install chrome` during deployment or set PUPPETEER_EXECUTABLE_PATH."
    )
  }

  return puppeteer.launch({
    ...options,
    executablePath,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      ...(options.args || []),
    ],
  })
}