function serializeValue(value) {
  if (value instanceof Error) {
    return { message: value.message, stack: value.stack }
  }

  if (typeof value === "object" && value !== null) {
    try {
      return JSON.parse(JSON.stringify(value))
    } catch {
      return String(value)
    }
  }

  return value
}

function write(level, message, details = {}) {
  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    details: serializeValue(details),
  }

  const output = JSON.stringify(payload)
  if (level === "error") {
    console.error(output)
  } else if (level === "warn") {
    console.warn(output)
  } else {
    console.info(output)
  }
}

export function logInfo(message, details) {
  write("info", message, details)
}

export function logWarn(message, details) {
  write("warn", message, details)
}

export function logError(message, details) {
  write("error", message, details)
}
