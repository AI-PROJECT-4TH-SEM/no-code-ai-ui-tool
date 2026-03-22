import connectDB from "@/lib/db"
import History from "@/lib/models/History"

export async function POST(req) {
  const body = await req.json()
  await connectDB()

  await History.create(body)

  return Response.json({ success: true })
}