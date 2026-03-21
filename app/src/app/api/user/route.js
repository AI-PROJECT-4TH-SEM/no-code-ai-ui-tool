import connectDB from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

export async function GET(req) {
  await connectDB();

  const authHeader = req.headers.get("authorization"); // "Bearer <token>"
  if (!authHeader) return new Response(JSON.stringify({ error: "No token" }), { status: 401 });

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, ACCESS_SECRET);
    const user = await User.findById(payload.userId).select("-password -refreshToken");
    if (!user) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

    return new Response(JSON.stringify({ user }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid or expired token" }), { status: 403 });
  }
}

export async function PATCH(req) {
  await connectDB();

  const authHeader = req.headers.get("authorization");
  if (!authHeader) return new Response(JSON.stringify({ error: "No token" }), { status: 401 });

  const token = authHeader.split(" ")[1];
  let payload;
  try {
    payload = jwt.verify(token, ACCESS_SECRET);
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid or expired token" }), { status: 403 });
  }

  const body = await req.json();
  const { firstName, lastName, email } = body;

  if (!firstName || !lastName || !email) {
    return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
  }

  try {
    const user = await User.findById(payload.userId);
    if (!user) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;

    await user.save();

    return new Response(JSON.stringify({ user }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}