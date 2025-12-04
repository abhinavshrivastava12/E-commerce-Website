// 📁 server/controllers/chatController.js
const ChatMessage = require("../models/ChatMessage");
const User = require("../models/User");

// ✅ Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { productId, productName, receiverId, content } = req.body;
    const senderId = req.user.id;

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ error: "Receiver not found" });
    }

    const message = new ChatMessage({
      productId,
      productName,
      senderId,
      senderName: req.user.name,
      receiverId,
      receiverName: receiver.name,
      content,
    });

    await message.save();
    res.status(201).json({ message: "Message sent", chatMessage: message });
  } catch (error) {
    console.error("❌ Send Message Error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

// ✅ Get messages for a product chat
exports.getMessages = async (req, res) => {
  try {
    const { productId, userId } = req.params;
    const currentUserId = req.user.id;

    const messages = await ChatMessage.find({
      productId: parseInt(productId),
      $or: [
        { senderId: currentUserId, receiverId: userId },
        { senderId: userId, receiverId: currentUserId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error("❌ Get Messages Error:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// ✅ Get list of buyers for a product
exports.getBuyers = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // In real app, fetch users who purchased this product
    // For now, return mock data or all users
    const buyers = await User.find().select("name email");
    
    res.json(buyers);
  } catch (error) {
    console.error("❌ Get Buyers Error:", error);
    res.status(500).json({ error: "Failed to fetch buyers" });
  }
};

// ✅ Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    const { productId, senderId } = req.body;
    const receiverId = req.user.id;

    await ChatMessage.updateMany(
      { productId, senderId, receiverId, read: false },
      { read: true }
    );

    res.json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("❌ Mark Read Error:", error);
    res.status(500).json({ error: "Failed to mark as read" });
  }
};