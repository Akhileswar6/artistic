const Order = require("../models/Order");
const User = require("../models/User");
const Activity = require("../models/Activity");
const Admin = require("../models/Admin");

// CREATE ORDER
const createOrder = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      address, 
      artStyle, 
      frameOption, 
      instructions, 
      price 
    } = req.body;

    const photo = req.file ? req.file.path : null;

    if (!photo) {
      return res.status(400).json({ success: false, message: "Photo is required" });
    }

    // Calculate advance (25%)
    const totalPrice = Number(price);
    const advanceAmount = Math.round(totalPrice * 0.25);

    const newOrder = new Order({
      user: req.user.id, // from verifyToken middleware
      name,
      email,
      phone,
      address,
      artStyle,
      frameOption,
      instructions,
      photo,
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

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: savedOrder,
    });
  } catch (error) {
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

    res.json(orders);
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
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN - GET ALL ORDERS
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "fullName email");
    res.json(orders);
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

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  updatePaymentInfo,
  submitFeedback
};
