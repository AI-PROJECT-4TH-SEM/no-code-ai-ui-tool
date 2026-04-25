import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken";
import { parse, serialize } from "cookie";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export async function GET(req) {
  await connectDB();

  const cookies = parse(req.headers.get("cookie") || "");
  const refreshToken = cookies.refreshToken;
  if (!refreshToken) return new Response(JSON.stringify({ error: "No refresh token" }), { status: 401 });

  try {
    const payload = jwt.verify(refreshToken, REFRESH_SECRET);
    const user = await User.findById(payload.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return new Response(JSON.stringify({ error: "Invalid token" }), { status: 403 });
    }

    const accessToken = jwt.sign({ userId: user._id }, ACCESS_SECRET, { expiresIn: "15m" });

    return new Response(JSON.stringify({ accessToken }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Token expired" }), { status: 403 });
  }
}