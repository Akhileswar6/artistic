const mongoose = require("mongoose");

const systemConfigSchema = new mongoose.Schema({
  maintenanceMode: { type: Boolean, default: false },
  basePricing: {
    pencilSketch: { type: Number, default: 499 },
    oilPainting: { type: Number, default: 999 },
    digitalArt: { type: Number, default: 799 }
  },
  discountPercentage: { type: Number, default: 0 },
  contactPhone: { type: String, default: "+91 8886044716" },
  contactEmail: { type: String, default: "support@artistic.com" },
  announcement: { type: String, default: "Welcome to Artistic!" },
}, { timestamps: true });

module.exports = mongoose.model("SystemConfig", systemConfigSchema);
