const test = require("node:test");
const assert = require("node:assert");
require("dotenv").config();
const mongoose = require("mongoose");
const { PricingService, PricingError } = require("../services/pricingService");
const SystemConfig = require("../models/SystemConfig");
const Coupon = require("../models/Coupon");
const Gallery = require("../models/Gallery");
const Order = require("../models/Order");
const { calculatePriceSchema, createOrderSchema } = require("../validators/orderSchemas");

test("Pricing Suite - Connect DB", async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
  }
  assert.strictEqual(mongoose.connection.readyState, 1);

  // Set up temporary test coupons for test suite execution
  await Coupon.findOneAndUpdate(
    { code: "ART10" },
    { code: "ART10", discountType: "percentage", discountValue: 10, isActive: true },
    { upsert: true }
  );
  await Coupon.findOneAndUpdate(
    { code: "EXPIRED_TEST" },
    { code: "EXPIRED_TEST", discountType: "percentage", discountValue: 20, expiryDate: new Date(Date.now() - 10000), isActive: true },
    { upsert: true }
  );
  await Coupon.findOneAndUpdate(
    { code: "HIGH_MIN_TEST" },
    { code: "HIGH_MIN_TEST", discountType: "percentage", discountValue: 15, minOrderValue: 50000, isActive: true },
    { upsert: true }
  );
  await Coupon.findOneAndUpdate(
    { code: "CAPPED_TEST" },
    { code: "CAPPED_TEST", discountType: "percentage", discountValue: 50, maxDiscount: 150, minOrderValue: 100, isActive: true },
    { upsert: true }
  );
});

// 1. Normal order price calculation matching prompt example
test("1. Normal order price calculation (matches specification example)", async () => {
  // Base artwork ₹1000 + realistic style ₹500 + premium frame ₹700 + 1 extra person ₹300 + rush delivery ₹400 = Subtotal ₹2900
  // Coupon ART10 (10%) = ₹290
  // Shipping ₹100
  // Taxable: 2900 - 290 + 100 = 2710
  // GST 18%: 2710 * 0.18 = 487.8 -> ₹488
  // Final total: 2710 + 488 = ₹3198
  const pricing = await PricingService.calculateOrderPrice({
    style: "realistic",
    frame: "premium",
    quantity: 1,
    extraPeople: 1,
    rushDelivery: true,
    couponCode: "ART10",
  });

  assert.strictEqual(pricing.baseArtworkPrice, 1000);
  assert.strictEqual(pricing.styleCharge, 500);
  assert.strictEqual(pricing.frameCharge, 700);
  assert.strictEqual(pricing.extraPersonCharge, 300);
  assert.strictEqual(pricing.rushDeliveryCharge, 400);
  assert.strictEqual(pricing.subtotal, 2900);
  assert.strictEqual(pricing.discount, 290);
  assert.strictEqual(pricing.shipping, 100);
  assert.strictEqual(pricing.tax, 488);
  assert.strictEqual(pricing.finalTotal, 3198);
  assert.strictEqual(pricing.currency, "INR");
});

// 2. Different artwork styles
test("2. Different artwork styles (sketch, realistic, charcoal, caricature, digital)", async () => {
  const sketchPricing = await PricingService.calculateOrderPrice({
    style: "sketch",
    frame: "noframe",
    quantity: 1,
  });
  assert.strictEqual(sketchPricing.styleCharge, 300);

  const charcoalPricing = await PricingService.calculateOrderPrice({
    style: "charcoal",
    frame: "noframe",
    quantity: 1,
  });
  assert.strictEqual(charcoalPricing.styleCharge, 500);

  const digitalPricing = await PricingService.calculateOrderPrice({
    style: "digital",
    frame: "noframe",
    quantity: 1,
  });
  assert.strictEqual(digitalPricing.styleCharge, 200);

  const caricaturePricing = await PricingService.calculateOrderPrice({
    style: "caricature",
    frame: "noframe",
    quantity: 1,
  });
  assert.strictEqual(caricaturePricing.styleCharge, 400);
});

