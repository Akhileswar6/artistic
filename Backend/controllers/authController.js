const User = require("../models/User");
const Otp = require("../models/Otp");
const Notification = require("../models/Notification");

const crypto = require("crypto");
const nodemailer = require("nodemailer");
const admin = require("../firebaseAdmin");




exports.googleAuth = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(400).json({ message: "No token provided " });
    }

    const decoded = await admin.auth().verifyIdToken(token);
    const { email, name, picture } = decoded;

    let user = await User.findOne({ email });

    // Create user if not exists
    if (!user) {
      user = await User.create({
        email,
        fullName: name,
        profilePic: picture,
        provider: "google"
      });

      // CREATE NOTIFICATION ONLY FOR NEW USER
      await Notification.create({
        userId: user._id,
        title: "Welcome to Artistic",
        message: "We’re excited to have you here!",
      });
    }

    res.json({
      message: "Google login successful ",
      user
    });

  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ message: "Invalid Google token " });
  }
};



const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate OTP
const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};




// SEND OTP (for both login & signup)
exports.sendOtp = async (req, res) => {
  try {
    const { email, type } = req.body;

const user = await User.findOne({ email });

//  HANDLE SIGNUP
if (type === "signup" && user) {
  return res.status(400).json({
    message: "Account already exists. Sign in instead "
  });
}


//  HANDLE LOGIN
if (type === "login" && !user) {
  return res.status(400).json({
    message: "No account found. Please sign up first "
  });
}

    const otp = generateOtp();

    // Delete old OTPs
    await Otp.deleteMany({ email });

    // Save new OTP
    await Otp.create({
      email,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000
    });

    // Send email
 await transporter.sendMail({
  from: `"Artistic" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: `Artistic Verification Code : ${otp}`,
  html: `
  <body style="margin:0; padding:0; background-color:#f3f4f6; font-family: Inter, sans-serif;">

    <table align="center" width="100%" cellpadding="0" cellspacing="0"
      style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08);">
      
      <!-- Header -->
      <tr>
        <td style="background:#2f3e5c; text-align:center; padding:20px;">
          <h1 style="color:#ffffff; margin:0; font-size:22px;">Artistic</h1>
        </td>
      </tr>

      <!-- Title -->
      <tr>
        <td style="padding:25px 30px 10px; text-align:center;">
          <h2 style="margin:0; color:#111827;">Verify Your Identity</h2>
        </td>
      </tr>

      <!-- Divider -->
      <tr>
        <td style="padding:0 30px;">
          <hr style="border:none; border-top:1px solid #e5e7eb;">
        </td>
      </tr>

      <!-- Content -->
      <tr>
        <td style="padding:20px 30px;">
          
          <p style="color:#374151; font-size:14px;">Hi there,</p>

          <p style="color:#4b5563; font-size:14px; line-height:1.6;">
            Use the One-Time Password (OTP) below to complete your login/signup process.
          </p>

          <!-- OTP Box -->
          <div style="text-align:center; margin:25px 0;">
            <span style="display:inline-block; background:#e5eaf2; padding:15px 25px; border-radius:6px; font-size:26px; font-weight:bold; letter-spacing:10px; color:#1f2937;">
              ${otp}
            </span>
          </div>

        </td>
      </tr>

      <!-- Divider -->
      <tr>
        <td style="padding:0 30px;">
          <hr style="border:none; border-top:1px solid #e5e7eb;">
        </td>
      </tr>

      <!-- Info -->
      <tr>
        <td style="padding:15px 30px; font-size:13px; color:#6b7280;">
          
          <p> This OTP is valid for <strong>5 minutes</strong>.</p>

          <p> Do not share this code with anyone. If you did not request this, please ignore this email.</p>

        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#f3f4f6; text-align:center; padding:15px;">
          <p style="margin:0; font-size:12px; color:#9ca3af;">
            © 2026 Artistic. All rights reserved.
          </p>
        </td>
      </tr>

    </table>

  </body>
  `
});

    res.json({ message: "OTP sent " });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to send OTP " });
  }
};



exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp, fullName, type } = req.body;

    const record = await Otp.findOne({ email }).sort({ createdAt: -1 });

    if (!record) {
      return res.status(400).json({ message: "No OTP found " });
    }

    if (record.expiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP expired " });
    }

    if (record.otp !== otp.trim()) {
      return res.status(400).json({ message: "Invalid OTP " });
    }

    let user = await User.findOne({ email });

    //  HANDLE SIGNUP
    if (type === "signup") {
      if (user) {
        return res.status(400).json({
          message: "Account already exists. Please login "
        });
      }

      user = await User.create({
        email,
        fullName
      });

      await Notification.create({
        userId: user._id,
        title: "Welcome to Artistic 🎉",
        message: "We’re excited to have you here!",
      });
    }

    //  HANDLE LOGIN
    if (type === "login") {
      if (!user) {
        return res.status(400).json({
          message: "No account found. Please signup "
        });
      }
    }

    await Otp.deleteMany({ email });

    res.json({
      message: "Success ",
      user
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Verification failed " });
  }
};