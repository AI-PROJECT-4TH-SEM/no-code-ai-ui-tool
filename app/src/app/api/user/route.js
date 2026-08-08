import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { getAuthenticatedUserId } from "@/lib/auth";
import { jsonResponse } from "@/lib/http";
import { logError, logWarn } from "@/lib/logger";

export async function GET(req) {
  await connectDB();

  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    logWarn("User fetch denied: missing auth");
    return jsonResponse({ error: "No token" }, 401);
  }

  try {
    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) return jsonResponse({ error: "User not found" }, 404);

    return jsonResponse({ user }, 200);
  } catch (error) {
    logError("User fetch failed", { userId, error });
    return jsonResponse({ error: "Invalid or expired token" }, 403);
  }
}

export async function PATCH(req) {
  await connectDB();

  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    logWarn("User update denied: missing auth");
    return jsonResponse({ error: "No token" }, 401);
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { firstName, lastName } = body;

    if (!firstName || !lastName) {
      return jsonResponse({ error: "All fields are required" }, 400);
    }

    const user = await User.findById(userId);
    if (!user) return jsonResponse({ error: "User not found" }, 404);

    user.firstName = String(firstName).trim().slice(0, 80);
    user.lastName = String(lastName).trim().slice(0, 80);

    await user.save();

    return jsonResponse({ user }, 200);
  } catch (error) {
    logError("User update failed", { userId, error });
    return jsonResponse({ error: "Server error" }, 500);
  }
}