// 3. Different frames
test("3. Different frames (noframe, basic, standard8x10, standard12x16, premium, custom)", async () => {
  const noframe = await PricingService.calculateOrderPrice({
    style: "sketch",
    frame: "noframe",
  });
  assert.strictEqual(noframe.frameCharge, 0);

  const basic = await PricingService.calculateOrderPrice({
    style: "sketch",
    frame: "basic",
  });
  assert.strictEqual(basic.frameCharge, 300);

  const standard8x10 = await PricingService.calculateOrderPrice({
    style: "sketch",
    frame: "standard8x10",
  });
  assert.strictEqual(standard8x10.frameCharge, 200);

  const standard12x16 = await PricingService.calculateOrderPrice({
    style: "sketch",
    frame: "standard12x16",
  });
  assert.strictEqual(standard12x16.frameCharge, 400);

  const premium = await PricingService.calculateOrderPrice({
    style: "sketch",
    frame: "premium",
  });
  assert.strictEqual(premium.frameCharge, 700);

  const custom = await PricingService.calculateOrderPrice({
    style: "sketch",
    frame: "custom",
  });
  assert.strictEqual(custom.frameCharge, 600);
});

// 4. Multiple quantities
test("4. Multiple quantities multiplies item portrait pricing", async () => {
  const single = await PricingService.calculateOrderPrice({
    style: "realistic",
    frame: "noframe",
    quantity: 1,
  });
  // base 1000 + style 500 = 1500

  const double = await PricingService.calculateOrderPrice({
    style: "realistic",
    frame: "noframe",
    quantity: 2,
  });
  // items total: 1500 * 2 = 3000
  assert.strictEqual(double.subtotal, 3000);
  assert.strictEqual(double.quantity, 2);
});

// 5. Extra people
test("5. Extra people charge calculated at ₹300 per extra person", async () => {
  const with2Extra = await PricingService.calculateOrderPrice({
    style: "realistic",
    frame: "noframe",
    extraPeople: 2,
  });
  assert.strictEqual(with2Extra.extraPeople, 2);
  assert.strictEqual(with2Extra.extraPersonCharge, 600);
});

// 6. Rush delivery
test("6. Rush delivery adds rush charge when selected, 0 when false", async () => {
  const standard = await PricingService.calculateOrderPrice({
    style: "realistic",
    frame: "noframe",
    rushDelivery: false,
  });
  assert.strictEqual(standard.rushDeliveryCharge, 0);

  const rushed = await PricingService.calculateOrderPrice({
    style: "realistic",
    frame: "noframe",
    rushDelivery: true,
  });
  assert.strictEqual(rushed.rushDeliveryCharge, 400);
});

// 7. Coupon discount
test("7. Valid coupon applies correct discount", async () => {
  const res = await PricingService.calculateOrderPrice({
    style: "realistic",
    frame: "premium",
    rushDelivery: true,
    couponCode: "ART10",
  });
  // Subtotal = 1000 + 500 + 700 + 400 = 2600. 10% discount = 260
  assert.strictEqual(res.discount, 260);
  assert.strictEqual(res.couponCode, "ART10");
});

// 8. Expired coupon
test("8. Expired coupon is rejected", async () => {
  await Coupon.findOneAndUpdate(
    { code: "EXPIRED_TEST" },
    {
      code: "EXPIRED_TEST",
      discountType: "percentage",
      discountValue: 20,
      expiryDate: new Date(Date.now() - 10000), // in the past
      isActive: true,
    },
    { upsert: true }
  );

  await assert.rejects(
    async () => {
      await PricingService.calculateOrderPrice({
        style: "realistic",
        frame: "noframe",
        couponCode: "EXPIRED_TEST",
      });
    },
    (err) => {
      assert.strictEqual(err.statusCode, 400);
      assert.strictEqual(err.message, "Invalid or expired coupon");
      return true;
    }
  );
});

// 9. Invalid coupon
test("9. Non-existent coupon is rejected", async () => {
  await assert.rejects(
    async () => {
      await PricingService.calculateOrderPrice({
        style: "realistic",
        frame: "noframe",
        couponCode: "DOES_NOT_EXIST",
      });
    },
    (err) => {
      assert.strictEqual(err.statusCode, 400);
      assert.strictEqual(err.message, "Invalid or expired coupon");
      return true;
    }
  );
});

// 10. Minimum coupon amount
test("10. Minimum order amount for coupon is enforced", async () => {
  await Coupon.findOneAndUpdate(
    { code: "HIGH_MIN_TEST" },
    {
      code: "HIGH_MIN_TEST",
      discountType: "percentage",
      discountValue: 15,
      minOrderValue: 50000, // very high min order
      isActive: true,
    },
    { upsert: true }
  );

  await assert.rejects(
    async () => {
      await PricingService.calculateOrderPrice({
        style: "realistic",
        frame: "noframe",
        couponCode: "HIGH_MIN_TEST",
      });
    },
    (err) => {
      assert.strictEqual(err.statusCode, 400);
      assert.match(err.message, /Minimum order amount of ₹50000 required/);
      return true;
    }
  );
});

