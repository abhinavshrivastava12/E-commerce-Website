// 📁 server/routes/auth.js - COMPLETE FIX
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const OTP = require("../models/OTP");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

// ✅ 1. Direct Registration Route
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("📝 Registration attempt:", { name, email });

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please fill all fields" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({ 
      name: name.trim(), 
      email: email.toLowerCase().trim(), 
      password: hashedPassword 
    });

    console.log("✅ User created:", user.email);

    // Send Welcome Email (Optional)
    try {
      const welcomeHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #9333ea;">Welcome to Abhi ShoppingZone! 🎉</h2>
          <p>Hi ${name},</p>
          <p>Your account has been successfully created. Start shopping now!</p>
          <br/>
          <p style="color: gray; font-size: 12px;">© All rights reserved by Abhinav Shrivastava</p>
        </div>
      `;
      await sendEmail(email, "Welcome to Abhi ShoppingZone", welcomeHtml);
      console.log("✅ Welcome email sent");
    } catch (emailErr) {
      console.error("⚠️ Email sending failed:", emailErr.message);
    }

    res.status(201).json({ 
      message: "Registration successful! Please login.",
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email 
      }
    });

  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ error: "Registration failed: " + error.message });
  }
});

// ✅ 2. Login Route - FIXED
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔐 Login attempt for:", email);

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(400).json({ error: "User not found" });
    }

    console.log("✅ User found:", user.email);

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Invalid password for:", email);
      return res.status(400).json({ error: "Invalid password" });
    }

    console.log("✅ Password verified");

    // Generate token
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );

    console.log("✅ Token generated for:", user.email);

    // Return user data with token
    res.status(200).json({
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email 
      }
    });

  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ error: "Login failed: " + error.message });
  }
});

// ✅ 3. Send OTP for Registration (Existing Code)
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    
    console.log("📧 Sending OTP to:", email);
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }
    
    const otp = crypto.randomInt(100000, 999999).toString();
    await OTP.create({ email, otp });

    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #9333ea;">Verify Your Email</h2>
        <p>Your OTP code is: <b style="font-size: 24px; color: #9333ea;">${otp}</b></p>
        <p>Valid for 10 minutes.</p>
        <br/>
        <p style="color: gray; font-size: 12px;">© Abhi ShoppingZone</p>
      </div>
    `;

    await sendEmail(email, "Your OTP - Abhi ShoppingZone", html);
    
    console.log("✅ OTP sent:", otp);
    
    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("❌ Send OTP Error:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// ✅ 4. Verify OTP Route (Existing Code)
router.post("/verify-otp-register", async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;
    
    console.log("🔍 Verifying OTP for:", email);
    
    const otpRecord = await OTP.findOne({ email, otp }).sort({ createdAt: -1 });
    
    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    await OTP.deleteMany({ email });

    console.log("✅ User registered via OTP:", user.email);

    res.status(201).json({
      message: "Registration successful",
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error("❌ OTP Register Error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// ✅ 5. Get Current User Profile
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("❌ Get Profile Error:", error);
    res.status(403).json({ error: "Invalid token" });
  }
});

module.exports = router;