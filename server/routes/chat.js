// 📁 server/routes/chat.js
const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getMessages,
  getBuyers,
  markAsRead,
} = require("../controllers/chatController");
const requireAuth = require("../middleware/auth");

// ✅ All routes are protected
router.post("/message", requireAuth, sendMessage);
router.get("/messages/:productId/:userId", requireAuth, getMessages);
router.get("/buyers/:productId", requireAuth, getBuyers);
router.put("/read", requireAuth, markAsRead);

module.exports = router;