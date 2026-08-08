import connectDB from "@/lib/db"
import Session from "@/lib/models/Session"
import User from "@/lib/models/User"
import { getAuthenticatedUserId } from "@/lib/auth"
import { jsonResponse } from "@/lib/http"
import { logError, logWarn } from "@/lib/logger"

export async function GET(req) {
  await connectDB()
  const userId = getAuthenticatedUserId(req)
  if (!userId) {
    logWarn("Session list denied: missing auth")
    return jsonResponse({ error: "Unauthorized" }, 401)
  }

  try {
    const sessions = await Session.find({ userId })
      .sort({ createdAt: -1 })
      .select("-originalHtml -currentHtml -changes")
    return jsonResponse(sessions, 200)
  } catch (error) {
    logError("Session list failed", { userId, error })
    return jsonResponse({ error: "Unable to load sessions" }, 500)
  }
}

export async function POST(req) {
  await connectDB()
  const userId = getAuthenticatedUserId(req)
  if (!userId) {
    logWarn("Session create denied: missing auth")
    return jsonResponse({ error: "Unauthorized" }, 401)
  }

  try {
    const body = await req.json().catch(() => ({}))
    const { label, html } = body
    if (!label || !html) return jsonResponse({ error: "Missing fields" }, 400)

    const session = await Session.create({
      userId,
      label: String(label).trim().slice(0, 200),
      originalHtml: String(html).slice(0, 2000000),
      currentHtml: String(html).slice(0, 2000000),
      changes: []
    })

    await User.findByIdAndUpdate(userId, { $inc: { totalAnalyses: 1 } })

    return jsonResponse({ sessionId: session._id }, 200)
  } catch (error) {
    logError("Session create failed", { userId, error })
    return jsonResponse({ error: "Unable to create session" }, 500)
  }
}