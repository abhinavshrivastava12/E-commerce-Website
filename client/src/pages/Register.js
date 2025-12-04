// 📁 src/pages/Register.js - Complete Enhanced Register Page
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Register = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Abhi ShoppingZone - Register";
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      toast.warning("⚠️ Please agree to Terms & Conditions");
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
      await axios.post("/api/auth/register", { name, email, password });
      toast.success("✅ Registration Successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error("❌ Registration Error:", err);
      toast.error(err.response?.data?.error || "❌ Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 relative overflow-hidden py-12 ${
      darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100'
    }`}>
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-40 right-20 w-72 h-72 rounded-full blur-3xl opacity-20 ${
          darkMode ? 'bg-blue-600' : 'bg-blue-400'
        }`} style={{ animation: 'float 7s ease-in-out infinite' }}></div>
        <div className={`absolute bottom-40 left-20 w-96 h-96 rounded-full blur-3xl opacity-20 ${
          darkMode ? 'bg-purple-600' : 'bg-purple-400'
        }`} style={{ animation: 'float 9s ease-in-out infinite', animationDelay: '1s' }}></div>
      </div>

      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`fixed top-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${
          darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-900 text-yellow-400'
        }`}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>

      {/* Register Card */}
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
            <h2 className="text-4xl font-black text-white mb-2">Join Us Today!</h2>
            <p className="text-blue-100">Create your account and start shopping</p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="p-8 space-y-5">
            {/* Name Input */}
            <div>
              <label className={`block text-sm font-bold mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">
                  👤
                </span>
                <input
                  type="text"
                  placeholder="Enter your full name"
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

            {/* Email Input */}
            <div>
              <label className={`block text-sm font-bold mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">
                  📧
                </span>
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
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className={`block text-sm font-bold mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">
                  🔒
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className={`w-full pl-12 pr-12 py-4 rounded-xl border-2 focus:outline-none transition-all ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-600'
                  }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Must be at least 6 characters
              </p>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className={`block text-sm font-bold mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">
                  🔐
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 focus:outline-none transition-all ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-600'
                  }`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="terms" className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                I agree to the{" "}
                <button type="button" className="text-blue-600 hover:underline font-semibold">
                  Terms & Conditions
                </button>{" "}
                and{" "}
                <button type="button" className="text-blue-600 hover:underline font-semibold">
                  Privacy Policy
                </button>
              </label>
            </div>

            {/* Register Button */}
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
                  <span className="animate-spin">⏳</span> Creating Account...
                </span>
              ) : (
                '🚀 Create Account'
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className={`absolute inset-0 flex items-center ${
                darkMode ? 'text-gray-600' : 'text-gray-400'
              }`}>
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-4 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'}`}>
                  Or sign up with
                </span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className={`py-3 rounded-xl font-bold transition-all hover:scale-105 ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                🔵 Facebook
              </button>
              <button
                type="button"
                className={`py-3 rounded-xl font-bold transition-all hover:scale-105 ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                🔴 Google
              </button>
            </div>

            {/* Login Link */}
            <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                Login Here
              </Link>
            </p>
          </form>
        </div>

        {/* Benefits Section */}
        <div className={`mt-6 p-6 rounded-2xl ${
          darkMode ? 'bg-gray-800/50' : 'bg-white/50'
        } backdrop-blur-lg`}>
          <h3 className={`text-lg font-bold mb-4 text-center ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Why Join Abhi ShoppingZone?
          </h3>
          <div className="space-y-3">
            {[
              { icon: '🎁', text: 'Exclusive deals for members' },
              { icon: '🚚', text: 'Free delivery on orders over ₹500' },
              { icon: '⚡', text: 'Lightning fast checkout' },
              { icon: '🔔', text: 'Early access to new products' }
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-2xl">{benefit.icon}</span>
                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  {benefit.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px); 
          }
          50% { 
            transform: translateY(-20px); 
          }
        }
      `}</style>
    </div>
  );
};

export default Register