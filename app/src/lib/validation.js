export function normalizeEmail(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : ""
}

export function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || "")
}

export function isValidUrl(value) {
  if (!isNonEmptyString(value)) return false
  try {
    const parsed = new URL(value)
    return ["http:", "https:"].includes(parsed.protocol)
  } catch {
    return false
  }
}

export function sanitizeText(value) {
  return typeof value === "string" ? value.trim().slice(0, 200000) : ""
}
