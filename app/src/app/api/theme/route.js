import connectDB from "@/lib/db"
import Theme from "@/lib/models/Theme"
import { themes } from "@/lib/themes"
import { isNonEmptyString } from "@/lib/validation"
import { getAuthenticatedUserId } from "@/lib/auth"
import { jsonResponse } from "@/lib/http"
import { logError, logWarn } from "@/lib/logger"

export async function GET(req) {
  await connectDB()

  const userId = getAuthenticatedUserId(req)
  if (!userId) {
    logWarn("Theme fetch denied: missing auth")
    return jsonResponse({ error: "No token" }, 401)
  }

  try {
    const themeDoc = await Theme.findOne({ userId })
    const selectedTheme = themeDoc?.selectedTheme || themes[0]?.name || "AI Minimal"

    return jsonResponse({ theme: selectedTheme }, 200)
  } catch (error) {
    logError("Theme fetch failed", { userId, error })
    return jsonResponse({ error: "Invalid token" }, 403)
  }
}

export async function PATCH(req) {
  await connectDB()

  const userId = getAuthenticatedUserId(req)
  if (!userId) {
    logWarn("Theme update denied: missing auth")
    return jsonResponse({ error: "No token" }, 401)
  }

  const body = await req.json().catch(() => ({}))
  const themeName = typeof body.themeName === "string" ? body.themeName.trim() : ""

  if (!isNonEmptyString(themeName)) {
    return jsonResponse({ error: "Theme required" }, 400)
  }

  const validThemes = themes.map(t => t.name)

  if (!validThemes.includes(themeName)) {
    return jsonResponse({ error: "Invalid theme" }, 400)
  }

  try {
    const updated = await Theme.findOneAndUpdate(
      { userId },
      { selectedTheme: themeName },
      { upsert: true, new: true }
    )

    return jsonResponse({ success: true, selectedTheme: updated.selectedTheme }, 200)
  } catch (error) {
    logError("Theme update failed", { userId, error })
    return jsonResponse({ error: "Server error" }, 500)
  }
}