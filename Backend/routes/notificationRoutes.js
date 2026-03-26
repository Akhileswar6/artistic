const express = require("express");
const router = express.Router();

const Notification = require("../models/Notification");

// ================= GET ALL NOTIFICATIONS =================
router.get("/:userId", async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

// ================= MARK ONE AS READ =================
router.put("/:id", async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ message: "Notification updated" });
  } catch (err) {
    res.status(500).json({ message: "Error updating notification" });
  }
});

// ================= MARK ALL AS READ =================
router.put("/mark-all/:userId", async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.params.userId },
      { read: true }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Error updating notifications" });
  }
});

module.exports = router;