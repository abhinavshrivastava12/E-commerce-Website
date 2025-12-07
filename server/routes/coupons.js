// 📁 server/routes/coupons.js - FIXED WITH SAMPLE COUPONS
const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');

// ✅ SAMPLE COUPONS (Will be auto-created if not exist)
const sampleCoupons = [
  {
    code: 'SAVE10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 0,
    maxDiscount: 500,
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    usageLimit: 1000,
    description: 'Get 10% off on all orders'
  },
  {
    code: 'FIRST20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 500,
    maxDiscount: 1000,
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    usageLimit: 500,
    description: 'Get 20% off on orders above ₹500'
  },
  {
    code: 'FLAT100',
    discountType: 'fixed',
    discountValue: 100,
    minOrderValue: 1000,
    maxDiscount: null,
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    usageLimit: 1000,
    description: 'Get ₹100 off on orders above ₹1000'
  }
];

// ✅ Initialize Sample Coupons (Run once on server start)
const initializeCoupons = async () => {
  try {
    for (const couponData of sampleCoupons) {
      const exists = await Coupon.findOne({ code: couponData.code });
      if (!exists) {
        await Coupon.create(couponData);
        console.log(`✅ Created coupon: ${couponData.code}`);
      }
    }
  } catch (error) {
    console.error('❌ Coupon initialization error:', error);
  }
};

// Run initialization
initializeCoupons();

// ✅ Validate Coupon - FIXED
router.post('/validate', async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    console.log('🎫 Validating coupon:', code, 'for cart total:', cartTotal);

    if (!code || !cartTotal) {
      return res.status(400).json({ error: 'Coupon code and cart total are required' });
    }

    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase().trim(),
      isActive: true,
      expiryDate: { $gte: new Date() }
    });

    console.log('🔍 Coupon found:', coupon ? coupon.code : 'Not found');

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

    console.log('✅ Discount calculated:', discount);

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