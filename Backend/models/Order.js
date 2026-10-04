const mongoose = require("mongoose");

const PricingSnapshotSchema = new mongoose.Schema({
  currency: {
    type: String,
    default: "INR",
  },
  baseArtworkPrice: {
    type: Number,
    required: true,
  },
  styleCharge: {
    type: Number,
    required: true,
  },
  frameCharge: {
    type: Number,
    required: true,
  },
  extraPersonCharge: {
    type: Number,
    required: true,
  },
  rushDeliveryCharge: {
    type: Number,
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
  },
  couponCode: {
    type: String,
    default: null,
  },
  discount: {
    type: Number,
    default: 0,
  },
  shipping: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    required: true,
  },
  finalTotal: {
    type: Number,
    required: true,
  },
  calculatedAt: {
    type: Date,
    default: Date.now,
  },
  details: {
    type: Object,
    default: {},
  },
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  artworkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gallery",
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  artStyle: {
    type: String,
    required: true,
  },
  frameOption: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
  extraPeople: {
    type: Number,
    default: 0,
    min: 0,
  },
  rushDelivery: {
    type: Boolean,
    default: false,
  },
  couponCode: {
    type: String,
    default: null,
  },
  instructions: {
    type: String,
  },
  photo: {
    type: String, // URL to the uploaded photo
    required: true,
  },
  pricingSnapshot: {
    type: PricingSnapshotSchema,
    required: false, // optional so older orders without snapshot remain valid
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  advanceAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "payment_done", "in_progress", "completed", "out_for_delivery", "delivered", "cancelled"],
    default: "pending",
  },
  transactionId: {
    type: String,
    default: "",
  },
  isAdvancePaid: {
    type: Boolean,
    default: false,
  },
  balanceTransactionId: {
    type: String,
    default: "",
  },
  isFullPaid: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  feedback: {
    type: String,
    default: "",
  },
  feedbackDate: {
    type: Date,
  },
  history: [
    {
      status: { type: String },
      updatedBy: { type: String, default: "System" },
      timestamp: { type: Date, default: Date.now },
      metadata: { type: Object },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", OrderSchema);
