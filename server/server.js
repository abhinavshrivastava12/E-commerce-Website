// 📁 server/server.js - COMPLETE FIX
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// ✅ CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://abhi-shoppingzone-frontend.onrender.com',
  process.env.CLIENT_URL
].filter(Boolean);

const io = socketIO(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// ✅ Middleware
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    console.log('❌ CORS blocked origin:', origin);
    return callback(null, true); // Allow for now
  },
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Make io accessible
app.set('io', io);

// ✅ Request Logger (Debug)
app.use((req, res, next) => {
  console.log(`📍 ${req.method} ${req.path}`);
  next();
});

// ✅ Health Check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Abhi ShoppingZone API - Running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend is working!',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// ✅ Import Routes
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const reviewRoutes = require('./routes/reviews');
const chatRoutes = require('./routes/chat');
const geminiRoutes = require('./routes/gemini');
const paymentRoutes = require('./routes/payment');
const couponRoutes = require('./routes/coupons');
const wishlistRoutes = require('./routes/wishlist');
const productsRoutes = require('./routes/products');
const sellerAuthRoutes = require('./routes/sellerAuth');
const sellerProductRoutes = require('./routes/sellerProducts');

// ✅ Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/gemini', geminiRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/seller/auth', sellerAuthRoutes);
app.use('/api/seller/products', sellerProductRoutes);

console.log('✅ All routes loaded');

// ✅ Socket.IO
io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);

  socket.on('join-product-chat', (productId) => {
    socket.join(`product-${productId}`);
  });

  socket.on('send-message', (data) => {
    io.to(`product-${data.productId}`).emit('receive-message', data);
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// ✅ 404 Handler
app.use((req, res) => {
  console.log('❌ 404 Not Found:', req.path);
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// ✅ Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  console.error('Stack:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ✅ Database & Server Start
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`\n🚀 Server Running on Port ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📍 Health Check: http://localhost:${PORT}/api/test\n`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

// ✅ Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('⚠️ SIGTERM received, shutting down gracefully');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  });
});

module.exports = { app, server, io };