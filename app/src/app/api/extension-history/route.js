import connectDB from "@/lib/db"
import ExtensionHistory from "@/lib/models/ExtensionHistory"
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
 * POST /api/extension-history
 * Save a history entry from the extension
 */
export async function POST(req) {
  await connectDB()

  const auth = verifyExtensionKey(req)
  if (!auth.valid) {
    logWarn("Extension history save denied:", auth.error)
    return jsonResponse({ error: auth.error }, 401)
  }

  try {
    const body = await req.json().catch(() => ({}))
    const { url, title, result, timestamp } = body

    if (!url) {
      return jsonResponse({ error: "Missing URL" }, 400)
    }

    const entry = new ExtensionHistory({
      deviceId: auth.deviceId,
      url,
      title: title || "",
      result: result || null,
      timestamp: timestamp || new Date(),
    })

    await entry.save()

    return jsonResponse(
      {
        success: true,
        id: entry._id,
        message: "History entry saved",
      },
      201
    )
  } catch (error) {
    logError("Extension history save failed", { error })
    return jsonResponse({ error: "Failed to save history" }, 500)
  }
}

/**
 * GET /api/extension-history
 * Retrieve history entries for a device
 */
export async function GET(req) {
  await connectDB()

  const auth = verifyExtensionKey(req)
  if (!auth.valid) {
    logWarn("Extension history fetch denied:", auth.error)
    return jsonResponse({ error: auth.error }, 401)
  }

  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get("limit") || "20")
    const skip = parseInt(searchParams.get("skip") || "0")

    const entries = await ExtensionHistory.find({ deviceId: auth.deviceId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip)

    const total = await ExtensionHistory.countDocuments({
      deviceId: auth.deviceId,
    })

    return jsonResponse(
      {
        success: true,
        entries,
        total,
        limit,
        skip,
      },
      200
    )
  } catch (error) {
    logError("Extension history fetch failed", { error })
    return jsonResponse({ error: "Failed to fetch history" }, 500)
  }
}

/**
 * DELETE /api/extension-history
 * Delete a history entry
 */
export async function DELETE(req) {
  await connectDB()

  const auth = verifyExtensionKey(req)
  if (!auth.valid) {
    logWarn("Extension history delete denied:", auth.error)
    return jsonResponse({ error: auth.error }, 401)
  }

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return jsonResponse({ error: "Missing entry ID" }, 400)
    }

    const result = await ExtensionHistory.findOneAndDelete({
      _id: id,
      deviceId: auth.deviceId,
    })

    if (!result) {
      return jsonResponse({ error: "Entry not found" }, 404)
    }

    return jsonResponse(
      { success: true, message: "Entry deleted" },
      200
    )
  } catch (error) {
    logError("Extension history delete failed", { error })
    return jsonResponse({ error: "Failed to delete entry" }, 500)
  }
}
