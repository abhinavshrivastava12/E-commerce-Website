// 📁 server/routes/sellerAuth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Seller = require("../models/Seller");
const router = express.Router();

// Register Seller
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, shopName, phone, gstNumber, address } = req.body;

    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const seller = await Seller.create({
      name,
      email,
      password: hashedPassword,
      shopName,
      phone,
      gstNumber,
      address
    });

    res.status(201).json({
      message: "Seller registered successfully. Awaiting admin verification.",
      seller: {
        id: seller._id,
        name: seller.name,
        email: seller.email,
        shopName: seller.shopName
      }
    });
  } catch (error) {
    console.error("❌ Seller Registration Error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login Seller
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(400).json({ error: "Seller not found" });
    }

    if (!seller.isActive) {
      return res.status(403).json({ error: "Account is deactivated" });
    }

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: seller._id, role: 'seller' },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      seller: {
        id: seller._id,
        name: seller.name,
        email: seller.email,
        shopName: seller.shopName,
        isVerified: seller.isVerified,
        role: seller.role
      }
    });
  } catch (error) {
    console.error("❌ Seller Login Error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Get Seller Profile
router.get("/profile", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const seller = await Seller.findById(decoded.id).select("-password");
    if (!seller) return res.status(404).json({ error: "Seller not found" });

    res.json(seller);
  } catch (error) {
    console.error("❌ Profile Error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

module.exports = router;