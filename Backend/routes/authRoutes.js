const express = require("express");
const router = express.Router();

const { sendOtp, verifyOtp, googleAuth, updateProfile, getUserStats } = require("../controllers/authController");
const Notification = require("../models/Notification"); 

const { verifyToken } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/google", googleAuth);
router.put("/update-profile", verifyToken, upload.single("profilePic"), updateProfile);
router.get("/stats/:userId", verifyToken, getUserStats);

//  Notifications route
router.get("/notifications/:userId", verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

module.exports = router;