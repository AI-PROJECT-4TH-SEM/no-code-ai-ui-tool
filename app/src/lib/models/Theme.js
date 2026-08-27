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
  default: "AI Minimal",
  enum: [
    "🌙 Midnight Luxury",
    " Neon Cyberpunk",
    "AI Minimal",
    "🌌 Glass Futuristic",
    "⚡ Electric Bold",
    "🔥 Fiery",
    "🌙 Midnight",
    "☀️ Sunny",
    "🍬 Candy",
    "🌈 Colorful",
    "🌊 Ocean",
    "🌿 Nature",
    "🧬 Matrix Terminal"
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

themeSchema.index({ userId: 1 });

const Theme =
  mongoose.models.Theme || mongoose.model("Theme", themeSchema);

export default Theme;