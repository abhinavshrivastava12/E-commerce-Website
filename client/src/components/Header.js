// 📁 client/src/components/Header.js - COMPLETE FIX
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Header = () => {
  const { user, logout, loading } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // ✅ Fixed Logout Handler
  const handleLogout = () => {
    logout();
    navigate("/", { replace: true }); // Force navigation to home
  };

  if (loading) return null;

  return (
    <header className="bg-black text-white px-6 py-4 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:scale-105 transition-transform">
          Abhi <span className="text-red-500">ShoppingZone</span>
        </Link>

        <nav className="flex space-x-6 items-center text-sm font-medium">
          <Link to="/" className="hover:text-purple-400 transition-colors">
            🏠 Home
          </Link>
          
          <Link to="/cart" className="hover:text-purple-400 transition-colors relative">
            🛒 Cart
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link to="/orders" className="hover:text-purple-400 transition-colors">
                📦 Orders
              </Link>
              <span className="text-gray-300">
                Hi, {user.name.split(" ")[0]} 👋
              </span>
              <button 
                onClick={handleLogout} 
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors font-bold"
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
              >
                🔐 Login
              </Link>
              <Link 
                to="/register" 
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
              >
                ✨ Register
              </Link>
            </>
          )}

          {/* ✅ Fixed Seller Panel Link */}
          <Link 
            to="/seller/login" 
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
          >
            🏪 Seller Panel
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;