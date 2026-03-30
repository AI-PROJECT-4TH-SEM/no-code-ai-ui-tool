import connectDB from "@/lib/db"
import Session from "@/lib/models/Session"
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

export async function GET(req, context) {
  await connectDB()
  const userId = getUserId(req)
  if (!userId) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })

  const { id } = await context.params

  const session = await Session.findOne({ _id: id, userId })
  if (!session) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 })

  return Response.json(session)
}

export async function PATCH(req, context) {
  await connectDB()
  const userId = getUserId(req)
  if (!userId) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })

  const { id } = await context.params
  const { themeName, html, suppressedIds } = await req.json()

  const session = await Session.findOneAndUpdate(
    { _id: id, userId },
    {
      currentHtml: html,
      suppressedIds: suppressedIds ?? [],
      $push: {
        changes: {
          $each: [{ themeName, html, appliedAt: new Date() }],
          $position: 0
        }
      }
    },
    { returnDocument: "after" }
  )

  if (!session) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 })

  return Response.json({ success: true })
}

export async function DELETE(req, context) {
  await connectDB()
  const userId = getUserId(req)
  if (!userId) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })

  const { id } = await context.params

  await Session.findOneAndDelete({ _id: id, userId })
  return Response.json({ success: true })
}
