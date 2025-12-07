// 📁 client/src/config/api.js - API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Base
  BASE: API_BASE_URL,
  
  // Auth
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  
  // Orders
  ORDERS: `${API_BASE_URL}/api/orders`,
  MY_ORDERS: `${API_BASE_URL}/api/orders/my`,
  
  // Products
  PRODUCTS: `${API_BASE_URL}/api/products/all`,
  PRODUCT_BY_ID: (id) => `${API_BASE_URL}/api/products/${id}`,
  
  // Coupons
  VALIDATE_COUPON: `${API_BASE_URL}/api/coupons/validate`,
  USE_COUPON: `${API_BASE_URL}/api/coupons/use`,
  
  // Gemini AI
  GEMINI: `${API_BASE_URL}/api/gemini`,
  
  // Chat
  CHAT_MESSAGE: `${API_BASE_URL}/api/chat/message`,
  CHAT_BUYERS: (productId) => `${API_BASE_URL}/api/chat/buyers/${productId}`,
  CHAT_MESSAGES: (productId, userId) => `${API_BASE_URL}/api/chat/messages/${productId}/${userId}`,
  
  // Seller
  SELLER_LOGIN: `${API_BASE_URL}/api/seller/auth/login`,
  SELLER_REGISTER: `${API_BASE_URL}/api/seller/auth/register`,
  SELLER_PRODUCTS: `${API_BASE_URL}/api/seller/products/my-products`,
  SELLER_ADD_PRODUCT: `${API_BASE_URL}/api/seller/products/add`,
  SELLER_DASHBOARD: `${API_BASE_URL}/api/seller/products/dashboard`,
};

export default API_BASE_URL;