// 📁 backend/routes/paymentRoutes.js
const express = require("express");
const router = express.Router();

// ✅ WhatsApp Redirect Payment
router.post("/create-order", (req, res) => {
  const { name, total } = req.body;

  const phoneNumber = "919696400628"; // 👈 Replace this with your actual WhatsApp number (with country code)

  const message = `Hi! I want to place an order on Abhi ShoppingZone.\nName: ${name}\nTotal: ₹${total}`;

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  res.json({ redirectUrl: whatsappLink });
});

module.exports = router;
