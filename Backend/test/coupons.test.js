const test = require("node:test");
const assert = require("node:assert");
require("dotenv").config();
const mongoose = require("mongoose");
const Coupon = require("../models/Coupon");
const { PricingService, PricingError } = require("../services/pricingService");
const { createCouponSchema } = require("../validators/adminSchemas");

test("Coupons Admin Suite - Connect DB", async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
  }
  assert.strictEqual(mongoose.connection.readyState, 1);
});

test("Coupon Validation - createCouponSchema enforces valid data", () => {
  // Valid percentage coupon
  const validPercent = createCouponSchema.safeParse({
    code: "TESTSAVE20",
    discountType: "percentage",
    discountValue: 20,
    minOrderValue: 500,
    maxDiscount: 200,
    description: "20% off up to ₹200",
  });
  assert.strictEqual(validPercent.success, true);

  // Valid fixed coupon
  const validFixed = createCouponSchema.safeParse({
    code: "FLAT300",
    discountType: "fixed",
    discountValue: 300,
    minOrderValue: 1000,
  });
  assert.strictEqual(validFixed.success, true);

  // Invalid: percentage over 100
  const over100 = createCouponSchema.safeParse({
    code: "OVER100",
    discountType: "percentage",
    discountValue: 150,
  });
  assert.strictEqual(over100.success, false);

  // Invalid: negative discount value
  const negativeVal = createCouponSchema.safeParse({
    code: "NEGATIVE",
    discountType: "fixed",
    discountValue: -50,
  });
  assert.strictEqual(negativeVal.success, false);
});

test("Coupon Lifecycle - Create, Apply at Checkout, Instant Expire, Reject at Checkout, Delete", async () => {
  const testCode = `ADM_${Date.now()}`;

  // 1. Create Coupon
  const coupon = new Coupon({
    code: testCode,
    discountType: "percentage",
    discountValue: 25,
    minOrderValue: 1000,
    maxDiscount: 500,
    expiryDate: new Date(Date.now() + 86400000), // tomorrow
    isActive: true,
    description: "Admin test discount",
  });
  await coupon.save();

  // 2. Verify it is valid and can be applied in PricingService
  const pricing = await PricingService.calculateOrderPrice({
    style: "realistic",
    frame: "noframe",
    quantity: 1,
    couponCode: testCode,
  });
  assert.strictEqual(pricing.couponCode, testCode);
  assert.ok(pricing.discount > 0);

  // 3. Instant Expire Action
  coupon.expiryDate = new Date(Date.now() - 1000); // set to past
  coupon.isActive = false;
  await coupon.save();

  // 4. Verify checkout now REJECTS the expired coupon
  await assert.rejects(
    async () => {
      await PricingService.calculateOrderPrice({
        style: "realistic",
        frame: "noframe",
        quantity: 1,
        couponCode: testCode,
      });
    },
    (err) => {
      assert(err instanceof PricingError);
      assert.strictEqual(err.statusCode, 400);
      assert.match(err.message, /Invalid or expired coupon/i);
      return true;
    }
  );

  // 5. Toggle Status back to active (with future date)
  coupon.isActive = true;
  coupon.expiryDate = new Date(Date.now() + 86400000);
  await coupon.save();

  const reactivatedPricing = await PricingService.calculateOrderPrice({
    style: "realistic",
    frame: "noframe",
    quantity: 1,
    couponCode: testCode,
  });
  assert.strictEqual(reactivatedPricing.couponCode, testCode);

  // 6. Delete Coupon
  await Coupon.findByIdAndDelete(coupon._id);
  const deletedCheck = await Coupon.findById(coupon._id);
  assert.strictEqual(deletedCheck, null);

  // 7. Verify checkout rejects deleted coupon
  await assert.rejects(
    async () => {
      await PricingService.calculateOrderPrice({
        style: "realistic",
        frame: "noframe",
        quantity: 1,
        couponCode: testCode,
      });
    },
    (err) => {
      assert(err instanceof PricingError);
      assert.strictEqual(err.statusCode, 400);
      return true;
    }
  );
});

test("Available Coupons - getAvailableCoupons returns active non-expired coupons only", async () => {
  const { getAvailableCoupons } = require("../controllers/orderController");

  const activeCode = `ACT_${Date.now()}`;
  const expiredCode = `EXP_${Date.now()}`;

  await Coupon.create({
    code: activeCode,
    discountType: "percentage",
    discountValue: 20,
    isActive: true,
  });

  await Coupon.create({
    code: expiredCode,
    discountType: "fixed",
    discountValue: 100,
    isActive: false,
  });

  let responseData = null;
  const mockReq = { user: null };
  const mockRes = {
    json: (data) => { responseData = data; },
    status: () => mockRes,
  };

  await getAvailableCoupons(mockReq, mockRes);

  assert.strictEqual(responseData.success, true);
  const codes = responseData.coupons.map((c) => c.code);
  assert.ok(codes.includes(activeCode));
  assert.strictEqual(codes.includes(expiredCode), false);

  // Cleanup
  await Coupon.deleteMany({ code: { $in: [activeCode, expiredCode] } });
});

test("Coupons Admin Suite - Close DB", async () => {
  await mongoose.disconnect();
  assert.strictEqual(mongoose.connection.readyState, 0);
});
