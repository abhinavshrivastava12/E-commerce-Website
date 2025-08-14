import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cart } = useCart();
  console.log("🧺 Cart Contents:", cart);


  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="p-6 min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold">🛒 Your cart is empty.</h1>
        <Link to="/" className="text-blue-600 underline">
          Go Back to Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">🛒 Your Cart</h1>
      <ul className="mb-6 space-y-4">
        {cart.map((item) => (
          <li
            key={item.id}
            className="bg-white p-4 rounded shadow flex justify-between"
          >
            <span>
              {item.name} x {item.quantity}
            </span>
            <span>₹{item.price * item.quantity}</span>
          </li>
        ))}
      </ul>
      <p className="text-xl font-semibold mb-4">Total: ₹{total}</p>
      <Link
        to="/checkout"
        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
};

export default Cart;
