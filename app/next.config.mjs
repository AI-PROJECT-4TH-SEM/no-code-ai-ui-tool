import { dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const allowedCorsOrigin = process.env.ALLOWED_CORS_ORIGIN || ""

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: {
    root: __dirname,
  },
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core", "puppeteer"],
  outputFileTracingIncludes: {
    "/api/analyse": [
      "./node_modules/@sparticuz/chromium/bin/**",
      "./node_modules/@sparticuz/chromium/build/**",
      "./node_modules/@sparticuz/chromium/package.json",
    ],
    "/api/fetch-url": [
      "./node_modules/@sparticuz/chromium/bin/**",
      "./node_modules/@sparticuz/chromium/build/**",
      "./node_modules/@sparticuz/chromium/package.json",
    ],
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      {
        key: "Content-Security-Policy",
        value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self';",
      },
    ]

    const apiHeaders = allowedCorsOrigin
      ? [
          { key: "Access-Control-Allow-Origin", value: allowedCorsOrigin },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PATCH,DELETE,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type,Authorization" },
          { key: "Access-Control-Allow-Credentials", value: "true" },
        ]
      : []

    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      ...(apiHeaders.length > 0
        ? [
            {
              source: "/api/:path*",
              headers: apiHeaders,
            },
          ]
        : []),
    ]
  },
}

export default nextConfig
