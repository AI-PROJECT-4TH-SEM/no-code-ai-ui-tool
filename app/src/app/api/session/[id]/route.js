import connectDB from "@/lib/db"
import Session from "@/lib/models/Session"
import { getAuthenticatedUserId } from "@/lib/auth"
import { jsonResponse } from "@/lib/http"
import { logError, logWarn } from "@/lib/logger"

export async function GET(req, context) {
  await connectDB()
  const userId = getAuthenticatedUserId(req)
  if (!userId) return jsonResponse({ error: "Unauthorized" }, 401)

  const { id } = await context.params

  try {
    const session = await Session.findOne({ _id: id, userId })
    if (!session) return jsonResponse({ error: "Not found" }, 404)

    return jsonResponse(session, 200)
  } catch (error) {
    logError("Failed to fetch session", { userId, sessionId: id, error })
    return jsonResponse({ error: "Failed to fetch session" }, 500)
  }
}

export async function PATCH(req, context) {
  await connectDB()
  const userId = getAuthenticatedUserId(req)
  if (!userId) return jsonResponse({ error: "Unauthorized" }, 401)

  const { id } = await context.params
  const body = await req.json().catch(() => ({}))
  const { themeName, html, suppressedIds } = body

  if (!html) {
    logWarn("Session update rejected because HTML was missing", { userId, sessionId: id })
    return jsonResponse({ error: "Missing html" }, 400)
  }

  try {
    const session = await Session.findOneAndUpdate(
      { _id: id, userId },
      {
        currentHtml: String(html).slice(0, 2000000),
        suppressedIds: suppressedIds ?? [],
        $push: {
          changes: {
            $each: [{ themeName, html: String(html).slice(0, 2000000), appliedAt: new Date() }],
            $position: 0
          }
        }
      },
      { returnDocument: "after" }
    )

    if (!session) return jsonResponse({ error: "Not found" }, 404)

    return jsonResponse({ success: true }, 200)
  } catch (error) {
    logError("Failed to update session", { userId, sessionId: id, error })
    return jsonResponse({ error: "Failed to update session" }, 500)
  }
}

export async function DELETE(req, context) {
  await connectDB()
  const userId = getAuthenticatedUserId(req)
  if (!userId) return jsonResponse({ error: "Unauthorized" }, 401)

  const { id } = await context.params

  try {
    await Session.findOneAndDelete({ _id: id, userId })
    return jsonResponse({ success: true }, 200)
  } catch (error) {
    logError("Failed to delete session", { userId, sessionId: id, error })
    return jsonResponse({ error: "Failed to delete session" }, 500)
  }
}
