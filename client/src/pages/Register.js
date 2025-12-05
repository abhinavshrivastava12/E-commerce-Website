// 📁 client/src/pages/Register.js - FIXED OTP SYSTEM
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Register = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Details
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Abhi ShoppingZone - Register";
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/send-otp", { email });
      toast.success("📧 OTP sent to your email!");
      setStep(2);
      setTimer(600); // 10 minutes
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
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
      await axios.post("http://localhost:5000/api/auth/verify-otp-register", {
        name,
        email,
        password,
        otp
      });
      toast.success("✅ Registration Successful! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.error || "Invalid OTP or Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/send-otp", { email });
      toast.success("📧 OTP resent successfully!");
      setTimer(600);
    } catch (error) {
      toast.error("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 relative overflow-hidden py-12 ${
      darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100'
    }`}>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`fixed top-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${
          darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-900 text-yellow-400'
        }`}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>

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
            <div className="text-6xl mb-4">
              {step === 1 ? '📧' : step === 2 ? '🔐' : '✨'}
            </div>
            <h2 className="text-4xl font-black text-white mb-2">
              {step === 1 ? 'Enter Email' : step === 2 ? 'Verify OTP' : 'Complete Profile'}
            </h2>
            <p className="text-blue-100">
              {step === 1 ? 'We will send you a verification code' : 
               step === 2 ? 'Check your email for OTP' : 
               'Create your account'}
            </p>
          </div>

          {/* Step 1: Email */}
          {step === 1 && (
            <form onSubmit={handleSendOTP} className="p-8 space-y-6">
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
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-black text-lg transition-all duration-300 transform hover:scale-105 shadow-xl ${
                  darkMode
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                }`}
              >
                {loading ? '⏳ Sending...' : '📧 Send OTP'}
              </button>
              <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Already have an account?{" "}
                <Link to="/login" className="font-bold text-blue-600 hover:underline">
                  Login Here
                </Link>
              </p>
            </form>
          )}

          {/* Step 2: OTP & Details */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="p-8 space-y-5">
              <div>
                <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className={`w-full px-4 py-4 rounded-xl border-2 focus:outline-none ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className={`text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Enter OTP
                  </label>
                  {timer > 0 ? (
                    <span className="text-xs text-blue-600 font-bold">
                      Expires in {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      className="text-xs text-blue-600 font-bold hover:underline"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                  className={`w-full px-4 py-4 rounded-xl border-2 focus:outline-none text-center text-2xl tracking-widest font-bold ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create password"
                    className={`w-full pr-12 px-4 py-4 rounded-xl border-2 focus:outline-none ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  className={`w-full px-4 py-4 rounded-xl border-2 focus:outline-none ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-black text-lg transition-all duration-300 transform hover:scale-105 shadow-xl ${
                  darkMode
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                }`}
              >
                {loading ? '⏳ Verifying...' : '🚀 Complete Registration'}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className={`w-full py-3 rounded-xl font-bold ${
                  darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'
                }`}
              >
                ← Change Email
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;