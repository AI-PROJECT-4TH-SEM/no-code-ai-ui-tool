import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshToken: { type: String },
  createdAt: { type: Date, default: Date.now },
   resetPasswordToken: String,
   resetPasswordExpire: Date,
   otp: String,
otpExpire: Date,

});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;