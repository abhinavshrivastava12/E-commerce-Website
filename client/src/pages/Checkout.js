// 📁 client/src/pages/Checkout.js - COMPLETE FIX
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
  const [selectedPayment, setSelectedPayment] = useState("");

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping - discount;

  const paymentMethods = [
    { id: 'razorpay', name: '💳 Razorpay', description: 'Card/UPI/NetBanking' },
    { id: 'cod', name: '🚚 Cash on Delivery', description: 'Pay when delivered' },
    { id: 'whatsapp', name: '💬 WhatsApp Payment', description: 'Pay via WhatsApp' }
  ];

  // ✅ FIXED: Apply Coupon
  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.warning("⚠️ Please enter a coupon code");
      return;
    }

    try {
      console.log('🎫 Applying coupon:', couponCode);
      
      const response = await axios.post("process.env.REACT_APP_API_URL || http://localhost:5000/api/coupons/validate", {
        code: couponCode.toUpperCase().trim(),
        cartTotal: subtotal
      });

      console.log('✅ Coupon response:', response.data);

      setDiscount(response.data.discount);
      setAppliedCoupon(response.data.couponId);
      toast.success(`✅ Coupon applied! You saved ₹${response.data.discount}`);
    } catch (error) {
      console.error('❌ Coupon error:', error.response?.data || error);
      toast.error(error.response?.data?.error || "Invalid coupon code");
      setDiscount(0);
      setAppliedCoupon(null);
    }
  };

  // ✅ FIXED: Razorpay Integration
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async (orderId) => {
    const res = await loadRazorpay();

    if (!res) {
      toast.error('Razorpay SDK failed to load');
      return false;
    }

    // ✅ USE YOUR RAZORPAY KEY HERE
    const RAZORPAY_KEY = "rzp_test_RoS6kDQGaecjrN"; // 👈 REPLACE THIS

    const options = {
      key: RAZORPAY_KEY,
      amount: total * 100,
      currency: "INR",
      name: "Abhi ShoppingZone",
      description: `Order #${orderId}`,
      image: "/logo.png", // Optional
      handler: function (response) {
        console.log("✅ Payment Success:", response);
        toast.success("✅ Payment successful!");
        return true;
      },
      prefill: {
        name: user.name,
        email: user.email
      },
      theme: {
        color: "#9333ea"
      },
      modal: {
        ondismiss: function() {
          console.log('Payment cancelled by user');
          toast.warning('Payment cancelled');
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    
    return new Promise((resolve) => {
      razorpay.on('payment.success', () => resolve(true));
      razorpay.on('payment.error', () => resolve(false));
      razorpay.open();
    });
  };

  // ✅ FIXED: Place Order
  const handlePlaceOrder = async () => {
    if (!selectedPayment) {
      toast.warning("⚠️ Please select a payment method");
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
        paymentMethod: selectedPayment === 'cod' ? 'COD' : 
                       selectedPayment === 'razorpay' ? 'Razorpay' : 
                       selectedPayment === 'whatsapp' ? 'WhatsApp' : 'Online'
      };

      const response = await axios.post(
        "process.env.REACT_APP_API_URL || http://localhost:5000/api/orders",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      const orderId = response.data.orderId;
      console.log('✅ Order created:', orderId);

      // 2. Mark coupon as used if applied
      if (appliedCoupon) {
        await axios.post("process.env.REACT_APP_API_URL || http://localhost:5000/api/coupons/use", {
          couponId: appliedCoupon
        });
      }

      // 3. Handle payment method
      if (selectedPayment === 'cod') {
        // COD - Direct confirmation
        toast.success("✅ Order placed successfully! Pay on delivery.");
        clearCart();
        setTimeout(() => navigate("/orders"), 1500);
      } 
      else if (selectedPayment === 'razorpay') {
        // Razorpay - Show payment gateway
        const paymentSuccess = await handleRazorpayPayment(orderId);
        
        if (paymentSuccess) {
          toast.success("✅ Payment successful! Order confirmed.");
          clearCart();
          setTimeout(() => navigate("/orders"), 1500);
        } else {
          toast.error("❌ Payment failed. Please try again.");
        }
      }
      else if (selectedPayment === 'whatsapp') {
        // ✅ FIXED: WhatsApp - Redirect BEFORE clearing cart
        const message = `Hello! I want to complete payment for my order.

Order ID: ${orderId}
Customer: ${user.name}
Email: ${user.email}

📦 Items:
${cart.map(item => `• ${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}`).join('\n')}

💰 Total: ₹${total}

Please send payment details.`;

        const phoneNumber = "919696400628"; // 👈 YOUR WHATSAPP NUMBER
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        console.log('💬 Opening WhatsApp:', whatsappURL);
        
        // ✅ FIXED: Open WhatsApp in new tab
        window.open(whatsappURL, "_blank");
        
        // Show message and clear cart AFTER opening WhatsApp
        toast.success("✅ Order placed! Opening WhatsApp...");
        
        setTimeout(() => {
          clearCart();
          toast.info("📱 Complete payment on WhatsApp");
          navigate("/orders");
        }, 2000);
      }

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
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`fixed top-24 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${
          darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-900 text-yellow-400'
        }`}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className={`text-4xl font-black mb-8 ${
          darkMode 
            ? 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'
            : 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'
        }`}>
          🧾 Checkout
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Items & Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className={`rounded-2xl p-6 shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                📦 Order Items
              </h2>
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className={`flex gap-4 p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
                  >
                    <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center text-2xl">
                      🛍️
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {item.name}
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-bold ${darkMode ? 'text-purple-400' : 'text-green-600'}`}>
                        ₹{item.price * item.quantity}
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        ₹{item.price} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div className={`rounded-2xl p-6 shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                💳 Select Payment Method
              </h2>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      selectedPayment === method.id
                        ? darkMode
                          ? 'border-purple-500 bg-purple-900/30'
                          : 'border-purple-600 bg-purple-50'
                        : darkMode
                          ? 'border-gray-700 bg-gray-700 hover:border-gray-600'
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {method.name}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {method.description}
                        </p>
                      </div>
                      {selectedPayment === method.id && (
                        <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className={`rounded-2xl p-6 shadow-xl sticky top-24 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Subtotal</span>
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Shipping</span>
                  <span className={`font-bold ${shipping === 0 ? 'text-green-500' : darkMode ? 'text-white' : 'text-gray-900'}`}>
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
                    <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Total</span>
                    <span className={`text-3xl font-black ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>₹{total}</span>
                  </div>
                </div>
              </div>

              {/* Coupon */}
              <div className="mb-6">
                <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Coupon Code
                </label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-100 border-2 border-green-500 rounded-lg p-3">
                    <span className="text-green-700 font-bold">✓ Applied</span>
                    <button onClick={() => { setAppliedCoupon(null); setDiscount(0); setCouponCode(''); }} className="text-red-600 font-bold">
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
                      className={`flex-1 px-4 py-3 rounded-lg border-2 focus:outline-none ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`}
                    />
                    <button onClick={applyCoupon} className={`px-6 py-3 rounded-lg font-bold ${
                      darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                    }`}>
                      Apply
                    </button>
                  </div>
                )}
                <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Try: SAVE10, FIRST20, or FLAT100
                </p>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={!selectedPayment || loading}
                className={`w-full py-4 rounded-xl font-black text-lg transition-all mb-4 ${
                  selectedPayment && !loading
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? '⏳ Processing...' : `Place Order • ₹${total}`}
              </button>

              <button onClick={() => navigate('/cart')} className={`w-full py-3 rounded-xl font-bold ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}>
                ← Back to Cart
              </button>

              {/* Trust Badges */}
              <div className={`mt-6 pt-6 border-t space-y-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Secure Payment</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>7 Day Return</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Free Shipping over ₹500</span>
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