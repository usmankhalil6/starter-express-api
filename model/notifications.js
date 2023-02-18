const mongoose = require("mongoose");

const notificationsSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, min: 6, max: 255 },
    percentage: { type: String, max: 1024, min: 8 },
    category: { type: String },
    saleType: { type: String },
    url: { type: String },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "brand",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("notificaitons", notificationsSchema);
