import connectDB from "@/lib/db"
import Html from "@/lib/models/Html"
import jwt from "jsonwebtoken"

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET

function getUserId(req) {
  const auth = req.headers.get("authorization")
  if (!auth) return null
  const token = auth.replace("Bearer ", "")
  try {
    const payload = jwt.verify(token, ACCESS_SECRET)
    return payload.userId
  } catch {
    return null
  }
}

export async function GET(req) {
  await connectDB()
  const userId = getUserId(req)
  if (!userId) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })

  try {
    const doc = await Html.findOne({ userId })
    return new Response(JSON.stringify({ html: doc?.content || "" }), { status: 200 })
  } catch {
    return new Response(JSON.stringify({ error: "Failed to fetch HTML" }), { status: 500 })
  }
}

export async function POST(req) {
  await connectDB()
  const userId = getUserId(req)
  if (!userId) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })

  try {
    const { content } = await req.json()
    if (!content) return new Response(JSON.stringify({ error: "No content provided" }), { status: 400 })

    await Html.findOneAndUpdate(
      { userId },
      { content, updatedAt: new Date() },
      { upsert: true, new: true }
    )

    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  } catch {
    return new Response(JSON.stringify({ error: "Failed to save HTML" }), { status: 500 })
  }
}