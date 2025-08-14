// 📁 src/pages/HomePage.js - Updated with animations & featured section
import React, { useState, useEffect } from "react";
import products from "../data/products";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";

const categories = ["All", "Electronics", "Clothing", "Groceries"];

const HomePage = () => {
  useEffect(() => {
    document.title = "Abhi ShoppingZone - Home";
  }, []);

  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered = selectedCategory === "All"
    ? products
    : products.filter((p) => p.category === selectedCategory);

  const featured = filtered.slice(0, 4);

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-6">
      <header className="max-w-6xl mx-auto mb-10 text-center">
        <h1 className="text-4xl font-black">🛍️ Welcome to <span className="text-red-600">Abhi ShoppingZone</span></h1>
        <p className="mt-2 text-gray-600">Discover top products & enjoy smooth shopping experience</p>
        <Link to="/cart" className="inline-block mt-6 bg-black text-white px-6 py-3 rounded-xl shadow hover:bg-gray-800 transition">
          View Cart
        </Link>
      </header>

      {/* Category Filter */}
      <div className="max-w-6xl mx-auto mb-10 flex flex-wrap justify-center gap-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full font-medium hover:shadow-md transition duration-200 ${
              selectedCategory === cat
                ? "bg-black text-white"
                : "bg-white border border-gray-300 text-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Products */}
      <section className="max-w-6xl mx-auto mb-14">
        <h2 className="text-2xl font-semibold mb-6">Featured Items</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} featured />
          ))}
        </div>
      </section>

      {/* All Products */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">All Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
