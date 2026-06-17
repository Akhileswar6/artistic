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
  basePricing: z.object({
    pencilSketch: z.number().nonnegative().optional(),
    oilPainting: z.number().nonnegative().optional(),
    digitalArt: z.number().nonnegative().optional(),
  }).optional(),
  discountPercentage: z.number().min(0).max(100).optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email("Invalid email format").optional(),
  announcement: z.string().optional().or(z.literal("")),
});

module.exports = {
  adminLoginSchema,
  adminProfileSchema,
  addAdminSchema,
  changePasswordSchema,
  blockUsersSchema,
  systemConfigSchema,
};
