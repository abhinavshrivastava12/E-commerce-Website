// 📁 client/src/context/AuthContext.js - FIXED VERSION
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // ✅ Validate that token exists
          if (parsedUser && parsedUser.token) {
            setUser(parsedUser);
          } else {
            localStorage.removeItem("user");
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData) => {
    // ✅ Ensure token is present
    if (!userData.token) {
      console.error("Login failed: No token provided");
      return false;
    }
    
    const userWithToken = {
      ...userData.user,
      token: userData.token
    };
    
    setUser(userWithToken);
    localStorage.setItem("user", JSON.stringify(userWithToken));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
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