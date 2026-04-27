import mongoose from "mongoose"

const assistantMessageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  meta: { type: mongoose.Schema.Types.Mixed, default: null },
  createdAt: { type: Date, default: Date.now },
}, { _id: false })

const assistantChatSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true, index: true },
  pageUrl: { type: String, default: "", index: true },
  selectedSelector: { type: String, default: "" },
  selectedTag: { type: String, default: "" },
  messages: { type: [assistantMessageSchema], default: [] },
}, { timestamps: true })

export default mongoose.models.AssistantChat || mongoose.model("AssistantChat", assistantChatSchema)
