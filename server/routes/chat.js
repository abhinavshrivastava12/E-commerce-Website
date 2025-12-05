// 📁 server/routes/chat.js - ENHANCED VERSION
const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getMessages,
  getBuyers,
  markAsRead,
  getUnreadCount,
  getChatList
} = require("../controllers/chatController");
const requireAuth = require("../middleware/auth");

// ✅ All routes require authentication

// Send a new message
router.post("/message", requireAuth, sendMessage);

// Get messages between two users for a product
router.get("/messages/:productId/:userId", requireAuth, getMessages);

// Get list of buyers/users for a product
router.get("/buyers/:productId", requireAuth, getBuyers);

// Mark messages as read
router.put("/read", requireAuth, markAsRead);

// Get unread message count
router.get("/unread-count", requireAuth, getUnreadCount);

// Get chat list (all conversations)
router.get("/conversations", requireAuth, getChatList);

module.exports = router;