import React, { useState, useEffect } from 'react';
import { Upload, Package, TrendingUp, Eye, DollarSign, ShoppingBag, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

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
  const [loading, setLoading] = useState(false);
  const [seller, setSeller] = useState(null);
  
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

  const [editingProduct, setEditingProduct] = useState(null);

  const categories = ['Electronics', 'Clothing', 'Groceries', 'Home & Kitchen', 'Beauty', 'Sports'];

  useEffect(() => {
    const storedSeller = localStorage.getItem('seller');
    if (!storedSeller) {
      window.location.href = '/seller/login';
      return;
    }
    
    const parsed = JSON.parse(storedSeller);
    setSeller(parsed);
    loadDashboardData(parsed.token);
  }, []);

  const loadDashboardData = async (token) => {
    try {
      setLoading(true);
      
      const statsRes = await fetch('http://localhost:5000/api/seller/products/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const statsData = await statsRes.json();
      setStats(statsData);

      const productsRes = await fetch('http://localhost:5000/api/seller/products/my-products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const productsData = await productsRes.json();
      setProducts(productsData);
      
      setLoading(false);
    } catch (error) {
      console.error('Load Error:', error);
      alert('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      setFormData({ ...formData, image: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.stock) {
      alert('Please fill all required fields');
      return;
    }

    if (!formData.image && !editingProduct) {
      alert('Please select an image');
      return;
    }

    try {
      setLoading(true);
      
      const data = new FormData();
      data.append('name', formData.name);
      data.append('price', formData.price);
      data.append('originalPrice', formData.originalPrice || formData.price);
      data.append('category', formData.category);
      data.append('description', formData.description);
      data.append('stock', formData.stock);
      data.append('discount', formData.discount || 0);
      
      if (formData.image) {
        data.append('image', formData.image);
      }

      const url = editingProduct 
        ? `http://localhost:5000/api/seller/products/update/${editingProduct._id}`
        : 'http://localhost:5000/api/seller/products/add';
      
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 
          Authorization: `Bearer ${seller.token}`
        },
        body: data
      });

      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || 'Failed to save product');
      }

      alert(editingProduct ? 'Product updated!' : 'Product added!');
      
      setFormData({
        name: '',
        price: '',
        originalPrice: '',
        category: 'Electronics',
        description: '',
        stock: '',
        discount: '',
        image: null
      });
      setEditingProduct(null);
      
      loadDashboardData(seller.token);
      setActiveTab('my-products');
      
    } catch (error) {
      console.error('Submit Error:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      category: product.category,
      description: product.description,
      stock: product.stock,
      discount: product.discount || 0,
      image: null
    });
    setEditingProduct(product);
    setActiveTab('add-product');
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/seller/products/delete/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${seller.token}` }
      });

      if (!res.ok) throw new Error('Failed to delete');

      alert('Product deleted!');
      loadDashboardData(seller.token);
    } catch (error) {
      console.error('Delete Error:', error);
      alert('Failed to delete product');
    }
  };

  const handleToggleStatus = async (productId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/seller/products/toggle-status/${productId}`, {
        method: 'PUT',
        headers: { 
          Authorization: `Bearer ${seller.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) throw new Error('Failed to toggle');

      alert('Status updated!');
      loadDashboardData(seller.token);
    } catch (error) {
      console.error('Toggle Error:', error);
      alert('Failed to update status');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('seller');
      window.location.href = '/seller/login';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-black text-gray-900">📊 Dashboard Overview</h2>
      
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

      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-2xl font-black mb-4">Recent Products</h3>
        <div className="space-y-3">
          {products.slice(0, 5).map(product => (
            <div key={product._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-4">
                <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                <div>
                  <p className="font-bold text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">₹{product.price} • Stock: {product.stock}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">{product.sales || 0} sold</p>
                <p className="text-xs text-gray-500">₹{product.price * (product.sales || 0)} revenue</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAddProduct = () => (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-black text-gray-900 mb-6">
        {editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}
      </h2>
      
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">Product Name *</label>
            <input
              type="text"
              placeholder="Enter product name"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-600 focus:outline-none"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">Category *</label>
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
            <label className="block text-sm font-bold mb-2 text-gray-700">Price (₹) *</label>
            <input
              type="number"
              placeholder="2999"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-600 focus:outline-none"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              min="0"
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
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">Stock Quantity *</label>
            <input
              type="number"
              placeholder="50"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-600 focus:outline-none"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              min="0"
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
              min="0"
              max="100"
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
          <label className="block text-sm font-bold mb-2 text-gray-700">
            Product Image {!editingProduct && '*'}
          </label>
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
                {formData.image ? formData.image.name : editingProduct ? 'Change image (optional)' : 'Click to upload product image'}
              </p>
              <p className="text-sm text-gray-500">PNG, JPG, WEBP (Max 5MB)</p>
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-black text-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-105 shadow-xl disabled:opacity-50"
          >
            {loading ? '⏳ Processing...' : editingProduct ? '✏️ Update Product' : '➕ Add Product'}
          </button>
          {editingProduct && (
            <button
              onClick={() => {
                setEditingProduct(null);
                setFormData({
                  name: '',
                  price: '',
                  originalPrice: '',
                  category: 'Electronics',
                  description: '',
                  stock: '',
                  discount: '',
                  image: null
                });
              }}
              className="px-8 py-4 rounded-xl font-bold bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderMyProducts = () => (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-black text-gray-900 mb-6">📦 My Products ({products.length})</h2>
      
      {products.length === 0 ? (
        <div className="text-center py-20">
          <Package size={64} className="mx-auto mb-4 text-gray-400" />
          <p className="text-xl text-gray-600 mb-6">No products yet. Add your first product!</p>
          <button
            onClick={() => setActiveTab('add-product')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-bold hover:from-purple-500 hover:to-pink-500 transition-all"
          >
            ➕ Add Product
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map(product => (
            <div key={product._id} className="flex items-center justify-between p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-6">
                <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded-lg shadow-md" />
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-black text-xl text-gray-900">{product.name}</h3>
                    {product.isActive ? (
                      <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold">Active</span>
                    ) : (
                      <span className="bg-gray-500 text-white text-xs px-3 py-1 rounded-full font-bold">Inactive</span>
                    )}
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span className="font-bold text-green-600">₹{product.price}</span>
                    <span>Stock: {product.stock}</span>
                    <span>Category: {product.category}</span>
                    <span className="text-blue-600">{product.views || 0} views</span>
                    <span className="text-purple-600 font-bold">{product.sales || 0} sold</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleStatus(product._id)}
                  className="p-3 bg-blue-100 text-blue-600 rounded-lg font-bold hover:bg-blue-200 transition-colors"
                  title={product.isActive ? 'Deactivate' : 'Activate'}
                >
                  {product.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                </button>
                <button
                  onClick={() => handleEdit(product)}
                  className="p-3 bg-green-100 text-green-600 rounded-lg font-bold hover:bg-green-200 transition-colors"
                  title="Edit"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="p-3 bg-red-100 text-red-600 rounded-lg font-bold hover:bg-red-200 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (!seller) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">⏳</div>
          <p className="text-xl font-bold text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              🏪 Seller Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome,</p>
                <p className="font-bold text-gray-900">{seller.name}</p>
                <p className="text-xs text-gray-500">{seller.shopName}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-600 text-white rounded-full font-bold hover:bg-red-500 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-4 mb-8">
          {[
            { id: 'dashboard', label: '📊 Dashboard' },
            { id: 'add-product', label: editingProduct ? '✏️ Edit Product' : '➕ Add Product' },
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

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'add-product' && renderAddProduct()}
        {activeTab === 'my-products' && renderMyProducts()}
      </div>
    </div>
  );
};

export default SellerDashboard;