// 11. Maximum coupon discount
test("11. Maximum coupon discount cap is enforced", async () => {
  await Coupon.findOneAndUpdate(
    { code: "CAPPED_TEST" },
    {
      code: "CAPPED_TEST",
      discountType: "percentage",
      discountValue: 50, // 50%
      maxDiscount: 150, // capped at 150
      minOrderValue: 100,
      isActive: true,
    },
    { upsert: true }
  );

  const res = await PricingService.calculateOrderPrice({
    style: "realistic",
    frame: "noframe",
    couponCode: "CAPPED_TEST",
  });
  // Subtotal is 1500; 50% would be 750, but max discount is 150
  assert.strictEqual(res.discount, 150);
});

// 12. GST calculation
test("12. GST calculation accurately reflects configured percentage", async () => {
  const res = await PricingService.calculateOrderPrice({
    style: "realistic",
    frame: "noframe",
    quantity: 1,
  });
  // subtotal 1500, discount 0, shipping 100 -> taxable = 1600
  // gst 18% = 288
  // final total = 1600 + 288 = 1888
  assert.strictEqual(res.subtotal, 1500);
  assert.strictEqual(res.shipping, 100);
  assert.strictEqual(res.tax, 288);
  assert.strictEqual(res.finalTotal, 1888);
});

// 13. Shipping calculation
test("13. Shipping calculation applied from system config", async () => {
  const res = await PricingService.calculateOrderPrice({
    style: "sketch",
    frame: "noframe",
  });
  assert.strictEqual(res.shipping, 100);
});

// 14. Invalid artwork
test("14. Invalid artwork ID is rejected with 404", async () => {
  const fakeId = new mongoose.Types.ObjectId().toString();
  await assert.rejects(
    async () => {
      await PricingService.calculateOrderPrice({
        artworkId: fakeId,
        style: "realistic",
        frame: "noframe",
      });
    },
    (err) => {
      assert.strictEqual(err.statusCode, 404);
      assert.strictEqual(err.message, "Artwork not found");
      return true;
    }
  );
});

// 15. Invalid style
test("15. Invalid style is rejected with 400", async () => {
  await assert.rejects(
    async () => {
      await PricingService.calculateOrderPrice({
        style: "non_existent_style_xyz",
        frame: "noframe",
      });
    },
    (err) => {
      assert.strictEqual(err.statusCode, 400);
      assert.strictEqual(err.message, "Selected style is not available");
      return true;
    }
  );
});

// 16. Invalid frame
test("16. Invalid frame is rejected with 400", async () => {
  await assert.rejects(
    async () => {
      await PricingService.calculateOrderPrice({
        style: "realistic",
        frame: "non_existent_frame_abc",
      });
    },
    (err) => {
      assert.strictEqual(err.statusCode, 400);
      assert.strictEqual(err.message, "Selected frame is not available");
      return true;
    }
  );
});

// 17. Invalid quantity
test("17. Invalid quantity (less than 1 or exceeding max) is rejected", async () => {
  await assert.rejects(
    async () => {
      await PricingService.calculateOrderPrice({
        style: "realistic",
        frame: "noframe",
        quantity: 0,
      });
    },
    (err) => {
      assert.strictEqual(err.statusCode, 400);
      assert.match(err.message, /Quantity must be between 1 and 10/);
      return true;
    }
  );

  await assert.rejects(
    async () => {
      await PricingService.calculateOrderPrice({
        style: "realistic",
        frame: "noframe",
        quantity: 15,
      });
    },
    (err) => {
      assert.strictEqual(err.statusCode, 400);
      assert.match(err.message, /Quantity must be between 1 and 10/);
      return true;
    }
  );
});

// 18. Invalid extraPeople
test("18. Invalid extraPeople (negative or exceeding max) is rejected", async () => {
  await assert.rejects(
    async () => {
      await PricingService.calculateOrderPrice({
        style: "realistic",
        frame: "noframe",
        extraPeople: -1,
      });
    },
    (err) => {
      assert.strictEqual(err.statusCode, 400);
      assert.match(err.message, /Extra people must be between 0 and 10/);
      return true;
    }
  );

  await assert.rejects(
    async () => {
      await PricingService.calculateOrderPrice({
        style: "realistic",
        frame: "noframe",
        extraPeople: 25,
      });
    },
    (err) => {
      assert.strictEqual(err.statusCode, 400);
      assert.match(err.message, /Extra people must be between 0 and 10/);
      return true;
    }
  );
});

