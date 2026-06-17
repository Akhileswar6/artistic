const express = require("express");
const router = express.Router();

const { sendOtp, verifyOtp, googleAuth, updateProfile, getUserStats } = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { validate } = require("../middleware/validationMiddleware");
const {
  sendOtpSchema,
  verifyOtpSchema,
  updateProfileSchema,
  getStatsSchema,
} = require("../validators/authSchemas");
const { strictLimiter } = require("../middleware/rateLimiters");

router.post("/send-otp", strictLimiter, validate({ body: sendOtpSchema }), sendOtp);
router.post("/verify-otp", strictLimiter, validate({ body: verifyOtpSchema }), verifyOtp);
router.post("/google", strictLimiter, googleAuth);
router.put("/update-profile", verifyToken, upload.single("profilePic"), validate({ body: updateProfileSchema }), updateProfile);
router.get("/stats/:userId", verifyToken, validate({ params: getStatsSchema }), getUserStats);

module.exports = router;