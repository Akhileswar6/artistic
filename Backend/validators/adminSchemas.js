const { z } = require("zod");

const mongoIdRegex = /^[0-9a-fA-F]{24}$/;

const adminLoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
  otp: z.string().length(6, "OTP must be exactly 6 characters").optional().or(z.literal("")),
});

const adminProfileSchema = z.object({
  fullName: z.string().min(1, "Name is required").max(100, "Name is too long").optional(),
  email: z.string().email("Invalid email format").optional(),
  bio: z.string().max(500, "Bio is too long").optional().or(z.literal("")),
  avatar: z.string().optional().or(z.literal("")),
});

const addAdminSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(1, "Name is required").max(100, "Name is too long").optional(),
});

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

const blockUsersSchema = z.object({
  userIds: z.array(z.string().regex(mongoIdRegex, "Invalid User ID format")),
});

const systemConfigSchema = z.object({
  maintenanceMode: z.boolean().optional(),
  baseArtworkPrice: z.number().nonnegative().optional(),
  artworkStyles: z.record(z.string(), z.number().nonnegative()).optional(),
  basePricing: z.record(z.string(), z.number().nonnegative()).optional(),
  framePricing: z.record(z.string(), z.number().nonnegative()).optional(),
  extraPersonCharge: z.number().nonnegative().optional(),
  rushDeliveryCharge: z.number().nonnegative().optional(),
  shippingCharge: z.number().nonnegative().optional(),
  gstPercentage: z.number().min(0).max(100).optional(),
  allowRushDelivery: z.boolean().optional(),
  maxQuantity: z.number().int().min(1).optional(),
  maxExtraPeople: z.number().int().min(0).optional(),
  discountPercentage: z.number().min(0).max(100).optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email("Invalid email format").optional(),
  announcement: z.string().optional().or(z.literal("")),
});

const createCouponSchema = z.object({
  code: z.string().min(2, "Coupon code must be at least 2 characters").max(25, "Coupon code too long").trim(),
  discountType: z.enum(["percentage", "fixed"], {
    errorMap: () => ({ message: "Discount type must be either 'percentage' or 'fixed'" }),
  }),
  discountValue: z.number().positive("Discount value must be greater than 0"),
  minOrderValue: z.number().nonnegative("Min order value cannot be negative").optional().default(0),
  maxDiscount: z.number().positive("Max discount must be greater than 0").nullable().optional(),
  expiryDate: z.string().nullable().optional().or(z.date()),
  startDate: z.string().nullable().optional().or(z.date()),
  usageLimit: z.number().int().positive("Usage limit must be a positive integer").nullable().optional(),
  userLimit: z.number().int().positive("User limit must be a positive integer").optional().default(1),
  description: z.string().max(250, "Description cannot exceed 250 characters").optional().default(""),
  isActive: z.boolean().optional().default(true),
}).refine((data) => {
  if (data.discountType === "percentage" && data.discountValue > 100) {
    return false;
  }
  return true;
}, {
  message: "Percentage discount cannot exceed 100%",
  path: ["discountValue"],
});

module.exports = {
  adminLoginSchema,
  adminProfileSchema,
  addAdminSchema,
  changePasswordSchema,
  blockUsersSchema,
  systemConfigSchema,
  createCouponSchema,
};
