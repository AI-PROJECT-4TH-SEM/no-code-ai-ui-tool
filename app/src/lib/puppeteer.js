import fs from "node:fs"
import puppeteer from "puppeteer"

const linuxChromePaths = [
  "/usr/bin/google-chrome-stable",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
]

function findChromeExecutable() {
  const configuredPath = process.env.PUPPETEER_EXECUTABLE_PATH
  if (configuredPath && fs.existsSync(/* turbopackIgnore: true */ configuredPath)) return configuredPath

  let bundledPath = ""
  try {
    bundledPath = puppeteer.executablePath()
  } catch {
    bundledPath = ""
  }
  if (bundledPath && fs.existsSync(/* turbopackIgnore: true */ bundledPath)) return bundledPath

  const systemPath = linuxChromePaths.find(path => fs.existsSync(path))
  return systemPath || null
}

export async function launchPuppeteer(options = {}) {
  const executablePath = findChromeExecutable()
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