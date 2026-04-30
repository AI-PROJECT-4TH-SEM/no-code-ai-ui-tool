import connectDB from "@/lib/db"
import ExtensionChat from "@/lib/models/ExtensionChat"

export async function DELETE(req, { params }) {
  await connectDB()

  try {
    const { id } = params
    
    if (!id) {
      return Response.json({ error: "Session ID required" }, { status: 400 })
    }

    const result = await ExtensionChat.deleteOne({ sessionId: id })
    
    if (result.deletedCount === 0) {
      return Response.json({ error: "Session not found" }, { status: 404 })
    }

    return Response.json({
      success: true,
      deletedCount: result.deletedCount,
    })
  } catch (err) {
    console.error("Failed to delete session:", err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
