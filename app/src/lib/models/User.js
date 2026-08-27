import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true, maxlength: 80 },
  lastName: { type: String, required: false, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true, maxlength: 254 },
  password: { type: String, required: true, minlength: 8 },
  refreshToken: { type: String, index: true },
  createdAt: { type: Date, default: Date.now, index: true },
  resetPasswordToken: { type: String, index: true },
  resetPasswordExpire: Date,
  otp: String,
  otpExpire: Date,
  totalAnalyses: { type: Number, default: 0, index: true },

  // Theme and preferences
  preferredTheme: { type: String, default: "AI Minimal" },
  customSettings: {
    fontScale: { type: Number, default: 1 },
    is3D: { type: Boolean, default: true },
    animationSpeed: { type: Number, default: 1 },
    contrastMode: { type: Boolean, default: false },
  },
  lastThemeUpdate: Date,
});

userSchema.index({ email: 1, createdAt: -1 });

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;