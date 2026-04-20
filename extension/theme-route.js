// app/api/theme/route.js  — UPDATED version
// Supports both JWT (website users) and Extension API Key (Chrome extension)
// Add to your .env:  EXTENSION_API_KEY=chai-ke-sath-extension-2025

import connectDB from "@/lib/db"
import Theme from "@/lib/models/Theme"
import jwt from "jsonwebtoken"

const ACCESS_SECRET    = process.env.JWT_ACCESS_SECRET
const EXTENSION_KEY    = process.env.EXTENSION_API_KEY || "chai-ke-sath-extension-2025"
const EXTENSION_USER_ID = "extension-device-user"   // fixed userId for extension saves

// ─── Auth helper — supports both JWT and Extension Key ────────────────────────
function resolveAuth(req) {
  // 1. Check extension API key header first
  const extKey = req.headers.get("x-extension-key")
  if (extKey && extKey === EXTENSION_KEY) {
    return { userId: EXTENSION_USER_ID, source: "extension" }
  }

  // 2. Fall back to JWT
  const authHeader = req.headers.get("authorization")
  if (!authHeader) return null

  const token = authHeader.split(" ")[1]
  try {
    const payload = jwt.verify(token, ACCESS_SECRET)
    return { userId: payload.userId, source: "jwt" }
  } catch {
    return null
  }
}

// ── GET theme ────────────────────────────────────────────────────────────────
export async function GET(req) {
  await connectDB()

  const auth = resolveAuth(req)
  if (!auth) {
    return new Response(JSON.stringify({ error: "No token" }), { status: 401 })
  }

  try {
    const theme = await Theme.findOne({ userId: auth.userId })
    return new Response(
      JSON.stringify({
        theme: theme?.selectedTheme || null,
        selectedTheme: theme?.selectedTheme || null,   // both keys for compatibility
      }),
      { status: 200 }
    )
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 })
  }
}

// ── PATCH theme ──────────────────────────────────────────────────────────────
export async function PATCH(req) {
  await connectDB()

  const auth = resolveAuth(req)
  if (!auth) {
    return new Response(JSON.stringify({ error: "No token" }), { status: 401 })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 })
  }

  // Accept both "themeName" (website) and "themeId" (extension) field names
  const themeName = body.themeName || body.themeId || null

  if (!themeName) {
    // Allow null/empty to clear theme
    try {
      await Theme.findOneAndDelete({ userId: auth.userId })
      return new Response(JSON.stringify({ success: true, selectedTheme: null }), { status: 200 })
    } catch {
      return new Response(JSON.stringify({ error: "Server error" }), { status: 500 })
    }
  }

  try {
    await Theme.findOneAndUpdate(
      { userId: auth.userId },
      { selectedTheme: themeName },
      { upsert: true }
    )

    return new Response(
      JSON.stringify({ success: true, selectedTheme: themeName }),
      { status: 200 }
    )
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 })
  }
}
