import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

const Invoice = () => {
  const { state } = useLocation();
  const { orderId, cart, total } = state || {};

  useEffect(() => {
    document.title = "Abhi ShoppingZone - Invoice";
  }, []);

  if (!orderId || !cart) return <div className="p-6">No order found.</div>;

  return (
    <div className="min-h-screen p-6 bg-white">
      <h1 className="text-3xl font-bold mb-4">🧾 Order Invoice</h1>
      <p className="mb-2">Order ID: <strong>{orderId}</strong></p>
      <p className="mb-6">Thank you for shopping with <span className="text-red-600 font-bold">Abhi ShoppingZone</span>!</p>

      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex justify-between border-b pb-2"
          >
            <div>{item.name} (x{item.quantity})</div>
            <div>₹{item.price * item.quantity}</div>
          </div>
        ))}
        <div className="text-lg font-semibold mt-4">
          Total Paid: ₹{total}
        </div>
      </div>

      <Link to="/" className="mt-6 inline-block bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
        Back to Home
      </Link>
    </div>
  );
};

export default Invoice;
