// 📁 client/src/pages/Register.js - COMPLETE FIX
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Abhi ShoppingZone - Register";
    
    // Redirect if already logged in
    if (user) {
      console.log("✅ User already logged in, redirecting to home");
      navigate("/");
    }
  }, [user, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      toast.warning("⚠️ Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("❌ Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      toast.warning("⚠️ Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      console.log("📝 Attempting registration for:", email);
      
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password
      });

      console.log("✅ Registration response:", res.data);
      
      toast.success("✅ Registration Successful! Please login.");
      
      // Redirect to login after short delay
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error("❌ Registration error:", error.response?.data || error);
      
      const errorMsg = error.response?.data?.error || error.response?.data?.message || "Registration failed";
      toast.error("❌ " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 relative overflow-hidden py-12 ${
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
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-4xl font-black text-white mb-2">Create Account</h2>
            <p className="text-blue-100">Join Abhi ShoppingZone today</p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="p-8 space-y-5">
            {/* Name */}
            <div>
              <label className={`block text-sm font-bold mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Full Name</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">👤</span>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 focus:outline-none transition-all ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-600'
                  }`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className={`block text-sm font-bold mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Email Address</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">📧</span>
                <input
                  type="email"
                  placeholder="Enter your email"
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
                  placeholder="Create password (min 6 characters)"
                  className={`w-full pl-12 pr-12 py-4 rounded-xl border-2 focus:outline-none transition-all ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-600'
                  }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
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

            {/* Confirm Password */}
            <div>
              <label className={`block text-sm font-bold mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm password"
                className={`w-full px-4 py-4 rounded-xl border-2 focus:outline-none transition-all ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-600'
                }`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-black text-lg transition-all duration-300 transform hover:scale-105 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                darkMode
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span> Creating Account...
                </span>
              ) : (
                '🚀 Create Account'
              )}
            </button>

            {/* Login Link */}
            <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-bold hover:underline">
                Login Here
              </Link>
            </p>

            {/* Seller Register Link */}
            <div className={`pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Want to sell on our platform?{" "}
                <Link
                  to="/seller/register"
                  className="font-bold text-green-600 hover:text-green-700 hover:underline transition-colors"
                >
                  Register as Seller
                </Link>
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

export default Register;