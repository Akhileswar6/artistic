const express = require("express");
const router = express.Router();

const { sendOtp, verifyOtp, googleAuth, updateProfile, getUserStats } = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/google", googleAuth);
router.put("/update-profile", verifyToken, upload.single("profilePic"), updateProfile);
router.get("/stats/:userId", verifyToken, getUserStats);

module.exports = router;