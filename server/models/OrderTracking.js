const mongoose = require('mongoose');

const orderTrackingSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered'],
    default: 'pending'
  },
  timeline: [{
    status: String,
    timestamp: Date,
    location: String,
    message: String
  }],
  estimatedDelivery: Date,
  trackingNumber: String
}, { timestamps: true });

module.exports = mongoose.model('OrderTracking', orderTrackingSchema);