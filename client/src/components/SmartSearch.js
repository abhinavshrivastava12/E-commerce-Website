import React, { useState, useEffect } from 'react';
import { Search, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SmartSearch = ({ products }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length > 1) {
      const filtered = products
        .filter(p => 
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5);
      setResults(filtered);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [query, products]);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search products..."
          className="w-full pl-12 pr-4 py-3 rounded-full border-2 focus:border-purple-600 focus:outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
        />
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border-2 border-gray-100 z-50">
          {results.map(product => (
            <button
              key={product.id}
              onClick={() => {
                navigate(`/product/${product.id}`);
                setQuery('');
              }}
              className="w-full p-4 hover:bg-gray-50 flex items-center gap-3 transition-colors"
            >
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                🛍️
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-900">{product.name}</p>
                <p className="text-sm text-green-600">₹{product.price}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};