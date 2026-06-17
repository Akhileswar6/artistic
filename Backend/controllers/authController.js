const User = require("../models/User");
const Otp = require("../models/Otp");
const Notification = require("../models/Notification");

const crypto = require("crypto");
const admin = require("../firebaseAdmin");
const jwt = require("jsonwebtoken");

// 🔥 fetch for Node
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));


// ================== BREVO EMAIL FUNCTION ==================
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
          name: "Artistic",
        },
        to: [{ email }],
        subject: `Artistic Verification Code : ${otp}`,
        htmlContent: `
<body style="margin:0;padding:20px;background:#f3f4f6;font-family:Inter,Segoe UI,Arial,sans-serif;">

<table
  align="center"
  width="100%"
  cellpadding="0"
  cellspacing="0"
  style="
    max-width:650px;
    margin:20px auto;
    background:#000000;
    border:1px solid #1a1a1e;
    border-radius:18px;
    overflow:hidden;
    box-shadow:0 20px 40px rgba(0,0,0,0.15);
  "
>


  <!-- Logo -->
  <tr>
    <td align="center" style="padding:40px 20px 20px;">

      <div style="display:inline-block; padding:10px;">
        <img
          src="https://res.cloudinary.com/artistic/image/upload/v1781679268/artistic_assets/logo.png"
          alt="Artistic"
          width="200"
          style="display:block;"
        />
      </div>

    </td>
  </tr>

  <!-- Title -->
  <tr>
    <td align="center" style="padding:10px 30px;">
      <h1
        style="
          margin:0;
          color:#ffffff;
          font-size:28px;
          font-weight:700;
        "
      >
        Verify Your Identity
      </h1>

      <p
        style="
          margin-top:12px;
          color:#a1a1aa;
          font-size:15px;
          line-height:1.6;
        "
      >
        Use the verification code below to securely continue
        your login or signup process.
      </p>
    </td>
  </tr>

  <!-- Divider -->
  <tr>
    <td style="padding:10px 40px;">
      <hr
        style="
          border:none;
          border-top:1px solid #27272a;
          margin:0;
        "
      >
    </td>
  </tr>

  <!-- Greeting -->
  <tr>
    <td style="padding:30px 40px 10px;">
      <p
        style="
          color:#f4f4f5;
          font-size:15px;
          margin:0;
        "
      >
        Hi there 👋,
      </p>
    </td>
  </tr>

  <!-- OTP Box -->
  <tr>
    <td align="center" style="padding:20px 40px 35px;">

      <div
        style="
          display:inline-block;
          padding:24px 42px;
        "
      >
        <span
          style="
            font-size:40px;
            font-weight:700;
            letter-spacing:12px;
            color:#ffffff;
            font-family:Courier New,monospace;
          "
        >
          ${otp}
        </span>
      </div>

    </td>
  </tr>

  <!-- Info -->
  <tr>
    <td style="padding:0 40px 20px;">
      <p
        style="
          margin:0 0 8px;
          color:#f4f4f5;
          font-size:14px;
          line-height:1.6;
        "
      >
        This OTP is valid for <strong>5 minutes</strong>.
      </p>

      <p
        style="
          margin:0;
          color:#a1a1aa;
          font-size:13px;
          line-height:1.6;
        "
      >
        Enter this code in the application to verify your identity and continue securely.
      </p>
    </td>
  </tr>

  <!-- Security Notice -->
  <tr>
    <td style="padding:0 40px 30px;">
      <p
        style="
          margin:0;
          color:#a1a1aa;
          font-size:13px;
          line-height:1.6;
        "
      >
        Never share this OTP with anyone. Artistic support will never ask for your verification code. If you did not request this email, you can safely ignore it.
      </p>
    </td>
  </tr>

  <!-- Divider -->
  <tr>
    <td style="padding:0 40px;">
      <hr
        style="
          border:none;
          border-top:1px solid #27272a;
          margin:0;
        "
      >
    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td
    align="center"
      style="
        padding:15px;
        background:#050505;
      "
    >



      <p
        style="
          color:#71717a;
          font-size:13px;
        "
      >
        © 2026 Artistic. All rights reserved.
      </p>

    </td>
  </tr>

</table>

</body>
`,
      }),
    });

    if (!response.ok) {
      throw new Error("Email sending failed");
    }

    
  } catch (error) {
    throw error;
  }
};


