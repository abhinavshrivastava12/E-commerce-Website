const mongoose = require('mongoose');

const priceAlertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: Number, required: true },
  productName: String,
  targetPrice: { type: Number, required: true },
  currentPrice: { type: Number, required: true },
  email: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('PriceAlert', priceAlertSchema);