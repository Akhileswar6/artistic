const { z } = require("zod");

const mongoIdRegex = /^[0-9a-fA-F]{24}$/;

const sendOtpSchema = z.object({
  email: z.string().email("Invalid email format"),
  type: z.enum(["signup", "login"], {
    errorMap: () => ({ message: "Type must be either signup or login" }),
  }),
});

const verifyOtpSchema = z.object({
  email: z.string().email("Invalid email format"),
  otp: z.string().length(6, "OTP must be exactly 6 characters"),
  fullName: z.string().optional(),
  type: z.enum(["signup", "login"], {
    errorMap: () => ({ message: "Type must be either signup or login" }),
  }),
});

const updateProfileSchema = z.object({
  userId: z.string().regex(mongoIdRegex, "Invalid User ID format"),
  fullName: z.string().min(1, "Name is required").max(100, "Name is too long"),
  profilePic: z.string().optional(),
});

const getStatsSchema = z.object({
  userId: z.string().regex(mongoIdRegex, "Invalid User ID format"),
});

module.exports = {
  sendOtpSchema,
  verifyOtpSchema,
  updateProfileSchema,
  getStatsSchema,
};
