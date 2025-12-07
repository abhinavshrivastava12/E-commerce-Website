// 📁 server/server.js - PRODUCTION READY
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// ✅ PRODUCTION CORS - Multiple origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://abhi-shoppingzone-frontend.onrender.com', // 👈 UPDATE THIS AFTER FRONTEND DEPLOY
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
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy violation'), false);
    }
    return callback(null, true);
  },
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
    message: 'Abhi ShoppingZone API - Production Server Running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

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

const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const reviewRoutes = require('./routes/reviews');
const chatRoutes = require('./routes/chat');
const geminiRoutes = require('./routes/gemini');
const paymentRoutes = require('./routes/payment');
const couponRoutes = require('./routes/coupons');
const wishlistRoutes = require('./routes/wishlist');
const sellerAuthRoutes = require('./routes/sellerAuth');
const sellerProductRoutes = require('./routes/sellerProducts');

// =====================================
// 🛣️ USE ALL ROUTES
// =====================================

app.use('/api/auth', authRoutes);
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reviews', reviewRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/gemini', geminiRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/products', require('./routes/products'));
app.use('/api/seller/auth', sellerAuthRoutes);
app.use('/api/seller/products', sellerProductRoutes);

// =====================================
// 🔌 SOCKET.IO
// =====================================

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

// =====================================
// ❌ ERROR HANDLING
// =====================================

app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path
  });
});

app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// =====================================
// 🗄️ DATABASE & SERVER START
// =====================================

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`\n🚀 Server Running on Port ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Error:', err);
    process.exit(1);
  });

// =====================================
// 🔄 GRACEFUL SHUTDOWN
// =====================================

process.on('SIGTERM', () => {
  server.close(() => {
    mongoose.connection.close(false, () => {
      process.exit(0);
    });
  });
});

module.exports = { app, server, io };