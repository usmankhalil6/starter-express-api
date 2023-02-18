const mongoose = require("mongoose");

const brandCategorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, min: 6, max: 255 },
    url: { type: String, required: true, max: 1024, min: 8 },
    images: { type: Array },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "brand",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("brandCategory", brandCategorySchema);
