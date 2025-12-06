// 📁 server/server.js - COMPLETE PRODUCTION-READY VERSION
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Socket.IO Setup with CORS
const io = socketIO(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// ✅ Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Make io accessible in routes
app.set('io', io);

// ✅ Health Check Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Abhi ShoppingZone API - All Systems Operational',
    features: [
      'User Authentication',
      'Seller Panel',
      'Order Management',
      'Real-time Chat',
      'Payment Integration',
      'AI Product Assistant',
      'Review System',
      'Coupon System'
    ],
    timestamp: new Date().toISOString()
  });
});

// ✅ Test Route
app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend is working!',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// =====================================
// 🔗 IMPORT ALL ROUTES
// =====================================

// User Routes
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const reviewRoutes = require('./routes/reviews');
const chatRoutes = require('./routes/chat');

// Feature Routes
const geminiRoutes = require('./routes/gemini');
const paymentRoutes = require('./routes/payment');
const couponRoutes = require('./routes/coupons');
const wishlistRoutes = require('./routes/wishlist');

// Seller Routes
const sellerAuthRoutes = require('./routes/sellerAuth');
const sellerProductRoutes = require('./routes/sellerProducts');

// =====================================
// 🛣️ USE ALL ROUTES
// =====================================

// User Authentication & Features
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/chat', chatRoutes);

// Additional Features
app.use('/api/gemini', geminiRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/products', require('./routes/products'));

// Seller Panel
app.use('/api/seller/auth', sellerAuthRoutes);
app.use('/api/seller/products', sellerProductRoutes);

// =====================================
// 🔌 SOCKET.IO REAL-TIME FEATURES
// =====================================

io.on('connection', (socket) => {
  console.log('✅ New client connected:', socket.id);

  // Join product chat room
  socket.on('join-product-chat', (productId) => {
    socket.join(`product-${productId}`);
    console.log(`📦 User ${socket.id} joined product chat: ${productId}`);
  });

  // Send message in chat
  socket.on('send-message', (data) => {
    console.log('💬 Message sent:', data);
    io.to(`product-${data.productId}`).emit('receive-message', data);
  });

  // Typing indicator
  socket.on('typing', (data) => {
    socket.to(`product-${data.productId}`).emit('user-typing', data);
  });

  // Stop typing
  socket.on('stop-typing', (data) => {
    socket.to(`product-${data.productId}`).emit('user-stopped-typing', data);
  });

  // Order status update
  socket.on('order-update', (data) => {
    io.to(`user-${data.userId}`).emit('order-status-changed', data);
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// =====================================
// ❌ ERROR HANDLING MIDDLEWARE
// =====================================

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method,
    message: 'The requested endpoint does not exist'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// =====================================
// 🗄️ DATABASE CONNECTION & SERVER START
// =====================================

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    console.log('📊 Database:', mongoose.connection.name);
    
    server.listen(PORT, () => {
      console.log('\n╔════════════════════════════════════════╗');
      console.log('║   🚀 SERVER STARTED SUCCESSFULLY      ║');
      console.log('╠════════════════════════════════════════╣');
      console.log(`║   📡 Port: ${PORT.toString().padEnd(28)}║`);
      console.log(`║   🌐 URL: http://localhost:${PORT}`.padEnd(41) + '║');
      console.log('║   ⚡ Socket.IO: ENABLED               ║');
      console.log('║   🏪 Seller Panel: ACTIVE             ║');
      console.log('║   🤖 AI Assistant: READY              ║');
      console.log('║   💬 Real-time Chat: ENABLED          ║');
      console.log('║   🎫 Coupon System: ACTIVE            ║');
      console.log('╚════════════════════════════════════════╝\n');
      
      console.log('📋 Available Endpoints:');
      console.log('   • GET  /                          - Health check');
      console.log('   • GET  /api/test                  - API test');
      console.log('   • POST /api/auth/register         - User registration');
      console.log('   • POST /api/auth/login            - User login');
      console.log('   • POST /api/seller/auth/register  - Seller registration');
      console.log('   • POST /api/seller/auth/login     - Seller login');
      console.log('   • GET  /api/orders/my             - Get user orders');
      console.log('   • POST /api/chat/message          - Send chat message');
      console.log('   • POST /api/gemini                - AI assistant');
      console.log('\n🎯 Ready to accept requests!\n');
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.error('💡 Make sure MongoDB is running and MONGO_URI is correct in .env');
    process.exit(1);
  });

// =====================================
// 🔄 GRACEFUL SHUTDOWN
// =====================================

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, closing server gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    mongoose.connection.close(false, () => {
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, closing server gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    mongoose.connection.close(false, () => {
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = { app, server, io };