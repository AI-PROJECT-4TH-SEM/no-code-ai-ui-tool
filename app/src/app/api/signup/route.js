import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { normalizeEmail, isNonEmptyString, isValidEmail } from "@/lib/validation";
import { rateLimit } from "@/lib/rateLimit";
import { jsonResponse } from "@/lib/http";
import { logError, logWarn } from "@/lib/logger";

export async function POST(req) {
  const ip = req.headers.get("x-forwarded-for") || "local";
  const rateCheck = rateLimit({ key: `signup:${ip}`, limit: 5, windowMs: 60_000 });
  if (!rateCheck.allowed) {
    logWarn("Signup rate limited", { ip, remaining: rateCheck.remaining })
    return jsonResponse({ error: "Too many requests" }, 429);
  }

  await connectDB();
  const body = await req.json().catch(() => ({}));
  const firstName = typeof body.firstName === "string" ? body.firstName.trim() : "";
  const lastName = typeof body.lastName === "string" ? body.lastName.trim() : "";
  const email = normalizeEmail(body.email);
  const password = typeof body.password === "string" ? body.password : "";

  if (!isNonEmptyString(firstName) || !isValidEmail(email) || !isNonEmptyString(password) || password.length < 8) {
    logWarn("Signup rejected due to invalid payload", { ip, email })
    return jsonResponse({ error: "Invalid signup data" }, 400);
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logWarn("Signup rejected because user already exists", { ip, email })
      return jsonResponse({ error: "User already exists" }, 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ firstName, lastName, email, password: hashedPassword });

    return jsonResponse({ message: "User created successfully" }, 201);
  } catch (error) {
    logError("Signup failed", { ip, email, error })
    return jsonResponse({ error: "Unable to create account" }, 500);
  }
}