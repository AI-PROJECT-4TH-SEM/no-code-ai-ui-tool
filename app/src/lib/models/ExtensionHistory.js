import mongoose from "mongoose"

const extensionHistorySchema = new mongoose.Schema(
  {
    // Device identifier from extension
    deviceId: {
      type: String,
      required: true,
      index: true,
    },

    // Scanned URL
    url: {
      type: String,
      required: true,
      index: true,
    },

    // Page title
    title: {
      type: String,
      default: "",
    },

    // Scan result/analysis
    result: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    // Timestamp of scan
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },

    // Storage metadata
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

// Composite indexes for efficient queries
extensionHistorySchema.index({ deviceId: 1, timestamp: -1 })
extensionHistorySchema.index({ deviceId: 1, url: 1 })
extensionHistorySchema.index({ timestamp: -1 }) // For cleanup old entries

const ExtensionHistory =
  mongoose.models.ExtensionHistory ||
  mongoose.model("ExtensionHistory", extensionHistorySchema)

export default ExtensionHistory
