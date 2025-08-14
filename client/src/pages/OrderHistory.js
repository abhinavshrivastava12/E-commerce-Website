// 📁 client/pages/OrderHistory.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      axios
        .get("/api/orders/my", {
          headers: {
            Authorization: `Bearer ${user.token}`, // 🔐 Send token
          },
        })
        .then((res) => setOrders(res.data))
        .catch((err) => console.error("❌ Failed to fetch orders:", err));
    }
  }, [user]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📦 Your Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div key={index} className="bg-white p-4 rounded shadow">
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Total:</strong> ₹{order.total}</p>
              <p><strong>Payment:</strong> {order.paymentMethod}</p>
              <ul className="list-disc ml-4">
                {order.cart.map((item, idx) => (
                  <li key={idx}>{item.name} × {item.quantity}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
