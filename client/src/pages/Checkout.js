// 📁 client/src/pages/Checkout.js - FIXED WITH ORDER UPDATE & COUPON
import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping - discount;

  // ✅ Apply Coupon
  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.warning("⚠️ Please enter a coupon code");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/coupons/validate", {
        code: couponCode,
        cartTotal: subtotal
      });

      setDiscount(response.data.discount);
      setAppliedCoupon(response.data.couponId);
      toast.success("✅ Coupon applied successfully!");
    } catch (error) {
      console.error("❌ Coupon error:", error);
      toast.error(error.response?.data?.error || "Invalid coupon code");
      setDiscount(0);
      setAppliedCoupon(null);
    }
  };

  // ✅ Remove Coupon
  const removeCoupon = () => {
    setDiscount(0);
    setAppliedCoupon(null);
    setCouponCode("");
    toast.info("Coupon removed");
  };

  // ✅ Place Order via WhatsApp
  const handleWhatsAppOrder = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    if (!user) {
      toast.error("Please login to place order");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      // 1. Create order in database
      const orderData = {
        cart: cart.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total: total,
        paymentMethod: "WhatsApp"
      };

      const response = await axios.post(
        "http://localhost:5000/api/orders",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      console.log("✅ Order created:", response.data);

      // 2. Mark coupon as used if applied
      if (appliedCoupon) {
        await axios.post("http://localhost:5000/api/coupons/use", {
          couponId: appliedCoupon
        });
      }

      // 3. Create WhatsApp message
      const message = `Hello, I want to place an order from Abhi ShoppingZone.

Order ID: ${response.data.orderId}
Customer: ${user.name}
Email: ${user.email}

📦 Items:
${cart.map(item => `• ${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}`).join('\n')}

💰 Payment Summary:
Subtotal: ₹${subtotal}
Shipping: ${shipping === 0 ? 'FREE' : '₹' + shipping}
${discount > 0 ? `Discount: -₹${discount}` : ''}
━━━━━━━━━━━━━━
Total: ₹${total}

Please confirm my order. Thank you!`;

      const encodedMessage = encodeURIComponent(message);
      const phoneNumber = "919696400628";

      // 4. Clear cart
      clearCart();

      // 5. Show success message
      toast.success("✅ Order placed! Redirecting to WhatsApp...");

      // 6. Open WhatsApp after short delay
      setTimeout(() => {
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
        navigate("/orders");
      }, 1500);

    } catch (error) {
      console.error("❌ Order error:", error);
      toast.error(error.response?.data?.error || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className="text-9xl mb-6">🛒</div>
          <h1 className={`text-4xl font-black mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>Your cart is empty</h1>
          <button
            onClick={() => navigate('/')}
            className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-all"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'
    }`}>
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`fixed top-24 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${
          darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-900 text-yellow-400'
        }`}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className={`text-4xl font-black mb-8 ${
          darkMode 
            ? 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'
            : 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'
        }`}>
          🧾 Checkout Summary
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl p-6 shadow-xl ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg mb-2 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>{item.name}</h3>
                    <div className="flex justify-between items-center">
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Quantity: <span className="font-bold">{item.quantity}</span>
                      </p>
                      <p className={`text-xl font-black ${
                        darkMode ? 'text-purple-400' : 'text-green-600'
                      }`}>
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className={`rounded-2xl p-8 shadow-2xl sticky top-24 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h2 className={`text-2xl font-black mb-6 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>Order Summary</h2>

              {/* Price Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Subtotal
                  </span>
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    ₹{subtotal}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Shipping
                  </span>
                  <span className={`font-bold ${
                    shipping === 0 ? 'text-green-500' : darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span>Discount</span>
                    <span className="font-bold">-₹{discount}</span>
                  </div>
                )}
                <div className={`border-t pt-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex justify-between items-center">
                    <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Total
                    </span>
                    <span className={`text-3xl font-black ${
                      darkMode ? 'text-purple-400' : 'text-purple-600'
                    }`}>
                      ₹{total}
                    </span>
                  </div>
                </div>
              </div>

              {/* Coupon Code */}
              <div className="mb-6">
                <label className={`block text-sm font-bold mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Have a coupon?
                </label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-100 border-2 border-green-500 rounded-lg p-3">
                    <span className="text-green-700 font-bold">✓ Coupon Applied</span>
                    <button
                      onClick={removeCoupon}
                      className="text-red-600 hover:text-red-700 font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      className={`flex-1 px-4 py-3 rounded-lg border-2 focus:outline-none transition-all ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-purple-600'
                      }`}
                    />
                    <button
                      onClick={applyCoupon}
                      className={`px-6 py-3 rounded-lg font-bold transition-all ${
                        darkMode
                          ? 'bg-gray-700 hover:bg-gray-600 text-white'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                      }`}
                    >
                      Apply
                    </button>
                  </div>
                )}
                <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Try: SAVE10 or FIRST20
                </p>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleWhatsAppOrder}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-black text-lg hover:from-green-500 hover:to-emerald-500 transition-all duration-300 transform hover:scale-105 shadow-xl mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '⏳ Processing...' : '📲 Place Order via WhatsApp'}
              </button>

              <button
                onClick={() => navigate('/cart')}
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}
              >
                ← Back to Cart
              </button>

              {/* Trust Badges */}
              <div className={`mt-6 pt-6 border-t space-y-3 ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Secure Payment
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Order Tracking Available
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    24/7 Customer Support
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;