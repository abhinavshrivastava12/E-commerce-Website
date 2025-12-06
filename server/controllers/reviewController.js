// 📁 server/controllers/reviewController.js - COMPLETE FIX
const Review = require("../models/Review");

// ✅ Create a new review
exports.createReview = async (req, res) => {
  try {
    const { productId, productName, rating, title, comment, images } = req.body;
    const userId = req.user.id;

    console.log("📝 Creating review:", { productId, userId });

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
      helpful: 0,
      notHelpful: 0
    });

    await review.save();
    console.log("✅ Review created:", review._id);

    res.status(201).json({ 
      success: true,
      message: "Review created successfully", 
      review 
    });
  } catch (error) {
    console.error("❌ Create Review Error:", error);
    res.status(500).json({ error: "Failed to create review: " + error.message });
  }
};

// ✅ Get all reviews for a product
exports.getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    console.log("📋 Fetching reviews for product:", productId);

    const reviews = await Review.find({ productId })
      .sort({ createdAt: -1 })
      .lean();

    console.log(`✅ Found ${reviews.length} reviews`);

    res.json(reviews);
  } catch (error) {
    console.error("❌ Get Reviews Error:", error);
    res.status(500).json({ error: "Failed to fetch reviews: " + error.message });
  }
};

// ✅ Mark review as helpful/not helpful - FIXED
exports.markHelpful = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body; // "helpful" or "notHelpful"

    console.log(`👍 Marking review ${id} as ${type}`);

    if (!type || !["helpful", "notHelpful"].includes(type)) {
      return res.status(400).json({ error: "Invalid type. Use 'helpful' or 'notHelpful'" });
    }

    const update = type === "helpful" 
      ? { $inc: { helpful: 1 } } 
      : { $inc: { notHelpful: 1 } };

    const review = await Review.findByIdAndUpdate(
      id, 
      update, 
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    console.log(`✅ Review updated: helpful=${review.helpful}, notHelpful=${review.notHelpful}`);

    res.json({ 
      success: true,
      message: "Review updated successfully", 
      review 
    });
  } catch (error) {
    console.error("❌ Mark Helpful Error:", error);
    res.status(500).json({ error: "Failed to update review: " + error.message });
  }
};

// ✅ Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    console.log("🗑️ Deleting review:", id);

    const review = await Review.findOne({ _id: id, userId });

    if (!review) {
      return res.status(404).json({ error: "Review not found or unauthorized" });
    }

    await Review.findByIdAndDelete(id);
    console.log("✅ Review deleted");

    res.json({ 
      success: true,
      message: "Review deleted successfully" 
    });
  } catch (error) {
    console.error("❌ Delete Review Error:", error);
    res.status(500).json({ error: "Failed to delete review: " + error.message });
  }
};