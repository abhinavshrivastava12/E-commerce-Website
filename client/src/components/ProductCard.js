// 📁 src/components/ProductCard.js (updated)
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

const ProductCard = ({ product, featured }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    addToCart({ ...product, quantity });
    toast.success(`🛒 ${product.name} added (Qty: ${quantity})`);
  };

  return (
    <div className={`bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1 ${featured ? "border-2 border-red-500" : ""}`}>
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded mb-4" />
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-red-600 font-bold mb-2">₹{product.price}</p>
      <div className="flex items-center justify-between mb-3">
        <select
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        >
          {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <button onClick={handleAdd} className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800 text-sm">
          Add to Cart
        </button>
      </div>
      <Link to={`/product/${product.id}`} className="text-blue-500 text-sm underline">View Details</Link>
    </div>
  );
};

export default ProductCard;
