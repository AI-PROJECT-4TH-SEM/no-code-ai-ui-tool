import connectDB from "@/lib/db"
import User from "@/lib/models/User"
import jwt from "jsonwebtoken"

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET

export async function POST(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1]

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, ACCESS_SECRET)

    const { name} = await req.json()

    const firstName = name.split(" ")[0]
    const lastName = name.split(" ").slice(1).join(" ")

    await connectDB()

    const user = await User.findByIdAndUpdate(
      decoded.id, // ✅ USE ID (NOT EMAIL)
      { firstName, lastName },
      { new: true }
    )

    return Response.json({ success: true, user })

  } catch (err) {
    return Response.json({ error: "Update failed" }, { status: 500 })
  }
}