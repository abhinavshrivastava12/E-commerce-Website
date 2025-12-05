// 📁 server/controllers/chatController.js - COMPLETE VERSION
const ChatMessage = require("../models/ChatMessage");
const User = require("../models/User");

// ✅ Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { productId, productName, receiverId, content } = req.body;
    const senderId = req.user.id;

    // Get sender and receiver details
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({ error: "Receiver not found" });
    }

    const message = new ChatMessage({
      productId,
      productName,
      senderId,
      senderName: sender.name,
      receiverId,
      receiverName: receiver.name,
      content,
    });

    await message.save();
    
    res.status(201).json({ 
      message: "Message sent successfully", 
      chatMessage: message 
    });
  } catch (error) {
    console.error("❌ Send Message Error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

// ✅ Get messages for a product chat between two users
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

// ✅ Get list of real users who have purchased or interacted with product
exports.getBuyers = async (req, res) => {
  try {
    const { productId } = req.params;
    const currentUserId = req.user.id;
    
    // Get all users except current user
    // In production, you'd filter by actual purchase history
    const buyers = await User.find({ 
      _id: { $ne: currentUserId } 
    }).select("name email");
    
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
      { 
        productId: parseInt(productId), 
        senderId, 
        receiverId, 
        read: false 
      },
      { read: true }
    );

    res.json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("❌ Mark Read Error:", error);
    res.status(500).json({ error: "Failed to mark as read" });
  }
};

// ✅ Get unread message count
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const unreadCount = await ChatMessage.countDocuments({
      receiverId: userId,
      read: false
    });

    res.json({ unreadCount });
  } catch (error) {
    console.error("❌ Get Unread Count Error:", error);
    res.status(500).json({ error: "Failed to get unread count" });
  }
};

// ✅ Get chat list (all conversations)
exports.getChatList = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all unique conversations
    const conversations = await ChatMessage.aggregate([
      {
        $match: {
          $or: [
            { senderId: userId },
            { receiverId: userId }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$senderId', userId] },
              '$receiverId',
              '$senderId'
            ]
          },
          lastMessage: { $first: '$content' },
          lastMessageTime: { $first: '$createdAt' },
          productId: { $first: '$productId' },
          productName: { $first: '$productName' },
          unread: {
            $sum: {
              $cond: [
                { $and: [
                  { $eq: ['$receiverId', userId] },
                  { $eq: ['$read', false] }
                ]},
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    // Populate user details
    const chatList = await Promise.all(
      conversations.map(async (conv) => {
        const user = await User.findById(conv._id).select('name email');
        return {
          userId: conv._id,
          userName: user?.name || 'Unknown User',
          userEmail: user?.email || '',
          lastMessage: conv.lastMessage,
          lastMessageTime: conv.lastMessageTime,
          productId: conv.productId,
          productName: conv.productName,
          unreadCount: conv.unread
        };
      })
    );

    res.json(chatList);
  } catch (error) {
    console.error("❌ Get Chat List Error:", error);
    res.status(500).json({ error: "Failed to fetch chat list" });
  }
};