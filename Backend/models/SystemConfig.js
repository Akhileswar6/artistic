const mongoose = require("mongoose");

const systemConfigSchema = new mongoose.Schema({
  maintenanceMode: { type: Boolean, default: false },
  basePricing: {
    realistic: { type: Number, default: 1500 },
    charcoal: { type: Number, default: 1500 },
    sketch: { type: Number, default: 2000 },
    caricature: { type: Number, default: 1800 }
  },
  framePricing: {
    noframe: { type: Number, default: 0 },
    standard8x10: { type: Number, default: 200 },
    standard12x16: { type: Number, default: 400 },
    custom: { type: Number, default: 600 }
  },
  discountPercentage: { type: Number, default: 0 },
  contactPhone: { type: String, default: "+91 8886044716" },
  contactEmail: { type: String, default: "support@artistic.com" },
  announcement: { type: String, default: "Welcome to Artistic!" },
}, { timestamps: true });

module.exports = mongoose.model("SystemConfig", systemConfigSchema);
