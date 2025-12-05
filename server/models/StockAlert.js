const mongoose = require('mongoose');

const stockAlertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: Number, required: true },
  email: { type: String, required: true },
  notified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('StockAlert', stockAlertSchema);