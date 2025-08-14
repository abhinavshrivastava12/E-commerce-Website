import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import products from "../data/products";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

const ProductPage = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));
  const { addToCart } = useCart();

  const [reviews, setReviews] = useState(
    JSON.parse(localStorage.getItem(`reviews-${id}`)) || []
  );
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    document.title = `Abhi ShoppingZone - ${product?.name || "Product Details"}`;
  }, [product]);

  if (!product) return <div className="p-6 text-red-600">❌ Product not found!</div>;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
    toast.success("🛒 Item added to cart!");
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    const newReview = {
      rating,
      comment,
      date: new Date().toLocaleDateString(),
    };
    const updated = [...reviews, newReview];
    setReviews(updated);
    localStorage.setItem(`reviews-${id}`, JSON.stringify(updated));
    setComment("");
    toast.success("✅ Review added!");
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <Link to="/" className="text-blue-500 underline mb-4 block">
        ← Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <img
          src={product.image}
          alt={product.name}
          className="w-full rounded-lg shadow"
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-xl text-red-600 mb-4">₹{product.price}</p>
          <p className="text-gray-600 mb-6">
            This is a detailed description for <strong>{product.name}</strong>.
            It's a great product, highly recommended!
          </p>
          <button
            onClick={handleAddToCart}
            className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* ⭐ Review Section */}
      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-semibold mb-4">⭐ Product Reviews</h2>

        {reviews.length === 0 && (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        )}

        <div className="space-y-4 mb-6">
          {reviews.map((rev, idx) => (
            <div key={idx} className="bg-gray-100 p-4 rounded-lg shadow-sm">
              <div className="text-yellow-500 font-bold">⭐ {rev.rating} / 5</div>
              <p className="text-gray-800">{rev.comment}</p>
              <div className="text-sm text-gray-500 mt-1">{rev.date}</div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmitReview} className="space-y-4">
          <label className="block">
            <span className="font-medium">Rating</span>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="mt-1 block w-full border rounded px-3 py-2"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="font-medium">Comment</span>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              className="mt-1 block w-full border rounded px-3 py-2"
              placeholder="Write your review..."
            />
          </label>

          <button
            type="submit"
            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductPage;
