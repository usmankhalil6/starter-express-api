const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, min: 6, max: 255 },
    url: { type: String, required: true, max: 1024, min: 8 },
    image: { type: String },
    categories: { type: Array },
  },
  { timestamps: true }
);
module.exports = mongoose.model("brand", brandSchema);
