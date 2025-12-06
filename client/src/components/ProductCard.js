// 📁 client/src/components/ProductCard.js - FIXED WITH WORKING WISHLIST
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const ProductCard = ({ product, featured, darkMode }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // ✅ Check if product is in wishlist on mount
  useEffect(() => {
    if (user) {
      const wishlist = JSON.parse(localStorage.getItem(`wishlist_${user.id}`) || "[]");
      setIsInWishlist(wishlist.some(item => item.id === product.id || item.id === product._id));
    }
  }, [user, product]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.warning("⚠️ Please login to add items to cart", {
        position: "top-center",
        theme: darkMode ? "dark" : "light"
      });
      
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      return;
    }

    addToCart({
      id: product.id || product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
    
    toast.success("🛒 Item added to cart!", {
      position: "bottom-right",
      theme: darkMode ? "dark" : "light"
    });
  };

  // ✅ Toggle Wishlist
  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.warning("⚠️ Please login to add to wishlist", {
        position: "top-center",
        theme: darkMode ? "dark" : "light"
      });
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      return;
    }

    const wishlistKey = `wishlist_${user.id}`;
    const wishlist = JSON.parse(localStorage.getItem(wishlistKey) || "[]");
    const productId = product.id || product._id;

    if (isInWishlist) {
      // Remove from wishlist
      const updated = wishlist.filter(item => 
        (item.id !== productId) && (item._id !== productId)
      );
      localStorage.setItem(wishlistKey, JSON.stringify(updated));
      setIsInWishlist(false);
      toast.info("💔 Removed from wishlist", {
        position: "bottom-right",
        theme: darkMode ? "dark" : "light"
      });
    } else {
      // Add to wishlist
      const wishlistItem = {
        id: productId,
        _id: productId,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category
      };
      wishlist.push(wishlistItem);
      localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
      setIsInWishlist(true);
      toast.success("❤️ Added to wishlist!", {
        position: "bottom-right",
        theme: darkMode ? "dark" : "light"
      });
    }
  };

  return (
    <Link
      to={`/product/${product.id || product._id}`}
      className={`block rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:rotate-1 group relative ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden h-72">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isHovered ? "scale-125 rotate-3" : "scale-100"
          }`}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.discount && (
            <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-black shadow-lg animate-pulse">
              {product.discount}% OFF
            </div>
          )}
          {featured && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-2 rounded-full text-xs font-black shadow-lg">
              ⭐ FEATURED
            </div>
          )}
          {product.trending && (
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-xs font-black shadow-lg">
              🔥 TRENDING
            </div>
          )}
          {product.bestSeller && (
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-full text-xs font-black shadow-lg">
              🏆 BEST SELLER
            </div>
          )}
        </div>

        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
            product.stock > 10 
              ? 'bg-green-500 text-white'
              : product.stock > 0
                ? 'bg-yellow-500 text-black'
                : 'bg-red-500 text-white'
          }`}>
            {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of Stock'}
          </div>
        </div>

        {/* Wishlist Button - Fixed */}
        <button
          onClick={toggleWishlist}
          className={`absolute bottom-3 right-3 p-3 rounded-full transition-all duration-300 transform hover:scale-110 z-10 ${
            isInWishlist
              ? 'bg-red-500 text-white shadow-lg'
              : darkMode
                ? 'bg-gray-700 text-white hover:bg-red-500'
                : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white'
          }`}
        >
          <svg
            className="w-6 h-6"
            fill={isInWishlist ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        
        {/* Quick View on Hover */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500`}>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || !user}
            className="w-full bg-white text-black py-3 rounded-full font-black hover:bg-yellow-400 transition-all duration-300 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!user ? '🔒 Login to Add' : product.stock === 0 ? 'Out of Stock' : 'Quick Add to Cart'}
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
          }`}>
            {product.category}
          </span>
          {product.rating && (
            <div className="flex items-center">
              <span className="text-yellow-400 text-lg">⭐</span>
              <span className={`ml-1 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {product.rating}
              </span>
            </div>
          )}
        </div>

        <h3 className={`font-bold text-xl mb-3 line-clamp-2 transition-colors ${
          darkMode ? 'text-white group-hover:text-purple-400' : 'text-gray-900 group-hover:text-red-600'
        }`}>
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className={`text-3xl font-black ${darkMode ? 'text-purple-400' : 'text-red-600'}`}>
              ₹{product.price}
            </p>
            {product.originalPrice && product.originalPrice > product.price && (
              <p className={`text-sm line-through ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                ₹{product.originalPrice}
              </p>
            )}
          </div>
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || !user}
          className={`w-full py-4 rounded-xl font-black text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
            darkMode
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500'
              : 'bg-gradient-to-r from-black to-gray-800 text-white hover:from-red-600 hover:to-pink-600'
          }`}
        >
          {!user ? '🔒 Login to Add' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;