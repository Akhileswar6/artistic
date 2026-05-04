const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  adminName: { type: String, required: true },
  action: { type: String, required: true }, // e.g., "Updated Order Status", "Deleted Order"
  targetId: { type: String }, // e.g., Order ID or User ID
  targetType: { type: String }, // e.g., "Order", "User", "Config"
  details: { type: String },
  timestamp: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: null }, // Set when order is delivered; TTL deletes the doc at this date
});

// MongoDB TTL index: automatically deletes documents when current time >= expiresAt
activitySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Activity", activitySchema);
