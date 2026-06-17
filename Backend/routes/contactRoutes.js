const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const { verifyToken } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validationMiddleware");
const { submitContactSchema } = require("../validators/contactSchemas");
const { strictLimiter } = require("../middleware/rateLimiters");

// @route   POST api/contact
// @desc    Submit a message
// @access  Private (Logged in users only)
router.post("/", verifyToken, strictLimiter, validate({ body: submitContactSchema }), async (req, res) => {
  try {
    const { fullName, email, subject, message } = req.body;

    if (!fullName || !email || !message) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    const newMessage = new Message({
      userId: req.user.id,
      fullName,
      email,
      subject,
      message,
    });

    await newMessage.save();

    res.status(201).json({ message: "Message sent successfully! We'll get back to you soon." });
  } catch (err) {
    console.error("Contact form error:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

module.exports = router;
