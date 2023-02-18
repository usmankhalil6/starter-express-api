const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    phone: { type: String, min: 6, max: 255 },
    password: { type: String, max: 1024, min: 8 },
    mobileId: { type: String, max: 1024, min: 8 },
    fcmToken: { type: String, max: 1024, min: 8 },
    favourites: { type: Array },
  },
  { timestamps: true }
);
module.exports = mongoose.model("user", userSchema);
