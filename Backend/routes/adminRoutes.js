const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Activity = require("../models/Activity");
const SystemConfig = require("../models/SystemConfig");
const Order = require("../models/Order");
const User = require("../models/User");
const Message = require("../models/Message");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Otp = require("../models/Otp");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const sendOtpEmail = async (email, otp) => {
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          email: process.env.EMAIL_USER,
          name: "Artistic Security",
        },
        to: [{ email }],
        subject: `Admin Login Verification Code: ${otp}`,
        htmlContent: `<div style="font-family:sans-serif;"><h3>Admin Login</h3><p>Your OTP code is: <b style="font-size:24px;">${otp}</b></p><p>This code expires in 5 minutes.</p></div>`,
      }),
    });
    if (!response.ok) throw new Error("Email sending failed");
  } catch (error) {
    console.error("Admin OTP Send Error:", error);
  }
};

const { verifyAdmin } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validationMiddleware");
const {
  adminLoginSchema,
  adminProfileSchema,
  addAdminSchema,
  changePasswordSchema,
  blockUsersSchema,
  systemConfigSchema,
} = require("../validators/adminSchemas");
const { strictLimiter } = require("../middleware/rateLimiters");
const { z } = require("zod");
const adminIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
});

// ============================
// 🟢 LOGIN ROUTE
// ============================
router.post("/login", strictLimiter, validate({ body: adminLoginSchema }), async (req, res) => {
  const { email, password, otp } = req.body;

  try {
    let admin = await Admin.findOne({ email });

    // If matches .env credentials exactly, ensure admin exists and password is synced
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      if (!admin) {
        admin = new Admin({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
        await admin.save();
      } else {
        admin.password = ADMIN_PASSWORD;
        await admin.save();
      }
    }

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Step 1: Send OTP
    if (!otp) {
      const otpCode = crypto.randomInt(100000, 999999).toString();
      await Otp.deleteMany({ email }); // clear previous
      await Otp.create({
        email,
        otp: otpCode,
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 min
      });
      await sendOtpEmail(email, otpCode);
      return res.json({ requireOtp: true, message: "OTP sent to admin email." });
    }

    // Step 2: Verify OTP
    const record = await Otp.findOne({ email }).sort({ createdAt: -1 });
    if (!record) return res.status(400).json({ message: "No OTP found. Please request a new one." });
    if (record.expiresAt < Date.now()) return res.status(400).json({ message: "OTP expired. Please try again." });
    if (record.otp !== otp.trim()) return res.status(400).json({ message: "Invalid OTP. Try again." });

    // Clean up OTP
    await Otp.deleteMany({ email });

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing from .env");
    }

    const token = jwt.sign(
      { role: "admin", email: admin.email, id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token, message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error during login", error: err.message });
  }
});

// ============================
// 👤 ADMIN PROFILE
// ============================
router.get("/profile", verifyAdmin, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
});

router.put("/profile", verifyAdmin, validate({ body: adminProfileSchema }), async (req, res) => {
  try {
    const { fullName, email, bio, avatar } = req.body;
    const admin = await Admin.findByIdAndUpdate(
      req.user.id,
      { fullName, email, bio, avatar },
      { returnDocument: "after" }
    ).select("-password");
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
});

// ============================
// 👥 MULTI-ADMIN MANAGEMENT
// ============================
router.get("/all-admins", verifyAdmin, async (req, res) => {
  try {
    const admins = await Admin.find().select("-password").sort({ createdAt: 1 });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: "Error fetching admins" });
  }
});

router.post("/add-admin", verifyAdmin, validate({ body: addAdminSchema }), async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    
    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: "Admin already exists" });

    const newAdmin = new Admin({ email, password, fullName: fullName || "Admin" });
    await newAdmin.save();

    res.json({ message: "New admin added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error adding admin" });
  }
});

router.delete("/remove-admin/:id", verifyAdmin, validate({ params: adminIdParamSchema }), async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: "Cannot remove yourself" });
    }
    await Admin.findByIdAndDelete(req.params.id);
    res.json({ message: "Admin removed" });
  } catch (err) {
    res.status(500).json({ message: "Error removing admin" });
  }
});

