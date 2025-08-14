import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext"; // 🔐 Make sure you have this

const Login = () => {
  const { login } = useAuth(); // Context login function
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    document.title = "Abhi ShoppingZone - Login";
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.warning("⚠️ Please enter both email and password");
      return;
    }

    try {
      const res = await axios.post("/api/auth/login", { email, password });
      login(res.data.user); // Save user in context + localStorage
      toast.success("✅ Login Successful!");
      navigate("/");
    } catch (error) {
      toast.error("❌ Login Failed! Check credentials.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">🔐 Login</h2>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border px-4 py-2 rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter your password"
          className="w-full border px-4 py-2 rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          🔓 Login
        </button>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <span
            className="text-red-500 hover:underline cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
