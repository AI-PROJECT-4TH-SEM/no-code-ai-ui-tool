/**
 * Chai Ke Sath AI — Extension Theme Server
 * ──────────────────────────────────────────
 * Standalone Express server that stores Chrome extension theme preferences
 * in MongoDB. Run this SEPARATELY from your Next.js app.
 *
 * SETUP:
 *   1. npm install express mongoose cors
 *   2. node extension-theme-server.js
 *   Runs on http://localhost:3001
 *
 * The Chrome extension calls this server (not your Next.js app) for theme storage.
 */

const express  = require("express")
const mongoose = require("mongoose")
const cors     = require("cors")

const app  = express()
const PORT = 3001

// ─── MongoDB connection ───────────────────────────────────────────────────────
const MONGO_URI = "mongodb+srv://riteshjha1:9818756275Alex@cluster1.biefhez.mongodb.net/chai-ke-sath-extension"

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected — Extension Theme Server"))
  .catch(err => console.error("❌ MongoDB error:", err.message))

// ─── Theme Schema ─────────────────────────────────────────────────────────────
const themeSchema = new mongoose.Schema({
  deviceId: {
    type:    String,
    required: true,
    unique:  true,
    index:   true,
  },
  themeId: {
    type:    String,
    default: null,
  },
  themeName: {
    type:    String,
    default: null,
  },
  appliedAt: {
    type:    Date,
    default: Date.now,
  },
  history: [{
    themeId:   String,
    themeName: String,
    appliedAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true })

const ExtensionTheme = mongoose.models.ExtensionTheme
  || mongoose.model("ExtensionTheme", themeSchema)

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: "*" }))
app.use(express.json())

// Simple API key check
const EXTENSION_KEY = "chai-ke-sath-extension-2025"

function checkKey(req, res, next) {
  const key = req.headers["x-extension-key"] || req.query.key
  if (key !== EXTENSION_KEY) {
    return res.status(401).json({ error: "Invalid extension key" })
  }
  next()
}

// ─── Routes ───────────────────────────────────────────────────────────────────

// GET /theme — get current theme for a device
app.get("/theme", checkKey, async (req, res) => {
  try {
    const deviceId = req.headers["x-device-id"] || "default"
    const doc = await ExtensionTheme.findOne({ deviceId })
    res.json({
      themeId:   doc?.themeId   || null,
      themeName: doc?.themeName || null,
      appliedAt: doc?.appliedAt || null,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /theme — save/update current theme
app.post("/theme", checkKey, async (req, res) => {
  try {
    const deviceId = req.headers["x-device-id"] || "default"
    const { themeId, themeName } = req.body

    const doc = await ExtensionTheme.findOneAndUpdate(
      { deviceId },
      {
        themeId,
        themeName: themeName || themeId,
        appliedAt: new Date(),
        // Push to history (keep last 10)
        $push: {
          history: {
            $each:     [{ themeId, themeName: themeName || themeId }],
            $position: 0,
            $slice:    10,
          }
        }
      },
      { upsert: true, new: true }
    )
    res.json({ success: true, themeId: doc.themeId, source: "mongodb" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /theme — remove theme (reset)
app.delete("/theme", checkKey, async (req, res) => {
  try {
    const deviceId = req.headers["x-device-id"] || "default"
    await ExtensionTheme.findOneAndUpdate(
      { deviceId },
      { themeId: null, themeName: null, appliedAt: new Date() },
      { upsert: true }
    )
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /theme/history — get last 10 applied themes
app.get("/theme/history", checkKey, async (req, res) => {
  try {
    const deviceId = req.headers["x-device-id"] || "default"
    const doc = await ExtensionTheme.findOne({ deviceId })
    res.json({ history: doc?.history || [] })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", server: "Chai Ke Sath AI Extension Theme Server" })
})

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Extension Theme Server running at http://localhost:${PORT}`)
  console.log(`   Endpoints:`)
  console.log(`   GET    /theme           — get saved theme`)
  console.log(`   POST   /theme           — save theme`)
  console.log(`   DELETE /theme           — remove theme`)
  console.log(`   GET    /theme/history   — theme history`)
})
