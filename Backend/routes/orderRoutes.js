const express = require("express");
const {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  updatePaymentInfo,
  submitFeedback,
} = require("../controllers/orderController");

const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// ============================
// 🛒 CREATE ORDER
// ============================
router.post("/create", verifyToken, upload.single("photo"), createOrder);

// ============================
// 👤 USER ORDERS
// ============================
router.get("/my-orders", verifyToken, getUserOrders);
router.get("/all", verifyAdmin, getAllOrders);
router.get("/:id", verifyToken, getOrderById);
router.put("/payment/:id", verifyToken, updatePaymentInfo);
router.put("/feedback/:id", verifyToken, submitFeedback);

// ============================
// 🕵️ ADMIN ORDERS
// ============================
// router.get("/all", verifyAdmin, getAllOrders); // Moved up to prevent /:id conflict
router.put("/status/:id", verifyAdmin, updateOrderStatus);
router.delete("/:id", verifyAdmin, deleteOrder);

module.exports = router;