import connectDB from "@/lib/db"
import ExtensionTheme from "@/lib/models/ExtensionTheme"
import { jsonResponse } from "@/lib/http"
import { logError, logWarn } from "@/lib/logger"

const EXTENSION_KEY = "chai-ke-sath-extension-2025"

/**
 * Verify extension authentication
 */
function verifyExtensionKey(req) {
  const key = req.headers.get("x-extension-key")
  const deviceId = req.headers.get("x-device-id")

  if (!key || !deviceId) {
    return { valid: false, error: "Missing extension credentials" }
  }

  if (key !== EXTENSION_KEY) {
    return { valid: false, error: "Invalid extension key" }
  }

  return { valid: true, deviceId }
}

/**
 * POST /api/extension-theme
 * Save theme for a specific page/device
 */
export async function POST(req) {
  await connectDB()

  const auth = verifyExtensionKey(req)
  if (!auth.valid) {
    logWarn("Extension theme save denied:", auth.error)
    return jsonResponse({ error: auth.error }, 401)
  }

  try {
    const body = await req.json().catch(() => ({}))
    const { pageKey, themeName, themeId } = body

    if (!pageKey) {
      return jsonResponse({ error: "Missing page key" }, 400)
    }

    // Find or create extension theme entry
    let themeDoc = await ExtensionTheme.findOne({
      deviceId: auth.deviceId,
      pageKey,
    })

    if (!themeDoc) {
      themeDoc = new ExtensionTheme({
        deviceId: auth.deviceId,
        pageKey,
      })
    }

    if (themeName) {
      themeDoc.selectedTheme = themeName
      themeDoc.themeId = themeId
      themeDoc.lastUpdated = new Date()
    }

    await themeDoc.save()

    logWarn("Extension theme saved", {
      deviceId: auth.deviceId,
      pageKey,
      theme: themeName,
    })

    return jsonResponse({
      success: true,
      message: "Theme saved for extension",
      theme: themeDoc.selectedTheme,
    }, 200)
  } catch (error) {
    logError("Extension theme save failed", { error })
    return jsonResponse({ error: "Failed to save theme" }, 500)
  }
}

/**
 * GET /api/extension-theme
 * Retrieve theme for a specific page/device
 */
export async function GET(req) {
  await connectDB()

  const auth = verifyExtensionKey(req)
  if (!auth.valid) {
    logWarn("Extension theme fetch denied:", auth.error)
    return jsonResponse({ error: auth.error }, 401)
  }

  try {
    const { searchParams } = new URL(req.url)
    const pageKey = searchParams.get("pageKey")

    if (!pageKey) {
      return jsonResponse({ error: "Missing page key" }, 400)
    }

    const themeDoc = await ExtensionTheme.findOne({
      deviceId: auth.deviceId,
      pageKey,
    })

    if (!themeDoc) {
      return jsonResponse(
        {
          success: true,
          theme: null,
          message: "No theme saved for this page",
        },
        200
      )
    }

    return jsonResponse(
      {
        success: true,
        theme: themeDoc.selectedTheme,
        themeId: themeDoc.themeId,
      },
      200
    )
  } catch (error) {
    logError("Extension theme fetch failed", { error })
    return jsonResponse({ error: "Failed to fetch theme" }, 500)
  }
}

/**
 * DELETE /api/extension-theme
 * Clear theme for a specific page
 */
export async function DELETE(req) {
  await connectDB()

  const auth = verifyExtensionKey(req)
  if (!auth.valid) {
    logWarn("Extension theme delete denied:", auth.error)
    return jsonResponse({ error: auth.error }, 401)
  }

  try {
    const { searchParams } = new URL(req.url)
    const pageKey = searchParams.get("pageKey")

    if (!pageKey) {
      return jsonResponse({ error: "Missing page key" }, 400)
    }

    await ExtensionTheme.deleteOne({
      deviceId: auth.deviceId,
      pageKey,
    })

    return jsonResponse(
      { success: true, message: "Theme cleared" },
      200
    )
  } catch (error) {
    logError("Extension theme delete failed", { error })
    return jsonResponse({ error: "Failed to delete theme" }, 500)
  }
}
