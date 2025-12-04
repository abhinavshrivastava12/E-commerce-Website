// 📁 server/controllers/reviewController.js
const Review = require("../models/Review");

// ✅ Create a new review
exports.createReview = async (req, res) => {
  try {
    const { productId, productName, rating, title, comment, images } = req.body;
    const userId = req.user.id;

    const review = new Review({
      productId,
      productName,
      userId,
      userName: req.user.name,
      userEmail: req.user.email,
      rating,
      title,
      comment,
      images: images || [],
      verified: true,
    });

    await review.save();
    res.status(201).json({ message: "Review created successfully", review });
  } catch (error) {
    console.error("❌ Create Review Error:", error);
    res.status(500).json({ error: "Failed to create review" });
  }
};

// ✅ Get all reviews for a product
exports.getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error("❌ Get Reviews Error:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

// ✅ Mark review as helpful
exports.markHelpful = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body; // "helpful" or "notHelpful"

    const update = type === "helpful" ? { $inc: { helpful: 1 } } : { $inc: { notHelpful: 1 } };
    const review = await Review.findByIdAndUpdate(id, update, { new: true });

    res.json({ message: "Updated successfully", review });
  } catch (error) {
    console.error("❌ Mark Helpful Error:", error);
    res.status(500).json({ error: "Failed to update review" });
  }
};

// ✅ Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    await Review.findByIdAndDelete(id);
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("❌ Delete Review Error:", error);
    res.status(500).json({ error: "Failed to delete review" });
  }
};