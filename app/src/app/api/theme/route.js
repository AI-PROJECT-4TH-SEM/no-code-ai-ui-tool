import connectDB from "@/lib/db"
import Theme from "@/lib/models/Theme"
import User from "@/lib/models/User"
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
    // Try to get from Theme model first (primary), fall back to User model
    const themeDoc = await Theme.findOne({ userId })
    let selectedTheme = themeDoc?.selectedTheme

    if (!selectedTheme) {
      const userDoc = await User.findById(userId)
      selectedTheme = userDoc?.preferredTheme
    }

    selectedTheme = selectedTheme || themes[0]?.name || "AI Minimal"

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
    // Update Theme model
    const updated = await Theme.findOneAndUpdate(
      { userId },
      {
        selectedTheme: themeName,
        lastUpdated: new Date(),
      },
      { upsert: true, returnDocument: "after" }
    )

    // Also update User model for redundant storage
    await User.findByIdAndUpdate(
      userId,
      {
        preferredTheme: themeName,
        lastThemeUpdate: new Date(),
      },
      { returnDocument: "after" }
    )

    return jsonResponse({ success: true, selectedTheme: updated.selectedTheme }, 200)
  } catch (error) {
    logError("Theme update failed", { userId, error })
    return jsonResponse({ error: "Server error" }, 500)
  }
}