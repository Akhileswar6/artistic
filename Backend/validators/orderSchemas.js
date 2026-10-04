const { z } = require("zod");

const mongoIdRegex = /^[0-9a-fA-F]{24}$/;

const calculatePriceSchema = z.object({
  artworkId: z.string().optional().nullable().or(z.literal("")),
  style: z.string().optional(),
  artStyle: z.string().optional(),
  frame: z.string().optional(),
  frameOption: z.string().optional(),
  quantity: z.preprocess((val) => {
    if (val === undefined || val === null || val === "") return 1;
    const num = Number(val);
    return isNaN(num) ? val : num;
  }, z.number().int().min(1, "Quantity must be between 1 and 10").max(10, "Quantity must be between 1 and 10").default(1)),
  extraPeople: z.preprocess((val) => {
    if (val === undefined || val === null || val === "") return 0;
    const num = Number(val);
    return isNaN(num) ? val : num;
  }, z.number().int().min(0, "Extra people must be between 0 and 10").max(10, "Extra people must be between 0 and 10").default(0)),
  rushDelivery: z.preprocess((val) => {
    if (typeof val === "string") {
      return val.toLowerCase() === "true" || val === "1";
    }
    return Boolean(val);
  }, z.boolean().default(false)),
  couponCode: z.string().optional().nullable().or(z.literal("")),
  // Untrusted fields that clients might send for UI purposes - ignored
  price: z.any().optional(),
  subtotal: z.any().optional(),
  discount: z.any().optional(),
  tax: z.any().optional(),
  shipping: z.any().optional(),
  finalTotal: z.any().optional(),
}).refine((data) => data.style || data.artStyle, {
  message: "Selected style is required",
  path: ["style"],
}).refine((data) => data.frame || data.frameOption, {
  message: "Selected frame is required",
  path: ["frame"],
});

const createOrderSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(6, "Phone number is too short").max(20, "Phone number is too long"),
  address: z.string().min(5, "Address is too short"),
  artworkId: z.string().optional().nullable().or(z.literal("")),
  style: z.string().optional(),
  artStyle: z.string().optional(),
  frame: z.string().optional(),
  frameOption: z.string().optional(),
  instructions: z.string().optional().nullable().or(z.literal("")),
  quantity: z.preprocess((val) => {
    if (val === undefined || val === null || val === "") return 1;
    const num = Number(val);
    return isNaN(num) ? val : num;
  }, z.number().int().min(1, "Quantity must be between 1 and 10").max(10, "Quantity must be between 1 and 10").default(1)),
  extraPeople: z.preprocess((val) => {
    if (val === undefined || val === null || val === "") return 0;
    const num = Number(val);
    return isNaN(num) ? val : num;
  }, z.number().int().min(0, "Extra people must be between 0 and 10").max(10, "Extra people must be between 0 and 10").default(0)),
  rushDelivery: z.preprocess((val) => {
    if (typeof val === "string") {
      return val.toLowerCase() === "true" || val === "1";
    }
    return Boolean(val);
  }, z.boolean().default(false)),
  couponCode: z.string().optional().nullable().or(z.literal("")),
  // Untrusted client-side price fields - MUST NEVER be trusted or used
  price: z.any().optional(),
  subtotal: z.any().optional(),
  discount: z.any().optional(),
  tax: z.any().optional(),
  shipping: z.any().optional(),
  finalTotal: z.any().optional(),
}).refine((data) => data.style || data.artStyle, {
  message: "Selected style is required",
  path: ["artStyle"],
}).refine((data) => data.frame || data.frameOption, {
  message: "Selected frame is required",
  path: ["frameOption"],
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
  calculatePriceSchema,
  createOrderSchema,
  updatePaymentInfoSchema,
  submitFeedbackSchema,
  updateOrderStatusSchema,
  orderIdParamSchema,
};
