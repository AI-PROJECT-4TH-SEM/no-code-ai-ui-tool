import mongoose from "mongoose";

const themeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  selectedTheme: { type: String, required: true }, // e.g., "Dark Mode", "Pastel"
  createdAt: { type: Date, default: Date.now },
});

const Theme = mongoose.models.Theme || mongoose.model("Theme", themeSchema);
export default Theme;