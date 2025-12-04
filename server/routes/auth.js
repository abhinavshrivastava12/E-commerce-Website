// 📁 server/routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const OTP = require("../models/OTP");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

// ✅ 1. Direct Registration Route (Fixes 404 Error on Register Page)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please fill all fields" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({ 
      name, 
      email, 
      password: hashedPassword 
    });

    // Send Welcome Email (Optional)
    try {
        const welcomeHtml = `
        <h2>Welcome to Abhi ShoppingZone! 🎉</h2>
        <p>Hi ${name},</p>
        <p>Your account has been successfully created. Start shopping now!</p>
        `;
        await sendEmail(email, "Welcome to Abhi ShoppingZone", welcomeHtml);
    } catch (emailErr) {
        console.error("Email sending failed:", emailErr);
    }

    res.status(201).json({ 
        message: "Registration successful! Please login.",
        user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ error: "Registration failed server error" });
  }
});

// ✅ 2. Send OTP for Registration (Existing Code)
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }
    const otp = crypto.randomInt(100000, 999999).toString();
    await OTP.create({ email, otp });

    const html = `<div style="font-family: Arial, sans-serif;">
        <h2 style="color: #9333ea;">Verify Your Email</h2>
        <p>OTP: <b>${otp}</b></p>
        <p>Valid for 10 minutes.</p>
      </div>`;

    await sendEmail(email, "Your OTP - Abhi ShoppingZone", html);
    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("❌ Send OTP Error:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// ✅ 3. Verify OTP Route (Existing Code)
router.post("/verify-otp-register", async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;
    const otpRecord = await OTP.findOne({ email, otp }).sort({ createdAt: -1 });
    
    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    await OTP.deleteMany({ email });

    res.status(201).json({
      message: "Registration successful",
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error("❌ OTP Register Error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// ✅ 4. Login Route (Important for Token)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Create Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;