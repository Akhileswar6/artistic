const User = require("../models/User");
const Otp = require("../models/Otp");
const Notification = require("../models/Notification");

const crypto = require("crypto");
const admin = require("../firebaseAdmin");

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
  <body style="margin:0; padding:0; background-color:#f3f4f6; font-family: Inter, sans-serif;">

    <table align="center" width="100%" cellpadding="0" cellspacing="0"
      style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08);">
      
      <tr>
        <td style="background:#2f3e5c; text-align:center; padding:20px;">
          <h1 style="color:#ffffff; margin:0; font-size:22px;">Artistic</h1>
        </td>
      </tr>

      <tr>
        <td style="padding:25px 30px 10px; text-align:center;">
          <h2 style="margin:0; color:#111827;">Verify Your Identity</h2>
        </td>
      </tr>

      <tr>
        <td style="padding:0 30px;">
          <hr style="border:none; border-top:1px solid #e5e7eb;">
        </td>
      </tr>

      <tr>
        <td style="padding:20px 30px;">
          <p style="color:#374151; font-size:14px;">Hi there,</p>

          <p style="color:#4b5563; font-size:14px; line-height:1.6;">
            Use the One-Time Password (OTP) below to complete your login/signup process.
          </p>

          <div style="text-align:center; margin:25px 0;">
            <span style="display:inline-block; background:#e5eaf2; padding:15px 25px; border-radius:6px; font-size:26px; font-weight:bold; letter-spacing:10px; color:#1f2937;">
              ${otp}
            </span>
          </div>
        </td>
      </tr>

      <tr>
        <td style="padding:0 30px;">
          <hr style="border:none; border-top:1px solid #e5e7eb;">
        </td>
      </tr>

      <tr>
        <td style="padding:15px 30px; font-size:13px; color:#6b7280;">
          <p>This OTP is valid for <strong>5 minutes</strong>.</p>
          <p>Do not share this code with anyone. If you did not request this, please ignore this email.</p>
        </td>
      </tr>

      <tr>
        <td style="background:#f3f4f6; text-align:center; padding:15px;">
          <p style="margin:0; font-size:12px; color:#9ca3af;">
            © 2026 Artistic. All rights reserved.
          </p>
        </td>
      </tr>

    </table>
  </body>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Brevo Error Response:", data);
      throw new Error("Email sending failed");
    }

    console.log("Brevo success:", data);

  } catch (error) {
    console.error("Brevo Error:", error);
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

    if (!user) {
      user = await User.create({
        email,
        fullName: name,
        profilePic: picture,
        provider: "google",
      });

      await Notification.create({
        userId: user._id,
        title: "Welcome to Artistic",
        message: "We’re excited to have you here!",
      });
    }

    res.json({
      message: "Google login successful",
      user,
    });

  } catch (error) {
    console.error("Google Auth Error:", error);
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
    console.error("SEND OTP ERROR:", err);
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

      user = await User.create({ email, fullName });

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
    }

    await Otp.deleteMany({ email });

    res.json({
      message: "Success",
      user,
    });

  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    res.status(500).json({ message: "Verification failed" });
  }
};