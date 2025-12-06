// 📁 server/routes/sellerProducts.js - FIXED WITHOUT VERIFICATION CHECK
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

// ✅ Seller Authentication Middleware
const verifySeller = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'seller') {
      return res.status(403).json({ error: "Access denied: Not a seller" });
    }

    const seller = await Seller.findById(decoded.id);
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    console.log("✅ Seller authenticated:", seller.email);

    req.sellerId = decoded.id;
    req.seller = seller;
    next();
  } catch (error) {
    console.error("❌ Auth Error:", error);
    res.status(403).json({ error: "Invalid token: " + error.message });
  }
};

// ✅ Add Product - FIXED (Removed verification check)
router.post("/add", verifySeller, upload.single("image"), async (req, res) => {
  try {
    const { name, price, originalPrice, category, description, stock, discount } = req.body;

    console.log("📦 Adding product:", { name, category, seller: req.seller.shopName });

    // Validation
    if (!name || !price || !category || !stock) {
      return res.status(400).json({ error: "Required fields: name, price, category, stock" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Product image is required" });
    }

    // ✅ REMOVED VERIFICATION CHECK - All sellers can add products
    console.log("✅ Seller verification bypassed (auto-verified)");

    const product = await Product.create({
      name: name.trim(),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Number(price),
      category: category.trim(),
      description: description?.trim() || "",
      image: req.file.path,
      stock: Number(stock),
      discount: discount ? Number(discount) : 0,
      sellerId: req.sellerId,
      sellerName: req.seller.shopName,
      isActive: true,
      views: 0,
      sales: 0
    });

    // Update seller stats
    await Seller.findByIdAndUpdate(req.sellerId, { 
      $inc: { totalProducts: 1 } 
    });

    console.log("✅ Product added successfully:", product._id);
    console.log("✅ Product details:", {
      name: product.name,
      price: product.price,
      stock: product.stock,
      image: product.image
    });

    res.status(201).json({ 
      success: true,
      message: "Product added successfully", 
      product 
    });
  } catch (error) {
    console.error("❌ Add Product Error:", error);
    res.status(500).json({ error: "Failed to add product: " + error.message });
  }
});

// ✅ Get Seller's Products
router.get("/my-products", verifySeller, async (req, res) => {
  try {
    console.log("📋 Fetching products for seller:", req.sellerId);

    const products = await Product.find({ sellerId: req.sellerId })
      .sort({ createdAt: -1 })
      .lean();

    console.log(`✅ Found ${products.length} products`);

    res.json(products);
  } catch (error) {
    console.error("❌ Fetch Products Error:", error);
    res.status(500).json({ error: "Failed to fetch products: " + error.message });
  }
});

// ✅ Update Product
router.put("/update/:id", verifySeller, upload.single("image"), async (req, res) => {
  try {
    const { name, price, originalPrice, category, description, stock, discount } = req.body;

    console.log("✏️ Updating product:", req.params.id);

    const product = await Product.findOne({ 
      _id: req.params.id, 
      sellerId: req.sellerId 
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Update fields
    if (name) product.name = name.trim();
    if (price) product.price = Number(price);
    if (originalPrice) product.originalPrice = Number(originalPrice);
    if (category) product.category = category.trim();
    if (description) product.description = description.trim();
    if (stock !== undefined) product.stock = Number(stock);
    if (discount !== undefined) product.discount = Number(discount);
    
    // Update image if new one provided
    if (req.file) {
      product.image = req.file.path;
    }

    await product.save();
    console.log("✅ Product updated");

    res.json({ 
      success: true,
      message: "Product updated successfully", 
      product 
    });
  } catch (error) {
    console.error("❌ Update Product Error:", error);
    res.status(500).json({ error: "Failed to update product: " + error.message });
  }
});

// ✅ Delete Product
router.delete("/delete/:id", verifySeller, async (req, res) => {
  try {
    console.log("🗑️ Deleting product:", req.params.id);

    const product = await Product.findOne({ 
      _id: req.params.id, 
      sellerId: req.sellerId 
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found or unauthorized" });
    }

    await Product.findByIdAndDelete(req.params.id);

    // Update seller stats
    await Seller.findByIdAndUpdate(req.sellerId, { 
      $inc: { totalProducts: -1 } 
    });

    console.log("✅ Product deleted");

    res.json({ 
      success: true,
      message: "Product deleted successfully" 
    });
  } catch (error) {
    console.error("❌ Delete Product Error:", error);
    res.status(500).json({ error: "Failed to delete product: " + error.message });
  }
});

// ✅ Dashboard Stats
router.get("/dashboard", verifySeller, async (req, res) => {
  try {
    console.log("📊 Fetching dashboard stats for:", req.sellerId);

    const products = await Product.find({ sellerId: req.sellerId });
    
    const stats = {
      totalProducts: products.length,
      totalViews: products.reduce((sum, p) => sum + (p.views || 0), 0),
      totalSales: products.reduce((sum, p) => sum + (p.sales || 0), 0),
      totalRevenue: products.reduce((sum, p) => sum + (p.price * (p.sales || 0)), 0),
      activeProducts: products.filter(p => p.isActive && p.stock > 0).length,
      outOfStock: products.filter(p => p.stock === 0).length
    };

    console.log("✅ Stats calculated:", stats);

    res.json(stats);
  } catch (error) {
    console.error("❌ Dashboard Error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data: " + error.message });
  }
});

// ✅ Toggle Product Active Status
router.put("/toggle-status/:id", verifySeller, async (req, res) => {
  try {
    console.log("🔄 Toggling status for product:", req.params.id);

    const product = await Product.findOne({ 
      _id: req.params.id, 
      sellerId: req.sellerId 
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    product.isActive = !product.isActive;
    await product.save();

    console.log(`✅ Product ${product.isActive ? 'activated' : 'deactivated'}`);

    res.json({ 
      success: true,
      message: `Product ${product.isActive ? 'activated' : 'deactivated'}`, 
      product 
    });
  } catch (error) {
    console.error("❌ Toggle Status Error:", error);
    res.status(500).json({ error: "Failed to update status" });
  }
});

module.exports = router;