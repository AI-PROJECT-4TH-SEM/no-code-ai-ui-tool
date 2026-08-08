import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { normalizeEmail, isNonEmptyString, isValidEmail } from "@/lib/validation";
import { rateLimit } from "@/lib/rateLimit";
import { buildRefreshCookie, getRefreshToken } from "@/lib/auth";
import { jsonResponse } from "@/lib/http";
import { logError, logWarn } from "@/lib/logger";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export async function POST(req) {
  const ip = req.headers.get("x-forwarded-for") || "local";
  const rateCheck = rateLimit({ key: `login:${ip}`, limit: 10, windowMs: 60_000 });
  if (!rateCheck.allowed) {
    logWarn("Login rate limited", { ip, remaining: rateCheck.remaining })
    return jsonResponse({ error: "Too many requests" }, 429);
  }

  await connectDB();
  const body = await req.json().catch(() => ({}));
  const email = normalizeEmail(body.email);
  const password = typeof body.password === "string" ? body.password : "";

  if (!isValidEmail(email) || !isNonEmptyString(password)) {
    logWarn("Login rejected due to invalid payload", { ip, email })
    return jsonResponse({ error: "Invalid credentials" }, 401);
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      logWarn("Login failed for unknown user", { ip, email })
      return jsonResponse({ error: "Invalid credentials" }, 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logWarn("Login failed due to invalid password", { ip, email })
      return jsonResponse({ error: "Invalid credentials" }, 401);
    }

    const accessToken = jwt.sign({ userId: user._id }, ACCESS_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ userId: user._id }, REFRESH_SECRET, { expiresIn: "7d" });

    user.refreshToken = refreshToken;
    await user.save();

    return jsonResponse({ accessToken }, 200, { "Set-Cookie": buildRefreshCookie(refreshToken) });
  } catch (error) {
    logError("Login failed", { ip, email, error })
    return jsonResponse({ error: "Authentication failed" }, 500);
  }
}