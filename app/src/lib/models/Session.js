import mongoose from "mongoose"

const changeSchema = new mongoose.Schema({
  themeName: String,
  html: String,
  appliedAt: { type: Date, default: Date.now }
})

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  label: { type: String, required: true, trim: true, maxlength: 200 },
  url: { type: String, trim: true, maxlength: 2048 },
  originalHtml: { type: String, required: true, maxlength: 2000000 },
  currentHtml: { type: String, required: true, maxlength: 2000000 },
  changes: [changeSchema],
  suppressedIds: { type: [String], default: [] }
}, { timestamps: true })

sessionSchema.index({ userId: 1, createdAt: -1 })

export default mongoose.models.Session || mongoose.model("Session", sessionSchema)