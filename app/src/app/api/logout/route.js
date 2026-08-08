import { clearRefreshCookie } from "@/lib/auth"
import { jsonResponse } from "@/lib/http"
import { logInfo } from "@/lib/logger"

export async function POST() {
  logInfo("User logged out")
  return jsonResponse({ ok: true }, 200, { "Set-Cookie": clearRefreshCookie() })
}