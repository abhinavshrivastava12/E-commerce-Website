// 📁 server/routes/reviews.js
const express = require("express");
const router = express.Router();
const {
  createReview,
  getReviewsByProduct,
  markHelpful,
  deleteReview,
} = require("../controllers/reviewController");
const requireAuth = require("../middleware/auth");

// ✅ Create review (protected)
router.post("/", requireAuth, createReview);

// ✅ Get reviews for a product (public)
router.get("/:productId", getReviewsByProduct);

// ✅ Mark review as helpful (public)
router.put("/:id/helpful", markHelpful);

// ✅ Delete review (protected)
router.delete("/:id", requireAuth, deleteReview);

module.exports = router;