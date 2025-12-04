// 📁 server/routes/auth.js - WITH OTP
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const OTP = require("../models/OTP");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

// ✅ Send OTP for Registration
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Save OTP to database
    await OTP.create({ email, otp });

    // Send OTP via email
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #9333ea;">Verify Your Email</h2>
        <p>Your OTP for registration is:</p>
        <h1 style="background: linear-gradient(to right, #9333ea, #ec4899); 
                   color: white; padding: 20px; text-align: center; 
                   border-radius: 10px; font-size: 32px; letter-spacing: 5px;">
          ${otp}
        </h1>
        <p style="color: #666;">This OTP is valid for 10 minutes.</p>
        <p style="color: #666;">If you didn't request this, please ignore this email.</p>
      </div>
    `;

    await sendEmail(email, "Your OTP for Registration - Abhi ShoppingZone", html);

    res.json({ message: "OTP sent successfully to your email" });
  } catch (error) {
    console.error("❌ Send OTP Error:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// ✅ Verify OTP and Register
router.post("/verify-otp-register", async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    // Verify OTP
    const otpRecord = await OTP.findOne({ email, otp }).sort({ createdAt: -1 });
    
    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({ name, email, password: hashedPassword });

    // Delete OTP after successful registration
    await OTP.deleteMany({ email });

    // Send welcome email
    const welcomeHtml = `
      <h2>Welcome to Abhi ShoppingZone! 🎉</h2>
      <p>Hi ${name},</p>
      <p>Your account has been successfully created. Start shopping now!</p>
      <p>© All rights reserved by Abhinav Shrivastava</p>
    `;
    await sendEmail(email, "Welcome to Abhi ShoppingZone", welcomeHtml);

    res.status(201).json({
      message: "Registration successful",
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// ✅ Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;