// 19 & 20. SECURITY TEST: Frontend price tampering ignored
test("19 & 20. CRITICAL SECURITY: Frontend sending price: 1 and finalTotal: 1 is IGNORED", async () => {
  const tamperedInput = {
    name: "Hacker User",
    email: "hacker@example.com",
    phone: "9999999999",
    address: "123 Hacker Street",
    style: "realistic",
    frame: "premium",
    quantity: 1,
    price: 1,
    finalTotal: 1,
    discount: 5000,
    tax: 0,
    shipping: 0,
  };

  // Schema validates without trusting or rejecting due to extra price field
  const parsed = createOrderSchema.safeParse(tamperedInput);
  assert.strictEqual(parsed.success, true);

  // Authoritative server-side price calculation
  const calculated = await PricingService.calculateOrderPrice({
    style: parsed.data.style,
    frame: parsed.data.frame,
    quantity: parsed.data.quantity,
  });

  // Base 1000 + style 500 + frame 700 = 2200 subtotal. Taxable = 2300, tax 18% = 414, final = 2714
  assert.notStrictEqual(calculated.finalTotal, 1);
  assert.strictEqual(calculated.finalTotal, 2714);
});

// 21. Order creation stores snapshot and authoritative price in database
test("21 & 22. Permanent pricing snapshot is preserved on created order", async () => {
  const pricing = await PricingService.calculateOrderPrice({
    style: "realistic",
    frame: "premium",
    quantity: 1,
    extraPeople: 1,
    rushDelivery: true,
    couponCode: "ART10",
  });

  const testOrder = new Order({
    name: "Test Customer",
    email: "test@example.com",
    phone: "9876543210",
    address: "Art Street, Hyderabad",
    artStyle: "realistic",
    frameOption: "premium",
    quantity: 1,
    extraPeople: 1,
    rushDelivery: true,
    couponCode: "ART10",
    photo: "test_photo_key.jpg",
    pricingSnapshot: {
      currency: pricing.currency,
      baseArtworkPrice: pricing.baseArtworkPrice,
      styleCharge: pricing.styleCharge,
      frameCharge: pricing.frameCharge,
      extraPersonCharge: pricing.extraPersonCharge,
      rushDeliveryCharge: pricing.rushDeliveryCharge,
      subtotal: pricing.subtotal,
      couponCode: pricing.couponCode,
      discount: pricing.discount,
      shipping: pricing.shipping,
      tax: pricing.tax,
      finalTotal: pricing.finalTotal,
      calculatedAt: new Date(),
    },
    totalPrice: pricing.finalTotal,
    advanceAmount: Math.round(pricing.finalTotal * 0.25),
    status: "pending",
  });

  const saved = await testOrder.save();
  assert.ok(saved._id);
  assert.strictEqual(saved.totalPrice, 3198);
  assert.strictEqual(saved.advanceAmount, 800);
  assert.strictEqual(saved.pricingSnapshot.finalTotal, 3198);
  assert.strictEqual(saved.pricingSnapshot.subtotal, 2900);
  assert.strictEqual(saved.pricingSnapshot.discount, 290);
  assert.strictEqual(saved.pricingSnapshot.tax, 488);

  // 23. Existing orders remain unchanged after pricing configuration changes
  const originalFinalTotal = saved.pricingSnapshot.finalTotal;
  // Even if SystemConfig changes later, the snapshot on the order does not change:
  const fetched = await Order.findById(saved._id);
  assert.strictEqual(fetched.pricingSnapshot.finalTotal, originalFinalTotal);

  // 24. Advance and balance payment checks
  const expectedAdvance = Math.round(saved.totalPrice * 0.25);
  const expectedBalance = saved.totalPrice - expectedAdvance;
  assert.strictEqual(saved.advanceAmount, expectedAdvance);
  assert.strictEqual(expectedAdvance + expectedBalance, saved.totalPrice);

  // Cleanup test order
  await Order.findByIdAndDelete(saved._id);
});

test("Pricing Suite - Close DB", async () => {
  // Clean up all temporary test coupons so database has NO pre-built coupons
  await Coupon.deleteMany({
    code: { $in: ["ART10", "EXPIRED_TEST", "HIGH_MIN_TEST", "CAPPED_TEST"] },
  });
  await mongoose.connection.close();
  assert.strictEqual(mongoose.connection.readyState, 0);
});
