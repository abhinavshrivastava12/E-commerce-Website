// 📁 client/src/pages/SellerLogin.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const SellerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/seller/auth/login', {
        email,
        password
      });

      localStorage.setItem('seller', JSON.stringify(res.data));
      toast.success('✅ Login Successful!');
      navigate('/seller/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || '❌ Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏪</div>
          <h1 className="text-4xl font-black text-gray-900">Seller Login</h1>
          <p className="text-gray-600 mt-2">Access your seller dashboard</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              placeholder="seller@example.com"
              className="w-full px-4 py-3 rounded-xl border-2 focus:border-purple-600 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full px-4 py-3 rounded-xl border-2 focus:border-purple-600 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-black text-lg hover:from-purple-500 hover:to-pink-500 transition-all"
          >
            {loading ? '⏳ Logging in...' : '🔓 Login'}
          </button>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/seller/register" className="text-purple-600 font-bold hover:underline">
              Register as Seller
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerLogin;