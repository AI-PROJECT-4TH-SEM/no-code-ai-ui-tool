import mongoose from "mongoose"

const schema = new mongoose.Schema({
  label: String,
  html: String,
}, { timestamps: true })

export default mongoose.models.History || mongoose.model("History", schema)