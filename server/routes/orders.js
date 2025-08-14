// 📁 server/routes/order.js
const express = require("express");
const router = express.Router();
const Order = require("../models/orders");
const sendEmail = require("../utils/sendEmail");
const requireAuth = require("../middleware/auth"); // 🔐 Add this

// ✅ Place an order
router.post("/", async (req, res) => {
  try {
    const { userId, cart, total, paymentMethod, email } = req.body;

    if (!userId || !cart || !total || !paymentMethod || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newOrder = new Order({
      userId,
      cart,
      total,
      paymentMethod,
    });

    await newOrder.save();

    const html = `
      <h2>Thank you for your order!</h2>
      <p><strong>Order ID:</strong> ${newOrder._id}</p>
      <p><strong>Total:</strong> ₹${total}</p>
      <p><strong>Payment Method:</strong> ${paymentMethod}</p>
      <h3>🛒 Items:</h3>
      <ul>
        ${cart.map(
          (item) =>
            `<li>${item.name} × ${item.quantity} = ₹${
              item.price * item.quantity
            }</li>`
        ).join("")}
      </ul>
      <p>We’ll notify you once it’s shipped.</p>
    `;

    await sendEmail(email, "🧾 Order Confirmation - Abhi ShoppingZone", html);

    res.status(201).json({ message: "Order placed & email sent", orderId: newOrder._id });
  } catch (err) {
    console.error("❌ Error placing order:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Secure orders route
router.get("/my", requireAuth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("❌ Error fetching orders:", err.message);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

module.exports = router;
