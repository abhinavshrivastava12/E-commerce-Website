// 📁 client/pages/OrderHistory.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // Navigation add kiya

const OrderHistory = () => {
  const { user, logout } = useAuth(); // Logout function auth context se lein
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.token) {
      axios
        .get("/api/orders/my", {
          headers: {
            Authorization: `Bearer ${user.token}`, 
          },
        })
        .then((res) => setOrders(res.data))
        .catch((err) => {
          console.error("❌ Failed to fetch orders:", err);
          // Agar token expire ya invalid hai (401/403), to logout karayein
          if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            alert("Session expired. Please login again.");
            logout();
            navigate("/login");
          }
        });
    }
  }, [user, logout, navigate]);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📦 Your Order History</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-10">
            <p className="text-gray-500 text-lg">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto">
          {orders.map((order, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="flex justify-between items-center border-b pb-3 mb-3">
                <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-mono text-sm font-bold text-gray-700">{order._id}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-xl font-bold text-green-600">₹{order.total}</p>
                </div>
              </div>
              
              <div className="mb-3">
                <p className="text-sm text-gray-600"><span className="font-semibold">Payment Method:</span> {order.paymentMethod}</p>
                <p className="text-sm text-gray-600"><span className="font-semibold">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-semibold mb-2 text-gray-700">Items:</h4>
                <ul className="space-y-1">
                    {order.cart.map((item, idx) => (
                    <li key={idx} className="flex justify-between text-sm text-gray-600">
                        <span>{item.name} <span className="text-gray-400">× {item.quantity}</span></span>
                        <span>₹{item.price * item.quantity}</span>
                    </li>
                    ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;