// ================== GOOGLE AUTH ==================
exports.googleAuth = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

    const decoded = await admin.auth().verifyIdToken(token);
    const { email, name, picture } = decoded;

    let user = await User.findOne({ email });
    const profilePicUrl = picture || `https://unavatar.io/${email.toLowerCase().trim()}`;

    if (!user) {
      user = await User.create({
        email,
        fullName: name,
        profilePic: profilePicUrl,
        provider: "google",
      });

      await Notification.create({
        userId: user._id,
        title: "Welcome to Artistic",
        message: "We’re excited to have you here!",
      });
    } else {
      // Sync profile pic from Google if missing or if it's a google provider
      user = await User.findOneAndUpdate(
        { email },
        { $set: { profilePic: profilePicUrl } },
        { returnDocument: "after" }
      );
    }

    const userToken = jwt.sign(
      { id: user._id, email: user.email, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Google login successful",
      user,
      token: userToken,
    });

  } catch (error) {
    res.status(401).json({ message: "Invalid Google token" });
  }
};


// ================== OTP GENERATOR ==================
const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};


// ================== SEND OTP ==================
exports.sendOtp = async (req, res) => {
  try {
    const { email, type } = req.body;

    const user = await User.findOne({ email });

    if (type === "signup" && user) {
      return res.status(400).json({
        message: "Account already exists. Sign in instead",
      });
    }

    if (type === "login" && !user) {
      return res.status(400).json({
        message: "No account found. Please sign up first",
      });
    }

    const otp = generateOtp();

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    await sendOtpEmail(email, otp);

    res.json({ message: "OTP sent" });

  } catch (err) {
    res.status(500).json({ message: "Failed to send OTP" });
  }
};


// ================== VERIFY OTP ==================
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp, fullName, type } = req.body;

    const record = await Otp.findOne({ email }).sort({ createdAt: -1 });

    if (!record) {
      return res.status(400).json({ message: "No OTP found" });
    }

    if (record.expiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (record.otp !== otp.trim()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    let user = await User.findOne({ email });

    if (type === "signup") {
      if (user) {
        return res.status(400).json({
          message: "Account already exists. Please login",
        });
      }

      const profilePic = `https://unavatar.io/${email.toLowerCase().trim()}`;

      user = await User.create({ email, fullName, profilePic });

      await Notification.create({
        userId: user._id,
        title: "Welcome to Artistic 🎉",
        message: "We’re excited to have you here!",
      });
    }

    if (type === "login") {
      if (!user) {
        return res.status(400).json({
          message: "No account found. Please signup",
        });
      }

      // Ensure profile pic exists or update it
      if (!user.profilePic) {
        user = await User.findOneAndUpdate(
          { email },
          { $set: { profilePic: `https://unavatar.io/${email.toLowerCase().trim()}` } },
          { returnDocument: "after" }
        );
      }
    }

    await Otp.deleteMany({ email });

    const userToken = jwt.sign(
      { id: user._id, email: user.email, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Success",
      user,
      token: userToken,
    });

  } catch (err) {
    res.status(500).json({ message: "Verification failed" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { userId, fullName } = req.body;
    let { profilePic } = req.body;

    // If a file was uploaded, use the Cloudinary URL from req.file
    if (req.file) {
      profilePic = req.file.path;
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { fullName, profilePic } },
      { returnDocument: "after" }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Error updating profile" });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const Order = require("../models/Order");
    
    const notificationsCount = await Notification.countDocuments({ userId });
    const ordersCount = await Order.countDocuments({ user: userId }); 

    res.json({
      notifications: notificationsCount,
      orders: ordersCount
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching stats" });
  }
};