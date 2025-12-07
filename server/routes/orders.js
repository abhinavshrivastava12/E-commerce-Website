// 📁 server/routes/orders.js - COMPLETE FIX
const express = require("express");
const router = express.Router();
const Order = require("../models/orders");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");

// ✅ Auth Middleware
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = {
      id: user._id,
      name: user.name,
      email: user.email
    };

    console.log("✅ User authenticated:", req.user.email);
    next();
  } catch (error) {
    console.error("❌ Auth Error:", error);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

// ✅ Place Order - FIXED WITH PROPER ERROR HANDLING
router.post("/", authenticateUser, async (req, res) => {
  try {
    const { cart, total, paymentMethod } = req.body;
    const userId = req.user.id;

    console.log("📦 Creating order for user:", req.user.email);
    console.log("📦 Cart items:", cart?.length);
    console.log("📦 Total:", total);
    console.log("📦 Payment:", paymentMethod);

    // Validation
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      console.log("❌ Validation failed: Empty cart");
      return res.status(400).json({ error: "Cart is empty or invalid" });
    }

    if (!total || total <= 0) {
      console.log("❌ Validation failed: Invalid total");
      return res.status(400).json({ error: "Invalid total amount" });
    }

    if (!paymentMethod) {
      console.log("❌ Validation failed: No payment method");
      return res.status(400).json({ error: "Payment method is required" });
    }

    // Create order
    const newOrder = new Order({
      userId,
      cart,
      total,
      paymentMethod,
      status: "pending",
      paymentStatus: "pending"
    });

    await newOrder.save();
    console.log("✅ Order saved:", newOrder._id);

    // Send email in background (don't wait for it)
    sendEmail(req.user.email, "🧾 Order Confirmation", `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #9333ea;">🎉 Order Confirmed!</h2>
        <p>Hi <strong>${req.user.name}</strong>,</p>
        <p>Your order has been placed successfully!</p>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Order ID:</strong> ${newOrder._id}</p>
          <p><strong>Total:</strong> ₹${total}</p>
          <p><strong>Payment:</strong> ${paymentMethod}</p>
        </div>
        <h3>📦 Items:</h3>
        <ul>
          ${cart.map(item => `<li>${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}</li>`).join('')}
        </ul>
        <p style="color: gray; font-size: 12px;">© Abhi ShoppingZone</p>
      </div>
    `).catch(err => console.error("Email error:", err));

    // ✅ IMPORTANT: Send response immediately
    res.status(201).json({ 
      success: true,
      message: "Order placed successfully", 
      orderId: newOrder._id,
      order: {
        _id: newOrder._id,
        userId: newOrder.userId,
        cart: newOrder.cart,
        total: newOrder.total,
        paymentMethod: newOrder.paymentMethod,
        status: newOrder.status,
        createdAt: newOrder.createdAt
      }
    });

    console.log("✅ Response sent to client");

  } catch (err) {
    console.error("❌ Order Creation Error:", err);
    console.error("Error Stack:", err.stack);
    
    // ✅ IMPORTANT: Always send a response
    res.status(500).json({ 
      error: "Failed to place order",
      details: err.message 
    });
  }
});

// ✅ Get User's Orders
router.get("/my", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("📋 Fetching orders for user:", req.user.email);

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    console.log(`✅ Found ${orders.length} orders`);

    res.json(orders);
  } catch (err) {
    console.error("❌ Fetch Orders Error:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// ✅ Get Single Order
router.get("/:orderId", authenticateUser, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      userId: req.user.id
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error("❌ Get Order Error:", err);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

// ✅ Cancel Order
router.put("/:orderId/cancel", authenticateUser, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      userId: req.user.id
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.status = "cancelled";
    await order.save();

    res.json({ 
      success: true,
      message: "Order cancelled successfully",
      order 
    });
  } catch (err) {
    console.error("❌ Cancel Order Error:", err);
    res.status(500).json({ error: "Failed to cancel order" });
  }
});

module.exports = router;