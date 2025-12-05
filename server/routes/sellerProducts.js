// 📁 server/routes/sellerProducts.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Seller = require("../models/Seller");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "shoppingzone-products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }]
  }
});

const upload = multer({ storage });

// Middleware
const verifySeller = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'seller') {
      return res.status(403).json({ error: "Access denied" });
    }

    req.sellerId = decoded.id;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid token" });
  }
};

// Add Product
router.post("/add", verifySeller, upload.single("image"), async (req, res) => {
  try {
    const { name, price, originalPrice, category, description, stock, discount } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Product image is required" });
    }

    const seller = await Seller.findById(req.sellerId);
    if (!seller.isVerified) {
      return res.status(403).json({ error: "Seller not verified yet" });
    }

    const product = await Product.create({
      name,
      price,
      originalPrice: originalPrice || price,
      category,
      description,
      image: req.file.path,
      stock,
      discount: discount || 0,
      sellerId: req.sellerId,
      sellerName: seller.shopName
    });

    await Seller.findByIdAndUpdate(req.sellerId, { $inc: { totalProducts: 1 } });

    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    console.error("❌ Add Product Error:", error);
    res.status(500).json({ error: "Failed to add product" });
  }
});

// Get Seller's Products
router.get("/my-products", verifySeller, async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.sellerId }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Delete Product
router.delete("/delete/:id", verifySeller, async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, sellerId: req.sellerId });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await Product.findByIdAndDelete(req.params.id);
    await Seller.findByIdAndUpdate(req.sellerId, { $inc: { totalProducts: -1 } });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// Dashboard Stats
router.get("/dashboard", verifySeller, async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.sellerId });
    
    const stats = {
      totalProducts: products.length,
      totalViews: products.reduce((sum, p) => sum + p.views, 0),
      totalSales: products.reduce((sum, p) => sum + p.sales, 0),
      totalRevenue: products.reduce((sum, p) => sum + (p.price * p.sales), 0),
      activeProducts: products.filter(p => p.isActive).length,
      outOfStock: products.filter(p => p.stock === 0).length
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

module.exports = router;