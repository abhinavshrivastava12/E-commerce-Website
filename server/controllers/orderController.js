// controllers/orderController.js
const sendEmail = require("../utils/sendEmail");

exports.placeOrder = async (req, res) => {
  try {
    const { cart, total, paymentMethod } = req.body;
    const user = req.user;

    const order = new Order({
      user: user._id,
      items: cart,
      total,
      paymentMethod,
    });

    await order.save();

    // ✅ Send Email
    await sendEmail({
      to: user.email,
      subject: "🧾 Your Order Confirmation - Abhi ShoppingZone",
      html: `
        <h2>Thank you for your purchase, ${user.name}!</h2>
        <p><strong>Total:</strong> ₹${total}</p>
        <p><strong>Items:</strong> ${cart.map(item => `<li>${item.name} × ${item.quantity}</li>`).join("")}</p>
        <p>Your order will be delivered soon. Track your order in your profile.</p>
        <br>
        <p>🙏 Thank you for shopping at Abhi ShoppingZone</p>
      `,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("❌ Order Error:", err);
    res.status(500).json({ error: "Failed to place order" });
  }
};
