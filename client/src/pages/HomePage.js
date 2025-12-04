// 📁 src/pages/HomePage.js - Ultra Premium with Dark Mode
import React, { useState, useEffect } from "react";
import products from "../data/products";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";

const categories = ["All", "Electronics", "Clothing", "Groceries", "Home & Kitchen", "Beauty", "Sports"];

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const banners = [
    {
      title: "Mega Electronics Sale",
      subtitle: "Up to 50% OFF on Premium Gadgets",
      bg: "from-purple-600 via-pink-600 to-red-600",
      emoji: "🎧",
      particles: "✨"
    },
    {
      title: "Fashion Fiesta",
      subtitle: "New Season Collection - Flat 30% OFF",
      bg: "from-pink-600 via-rose-600 to-orange-600",
      emoji: "👗",
      particles: "🌟"
    },
    {
      title: "Grocery Bonanza",
      subtitle: "Essential Items at Unbeatable Prices",
      bg: "from-green-600 via-emerald-600 to-teal-600",
      emoji: "🛒",
      particles: "💫"
    }
  ];

  useEffect(() => {
    document.title = "Abhi ShoppingZone - Home";
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [banners.length]);

  const filtered = products.filter((p) => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featured = filtered.filter(p => p.featured).slice(0, 4);
  const trending = filtered.filter(p => p.trending).slice(0, 6);
  const bestSellers = filtered.filter(p => p.bestSeller).slice(0, 4);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      {/* Floating Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`fixed top-24 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${
          darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-900 text-yellow-400'
        }`}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>

      {/* Hero Banner Slider with Parallax */}
      <div className="relative h-[600px] overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out`}
            style={{
              transform: `translateX(${(index - currentSlide) * 100}%)`,
              opacity: index === currentSlide ? 1 : 0
            }}
          >
            <div 
              className={`h-full bg-gradient-to-r ${banner.bg} flex items-center justify-center text-white relative overflow-hidden`}
              style={{ transform: `translateY(${scrollY * 0.3}px)` }}
            >
              {/* Animated Background Particles */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute text-4xl animate-float"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 5}s`,
                      animationDuration: `${5 + Math.random() * 10}s`
                    }}
                  >
                    {banner.particles}
                  </div>
                ))}
              </div>

              <div className="text-center px-6 relative z-10">
                <div className="text-9xl mb-6 animate-bounce-slow">{banner.emoji}</div>
                <h1 className="text-6xl md:text-7xl font-black mb-6 drop-shadow-2xl animate-fade-in-up">
                  {banner.title}
                </h1>
                <p className="text-3xl mb-8 opacity-90 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  {banner.subtitle}
                </p>
                <Link
                  to="/"
                  className="inline-block bg-white text-black px-10 py-5 rounded-full font-black text-xl hover:bg-yellow-400 transition-all duration-300 transform hover:scale-110 shadow-2xl animate-fade-in-up"
                  style={{ animationDelay: '0.4s' }}
                >
                  Shop Now →
                </Link>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slider Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-white w-12" : "bg-white bg-opacity-50 w-3"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Search Bar with Glow Effect */}
        <div className="mb-12">
          <div className="relative max-w-3xl mx-auto">
            <div className={`absolute inset-0 rounded-full blur-xl opacity-30 ${darkMode ? 'bg-purple-600' : 'bg-red-400'}`}></div>
            <input
              type="text"
              placeholder="🔍 Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`relative w-full px-8 py-5 rounded-full border-2 focus:outline-none shadow-2xl text-lg transition-all duration-300 ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 text-white focus:border-purple-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-red-600'
              }`}
            />
          </div>
        </div>

        {/* Category Pills with 3D Effect */}
        <div className="mb-16 flex flex-wrap justify-center gap-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-2xl ${
                selectedCategory === cat
                  ? darkMode
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-purple-500/50"
                    : "bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-red-500/50"
                  : darkMode
                    ? "bg-gray-800 text-white border-2 border-gray-700"
                    : "bg-white text-gray-700 border-2 border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Stats with Animation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {[
            { icon: "🚚", label: "Free Delivery", value: "On orders over ₹500", color: "from-blue-500 to-cyan-500" },
            { icon: "💯", label: "Quality Products", value: "100% Authentic", color: "from-green-500 to-emerald-500" },
            { icon: "🔄", label: "Easy Returns", value: "7 Day Return Policy", color: "from-orange-500 to-red-500" },
            { icon: "💳", label: "Secure Payment", value: "SSL Encrypted", color: "from-purple-500 to-pink-500" }
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:rotate-1 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className={`text-5xl mb-4 inline-block p-4 rounded-full bg-gradient-to-r ${stat.color}`}>
                {stat.icon}
              </div>
              <h3 className={`font-bold text-xl mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {stat.label}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Trending Products */}
        {trending.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center justify-between mb-10">
              <h2 className={`text-5xl font-black ${
                darkMode 
                  ? 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent'
              }`}>
                🔥 Trending Now
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {trending.map((product) => (
                <ProductCard key={product.id} product={product} darkMode={darkMode} />
              ))}
            </div>
          </section>
        )}

        {/* Featured Products */}
        {featured.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center justify-between mb-10">
              <h2 className={`text-5xl font-black ${
                darkMode 
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent'
              }`}>
                ⭐ Featured Products
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} featured darkMode={darkMode} />
              ))}
            </div>
          </section>
        )}

        {/* Best Sellers */}
        {bestSellers.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center justify-between mb-10">
              <h2 className={`text-5xl font-black ${
                darkMode 
                  ? 'bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent'
              }`}>
                🏆 Best Sellers
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} darkMode={darkMode} />
              ))}
            </div>
          </section>
        )}

        {/* All Products */}
        <section>
          <h2 className={`text-4xl font-black mb-10 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            All Products ({filtered.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} darkMode={darkMode} />
            ))}
          </div>
        </section>

        {/* Newsletter with Glassmorphism */}
        <section className={`mt-20 rounded-3xl p-16 text-center shadow-2xl backdrop-blur-xl ${
          darkMode 
            ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30'
            : 'bg-gradient-to-r from-purple-600 to-blue-600'
        } text-white relative overflow-hidden`}>
          <div className="absolute inset-0 bg-white/5"></div>
          <div className="relative z-10">
            <h2 className="text-5xl font-black mb-4">📧 Subscribe to Our Newsletter</h2>
            <p className="text-2xl mb-10 opacity-90">Get exclusive deals and updates!</p>
            <div className="flex flex-col sm:flex-row max-w-xl mx-auto gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className={`flex-1 px-8 py-5 rounded-full focus:outline-none focus:ring-4 focus:ring-yellow-400 text-lg ${
                  darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                }`}
              />
              <button className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-10 py-5 rounded-full font-black text-lg hover:from-yellow-300 hover:to-orange-300 transition-all duration-300 transform hover:scale-105 shadow-xl whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-25px); }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float infinite ease-in-out;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
