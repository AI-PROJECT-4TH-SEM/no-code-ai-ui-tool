import connectDB from "@/lib/db"
import User from "@/lib/models/User"
import Theme from "@/lib/models/Theme"
import Session from "@/lib/models/Session"
import { getAuthenticatedUserId } from "@/lib/auth"
import { jsonResponse } from "@/lib/http"
import { logError, logWarn } from "@/lib/logger"

/**
 * POST /api/migrate-local-data
 * Migrates locally stored data to MongoDB for authenticated users
 * Expects: { themeData?: object }
 */
export async function POST(req) {
  await connectDB()

  const userId = getAuthenticatedUserId(req)
  if (!userId) {
    logWarn("Migration denied: missing auth")
    return jsonResponse({ error: "No token" }, 401)
  }

  try {
    const body = await req.json().catch(() => ({}))
    const { themeData, sessionData } = body

    const migrations = {
      theme: false,
      session: false,
    }

    // Migrate theme data
    if (themeData && themeData.name) {
      try {
        await Theme.findOneAndUpdate(
          { userId },
          {
            selectedTheme: themeData.name,
            customSettings: themeData.customSettings || {},
            lastUpdated: new Date(),
          },
          { upsert: true, new: true }
        )
        migrations.theme = true
      } catch (themeError) {
        logError("Theme migration failed", { userId, themeError })
      }
    }

    // Migrate session data (if provided)
    if (sessionData && sessionData.html) {
      try {
        const existingSession = await Session.findOne({ userId, label: sessionData.label || "Migrated Session" })
        
        if (!existingSession) {
          await Session.create({
            userId,
            label: sessionData.label || "Migrated Session",
            originalHtml: sessionData.originalHtml || sessionData.html,
            currentHtml: sessionData.html,
            changes: sessionData.changes || [],
            suppressedIds: sessionData.suppressedIds || [],
          })
          migrations.session = true
        }
      } catch (sessionError) {
        logError("Session migration failed", { userId, sessionError })
      }
    }

    return jsonResponse({
      success: true,
      message: "Local data migration completed",
      migrations,
    }, 200)
  } catch (error) {
    logError("Data migration failed", { userId, error })
    return jsonResponse({ error: "Migration failed" }, 500)
  }
}

/**
 * GET /api/migrate-local-data
 * Returns migration status and instructions
 */
export async function GET(req) {
  await connectDB()

  const userId = getAuthenticatedUserId(req)
  if (!userId) {
    logWarn("Migration status check denied: missing auth")
    return jsonResponse({ error: "No token" }, 401)
  }

  try {
    const themeDoc = await Theme.findOne({ userId })
    const sessionCount = await Session.countDocuments({ userId })

    return jsonResponse({
      migrationStatus: {
        hasThemeData: !!themeDoc,
        sessionCount,
        lastThemeUpdate: themeDoc?.updatedAt || null,
      },
      instructions: "Call POST with local data to migrate it to MongoDB",
    }, 200)
  } catch (error) {
    logError("Migration status check failed", { userId, error })
    return jsonResponse({ error: "Status check failed" }, 500)
  }
}
