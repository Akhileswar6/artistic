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
const { validate } = require("../middleware/validationMiddleware");
const {
  createOrderSchema,
  updatePaymentInfoSchema,
  submitFeedbackSchema,
  updateOrderStatusSchema,
  orderIdParamSchema,
} = require("../validators/orderSchemas");

const router = express.Router();

// ============================
// 🛒 CREATE ORDER
// ============================
router.post("/create", verifyToken, upload.single("photo"), validate({ body: createOrderSchema }), createOrder);

// ============================
// 👤 USER ORDERS
// ============================
router.get("/my-orders", verifyToken, getUserOrders);
router.get("/all", verifyAdmin, getAllOrders);
router.get("/:id", verifyToken, validate({ params: orderIdParamSchema }), getOrderById);
router.put("/payment/:id", verifyToken, validate({ params: orderIdParamSchema, body: updatePaymentInfoSchema }), updatePaymentInfo);
router.put("/feedback/:id", verifyToken, validate({ params: orderIdParamSchema, body: submitFeedbackSchema }), submitFeedback);

// ============================
// 🕵️ ADMIN ORDERS
// ============================
router.put("/status/:id", verifyAdmin, validate({ params: orderIdParamSchema, body: updateOrderStatusSchema }), updateOrderStatus);
router.delete("/:id", verifyAdmin, validate({ params: orderIdParamSchema }), deleteOrder);

module.exports = router;