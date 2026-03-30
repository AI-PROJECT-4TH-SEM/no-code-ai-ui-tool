import mongoose from "mongoose"

const changeSchema = new mongoose.Schema({
  themeName: String,
  html: String,
  appliedAt: { type: Date, default: Date.now }
})

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  label: { type: String, required: true },
  originalHtml: { type: String, required: true },
  currentHtml: { type: String, required: true },
  changes: [changeSchema],
  suppressedIds: { type: [String], default: [] }
}, { timestamps: true })

export default mongoose.models.Session || mongoose.model("Session", sessionSchema)