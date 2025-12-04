// 📁 server/routes/coupons.js
const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');

// ✅ Validate Coupon
router.post('/validate', async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(),
      isActive: true,
      expiryDate: { $gte: new Date() }
    });

    if (!coupon) {
      return res.status(404).json({ error: "Invalid or expired coupon code" });
    }

    // Check minimum order value
    if (cartTotal < coupon.minOrderValue) {
      return res.status(400).json({ 
        error: `Minimum order value of ₹${coupon.minOrderValue} required` 
      });
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ error: "Coupon usage limit reached" });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (cartTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    res.json({
      valid: true,
      discount: Math.round(discount),
      couponId: coupon._id,
      description: coupon.description
    });
  } catch (error) {
    console.error("❌ Coupon Validation Error:", error);
    res.status(500).json({ error: "Failed to validate coupon" });
  }
});

// ✅ Mark Coupon as Used
router.post('/use', async (req, res) => {
  try {
    const { couponId } = req.body;
    
    await Coupon.findByIdAndUpdate(couponId, { 
      $inc: { usedCount: 1 } 
    });

    res.json({ message: "Coupon applied successfully" });
  } catch (error) {
    console.error("❌ Coupon Use Error:", error);
    res.status(500).json({ error: "Failed to apply coupon" });
  }
});

// ✅ Get All Active Coupons
router.get('/active', async (req, res) => {
  try {
    const coupons = await Coupon.find({
      isActive: true,
      expiryDate: { $gte: new Date() }
    }).select('-usedCount');

    res.json(coupons);
  } catch (error) {
    console.error("❌ Get Coupons Error:", error);
    res.status(500).json({ error: "Failed to fetch coupons" });
  }
});

module.exports = router;