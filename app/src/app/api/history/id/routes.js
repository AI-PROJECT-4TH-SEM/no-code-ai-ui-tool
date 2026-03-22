import connectDB from "@/lib/db"
import History from "@/lib/models/History"

export async function DELETE(req, { params }) {
  const { id } = params

  try {
    await connectDB()
    await History.findByIdAndDelete(id)

    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: "Delete failed" }, { status: 500 })
  }
}