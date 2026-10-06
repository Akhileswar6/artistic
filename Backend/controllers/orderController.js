const Order = require("../models/Order");
const User = require("../models/User");
const Activity = require("../models/Activity");
const Admin = require("../models/Admin");
const Coupon = require("../models/Coupon");
const { generatePresignedUrl } = require("../utils/s3utils");
const { PricingService, PricingError } = require("../services/pricingService");

// PREVIEW ORDER PRICE (CALCULATE PRICE)
const calculatePrice = async (req, res) => {
  try {
    const {
      artworkId,
      style,
      artStyle,
      frame,
      frameOption,
      quantity,
      extraPeople,
      rushDelivery,
      couponCode,
    } = req.body;

    const selectedStyle = style || artStyle;
    const selectedFrame = frame || frameOption;
    const userId = req.user?.id || null;

    const pricing = await PricingService.calculateOrderPrice({
      artworkId,
      style: selectedStyle,
      frame: selectedFrame,
      quantity,
      extraPeople,
      rushDelivery,
      couponCode,
      userId,
    });

    res.json({
      success: true,
      ...pricing,
      pricing,
    });
  } catch (error) {
    if (error instanceof PricingError || error.name === "PricingError") {
      return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message,
      });
    }
    console.error("❌ Calculate Price Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to calculate order price",
    });
  }
};

// CREATE ORDER
const createOrder = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      address, 
      artworkId,
      style,
      artStyle, 
      frame,
      frameOption, 
      instructions, 
      quantity,
      extraPeople,
      rushDelivery,
      couponCode,
      // Note: price, subtotal, discount, tax, shipping, finalTotal are NEVER trusted from req.body
    } = req.body;

    const photo = req.file ? req.file.key : null;

    if (!photo) {
      console.error("❌ Create Order Error: Photo is missing. req.file =", req.file);
      return res.status(400).json({ success: false, message: "Photo is required" });
    }

    const selectedStyle = style || artStyle;
    const selectedFrame = frame || frameOption;

    // Authoritative Server-side Price Calculation
    const pricing = await PricingService.calculateOrderPrice({
      artworkId,
      style: selectedStyle,
      frame: selectedFrame,
      quantity,
      extraPeople,
      rushDelivery,
      couponCode,
      userId: req.user.id,
    });

    const totalPrice = pricing.finalTotal;
    const advanceAmount = Math.round(totalPrice * 0.25);

    const pricingSnapshot = {
      currency: pricing.currency || "INR",
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
      calculatedAt: pricing.calculatedAt,
      details: {
        quantity: pricing.quantity,
        extraPeople: pricing.extraPeople,
        rushDelivery: pricing.rushDelivery,
        gstPercentage: pricing.gstPercentage,
        artworkTitle: pricing.artworkTitle,
      },
    };

    const newOrder = new Order({
      user: req.user.id,
      artworkId: artworkId || undefined,
      name,
      email,
      phone,
      address,
      artStyle: selectedStyle,
      frameOption: selectedFrame,
      quantity: pricing.quantity,
      extraPeople: pricing.extraPeople,
      rushDelivery: pricing.rushDelivery,
      couponCode: pricing.couponCode,
      instructions,
      photo,
      pricingSnapshot,
      totalPrice,
      advanceAmount,
      status: "pending",
      history: [{
        status: "pending",
        updatedBy: "Customer",
        timestamp: new Date(),
        metadata: { action: "Order Created" }
      }]
    });

    const savedOrder = await newOrder.save();

    // Record coupon usage if applied
    if (pricing.couponCode) {
      await PricingService.recordCouponUsage(pricing.couponCode, req.user.id);
    }

    // Server-side audit log
    console.log(`🛒 [Order Created] ID: ${savedOrder._id}, User: ${req.user.id}, Subtotal: ₹${pricing.subtotal}, Discount: ₹${pricing.discount} (${pricing.couponCode || 'None'}), Shipping: ₹${pricing.shipping}, Tax: ₹${pricing.tax}, Total: ₹${totalPrice}`);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: savedOrder,
    });
  } catch (error) {
    if (error instanceof PricingError || error.name === "PricingError") {
      return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message,
      });
    }
    console.error("❌ Create Order Error:", error.message, error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET USER ORDERS
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    const ordersWithUrls = await Promise.all(orders.map(async (order) => {
      const orderObj = order.toObject();
      orderObj.photo = await generatePresignedUrl(orderObj.photo);
      return orderObj;
    }));

    res.json(ordersWithUrls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE ORDER
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const orderObj = order.toObject();
    orderObj.photo = await generatePresignedUrl(orderObj.photo);
    res.json(orderObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN - GET ALL ORDERS
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "fullName email");
    
    const ordersWithUrls = await Promise.all(orders.map(async (order) => {
      const orderObj = order.toObject();
      orderObj.photo = await generatePresignedUrl(orderObj.photo);
      return orderObj;
    }));
    
    res.json(ordersWithUrls);
  } catch (error) {
    console.error("❌ Get All Orders Error:", error);
    res.status(500).json({ message: error.message, stack: error.stack });
  }
};

