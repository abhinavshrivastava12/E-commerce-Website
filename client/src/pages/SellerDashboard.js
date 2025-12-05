import React, { useState, useEffect } from 'react';
import { Upload, Package, TrendingUp, Eye, DollarSign, ShoppingBag } from 'lucide-react';

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalViews: 0,
    totalSales: 0,
    totalRevenue: 0,
    activeProducts: 0,
    outOfStock: 0
  });
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: 'Electronics',
    description: '',
    stock: '',
    discount: '',
    image: null
  });

  const categories = ['Electronics', 'Clothing', 'Groceries', 'Home & Kitchen', 'Beauty', 'Sports'];

  // Mock data for demo
  useEffect(() => {
    setStats({
      totalProducts: 12,
      totalViews: 3420,
      totalSales: 89,
      totalRevenue: 45670,
      activeProducts: 10,
      outOfStock: 2
    });
    
    setProducts([
      { id: 1, name: 'Wireless Headphones', price: 2999, stock: 25, sales: 15, image: '🎧' },
      { id: 2, name: 'Smart Watch', price: 4999, stock: 12, sales: 8, image: '⌚' },
      { id: 3, name: 'Bluetooth Speaker', price: 1999, stock: 0, sales: 22, image: '🔊' }
    ]);
  }, []);

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = () => {
    alert('Product added! (This is a demo - connect to backend)');
    console.log('Form data:', formData);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-black text-gray-900">📊 Dashboard Overview</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-2xl shadow-xl text-white">
          <div className="flex items-center justify-between mb-4">
            <Package size={32} />
            <span className="text-4xl font-black">{stats.totalProducts}</span>
          </div>
          <p className="text-lg font-bold">Total Products</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-6 rounded-2xl shadow-xl text-white">
          <div className="flex items-center justify-between mb-4">
            <Eye size={32} />
            <span className="text-4xl font-black">{stats.totalViews}</span>
          </div>
          <p className="text-lg font-bold">Total Views</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-6 rounded-2xl shadow-xl text-white">
          <div className="flex items-center justify-between mb-4">
            <ShoppingBag size={32} />
            <span className="text-4xl font-black">{stats.totalSales}</span>
          </div>
          <p className="text-lg font-bold">Total Sales</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-6 rounded-2xl shadow-xl text-white">
          <div className="flex items-center justify-between mb-4">
            <DollarSign size={32} />
            <span className="text-4xl font-black">₹{stats.totalRevenue}</span>
          </div>
          <p className="text-lg font-bold">Total Revenue</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-6 rounded-2xl shadow-xl text-white">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp size={32} />
            <span className="text-4xl font-black">{stats.activeProducts}</span>
          </div>
          <p className="text-lg font-bold">Active Products</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-pink-500 p-6 rounded-2xl shadow-xl text-white">
          <div className="flex items-center justify-between mb-4">
            <Package size={32} />
            <span className="text-4xl font-black">{stats.outOfStock}</span>
          </div>
          <p className="text-lg font-bold">Out of Stock</p>
        </div>
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-2xl font-black mb-4">Recent Products</h3>
        <div className="space-y-3">
          {products.map(product => (
            <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{product.image}</span>
                <div>
                  <p className="font-bold text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">₹{product.price} • Stock: {product.stock}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">{product.sales} sold</p>
                <p className="text-xs text-gray-500">₹{product.price * product.sales} revenue</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAddProduct = () => (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-black text-gray-900 mb-6">➕ Add New Product</h2>
      
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">Product Name</label>
            <input
              type="text"
              placeholder="Enter product name"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-600 focus:outline-none"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">Category</label>
            <select
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-600 focus:outline-none"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">Price (₹)</label>
            <input
              type="number"
              placeholder="2999"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-600 focus:outline-none"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">Original Price (₹)</label>
            <input
              type="number"
              placeholder="4999"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-600 focus:outline-none"
              value={formData.originalPrice}
              onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">Stock Quantity</label>
            <input
              type="number"
              placeholder="50"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-600 focus:outline-none"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">Discount (%)</label>
            <input
              type="number"
              placeholder="40"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-600 focus:outline-none"
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-2 text-gray-700">Description</label>
          <textarea
            placeholder="Enter product description..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-600 focus:outline-none"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2 text-gray-700">Product Image</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-600 transition-colors cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <Upload size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 font-semibold mb-2">
                {formData.image ? formData.image.name : 'Click to upload product image'}
              </p>
              <p className="text-sm text-gray-500">PNG, JPG, WEBP (Max 5MB)</p>
            </label>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-black text-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-105 shadow-xl"
        >
          ➕ Add Product
        </button>
      </div>
    </div>
  );

  const renderMyProducts = () => (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-black text-gray-900 mb-6">📦 My Products</h2>
      
      <div className="space-y-4">
        {products.map(product => (
          <div key={product.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center text-4xl shadow-md">
                {product.image}
              </div>
              <div>
                <h3 className="font-black text-xl text-gray-900 mb-1">{product.name}</h3>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span className="font-bold">₹{product.price}</span>
                  <span>Stock: {product.stock}</span>
                  <span className="text-green-600 font-bold">{product.sales} sold</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500 transition-colors">
                ✏️ Edit
              </button>
              <button className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-500 transition-colors">
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              🏪 Seller Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Welcome, <strong>Shop Owner</strong></span>
              <button className="px-6 py-2 bg-red-600 text-white rounded-full font-bold hover:bg-red-500 transition-colors">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8">
          {[
            { id: 'dashboard', label: '📊 Dashboard' },
            { id: 'add-product', label: '➕ Add Product' },
            { id: 'my-products', label: '📦 My Products' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'add-product' && renderAddProduct()}
        {activeTab === 'my-products' && renderMyProducts()}
      </div>
    </div>
  );
};

export default SellerDashboard;