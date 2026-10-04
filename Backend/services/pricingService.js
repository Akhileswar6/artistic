const SystemConfig = require("../models/SystemConfig");
const Gallery = require("../models/Gallery");
const Coupon = require("../models/Coupon");

class PricingError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = "PricingError";
    this.statusCode = statusCode;
  }
}

class PricingService {
  /**
   * Fetch current system pricing configuration with fallback defaults
   */
  static async getConfig() {
    let config = await SystemConfig.findOne();
    if (!config) {
      config = new SystemConfig();
      await config.save();
    }
    return config;
  }

  /**
   * Calculate complete order price on the backend (Single Source of Truth)
   *
   * @param {Object} options
   * @param {string} [options.artworkId]
   * @param {string} options.style - selected art style (e.g. realistic, sketch, charcoal, caricature)
   * @param {string} options.frame - selected frame (e.g. none, noframe, basic, premium, standard8x10, standard12x16, custom)
   * @param {number} [options.quantity=1]
   * @param {number} [options.extraPeople=0]
   * @param {boolean} [options.rushDelivery=false]
   * @param {string} [options.couponCode]
   * @param {string} [options.userId]
   * @returns {Promise<Object>} Detailed pricing breakdown
   */
  static async calculateOrderPrice({
    artworkId,
    style,
    frame,
    quantity = 1,
    extraPeople = 0,
    rushDelivery = false,
    couponCode = null,
    userId = null,
  }) {
    const config = await this.getConfig();

    // 1. Base Artwork Price is 0 (keep only art style price)
    let baseArtworkPrice = 0;
    let artworkTitle = "Custom Commission";

    if (artworkId) {
      let artwork;
      try {
        artwork = await Gallery.findById(artworkId);
      } catch (err) {
        throw new PricingError("Artwork not found", 404);
      }

      if (!artwork) {
        throw new PricingError("Artwork not found", 404);
      }

      if (artwork.isActive === false) {
        throw new PricingError("Selected artwork is not available", 400);
      }

      if (typeof artwork.price === "number" && artwork.price > 0) {
        baseArtworkPrice = artwork.price;
      } else if (typeof artwork.basePrice === "number" && artwork.basePrice > 0) {
        baseArtworkPrice = artwork.basePrice;
      }
      artworkTitle = artwork.title || artworkTitle;
    }

    // 2. Style validation & charge
    if (!style || typeof style !== "string") {
      throw new PricingError("Selected style is required", 400);
    }
    const normalizedStyle = style.toLowerCase().trim();

    // Map style charge from artworkStyles with strict standard defaults (e.g. realistic: 500)
    const defaultStylePrices = {
      realistic: 500,
      charcoal: 500,
      sketch: 300,
      caricature: 400,
      digital: 200,
    };

    let styleCharge = null;
    if (config.artworkStyles && config.artworkStyles[normalizedStyle] !== undefined) {
      styleCharge = config.artworkStyles[normalizedStyle];
    } else {
      styleCharge = defaultStylePrices[normalizedStyle] ?? 500;
    }

    if (styleCharge === null || isNaN(styleCharge)) {
      throw new PricingError("Selected style is not available", 400);
    }

    // 3. Frame validation & charge
    if (!frame || typeof frame !== "string") {
      throw new PricingError("Selected frame is required", 400);
    }
    const normalizedFrame = frame.toLowerCase().trim();

    let frameCharge = null;
    if (config.framePricing && config.framePricing[normalizedFrame] !== undefined) {
      frameCharge = config.framePricing[normalizedFrame];
    } else if (normalizedFrame === "noframe" || normalizedFrame === "none") {
      frameCharge = 0;
    }

    if (frameCharge === null || isNaN(frameCharge)) {
      throw new PricingError("Selected frame is not available", 400);
    }

    // 4. Quantity validation
    const parsedQuantity = Number(quantity);
    const maxQuantity = config.maxQuantity || 10;
    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1 || parsedQuantity > maxQuantity) {
      throw new PricingError(`Quantity must be between 1 and ${maxQuantity}`, 400);
    }

    // 5. Extra People validation & charge
    const parsedExtraPeople = Number(extraPeople || 0);
    const maxExtraPeople = config.maxExtraPeople || 10;
    if (!Number.isInteger(parsedExtraPeople) || parsedExtraPeople < 0 || parsedExtraPeople > maxExtraPeople) {
      throw new PricingError(`Extra people must be between 0 and ${maxExtraPeople}`, 400);
    }
    const extraPersonRate = config.extraPersonCharge ?? 300;
    const extraPersonCharge = parsedExtraPeople * extraPersonRate;

    // 6. Rush Delivery validation & charge
    const isRushDelivery = Boolean(rushDelivery);
    if (isRushDelivery && config.allowRushDelivery === false) {
      throw new PricingError("Rush delivery is currently not available", 400);
    }
    const rushDeliveryCharge = isRushDelivery ? (config.rushDeliveryCharge ?? 400) : 0;

    // 7. Subtotal calculation
    // Base portrait cost per unit
    const unitPrice = baseArtworkPrice + styleCharge + frameCharge + extraPersonCharge;
    const itemsTotal = unitPrice * parsedQuantity;
    const subtotal = itemsTotal + rushDeliveryCharge;

    // 8. Coupon validation & discount
    let discount = 0;
    let appliedCoupon = null;
    let normalizedCouponCode = null;

    if (couponCode && typeof couponCode === "string" && couponCode.trim()) {
      normalizedCouponCode = couponCode.trim().toUpperCase();
      const coupon = await Coupon.findOne({ code: normalizedCouponCode });

      if (!coupon) {
        throw new PricingError("Invalid or expired coupon", 400);
      }

      const validation = coupon.isValid(subtotal, userId);
      if (!validation.valid) {
        throw new PricingError(validation.message || "Invalid or expired coupon", 400);
      }

      discount = coupon.calculateDiscount(subtotal);
      appliedCoupon = {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: discount,
      };
    }

    // 9. Shipping calculation (Removed / 0)
    const shipping = 0;

    // 10. Tax / GST calculation (Removed / 0)
    const gstPercentage = 0;
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = 0;

    // 11. Final total
    const finalTotal = taxableAmount;

    return {
      currency: "INR",
      baseArtworkPrice,
      styleCharge,
      frameCharge,
      extraPersonCharge,
      rushDeliveryCharge,
      subtotal,
      discount,
      shipping,
      tax,
      finalTotal,
      couponCode: appliedCoupon ? appliedCoupon.code : null,
      appliedCoupon,
      gstPercentage,
      quantity: parsedQuantity,
      extraPeople: parsedExtraPeople,
      rushDelivery: isRushDelivery,
      artworkTitle,
      calculatedAt: new Date(),
    };
  }

  /**
   * Increment coupon usage count and track user when an order is finalized
   */
  static async recordCouponUsage(couponCode, userId) {
    if (!couponCode) return;
    try {
      const code = couponCode.trim().toUpperCase();
      const coupon = await Coupon.findOne({ code });
      if (!coupon) return;

      coupon.usedCount += 1;
      if (userId) {
        const userEntry = coupon.usedBy.find(
          (u) => u.userId && u.userId.toString() === userId.toString()
        );
        if (userEntry) {
          userEntry.count += 1;
          userEntry.usedAt = new Date();
        } else {
          coupon.usedBy.push({ userId, count: 1, usedAt: new Date() });
        }
      }
      await coupon.save();
    } catch (err) {
      console.error("Failed to record coupon usage:", err);
    }
  }
}

module.exports = { PricingService, PricingError };
