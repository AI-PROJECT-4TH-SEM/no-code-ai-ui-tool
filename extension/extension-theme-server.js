const express  = require("express")
const mongoose = require("mongoose")
const cors     = require("cors")

const app  = express()
const PORT = 3001

const MONGO_URI = "mongodb+srv://riteshjha1:9818756275Alex@cluster1.biefhez.mongodb.net/chai-ke-sath-extension"

mongoose.connect(MONGO_URI)
  .then(() => console.log(" MongoDB connected — Extension Theme Server"))
  .catch(err => console.error(" MongoDB error:", err.message))

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

app.use(cors({ origin: "*" }))
app.use(express.json())

const EXTENSION_KEY = "chai-ke-sath-extension-2025"

function checkKey(req, res, next) {
  const key = req.headers["x-extension-key"] || req.query.key
  if (key !== EXTENSION_KEY) {
    return res.status(401).json({ error: "Invalid extension key" })
  }
  next()
}

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

app.get("/theme/history", checkKey, async (req, res) => {
  try {
    const deviceId = req.headers["x-device-id"] || "default"
    const doc = await ExtensionTheme.findOne({ deviceId })
    res.json({ history: doc?.history || [] })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get("/", (req, res) => {
  res.json({ status: "ok", server: "Chai Ke Sath AI Extension Theme Server" })
})


app.listen(PORT, () => {
  console.log(` Extension Theme Server running at http://localhost:${PORT}`)
  console.log(`   Endpoints:`)
  console.log(`   GET    /theme           — get saved theme`)
  console.log(`   POST   /theme           — save theme`)
  console.log(`   DELETE /theme           — remove theme`)
  console.log(`   GET    /theme/history   — theme history`)
})
