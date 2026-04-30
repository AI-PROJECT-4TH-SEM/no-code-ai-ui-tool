import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  meta: { type: mongoose.Schema.Types.Mixed, default: null },
  createdAt: { type: Date, default: Date.now },
}, { _id: false })

const extensionChatSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true, index: true },
  pageUrl: { type: String, default: "", index: true },
  selectedSelector: { type: String, default: "" },
  selectedTag: { type: String, default: "" },
  messages: { type: [messageSchema], default: [] },
}, { timestamps: true })

export default mongoose.models.ExtensionChat || mongoose.model("ExtensionChat", extensionChatSchema)
