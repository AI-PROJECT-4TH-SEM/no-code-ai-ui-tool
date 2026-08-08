import mongoose from "mongoose"

const htmlSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  content: { type: String, required: true, maxlength: 2000000 },
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now, index: true },
})

htmlSchema.index({ userId: 1, updatedAt: -1 })

const Html = mongoose.models.Html || mongoose.model("Html", htmlSchema)
export default Html