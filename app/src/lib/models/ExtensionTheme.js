import mongoose from "mongoose"

const extensionThemeSchema = new mongoose.Schema(
  {
    // Device identifier from extension
    deviceId: {
      type: String,
      required: true,
      index: true,
    },

    // Normalized page URL (origin)
    pageKey: {
      type: String,
      required: true,
      index: true,
    },

    // Theme information
    selectedTheme: {
      type: String,
      default: null,
    },

    themeId: {
      type: String,
      default: null,
    },

    // Timestamps
    lastUpdated: {
      type: Date,
      default: Date.now,
      index: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
)

// Composite index for efficient queries
extensionThemeSchema.index({ deviceId: 1, pageKey: 1 }, { unique: true })
extensionThemeSchema.index({ deviceId: 1, lastUpdated: -1 })

const ExtensionTheme =
  mongoose.models.ExtensionTheme ||
  mongoose.model("ExtensionTheme", extensionThemeSchema)

export default ExtensionTheme
