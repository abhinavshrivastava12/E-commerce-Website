// 📁 client/src/pages/OrderHistory.js - COMPLETE FIX
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const OrderHistory = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    // ✅ Check if user exists and has token
    if (!user) {
      console.log("❌ No user found, redirecting to login");
      toast.error("Please login to view orders");
      navigate("/login");
      return;
    }

    if (!user.token) {
      console.log("❌ No token found, redirecting to login");
      toast.error("Session expired. Please login again.");
      logout();
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      console.log("🔄 Fetching orders for user:", user.id);
      
      const res = await axios.get("process.env.REACT_APP_API_URL || http://localhost:5000/api/orders/my", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      console.log("✅ Orders fetched successfully:", res.data);
      setOrders(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch orders:", err);
      
      if (err.response) {
        if (err.response.status === 401 || err.response.status === 403) {
          toast.error("Session expired. Please login again.");
          logout();
          navigate("/login");
        } else {
          toast.error("Failed to load orders: " + (err.response.data.error || "Unknown error"));
        }
      } else if (err.request) {
        toast.error("Cannot connect to server. Please check if server is running.");
      } else {
        toast.error("Failed to load orders");
      }
    } finally {
      setLoading(false);
    }
  }, [user, navigate, logout]);

  useEffect(() => {
    document.title = "Abhi ShoppingZone - Order History";
    fetchOrders();
  }, [fetchOrders]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">⏳</div>
          <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-700'}`}>
            Loading your orders...
          </p>
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
        <div className="mb-8">
          <h1 className={`text-5xl font-black mb-4 ${
            darkMode 
              ? 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'
          }`}>
            📦 Your Order History
          </h1>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Track all your orders in one place • Welcome back, {user?.name}!
          </p>
        </div>

        {orders.length === 0 ? (
          <div className={`text-center py-20 rounded-3xl ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-2xl`}>
            <div className="text-9xl mb-6">📭</div>
            <h2 className={`text-3xl font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              No Orders Yet
            </h2>
            <p className={`text-lg mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              You haven't placed any orders yet. Start shopping now!
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-4 rounded-full font-black text-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Start Shopping 🛍️
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div
                key={order._id}
                className={`rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                {/* Order Header */}
                <div className={`p-6 border-b ${
                  darkMode ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <p className={`text-sm mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        Order #{index + 1}
                      </p>
                      <p className={`font-mono text-sm font-bold ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        ID: {order._id}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className={`text-sm mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        Total Amount
                      </p>
                      <p className={`text-3xl font-black ${
                        darkMode ? 'text-purple-400' : 'text-green-600'
                      }`}>
                        ₹{order.total}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                        ✓ {order.paymentMethod}
                      </span>
                      <span className={`text-xs text-center ${
                        darkMode ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <h4 className={`font-bold text-lg mb-4 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    📦 Items Ordered ({order.cart.length})
                  </h4>
                  <div className="space-y-3">
                    {order.cart.map((item, idx) => (
                      <div
                        key={idx}
                        className={`flex justify-between items-center p-4 rounded-xl ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-16 h-16 rounded-lg flex items-center justify-center text-3xl ${
                            darkMode ? 'bg-gray-600' : 'bg-white'
                          }`}>
                            🛍️
                          </div>
                          <div>
                            <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {item.name}
                            </p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Quantity: <span className="font-bold">{item.quantity}</span>
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-black ${
                            darkMode ? 'text-purple-400' : 'text-green-600'
                          }`}>
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

                {/* Order Actions */}
                <div className={`p-6 border-t ${
                  darkMode ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex flex-wrap gap-4">
                    <button className={`flex-1 py-3 rounded-xl font-bold transition-all hover:scale-105 ${
                      darkMode
                        ? 'bg-purple-600 hover:bg-purple-500 text-white'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    }`}>
                      📄 Download Invoice
                    </button>
                    <button className={`flex-1 py-3 rounded-xl font-bold transition-all hover:scale-105 ${
                      darkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-white border-2 border-gray-300 hover:bg-gray-50'
                    }`}>
                      🔄 Track Order
                    </button>
                    <button 
                      onClick={() => navigate('/')}
                      className={`flex-1 py-3 rounded-xl font-bold transition-all hover:scale-105 ${
                        darkMode
                          ? 'bg-blue-600 hover:bg-blue-500 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      🛍️ Order Again
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Refresh Button */}
        <div className="mt-8 text-center">
          <button
            onClick={fetchOrders}
            className={`px-8 py-3 rounded-full font-bold transition-all hover:scale-105 ${
              darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-white hover:bg-gray-50 border-2 border-gray-300'
            }`}
          >
            🔄 Refresh Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;