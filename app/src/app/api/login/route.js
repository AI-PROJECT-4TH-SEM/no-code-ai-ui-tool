import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export async function POST(req) {
  await connectDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user) return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });

  // Create tokens
  const accessToken = jwt.sign({ userId: user._id }, ACCESS_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ userId: user._id }, REFRESH_SECRET, { expiresIn: "7d" });

  // Store refresh token in DB
  user.refreshToken = refreshToken;
  await user.save();

  // Set refresh token as httpOnly cookie
  const cookieSerialized = serialize("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  });

  return new Response(JSON.stringify({ accessToken }), {
    status: 200,
    headers: { "Set-Cookie": cookieSerialized },
  });
}