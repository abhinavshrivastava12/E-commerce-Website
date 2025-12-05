import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

const CompareProducts = () => {
  const { state } = useLocation();
  const [compareList, setCompareList] = useState(state?.products || []);

  const features = ['Price', 'Rating', 'Stock', 'Discount'];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-black mb-8 text-center">⚖️ Compare Products</h1>
      
      {compareList.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-2xl text-gray-600 mb-4">No products to compare</p>
          <Link to="/" className="text-blue-600 underline">Browse products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {compareList.map(product => (
            <div key={product.id} className="bg-white rounded-2xl shadow-xl p-6">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-4" />
              <h3 className="font-bold text-xl mb-4">{product.name}</h3>
              
              <div className="space-y-3">
                {features.map(feature => (
                  <div key={feature} className="flex justify-between">
                    <span className="text-gray-600">{feature}:</span>
                    <span className="font-bold">
                      {feature === 'Price' && `₹${product.price}`}
                      {feature === 'Rating' && `${product.rating || 'N/A'} ⭐`}
                      {feature === 'Stock' && product.stock}
                      {feature === 'Discount' && `${product.discount || 0}%`}
                    </span>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-full font-bold">
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};