const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false // Optional if we allow guest orders, but better to require login
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  artStyle: {
    type: String,
    required: true
  },
  frameOption: {
    type: String,
    required: true
  },
  instructions: {
    type: String
  },
  photo: {
    type: String, // URL to the uploaded photo
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  advanceAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "payment_done", "in_progress", "completed", "out_for_delivery", "delivered", "cancelled"],
    default: "pending"
  },
  transactionId: {
    type: String,
    default: ""
  },
  isAdvancePaid: {
    type: Boolean,
    default: false
  },
  balanceTransactionId: {
    type: String,
    default: ""
  },
  isFullPaid: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  feedback: {
    type: String,
    default: ""
  },
  feedbackDate: {
    type: Date
  },
  history: [
    {
      status: { type: String },
      updatedBy: { type: String, default: "System" },
      timestamp: { type: Date, default: Date.now },
      metadata: { type: Object }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", OrderSchema);
