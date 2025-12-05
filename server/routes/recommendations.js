const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/recommendations/:productId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    
    // Find similar products based on category and price range
    const recommendations = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      price: {
        $gte: product.price * 0.7,
        $lte: product.price * 1.3
      },
      isActive: true
    }).limit(6);

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});