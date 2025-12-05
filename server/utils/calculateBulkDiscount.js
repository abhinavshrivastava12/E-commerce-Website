const calculateBulkDiscount = (cart) => {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  if (totalItems >= 10) return 15; // 15% off for 10+ items
  if (totalItems >= 5) return 10;  // 10% off for 5+ items
  if (totalItems >= 3) return 5;   // 5% off for 3+ items
  return 0;
};

module.exports = calculateBulkDiscount;