import connectDB from "@/lib/db"
import Theme from "@/lib/models/Theme"
import jwt from "jsonwebtoken"

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET

// ✅ GET theme
export async function GET(req) {
  await connectDB()

  const authHeader = req.headers.get("authorization")
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "No token" }), { status: 401 })
  }

  const token = authHeader.split(" ")[1]

  try {
    const payload = jwt.verify(token, ACCESS_SECRET)

    const theme = await Theme.findOne({ userId: payload.userId })

    return new Response(
      JSON.stringify({ theme: theme?.selectedTheme || null }),
      { status: 200 }
    )
  } catch {
    return new Response(JSON.stringify({ error: "Invalid token" }), { status: 403 })
  }
}

// ✅ PATCH theme
export async function PATCH(req) {
  await connectDB()

  const authHeader = req.headers.get("authorization")
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "No token" }), { status: 401 })
  }

  const token = authHeader.split(" ")[1]

  let payload
  try {
    payload = jwt.verify(token, ACCESS_SECRET)
  } catch {
    return new Response(JSON.stringify({ error: "Invalid token" }), { status: 403 })
  }

  const { themeName } = await req.json()

  if (!themeName) {
    return new Response(JSON.stringify({ error: "Theme required" }), { status: 400 })
  }

  try {
    await Theme.findOneAndUpdate(
      { userId: payload.userId },
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