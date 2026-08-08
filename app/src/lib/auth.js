import jwt from "jsonwebtoken"
import { parse, serialize } from "cookie"

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET

export function getBearerToken(req) {
  const authHeader = req.headers.get("authorization") || ""
  if (!authHeader.startsWith("Bearer ")) return null
  return authHeader.slice(7).trim()
}

export function getRefreshToken(req) {
  const cookies = parse(req.headers.get("cookie") || "")
  return cookies.refreshToken || null
}

export function verifyAccessToken(token) {
  if (!token) return null
  try {
    return jwt.verify(token, ACCESS_SECRET)
  } catch {
    return null
  }
}

export function verifyRefreshToken(token) {
  if (!token) return null
  try {
    return jwt.verify(token, REFRESH_SECRET)
  } catch {
    return null
  }
}

export function getAuthenticatedUserId(req) {
  const token = getBearerToken(req)
  const payload = verifyAccessToken(token)
  return payload?.userId || null
}

export function buildRefreshCookie(token) {
  return serialize("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  })
}

export function clearRefreshCookie() {
  return serialize("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  })
}
