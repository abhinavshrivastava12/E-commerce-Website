import React, { useState } from 'react';

const AdvancedFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    rating: '',
    inStock: false,
    onSale: false,
    brand: ''
  });

  const handleChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    onFilterChange(updated);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-2xl font-black mb-4">🔍 Filters</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold mb-2">Price Range</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              className="flex-1 px-3 py-2 border-2 rounded-lg"
              value={filters.minPrice}
              onChange={(e) => handleChange('minPrice', e.target.value)}
            />
            <input
              type="number"
              placeholder="Max"
              className="flex-1 px-3 py-2 border-2 rounded-lg"
              value={filters.maxPrice}
              onChange={(e) => handleChange('maxPrice', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">Minimum Rating</label>
          <select
            className="w-full px-3 py-2 border-2 rounded-lg"
            value={filters.rating}
            onChange={(e) => handleChange('rating', e.target.value)}
          >
            <option value="">Any</option>
            <option value="4">4★ & above</option>
            <option value="4.5">4.5★ & above</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) => handleChange('inStock', e.target.checked)}
              className="w-5 h-5"
            />
            <span className="font-semibold">In Stock Only</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.onSale}
              onChange={(e) => handleChange('onSale', e.target.checked)}
              className="w-5 h-5"
            />
            <span className="font-semibold">On Sale</span>
          </label>
        </div>
      </div>
    </div>
  );
};