const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  discountType: {
    type: String,
    enum: ["percentage", "fixed"],
    default: "percentage",
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0,
  },
  minOrderValue: {
    type: Number,
    default: 0,
    min: 0,
  },
  maxDiscount: {
    type: Number,
    default: null, // null for uncapped
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  expiryDate: {
    type: Date,
    default: null, // null for no expiry
  },
  usageLimit: {
    type: Number,
    default: null, // null for unlimited
  },
  usedCount: {
    type: Number,
    default: 0,
  },
  userLimit: {
    type: Number,
    default: 1, // maximum times a specific user can use this coupon
  },
  usedBy: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      count: { type: Number, default: 1 },
      usedAt: { type: Date, default: Date.now }
    }
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
    default: "",
  },
}, { timestamps: true });

// Helper to check if coupon is valid for a given order amount and user
couponSchema.methods.isValid = function (subtotal, userId = null) {
  const now = new Date();

  if (!this.isActive) {
    return { valid: false, message: "Invalid or expired coupon" };
  }

  if (this.startDate && now < this.startDate) {
    return { valid: false, message: "Coupon is not yet active" };
  }

  if (this.expiryDate && now > this.expiryDate) {
    return { valid: false, message: "Invalid or expired coupon" };
  }

  if (this.usageLimit !== null && this.usedCount >= this.usageLimit) {
    return { valid: false, message: "Coupon usage limit has been reached" };
  }

  if (this.minOrderValue > 0 && subtotal < this.minOrderValue) {
    return {
      valid: false,
      message: `Minimum order amount of ₹${this.minOrderValue} required for this coupon`,
    };
  }

  if (userId && this.userLimit !== null) {
    const userUsage = this.usedBy.find(
      (u) => u.userId && u.userId.toString() === userId.toString()
    );
    if (userUsage && userUsage.count >= this.userLimit) {
      return { valid: false, message: "You have already used this coupon" };
    }
  }

  return { valid: true };
};

// Helper to calculate discount amount based on subtotal
couponSchema.methods.calculateDiscount = function (subtotal) {
  let discount = 0;
  if (this.discountType === "percentage") {
    discount = Math.round((subtotal * this.discountValue) / 100);
    if (this.maxDiscount !== null && this.maxDiscount !== undefined) {
      discount = Math.min(discount, this.maxDiscount);
    }
  } else if (this.discountType === "fixed") {
    discount = Math.round(this.discountValue);
  }

  // Discount cannot exceed subtotal
  return Math.min(Math.max(0, discount), subtotal);
};

module.exports = mongoose.model("Coupon", couponSchema);
