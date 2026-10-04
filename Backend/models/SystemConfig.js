const mongoose = require("mongoose");

const systemConfigSchema = new mongoose.Schema({
  maintenanceMode: { type: Boolean, default: false },
  baseArtworkPrice: { type: Number, default: 0 },
  artworkStyles: {
    sketch: { type: Number, default: 300 },
    realistic: { type: Number, default: 500 },
    charcoal: { type: Number, default: 500 },
    caricature: { type: Number, default: 400 },
    digital: { type: Number, default: 200 }
  },
  basePricing: {
    realistic: { type: Number, default: 1500 },
    charcoal: { type: Number, default: 1500 },
    sketch: { type: Number, default: 2000 },
    caricature: { type: Number, default: 1800 }
  },
  framePricing: {
    none: { type: Number, default: 0 },
    noframe: { type: Number, default: 0 },
    standard8x10: { type: Number, default: 200 },
    basic: { type: Number, default: 300 },
    standard12x16: { type: Number, default: 400 },
    premium: { type: Number, default: 700 },
    custom: { type: Number, default: 600 }
  },
  extraPersonCharge: { type: Number, default: 300 },
  rushDeliveryCharge: { type: Number, default: 400 },
  shippingCharge: { type: Number, default: 0 },
  gstPercentage: { type: Number, default: 0 },
  allowRushDelivery: { type: Boolean, default: true },
  maxQuantity: { type: Number, default: 10 },
  maxExtraPeople: { type: Number, default: 10 },
  discountPercentage: { type: Number, default: 0 },
  contactPhone: { type: String, default: "+91 8886044716" },
  contactEmail: { type: String, default: "support@artistic.com" },
  announcement: { type: String, default: "Welcome to Artistic!" },
}, { timestamps: true });

module.exports = mongoose.model("SystemConfig", systemConfigSchema);
