import connectDB from "@/lib/db"
import ExtensionChat from "@/lib/models/ExtensionChat"

export async function GET(req) {
  await connectDB()

  try {
    const sessions = await ExtensionChat.find({})
      .sort({ updatedAt: -1 })
      .limit(100)
      .select("sessionId pageUrl selectedSelector selectedTag messages createdAt updatedAt")

    return Response.json({
      success: true,
      sessions: sessions.map(s => ({
        sessionId: s.sessionId,
        pageUrl: s.pageUrl,
        selectedSelector: s.selectedSelector,
        selectedTag: s.selectedTag,
        messages: s.messages || [],
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      })),
    })
  } catch (err) {
    console.error("Failed to fetch sessions:", err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req) {
  await connectDB()

  try {
    const result = await ExtensionChat.deleteMany({})
    return Response.json({
      success: true,
      deletedCount: result.deletedCount,
    })
  } catch (err) {
    console.error("Failed to delete sessions:", err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
