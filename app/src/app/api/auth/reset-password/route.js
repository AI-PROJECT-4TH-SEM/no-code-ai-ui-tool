import connectDB from "@/lib/db"
import User from "@/lib/models/User"
import crypto from "crypto"
import bcrypt from "bcryptjs"

export async function POST(req) {
  const { email, otp, password } = await req.json()

  await connectDB()

  const hashedOtp = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex")

  const user = await User.findOne({
    email,
    otp: hashedOtp,
    otpExpire: { $gt: Date.now() },
  })

  if (!user) {
    return Response.json({ error: "Invalid or expired OTP" }, { status: 400 })
  }

  // update password
  user.password = await bcrypt.hash(password, 10)

  // clear otp
  user.otp = undefined
  user.otpExpire = undefined

  await user.save()

  return Response.json({ success: true })
}