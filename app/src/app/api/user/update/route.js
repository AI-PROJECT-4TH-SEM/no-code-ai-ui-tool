import connectDB from "@/lib/db"
import User from "@/lib/models/User"
import { getAuthenticatedUserId } from "@/lib/auth"
import { jsonResponse } from "@/lib/http"
import { logError, logWarn } from "@/lib/logger"

export async function POST(req) {
  const userId = getAuthenticatedUserId(req)
  if (!userId) {
    logWarn("User update endpoint denied: missing auth")
    return jsonResponse({ error: "Unauthorized" }, 401)
  }

  try {
    const { name } = await req.json().catch(() => ({}))
    const firstName = String(name || "").split(" ")[0] || ""
    const lastName = String(name || "").split(" ").slice(1).join(" ") || ""

    await connectDB()

    const user = await User.findByIdAndUpdate(
      userId,
      { firstName: firstName.trim(), lastName: lastName.trim() },
      { new: true }
    )

    return jsonResponse({ success: true, user })
  } catch (error) {
    logError("User update endpoint failed", { userId, error })
    return jsonResponse({ error: "Update failed" }, 500)
  }
}