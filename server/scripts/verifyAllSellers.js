// 📁 server/scripts/verifyAllSellers.js
// Run this ONCE to verify all existing sellers

const mongoose = require('mongoose');
require('dotenv').config();

// Seller Model
const sellerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  shopName: String,
  phone: String,
  gstNumber: String,
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  role: { type: String, default: 'seller' },
  totalProducts: { type: Number, default: 0 },
  totalSales: { type: Number, default: 0 }
}, { timestamps: true });

const Seller = mongoose.model('Seller', sellerSchema);

async function verifyAllSellers() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🔄 Finding all sellers...');
    const sellers = await Seller.find({});
    console.log(`✅ Found ${sellers.length} sellers`);

    console.log('🔄 Verifying all sellers...');
    const result = await Seller.updateMany(
      {},
      { 
        $set: { 
          isVerified: true,
          isActive: true 
        } 
      }
    );

    console.log('✅ Verification Complete!');
    console.log(`✅ Modified ${result.modifiedCount} sellers`);
    
    // Display all sellers
    const updatedSellers = await Seller.find({}).select('name email shopName isVerified isActive');
    console.log('\n📋 All Sellers:');
    updatedSellers.forEach((seller, index) => {
      console.log(`${index + 1}. ${seller.name} (${seller.email}) - ${seller.shopName}`);
      console.log(`   ✓ Verified: ${seller.isVerified}`);
      console.log(`   ✓ Active: ${seller.isActive}`);
      console.log('');
    });

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    console.log('\n🎉 All sellers are now verified and can add products!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit();
  }
}

verifyAllSellers();