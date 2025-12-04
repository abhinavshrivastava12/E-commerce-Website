// 📁 src/pages/Cart.js - Ultra Enhanced Cart Page
import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";


const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [darkMode, setDarkMode] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping - discount;

  const applyCoupon = () => {
    if (couponCode === "SAVE10") {
      setDiscount(subtotal * 0.1);
      toast.success("🎉 Coupon applied! 10% off");
    } else if (couponCode === "FIRST20") {
      setDiscount(subtotal * 0.2);
      toast.success("🎉 Coupon applied! 20% off");
    } else {
      toast.error("❌ Invalid coupon code");
    }
  };

  if (cart.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
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

        <div className="text-center">
          <div className="text-9xl mb-8 animate-bounce">🛒</div>
          <h1 className={`text-5xl font-black mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Your Cart is Empty
          </h1>
          <p className={`text-xl mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Looks like you haven't added anything to your cart yet
          </p>
          <Link
            to="/"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-5 rounded-full font-black text-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-110 shadow-2xl"
          >
            Start Shopping 🛍️
          </Link>
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

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className={`text-5xl font-black mb-4 ${
            darkMode 
              ? 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'
          }`}>
            🛒 Shopping Cart
          </h1>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl p-6 shadow-xl transition-all duration-300 hover:shadow-2xl ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <div className="flex gap-6">
                  {/* Product Image */}
                  <div className="w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className={`text-xl font-bold mb-2 ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {item.name}
                        </h3>
                        <p className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Price: ₹{item.price}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          darkMode 
                            ? 'hover:bg-red-900/30 text-red-400' 
                            : 'hover:bg-red-50 text-red-600'
                        }`}
                      >
                        🗑️
                      </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className={`w-10 h-10 rounded-lg font-bold transition-all ${
                            darkMode 
                              ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                          }`}
                        >
                          -
                        </button>
                        <span className={`text-xl font-bold min-w-[3ch] text-center ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className={`w-10 h-10 rounded-lg font-bold transition-all ${
                            darkMode 
                              ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                          }`}
                        >
                          +
                        </button>
                      </div>

                      <div className={`text-2xl font-black ${
                        darkMode ? 'text-purple-400' : 'text-purple-600'
                      }`}>
                        ₹{item.price * item.quantity}
                      </div>
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
              }`}>
                Order Summary
              </h2>

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
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
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
                <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Try: SAVE10 or FIRST20
                </p>
              </div>

              {/* Checkout Button */}
              <Link
                to="/checkout"
                className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-black text-lg text-center hover:from-purple-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-105 shadow-xl mb-4"
              >
                Proceed to Checkout →
              </Link>

              <Link
                to="/"
                className={`block w-full py-3 rounded-xl font-bold text-center transition-all ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}
              >
                Continue Shopping
              </Link>

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
                    7 Day Return Policy
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Free Shipping over ₹500
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

export default Cart;