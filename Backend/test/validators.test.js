const test = require("node:test");
const assert = require("node:assert");
const { sendOtpSchema, verifyOtpSchema } = require("../validators/authSchemas");
const { submitContactSchema } = require("../validators/contactSchemas");

test("sendOtpSchema - valid inputs", () => {
  const result = sendOtpSchema.safeParse({
    email: "user@example.com",
    type: "signup",
  });
  assert.strictEqual(result.success, true);
});

test("sendOtpSchema - invalid email format", () => {
  const result = sendOtpSchema.safeParse({
    email: "not-an-email",
    type: "login",
  });
  assert.strictEqual(result.success, false);
});

test("sendOtpSchema - invalid type value", () => {
  const result = sendOtpSchema.safeParse({
    email: "user@example.com",
    type: "admin-signup",
  });
  assert.strictEqual(result.success, false);
});

test("verifyOtpSchema - valid inputs", () => {
  const result = verifyOtpSchema.safeParse({
    email: "user@example.com",
    otp: "123456",
    type: "login",
  });
  assert.strictEqual(result.success, true);
});

test("verifyOtpSchema - short OTP value", () => {
  const result = verifyOtpSchema.safeParse({
    email: "user@example.com",
    otp: "123",
    type: "login",
  });
  assert.strictEqual(result.success, false);
});

test("submitContactSchema - valid inputs", () => {
  const result = submitContactSchema.safeParse({
    fullName: "John Doe",
    email: "john@example.com",
    subject: "Hello",
    message: "This is a test message.",
  });
  assert.strictEqual(result.success, true);
});
