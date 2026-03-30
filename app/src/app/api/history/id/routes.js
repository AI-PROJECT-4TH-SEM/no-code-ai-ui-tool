import connectDB from "@/lib/db"
import Session from "@/lib/models/Session"

export async function GET(req, { params }) {
  const { id } = params
  try {
    await connectDB()
    const session = await Session.findById(id)
    if (!session) return Response.json({ error: "Not found" }, { status: 404 })
    return Response.json(session)
  } catch (err) {
    return Response.json({ error: "Failed to load session" }, { status: 500 })
  }
}

export async function PATCH(req, { params }) {
  const { id } = params
  try {
    await connectDB()
    const { html, themeName } = await req.json()

    const session = await Session.findByIdAndUpdate(
      id,
      {
        $push: {
          changes: {
            $each: [{ html, themeName, appliedAt: new Date() }],
            $position: 0  
          }
        }
      },
      { returnDocument: "after", new: true }
    )

    return Response.json(session)
  } catch (err) {
    return Response.json({ error: "Failed to save" }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  const { id } = params
  try {
    await connectDB()
    await Session.findByIdAndDelete(id)
    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: "Delete failed" }, { status: 500 })
  }
}