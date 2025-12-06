// 📁 server/routes/products.js - GET ALL PRODUCTS (INCLUDING SELLER PRODUCTS)
// Add this to server.js: app.use('/api/products', require('./routes/products'));
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// ✅ Get All Active Products (Public Route)
router.get("/all", async (req, res) => {
  try {
    console.log("📦 Fetching all products...");

    const products = await Product.find({ 
      isActive: true,
      stock: { $gt: 0 } // Only show products with stock
    })
    .sort({ createdAt: -1 })
    .lean();

    console.log(`✅ Found ${products.length} products`);

    // Transform MongoDB products to match frontend format
    const transformedProducts = products.map(product => ({
      id: product._id,
      _id: product._id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      category: product.category,
      image: product.image,
      rating: product.rating || 4.5,
      discount: product.discount || 0,
      stock: product.stock,
      trending: product.trending || false,
      featured: product.featured || false,
      bestSeller: product.bestSeller || false,
      description: product.description || "",
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      isActive: product.isActive,
      views: product.views || 0,
      sales: product.sales || 0
    }));

    res.json(transformedProducts);
  } catch (error) {
    console.error("❌ Fetch Products Error:", error);
    res.status(500).json({ error: "Failed to fetch products: " + error.message });
  }
});

// ✅ Get Product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Increment views
    product.views = (product.views || 0) + 1;
    await product.save();

    const transformedProduct = {
      id: product._id,
      _id: product._id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      category: product.category,
      image: product.image,
      rating: product.rating || 4.5,
      discount: product.discount,
      stock: product.stock,
      description: product.description,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      views: product.views,
      sales: product.sales
    };

    res.json(transformedProduct);
  } catch (error) {
    console.error("❌ Get Product Error:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// ✅ Search Products
router.get("/search/:query", async (req, res) => {
  try {
    const { query } = req.params;
    
    const products = await Product.find({
      isActive: true,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    }).limit(20);

    res.json(products);
  } catch (error) {
    console.error("❌ Search Error:", error);
    res.status(500).json({ error: "Search failed" });
  }
});

module.exports = router;