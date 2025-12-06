// 📁 server/routes/orders.js - COMPLETE FIX
const express = require("express");
const router = express.Router();
const Order = require("../models/orders");
const sendEmail = require("../utils/sendEmail");
const requireAuth = require("../middleware/auth");

// ✅ Place an order (Protected)
router.post("/", requireAuth, async (req, res) => {
  try {
    const { cart, total, paymentMethod } = req.body;
    const userId = req.user.id;

    console.log("📦 Creating order for user:", userId);

    if (!cart || !total || !paymentMethod) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newOrder = new Order({
      userId,
      cart,
      total,
      paymentMethod,
    });

    await newOrder.save();
    console.log("✅ Order saved:", newOrder._id);

    // Send confirmation email
    try {
      const user = req.user;
      const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px;">
            <h2 style="color: #9333ea; text-align: center;">🎉 Order Confirmed!</h2>
            <p>Hi <strong>${user.name}</strong>,</p>
            <p>Thank you for your order!</p>
            
            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Order ID:</strong> ${newOrder._id}</p>
              <p><strong>Total Amount:</strong> ₹${total}</p>
              <p><strong>Payment Method:</strong> ${paymentMethod}</p>
              <p><strong>Order Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
            </div>

            <h3 style="color: #333;">🛒 Order Items:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              ${cart.map(item => `
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 10px;">${item.name}</td>
                  <td style="padding: 10px; text-align: center;">x${item.quantity}</td>
                  <td style="padding: 10px; text-align: right; font-weight: bold;">₹${item.price * item.quantity}</td>
                </tr>
              `).join('')}
            </table>

            <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f0fdf4; border-radius: 8px;">
              <p style="color: #16a34a; margin: 0;">✓ We'll notify you once your order is shipped!</p>
            </div>

            <p style="text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
              © Abhi ShoppingZone - All rights reserved by Abhinav Shrivastava
            </p>
          </div>
        </div>
      `;

      await sendEmail(user.email, "🧾 Order Confirmation - Abhi ShoppingZone", html);
      console.log("✅ Confirmation email sent");
    } catch (emailErr) {
      console.error("⚠️ Email error:", emailErr.message);
    }

    res.status(201).json({ 
      success: true,
      message: "Order placed successfully", 
      orderId: newOrder._id,
      order: newOrder
    });
  } catch (err) {
    console.error("❌ Order Error:", err);
    res.status(500).json({ error: "Failed to place order: " + err.message });
  }
});

// ✅ Get User's Orders (Protected)
router.get("/my", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("📋 Fetching orders for user:", userId);

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    console.log(`✅ Found ${orders.length} orders`);

    res.json(orders);
  } catch (err) {
    console.error("❌ Fetch Orders Error:", err);
    res.status(500).json({ error: "Failed to fetch orders: " + err.message });
  }
});

// ✅ Get Single Order Details (Protected)
router.get("/:orderId", requireAuth, async (req, res) => {
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

// ✅ Cancel Order (Protected)
router.put("/:orderId/cancel", requireAuth, async (req, res) => {
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