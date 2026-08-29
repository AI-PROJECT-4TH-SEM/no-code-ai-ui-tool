import connectDB from "@/lib/db"
import Html from "@/lib/models/Html"
import { sanitizeText } from "@/lib/validation"
import { getAuthenticatedUserId } from "@/lib/auth"
import { jsonResponse } from "@/lib/http"
import { logError, logWarn } from "@/lib/logger"

export async function GET(req) {
  await connectDB()
  const userId = getAuthenticatedUserId(req)
  if (!userId) {
    logWarn("HTML fetch denied: missing auth")
    return jsonResponse({ error: "Unauthorized" }, 401)
  }

  try {
    const doc = await Html.findOne({ userId })
    return jsonResponse({ html: doc?.content || "" }, 200)
  } catch (error) {
    logError("HTML fetch failed", { userId, error })
    return jsonResponse({ error: "Failed to fetch HTML" }, 500)
  }
}

export async function POST(req) {
  await connectDB()
  const userId = getAuthenticatedUserId(req)
  if (!userId) {
    logWarn("HTML save denied: missing auth")
    return jsonResponse({ error: "Unauthorized" }, 401)
  }

  try {
    const body = await req.json().catch(() => ({}))
    const content = sanitizeText(body.content)
    if (!content) {
      return jsonResponse({ error: "No content provided" }, 400)
    }

    await Html.findOneAndUpdate(
      { userId },
      { content, updatedAt: new Date() },
      { upsert: true, returnDocument: "after" }
    )

    return jsonResponse({ ok: true }, 200)
  } catch (error) {
    logError("HTML save failed", { userId, error })
    return jsonResponse({ error: "Failed to save HTML" }, 500)
  }
}