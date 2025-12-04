const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 🌐 Default Route
app.get('/', (req, res) => {
  res.send('Abhi ShoppingZone API is running...');
});

// 🔁 Import Routes
const authRoutes = require('./routes/auth'); // ✅ USE THIS
const productRoutes = require('./routes/products'); // optional
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payment'); // ✅ for WhatsApp link
// const reviewRoutes = require('./routes/reviewRoutes'); // if added
const reviewRoutes = require('./routes/reviews');
const chatRoutes = require('./routes/chat');
const geminiRoutes = require("./routes/gemini");

// 🔗 Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/chat', chatRoutes);
app.use("/api/gemini", geminiRoutes); 
// app.use('/api/reviews', reviewRoutes); // optional
// app.use('/api/products', productRoutes); // if you use product DB

// 🚀 Connect to DB & Start Server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error('❌ MongoDB Error:', err));
  console.log("BACKEND GEMINI KEY:", process.env.GEMINI_API_KEY);

