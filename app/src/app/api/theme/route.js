import connectDB from "@/lib/db";
import Theme from "@/lib/models/Theme";
import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

// GET user theme
export async function GET(req) {
  await connectDB();

  const authHeader = req.headers.get("authorization");
  if (!authHeader) return new Response(JSON.stringify({ error: "No token" }), { status: 401 });

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, ACCESS_SECRET);

    const theme = await Theme.findOne({ userId: payload.userId });
    return new Response(JSON.stringify({ theme: theme?.selectedTheme || null }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid or expired token" }), { status: 403 });
  }
}

// PATCH (update) user theme
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
  const { themeName } = body;

  if (!themeName) return new Response(JSON.stringify({ error: "Theme is required" }), { status: 400 });

  try {
    const existing = await Theme.findOne({ userId: payload.userId });
    if (existing) {
      existing.selectedTheme = themeName;
      await existing.save();
    } else {
      await Theme.create({ userId: payload.userId, selectedTheme: themeName });
    }

    return new Response(JSON.stringify({ success: true, selectedTheme: themeName }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}