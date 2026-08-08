import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken";
import { getRefreshToken, verifyRefreshToken } from "@/lib/auth";
import { jsonResponse } from "@/lib/http";
import { logError, logWarn } from "@/lib/logger";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export async function GET(req) {
  await connectDB();

  const refreshToken = getRefreshToken(req);
  if (!refreshToken) {
    logWarn("Refresh token missing")
    return jsonResponse({ error: "No refresh token" }, 401);
  }

  try {
    const payload = verifyRefreshToken(refreshToken)
    if (!payload?.userId) {
      return jsonResponse({ error: "Invalid token" }, 403);
    }

    const user = await User.findById(payload.userId);
    if (!user || user.refreshToken !== refreshToken) {
      logWarn("Refresh token replay or mismatch", { userId: payload.userId })
      return jsonResponse({ error: "Invalid token" }, 403);
    }

    const accessToken = jwt.sign({ userId: user._id }, ACCESS_SECRET, { expiresIn: "15m" });

    return jsonResponse({ accessToken }, 200);
  } catch (error) {
    logError("Refresh token verification failed", { error })
    return jsonResponse({ error: "Token expired" }, 403);
  }
}