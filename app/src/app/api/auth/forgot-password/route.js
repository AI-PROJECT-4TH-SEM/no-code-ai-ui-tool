import connectDB from "@/lib/db"
import User from "@/lib/models/User"
import crypto from "crypto"
import { sendEmail } from "@/lib/sendEmail"
export async function POST(req) {
  const { email } = await req.json()

  await connectDB()

  const user = await User.findOne({ email })
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 })
  }

  const resetToken = crypto.randomBytes(32).toString("hex")

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")

  user.resetPasswordToken = hashedToken
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000 // 15 min

  await user.save()

  const resetURL = `http://localhost:3000/reset-password/${resetToken}`

  console.log("RESET LINK:", resetURL)

  await sendEmail(
    user.email,
    "Password Reset",
    `
      <p>Hi ${user.firstName},</p>
      <p>You have requested a password reset. Please click the link below to reset your password:</p>
      <a href="${resetURL}" target="_blank">Reset Password</a>
      <p>This link will expire in 15 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    `
  )

  return Response.json({ success: true })
}