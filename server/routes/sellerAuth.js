// 📁 server/routes/sellerAuth.js - COMPLETE FIX WITH AUTO VERIFICATION
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Seller = require("../models/Seller");
const sendEmail = require("../utils/sendEmail");
const router = express.Router();

// ✅ Register Seller - AUTO VERIFY
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, shopName, phone, gstNumber } = req.body;

    console.log("📝 Seller Registration:", { name, email, shopName });

    // Validation
    if (!name || !email || !password || !shopName || !phone) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check existing seller
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({ error: "Email already registered as seller" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create seller with AUTO VERIFICATION
    const seller = await Seller.create({
      name,
      email,
      password: hashedPassword,
      shopName,
      phone,
      gstNumber: gstNumber || "",
      isVerified: true,  // ✅ AUTO VERIFY
      isActive: true
    });

    console.log("✅ Seller created and verified:", seller.email);

    // Send welcome email
    try {
      const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #9333ea;">Welcome to Abhi ShoppingZone Seller Panel! 🏪</h2>
          <p>Hi ${name},</p>
          <p>Your seller account has been created and <strong>verified</strong> successfully!</p>
          <p><strong>Shop Name:</strong> ${shopName}</p>
          <p>You can now login and start adding products.</p>
          <br/>
          <p style="color: gray; font-size: 12px;">© All rights reserved by Abhinav Shrivastava</p>
        </div>
      `;
      await sendEmail(email, "Seller Account Created - Abhi ShoppingZone", html);
    } catch (emailErr) {
      console.error("⚠️ Email sending failed:", emailErr);
    }

    res.status(201).json({
      success: true,
      message: "Seller registered successfully! You can now login.",
      seller: {
        id: seller._id,
        name: seller.name,
        email: seller.email,
        shopName: seller.shopName,
        isVerified: seller.isVerified
      }
    });
  } catch (error) {
    console.error("❌ Seller Registration Error:", error);
    res.status(500).json({ error: "Registration failed: " + error.message });
  }
});

// ✅ Login Seller
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔍 Seller login attempt for:", email);

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find seller
    const seller = await Seller.findOne({ email });
    if (!seller) {
      console.log("❌ Seller not found:", email);
      return res.status(400).json({ error: "Seller not found. Please register first." });
    }

    console.log("✅ Seller found:", seller.email);
    console.log("✅ Verified status:", seller.isVerified);

    // Check if active
    if (!seller.isActive) {
      return res.status(403).json({ error: "Your account has been deactivated. Contact support." });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      console.log("❌ Invalid password for:", email);
      return res.status(400).json({ error: "Invalid password" });
    }

    console.log("✅ Password verified for:", email);

    // Generate token
    const token = jwt.sign(
      { id: seller._id, role: 'seller' },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("✅ Token generated for seller:", seller.email);

    // Return response
    res.json({
      success: true,
      token,
      seller: {
        id: seller._id,
        name: seller.name,
        email: seller.email,
        shopName: seller.shopName,
        phone: seller.phone,
        isVerified: seller.isVerified,
        isActive: seller.isActive,
        role: 'seller'
      }
    });
  } catch (error) {
    console.error("❌ Seller Login Error:", error);
    res.status(500).json({ error: "Login failed: " + error.message });
  }
});

// ✅ Get Seller Profile
router.get("/profile", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'seller') {
      return res.status(403).json({ error: "Access denied" });
    }

    const seller = await Seller.findById(decoded.id).select("-password");
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    res.json(seller);
  } catch (error) {
    console.error("❌ Profile Error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// ✅ ADMIN: Verify Seller (for future use)
router.put("/admin/verify/:sellerId", async (req, res) => {
  try {
    const seller = await Seller.findByIdAndUpdate(
      req.params.sellerId,
      { isVerified: true },
      { new: true }
    );

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    res.json({ 
      success: true,
      message: "Seller verified successfully",
      seller 
    });
  } catch (error) {
    console.error("❌ Verify Error:", error);
    res.status(500).json({ error: "Failed to verify seller" });
  }
});

module.exports = router;