// 📁 client/src/pages/SellerLogin.js - COMPLETE FIX
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const SellerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.warning("⚠️ Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      console.log("🔄 Attempting seller login for:", email);
      
      const res = await axios.post('process.env.REACT_APP_API_URL || http://localhost:5000/api/seller/auth/login', {
        email: email.trim(),
        password: password
      });

      console.log("✅ Login response:", res.data);

      // Store seller data with token
      const sellerData = {
        ...res.data.seller,
        token: res.data.token
      };

      localStorage.setItem('seller', JSON.stringify(sellerData));
      
      toast.success('✅ Login Successful! Welcome ' + res.data.seller.name);
      
      // Navigate to dashboard
      setTimeout(() => {
        navigate('/seller/dashboard');
      }, 500);

    } catch (error) {
      console.error("❌ Login error:", error.response?.data || error);
      
      const errorMsg = error.response?.data?.error || 'Login failed. Please try again.';
      toast.error('❌ ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 relative overflow-hidden ${
      darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100'
    }`}>
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`fixed top-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${
          darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-900 text-yellow-400'
        }`}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>

      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 left-20 w-72 h-72 rounded-full blur-3xl opacity-20 ${
          darkMode ? 'bg-blue-600' : 'bg-blue-400'
        }`} style={{ animation: 'float 6s ease-in-out infinite' }}></div>
        <div className={`absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl opacity-20 ${
          darkMode ? 'bg-purple-600' : 'bg-purple-400'
        }`} style={{ animation: 'float 8s ease-in-out infinite', animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className={`rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl ${
          darkMode ? 'bg-gray-800/90' : 'bg-white/90'
        }`}>
          {/* Header */}
          <div className={`p-8 text-center ${
            darkMode 
              ? 'bg-gradient-to-r from-blue-900 to-purple-900' 
              : 'bg-gradient-to-r from-blue-600 to-purple-600'
          }`}>
            <div className="text-6xl mb-4">🏪</div>
            <h1 className="text-4xl font-black text-white mb-2">Seller Login</h1>
            <p className="text-blue-100">Access your seller dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            {/* Email */}
            <div>
              <label className={`block text-sm font-bold mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Email Address</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">📧</span>
                <input
                  type="email"
                  placeholder="seller@example.com"
                  className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 focus:outline-none transition-all ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-600'
                  }`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={`block text-sm font-bold mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Password</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  className={`w-full pl-12 pr-12 py-4 rounded-xl border-2 focus:outline-none transition-all ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-600'
                  }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-black text-lg transition-all duration-300 transform hover:scale-105 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                darkMode
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span> Logging in...
                </span>
              ) : (
                '🔓 Login to Dashboard'
              )}
            </button>

            {/* Register Link */}
            <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Don't have a seller account?{' '}
              <Link to="/seller/register" className="text-blue-600 font-bold hover:underline">
                Register Here
              </Link>
            </p>

            {/* Test Credentials */}
            <div className={`mt-4 p-4 rounded-xl ${
              darkMode ? 'bg-gray-700' : 'bg-blue-50'
            }`}>
              <p className={`text-xs font-bold mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                💡 For Testing: Register a new account first
              </p>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default SellerLogin;