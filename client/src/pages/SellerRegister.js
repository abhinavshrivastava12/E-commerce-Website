// 📁 client/src/pages/SellerRegister.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const SellerRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    shopName: '',
    phone: '',
    gstNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/seller/auth/register', formData);
      toast.success('✅ Registration Successful! Please login.');
      navigate('/seller/login');
    } catch (error) {
      toast.error(error.response?.data?.error || '❌ Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏪</div>
          <h1 className="text-4xl font-black text-gray-900">Seller Registration</h1>
          <p className="text-gray-600 mt-2">Start selling on our platform</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-2">Full Name</label>
            <input
              type="text"
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-xl border-2 focus:border-purple-600 focus:outline-none"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              placeholder="seller@example.com"
              className="w-full px-4 py-3 rounded-xl border-2 focus:border-purple-600 focus:outline-none"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              placeholder="Create password"
              className="w-full px-4 py-3 rounded-xl border-2 focus:border-purple-600 focus:outline-none"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Shop Name</label>
            <input
              type="text"
              placeholder="Your shop name"
              className="w-full px-4 py-3 rounded-xl border-2 focus:border-purple-600 focus:outline-none"
              value={formData.shopName}
              onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Phone</label>
            <input
              type="tel"
              placeholder="9876543210"
              className="w-full px-4 py-3 rounded-xl border-2 focus:border-purple-600 focus:outline-none"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">GST Number (Optional)</label>
            <input
              type="text"
              placeholder="GST123456789"
              className="w-full px-4 py-3 rounded-xl border-2 focus:border-purple-600 focus:outline-none"
              value={formData.gstNumber}
              onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-black text-lg hover:from-purple-500 hover:to-pink-500 transition-all"
        >
          {loading ? '⏳ Registering...' : '🚀 Register as Seller'}
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to="/seller/login" className="text-purple-600 font-bold hover:underline">
            Login Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SellerRegister;