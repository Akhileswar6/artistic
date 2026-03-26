const express = require("express");
const router = express.Router();

const { sendOtp, verifyOtp, googleAuth } = require("../controllers/authController");
const Notification = require("../models/Notification"); 

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/google", googleAuth);

//  Notifications route
router.get("/notifications/:userId", async (req, res) => {
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