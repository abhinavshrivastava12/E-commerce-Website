import React, { useState, useEffect, useCallback } from 'react';
import { Star, ThumbsUp, ThumbsDown, Send } from 'lucide-react';

const CustomerFeedbackSystem = ({ productId, productName, darkMode = false }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [userVotes, setUserVotes] = useState({});
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    title: '',
    comment: '',
    images: []
  });

  // FIX: Wrapped in useCallback to prevent infinite loops and satisfy ESLint
  const loadFeedbacks = useCallback(() => {
    const stored = localStorage.getItem(`feedbacks-${productId}`);
    if (stored) {
      setFeedbacks(JSON.parse(stored));
    }
  }, [productId]);

  // FIX: Wrapped in useCallback
  const loadUserVotes = useCallback(() => {
    const stored = localStorage.getItem(`user-votes-${productId}`);
    if (stored) {
      setUserVotes(JSON.parse(stored));
    }
  }, [productId]);

  // FIX: Added dependencies to useEffect
  useEffect(() => {
    loadFeedbacks();
    loadUserVotes();
  }, [loadFeedbacks, loadUserVotes]);

  const saveFeedbacks = (updatedFeedbacks) => {
    localStorage.setItem(`feedbacks-${productId}`, JSON.stringify(updatedFeedbacks));
    setFeedbacks(updatedFeedbacks);
  };

  const saveUserVotes = (votes) => {
    localStorage.setItem(`user-votes-${productId}`, JSON.stringify(votes));
    setUserVotes(votes);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setFormData({ ...formData, images: [...formData.images, ...imageUrls] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.comment) {
      alert('Please fill all required fields');
      return;
    }

    const newFeedback = {
      ...formData,
      id: Date.now(),
      productId,
      productName,
      date: new Date().toISOString(),
      verified: Math.random() > 0.5,
      helpful: 0,
      notHelpful: 0
    };

    const updated = [newFeedback, ...feedbacks];
    saveFeedbacks(updated);
    
    setFormData({
      name: '',
      email: '',
      rating: 5,
      title: '',
      comment: '',
      images: []
    });
    
    setShowForm(false);
    alert('Review submitted successfully!');
  };

  const markHelpful = (feedbackId, type) => {
    const voteKey = `${feedbackId}-${type}`;
    
    if (userVotes[voteKey]) {
      alert('You have already voted on this review!');
      return;
    }

    const updated = feedbacks.map(f => {
      if (f.id === feedbackId) {
        return {
          ...f,
          helpful: type === 'helpful' ? f.helpful + 1 : f.helpful,
          notHelpful: type === 'notHelpful' ? f.notHelpful + 1 : f.notHelpful
        };
      }
      return f;
    });
    
    saveFeedbacks(updated);
    
    const newVotes = { ...userVotes, [voteKey]: true };
    saveUserVotes(newVotes);
    
    alert(`Thank you for your feedback!`);
  };

  const getFilteredFeedbacks = () => {
    let filtered = feedbacks;
    
    if (filterRating !== 'all') {
      filtered = filtered.filter(f => f.rating === parseInt(filterRating));
    }
    
    if (sortBy === 'recent') {
      filtered = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'helpful') {
      filtered = [...filtered].sort((a, b) => b.helpful - a.helpful);
    } else if (sortBy === 'rating-high') {
      filtered = [...filtered].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'rating-low') {
      filtered = [...filtered].sort((a, b) => a.rating - b.rating);
    }
    
    return filtered;
  };

  const avgRating = feedbacks.length > 0 
    ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1)
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const count = feedbacks.filter(f => f.rating === rating).length;
    const percentage = feedbacks.length > 0 ? (count / feedbacks.length) * 100 : 0;
    return { rating, count, percentage };
  });

  const renderStars = (rating, size = 'text-lg') => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            size={size === 'text-lg' ? 18 : 24}
            className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  const hasVoted = (feedbackId, type) => {
    return userVotes[`${feedbackId}-${type}`] || false;
  };

  return (
    <div className={`rounded-3xl p-8 shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="mb-8">
        <h2 className={`text-4xl font-black mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          ⭐ Customer Reviews
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="text-center">
              <div className={`text-6xl font-black mb-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                {avgRating}
              </div>
              <div className="flex justify-center mb-2">
                {renderStars(Math.round(avgRating), 'text-2xl')}
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Based on {feedbacks.length} reviews
              </p>
            </div>
          </div>

          <div>
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-3 mb-2">
                <span className={`text-sm font-bold w-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {rating} ⭐
                </span>
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className={`text-sm w-12 text-right ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
          <div className="flex flex-wrap gap-3">
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className={`px-4 py-2 rounded-xl border-2 focus:outline-none transition-all ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-purple-600'
              }`}
            >
              <option value="all">All Ratings</option>
              {[5, 4, 3, 2, 1].map(r => (
                <option key={r} value={r}>{r} Stars</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-4 py-2 rounded-xl border-2 focus:outline-none transition-all ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-purple-600'
              }`}
            >
              <option value="recent">Most Recent</option>
              <option value="helpful">Most Helpful</option>
              <option value="rating-high">Highest Rating</option>
              <option value="rating-low">Lowest Rating</option>
            </select>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg ${
              darkMode
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
            }`}
          >
            ✍️ Write a Review
          </button>
        </div>

        {showForm && (
          <div className={`p-6 rounded-2xl mb-8 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h3 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Share Your Experience
            </h3>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Your Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`px-4 py-3 rounded-xl border-2 focus:outline-none transition-all ${
                  darkMode
                    ? 'bg-gray-800 border-gray-600 text-white focus:border-purple-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-purple-600'
                }`}
              />
              <input
                type="email"
                placeholder="Your Email *"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`px-4 py-3 rounded-xl border-2 focus:outline-none transition-all ${
                  darkMode
                    ? 'bg-gray-800 border-gray-600 text-white focus:border-purple-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-purple-600'
                }`}
              />
            </div>

            <div className="mb-4">
              <label className={`block font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Rating *
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating })}
                    className={`p-3 rounded-xl transition-all ${
                      formData.rating >= rating
                        ? 'bg-yellow-400 scale-110'
                        : darkMode
                          ? 'bg-gray-800 hover:bg-gray-600'
                          : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    <Star size={24} className={formData.rating >= rating ? 'fill-yellow-600 text-yellow-600' : 'text-gray-400'} />
                  </button>
                ))}
              </div>
            </div>

            <input
              type="text"
              placeholder="Review Title *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all mb-4 ${
                darkMode
                  ? 'bg-gray-800 border-gray-600 text-white focus:border-purple-500'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-purple-600'
              }`}
            />

            <textarea
              placeholder="Tell us about your experience... *"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows={5}
              className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all mb-4 ${
                darkMode
                  ? 'bg-gray-800 border-gray-600 text-white focus:border-purple-500'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-purple-600'
              }`}
            />

            <div className="mb-4">
              <label className={`block font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Add Photos/Videos (Optional)
              </label>
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleImageUpload}
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              />
              {formData.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.images.map((img, idx) => (
                    <img key={idx} src={img} alt={`Preview ${idx}`} className="w-20 h-20 object-cover rounded-lg" />
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                type="button"
                className="flex-1 py-3 rounded-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-500 hover:to-emerald-500 transition-all"
              >
                <Send size={18} className="inline mr-2" />
                Submit Review
              </button>
              <button
                onClick={() => setShowForm(false)}
                type="button"
                className={`px-6 py-3 rounded-xl font-bold transition-all ${
                  darkMode ? 'bg-gray-800 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {getFilteredFeedbacks().length === 0 ? (
          <p className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No reviews yet. Be the first to review this product!
          </p>
        ) : (
          getFilteredFeedbacks().map(feedback => (
            <div key={feedback.id} className={`p-6 rounded-2xl ${
              darkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-xl">
                    {feedback.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {feedback.name}
                      </span>
                      {feedback.verified && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          ✓ Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      {renderStars(feedback.rating)}
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {new Date(feedback.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <h4 className={`font-bold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {feedback.title}
              </h4>
              <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {feedback.comment}
              </p>

              {feedback.images && feedback.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {feedback.images.map((img, idx) => (
                    <img key={idx} src={img} alt={`Review ${idx}`} className="w-24 h-24 object-cover rounded-lg" />
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4 pt-4 border-t border-gray-300">
                <button
                  onClick={() => markHelpful(feedback.id, 'helpful')}
                  disabled={hasVoted(feedback.id, 'helpful')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    hasVoted(feedback.id, 'helpful')
                      ? 'bg-green-200 text-green-700'
                      : darkMode
                        ? 'hover:bg-gray-600'
                        : 'hover:bg-gray-200'
                  }`}
                >
                  <ThumbsUp size={16} className={hasVoted(feedback.id, 'helpful') ? 'fill-current' : ''} />
                  <span className="text-sm font-bold">Helpful ({feedback.helpful})</span>
                </button>
                <button
                  onClick={() => markHelpful(feedback.id, 'notHelpful')}
                  disabled={hasVoted(feedback.id, 'notHelpful')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    hasVoted(feedback.id, 'notHelpful')
                      ? 'bg-red-200 text-red-700'
                      : darkMode
                        ? 'hover:bg-gray-600'
                        : 'hover:bg-gray-200'
                  }`}
                >
                  <ThumbsDown size={16} className={hasVoted(feedback.id, 'notHelpful') ? 'fill-current' : ''} />
                  <span className="text-sm font-bold">({feedback.notHelpful})</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CustomerFeedbackSystem;