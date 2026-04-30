import mongoose from "mongoose"

const historySchema = new mongoose.Schema({
  url: { type: String, required: true },
  html: { type: String, required: true },
  method: { type: String, default: "fetch" },
  createdAt: { type: Date, default: Date.now },
})

const History = mongoose.models.History || mongoose.model("History", historySchema)
export default History
