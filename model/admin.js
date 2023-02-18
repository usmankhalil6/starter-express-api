const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, min: 6, max: 255 },
    password: { type: String, required: true, max: 1024, min: 8 },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Admin", adminSchema);
