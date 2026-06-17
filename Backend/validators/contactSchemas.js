const { z } = require("zod");

const submitContactSchema = z.object({
  fullName: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().email("Invalid email format"),
  subject: z.string().max(200, "Subject is too long").optional().or(z.literal("")),
  message: z.string().min(1, "Message is required").max(5000, "Message is too long"),
});

module.exports = {
  submitContactSchema,
};
