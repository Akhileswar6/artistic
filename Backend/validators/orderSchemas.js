const { z } = require("zod");

const mongoIdRegex = /^[0-9a-fA-F]{24}$/;

const createOrderSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(6, "Phone number is too short").max(20, "Phone number is too long"),
  address: z.string().min(5, "Address is too short"),
  artStyle: z.string().min(1, "Art style is required"),
  frameOption: z.string().min(1, "Frame option is required"),
  instructions: z.string().optional(),
  price: z.coerce.number().positive("Price must be a positive number"),
});

const updatePaymentInfoSchema = z.object({
  transactionId: z.string().min(1, "Transaction ID is required").max(100, "Transaction ID is too long"),
  paymentType: z.enum(["advance", "balance"], {
    errorMap: () => ({ message: "Payment type must be advance or balance" }),
  }),
});

const submitFeedbackSchema = z.object({
  rating: z.coerce.number().min(1, "Rating must be between 1 and 5").max(5, "Rating must be between 1 and 5"),
  feedback: z.string().min(1, "Feedback cannot be empty").max(1000, "Feedback is too long"),
});

const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "accepted", "payment_done", "in_progress", "completed", "out_for_delivery", "delivered", "cancelled"]).optional(),
  isFullPaid: z.preprocess((val) => {
    if (typeof val === 'string') {
      if (val.toLowerCase() === 'true') return true;
      if (val.toLowerCase() === 'false') return false;
    }
    return val;
  }, z.boolean().optional()),
  isAdvancePaid: z.preprocess((val) => {
    if (typeof val === 'string') {
      if (val.toLowerCase() === 'true') return true;
      if (val.toLowerCase() === 'false') return false;
    }
    return val;
  }, z.boolean().optional()),
});

const orderIdParamSchema = z.object({
  id: z.string().regex(mongoIdRegex, "Invalid Order ID format"),
});

module.exports = {
  createOrderSchema,
  updatePaymentInfoSchema,
  submitFeedbackSchema,
  updateOrderStatusSchema,
  orderIdParamSchema,
};
