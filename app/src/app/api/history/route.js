import connectDB from "@/lib/db.js"
import History from "@/lib/models/History.js"

export async function GET() {
  await connectDB()

  const data = await History.find()
    .sort({ createdAt: -1 })
    .limit(10)

  return Response.json(data)
}
export async function DELETE() {
  await connectDB()
  await History.deleteMany({})

  return Response.json({ success: true })
}