router.put("/change-password", verifyAdmin, validate({ body: changePasswordSchema }), async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.user.id);

    if (!(await admin.comparePassword(oldPassword))) {
      return res.status(400).json({ message: "Incorrect old password" });
    }

    admin.password = newPassword;
    await admin.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating password" });
  }
});

// ============================
// 👥 GET ALL USERS
// ============================
router.get("/users", verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// ============================
// 🚫 BLOCK/UNBLOCK USERS
// ============================
router.post("/block-users", verifyAdmin, validate({ body: blockUsersSchema }), async (req, res) => {
  try {
    const { userIds } = req.body;
    const users = await User.find({ _id: { $in: userIds } });

    const bulkOps = users.map((user) => ({
      updateOne: {
        filter: { _id: user._id },
        update: { $set: { isBlocked: !user.isBlocked } },
      },
    }));

    if (bulkOps.length > 0) await User.bulkWrite(bulkOps);
    res.json({ message: "Statuses updated" });
  } catch (err) {
    res.status(500).json({ message: "Failed" });
  }
});

// ============================
// ✉️ MESSAGES
// ============================
router.get("/messages", verifyAdmin, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed" });
  }
});

router.delete("/messages/:id", verifyAdmin, validate({ params: adminIdParamSchema }), async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: "Success" });
  } catch (err) {
    res.status(500).json({ message: "Failed" });
  }
});

// ============================
// 📊 DASHBOARD STATS
// ============================
router.get("/stats-summary", verifyAdmin, async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const messagesCount = await Message.countDocuments();
    const ordersCount = await Order.countDocuments();

    // Calculate total revenue from all fully paid orders
    const paidOrders = await Order.find({ isFullPaid: true });
    const totalRevenue = paidOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

    res.json({
      users: usersCount,
      messages: messagesCount,
      orders: ordersCount,
      revenue: totalRevenue
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

// ============================
// 📈 DETAILED ANALYTICS (For Charts)
// ============================
router.get("/analytics", verifyAdmin, async (req, res) => {
  try {
    // 1. Revenue by Day (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const revenueData = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo }, isFullPaid: true } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalPrice" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // 2. Art Style Distribution
    const artStyleData = await Order.aggregate([
      { $group: { _id: "$artStyle", value: { $sum: 1 } } }
    ]);

    // 3. Order Status Distribution
    const statusData = await Order.aggregate([
      { $group: { _id: "$status", value: { $sum: 1 } } }
    ]);

    // 4. User Growth (Last 7 days)
    const userData = await User.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // 5. Message Trends (Last 7 days)
    const messageData = await Message.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json({
      revenueTrends: revenueData,
      artStyles: artStyleData,
      statuses: statusData,
      userGrowth: userData,
      messageTrends: messageData
    });
  } catch (err) {
    console.error("Dashboard Analytics Error:", err);
    res.status(500).json({ message: "Analytics failed", error: err.message });
  }
});

// ============================
// 📜 ACTIVITY LOGS
// ============================
router.get("/activities", verifyAdmin, async (req, res) => {
  try {
    const activities = await Activity.find()
      .sort({ timestamp: -1 })
      .limit(50);
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch activities" });
  }
});

// ============================
// ⚙️ SYSTEM CONFIGURATION
// ============================
router.get("/config", verifyAdmin, async (req, res) => {
  try {
    let config = await SystemConfig.findOne();
    if (!config) {
      config = new SystemConfig();
      await config.save();
    }
    res.json(config);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch config" });
  }
});

router.put("/config", verifyAdmin, validate({ body: systemConfigSchema }), async (req, res) => {
  try {
    const update = req.body;
    let config = await SystemConfig.findOneAndUpdate({}, update, { new: true, upsert: true });

    // Log this action
    const admin = await Admin.findById(req.user.id);
    await new Activity({
      adminId: req.user.id,
      adminName: admin?.fullName || "Admin",
      action: "Updated System Config",
      targetType: "Config",
      details: "Updated site-wide settings",
    }).save();

    res.json(config);
  } catch (err) {
    res.status(500).json({ message: "Failed to update config" });
  }
});

module.exports = router;