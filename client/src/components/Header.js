import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Header = () => {
  const { user, logout, loading } = useAuth();
  const { cart } = useCart();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) return null; // Or you can return a header skeleton/spinner here

  return (
    <header className="bg-black text-white px-6 py-4 shadow-md">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Abhi <span className="text-red-500">ShoppingZone</span>
        </Link>

        <nav className="flex space-x-6 items-center text-sm font-medium">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/cart" className="hover:underline">
            Cart ({totalItems})
          </Link>

          {user ? (
            <>
              <Link to="/orders" className="hover:underline">Orders</Link>
              <span className="text-gray-300">Hi, {user.name.split(" ")[0]}</span>
              <button onClick={logout} className="hover:underline">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="hover:underline">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
