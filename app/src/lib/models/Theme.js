import mongoose from "mongoose";

const themeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    selectedTheme: {
      type: String,
      required: true,
      default: "theme-ai",
      enum: [
        "theme-cyberpunk",
        "theme-ai",
        "theme-glass",
        "theme-electric",
        "theme-matrix",
      ],
    },

    customSettings: {
      fontScale: { type: Number, default: 1 },
      is3D: { type: Boolean, default: true },
      animationSpeed: { type: Number, default: 1 },
      contrastMode: { type: Boolean, default: false },
    },

    themeVersion: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// ⚡ index for performance
themeSchema.index({ userId: 1 });

const Theme =
  mongoose.models.Theme || mongoose.model("Theme", themeSchema);

export default Theme;