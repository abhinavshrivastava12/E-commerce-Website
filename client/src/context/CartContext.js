import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add item to cart
  const addToCart = (item) => {
    if (!item || typeof item !== "object" || !item.id) {
      console.error("🚫 Invalid item passed to addToCart:", item);
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id);

      if (existingItem) {
        // Increase quantity if item exists
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      } else {
        // Add new item
        return [...prevCart, item];
      }
    });
  };

  // ⭐ FIXED: updateQuantity function added
  const updateQuantity = (id, newQty) => {
    setCart((prevCart) =>
      prevCart.map((i) =>
        i.id === id ? { ...i, quantity: newQty } : i
      )
    );
  };

  // Remove item
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Clear all
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,   // ⭐ Important
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