// ADMIN - UPDATE ORDER STATUS
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, isFullPaid, isAdvancePaid } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    let actionName = "Status Update";

    if (status !== undefined) {
      order.status = status;
      // Handle payment flags based on status
      if (status === "payment_done") {
        order.isAdvancePaid = true;
      } else if (status === "out_for_delivery" || status === "delivered") {
        order.isAdvancePaid = true;
        order.isFullPaid = true;
      } else if (status === "pending" || status === "accepted") {
        order.isAdvancePaid = false;
        order.isFullPaid = false;
        order.transactionId = ""; 
        order.balanceTransactionId = "";
      }
    }

    if (isFullPaid !== undefined) {
      order.isFullPaid = isFullPaid;
      if (isFullPaid) {
        actionName = "Balance Payment Verified";
      }
    }

    if (isAdvancePaid !== undefined) {
      order.isAdvancePaid = isAdvancePaid;
      if (isAdvancePaid) {
        actionName = "Advance Payment Verified";
      }
    }

    // --- LOG HISTORY & ACTIVITY ---
    const adminId = req.user.id;
    const admin = await Admin.findById(adminId);
    
    // Add to order history
    order.history.push({
      status: order.status,
      updatedBy: admin?.fullName || "Admin",
      timestamp: new Date(),
      metadata: { action: actionName }
    });
    await order.save();

    // Create global activity record
    await new Activity({
      adminId: adminId,
      adminName: admin?.fullName || "Admin",
      action: actionName === "Status Update" ? "Updated Order Status" : actionName,
      targetId: id,
      targetType: "Order",
      details: actionName === "Status Update" ? `Changed status to: ${order.status}` : `${actionName} for order`,
    }).save();

    // Schedule activity log cleanup 7 days after delivery
    if (order.status === "delivered") {
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
      await Activity.updateMany(
        { targetId: id, targetType: "Order" },
        { $set: { expiresAt } }
      );
    }

    res.json({
      success: true,
      message: actionName === "Status Update" ? "Order status updated successfully" : `${actionName} successfully`,
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// USER - UPDATE PAYMENT INFO (Transaction ID)
const updatePaymentInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { transactionId, paymentType } = req.body; // paymentType: 'advance' | 'balance'

    const order = await Order.findOne({ _id: id, user: req.user.id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 1. Block if pending
    if (order.status === "pending") {
      return res.status(400).json({ message: "Please wait for the artist to accept your order before making a payment." });
    }

    // 2. Block if cancelled
    if (order.status === "cancelled") {
      return res.status(400).json({ message: "Cannot submit payment for a cancelled order." });
    }

    // 3. Handle Stage 1: Advance
    if (paymentType === 'advance') {
      if (order.isAdvancePaid) {
        return res.status(400).json({ message: "Advance payment has already been verified." });
      }
      order.transactionId = transactionId;
      // Note: Admin will verify this and set isAdvancePaid = true
    } 
    
    // 4. Handle Stage 2: Balance
    else if (paymentType === 'balance') {
      if (!order.isAdvancePaid) {
        return res.status(400).json({ message: "Please wait for your advance payment to be verified before submitting the final balance." });
      }
      if (order.isFullPaid) {
        return res.status(400).json({ message: "Order is already fully paid." });
      }
      order.balanceTransactionId = transactionId;
    }

    await order.save();

    res.json({
      success: true,
      message: `${paymentType === 'advance' ? 'Advance' : 'Balance'} Transaction ID submitted successfully`,
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// USER - SUBMIT FEEDBACK
const submitFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, feedback } = req.body;

    const order = await Order.findOne({ _id: id, user: req.user.id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "delivered") {
      return res.status(400).json({ message: "Feedback can only be submitted for delivered orders." });
    }

    if (order.rating > 0) {
      return res.status(400).json({ message: "Feedback has already been submitted for this order." });
    }

    order.rating = rating;
    order.feedback = feedback;
    order.feedbackDate = new Date();

    await order.save();

    res.json({
      success: true,
      message: "Feedback submitted successfully! Thank you for your review.",
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ADMIN - DELETE ORDER
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Log Global Activity
    const admin = await Admin.findById(req.user.id);
    await new Activity({
      adminId: req.user.id,
      adminName: admin?.fullName || "Admin",
      action: "Deleted Order",
      targetId: id,
      targetType: "Order",
      details: `Project owned by: ${order.name}`,
    }).save();

    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// USER - DELETE ORDER
const userDeleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({ message: "Artist approved the art, you can no longer delete it" });
    }

    await Order.findByIdAndDelete(id);
    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET AVAILABLE ACTIVE COUPONS (FOR EXPLORER/CHECKOUT)
const getAvailableCoupons = async (req, res) => {
  try {
    const now = new Date();
    const userId = req.user?.id || req.user?._id || null;

    const coupons = await Coupon.find({
      isActive: true,
      $and: [
        {
          $or: [
            { startDate: { $exists: false } },
            { startDate: null },
            { startDate: { $lte: now } },
          ],
        },
        {
          $or: [
            { expiryDate: { $exists: false } },
            { expiryDate: null },
            { expiryDate: { $gt: now } },
          ],
        },
      ],
    }).sort({ minOrderValue: 1, discountValue: -1 });

    const availableCoupons = coupons
      .filter((c) => {
        // If overall global limit reached, it cannot be used by anyone
        if (c.usageLimit !== null && c.usedCount >= c.usageLimit) {
          return false;
        }
        return true;
      })
      .map((c) => {
        let isAlreadyUsed = false;
        if (userId && c.userLimit !== null && Array.isArray(c.usedBy)) {
          const userRecord = c.usedBy.find(
            (u) => u.userId && u.userId.toString() === userId.toString()
          );
          if (userRecord && userRecord.count >= c.userLimit) {
            isAlreadyUsed = true;
          }
        }

        return {
          _id: c._id,
          code: c.code,
          discountType: c.discountType,
          discountValue: c.discountValue,
          minOrderValue: c.minOrderValue || 0,
          maxDiscount: c.maxDiscount || null,
          description: c.description || "",
          expiryDate: c.expiryDate,
          userLimit: c.userLimit,
          alreadyUsed: isAlreadyUsed,
          isAlreadyUsed: isAlreadyUsed,
        };
      });

    res.json({
      success: true,
      count: availableCoupons.length,
      coupons: availableCoupons,
    });
  } catch (error) {
    console.error("❌ Get Available Coupons Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load available coupons",
    });
  }
};

module.exports = {
  calculatePrice,
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  userDeleteOrder,
  updatePaymentInfo,
  submitFeedback,
  getAvailableCoupons,
};

