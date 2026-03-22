import connectDB from "@/lib/db"
import User from "@/lib/models/User"
import crypto from "crypto"
import { sendEmail } from "@/lib/sendEmail"

export async function POST(req) {
  const { email } = await req.json()

  await connectDB()

  const user = await User.findOne({ email })

 if (!user) {
  // pretend success (security)
  return Response.json({ success: true })
}

  const otp = Math.floor(100000 + Math.random() * 900000).toString()

  user.otp = crypto.createHash("sha256").update(otp).digest("hex")
  user.otpExpire = Date.now() + 10 * 60 * 1000

  await user.save()

  try {
    await sendEmail(
      user.email,
      "Your OTP Code",
      `
        <h2>Password Reset OTP</h2>
        <h1>${otp}</h1>
        <p>Valid for 10 minutes</p>
      `
    )
  } catch (err) {
    console.log("EMAIL FAILED:", err.message)
    return Response.json({ error: "Email failed" }, { status: 500 })
  }

  return Response.json({ success: true })
}