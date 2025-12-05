const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Socket.IO Setup
const io = socketIO(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// Make io accessible
app.set('io', io);

// Default Route
app.get('/', (req, res) => {
  res.send('Abhi ShoppingZone API - Seller Panel Enabled');
});

// 🔗 Import Routes
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payment');
const reviewRoutes = require('./routes/reviews');
const chatRoutes = require('./routes/chat');
const geminiRoutes = require("./routes/gemini");
const couponRoutes = require('./routes/coupons');
const wishlistRoutes = require('./routes/wishlist');

// 🆕 SELLER ROUTES
const sellerAuthRoutes = require('./routes/sellerAuth');
const sellerProductRoutes = require('./routes/sellerProducts');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/chat', chatRoutes);
app.use("/api/gemini", geminiRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/wishlist', wishlistRoutes);

// 🆕 Seller Routes
app.use('/api/seller/auth', sellerAuthRoutes);
app.use('/api/seller/products', sellerProductRoutes);

// Socket.IO
io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  socket.on('join-product-chat', (productId) => {
    socket.join(`product-${productId}`);
  });

  socket.on('send-message', (data) => {
    io.to(`product-${data.productId}`).emit('receive-message', data);
  });

  socket.on('typing', (data) => {
    socket.to(`product-${data.productId}`).emit('user-typing', data);
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

// Connect to DB & Start Server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    server.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
      console.log(`⚡ Socket.IO enabled`);
      console.log(`🏪 Seller Panel Active`);
    });
  })
  .catch((err) => console.error('❌ MongoDB Error:', err));