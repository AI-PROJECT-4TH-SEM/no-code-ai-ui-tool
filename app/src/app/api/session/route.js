import connectDB from "@/lib/db"
import Session from "@/lib/models/Session"
import User from "@/lib/models/User"
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

  const sessions = await Session.find({ userId })
    .sort({ createdAt: -1 })
    .select("-originalHtml -currentHtml -changes")
  return Response.json(sessions)
}

export async function POST(req) {
  await connectDB()
  const userId = getUserId(req)
  if (!userId) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })

  const { label, html } = await req.json()
  if (!label || !html) return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 })

  const session = await Session.create({
    userId,
    label,
    originalHtml: html,
    currentHtml: html,
    changes: []
  })

  await User.findByIdAndUpdate(userId, { $inc: { totalAnalyses: 1 } })

  return Response.json({ sessionId: session._id })
}