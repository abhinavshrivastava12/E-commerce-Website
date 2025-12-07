// 📁 client/src/context/AuthContext.js - COMPLETE FIX
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem("user");
        console.log("🔍 Checking stored user:", storedUser);
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log("✅ Parsed user:", parsedUser);
          
          // Validate that user has required fields
          if (parsedUser && parsedUser.token && parsedUser.id) {
            setUser(parsedUser);
            console.log("✅ User authenticated:", parsedUser.email);
          } else {
            console.log("❌ Invalid user data, clearing storage");
            localStorage.removeItem("user");
          }
        }
      } catch (error) {
        console.error("❌ Auth check error:", error);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

    const login = (userData) => {
    console.log("🔐 Login called with:", userData);
    
    // ✅ SAHI VALIDATION
    if (!userData || !userData.token) {
      console.error("❌ Login failed: No token provided");
      return false;
    }

    // ✅ PROPER USER OBJECT
    const userWithToken = {
      id: userData.user?.id || userData.user?._id || userData.id,
      name: userData.user?.name || userData.name,
      email: userData.user?.email || userData.email,
      token: userData.token
    };

    console.log("✅ Setting user:", userWithToken);
    
    setUser(userWithToken);
    localStorage.setItem("user", JSON.stringify(userWithToken));
    
    return true;
  };

  const logout = () => {
    console.log("🔓 Logging out");
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};