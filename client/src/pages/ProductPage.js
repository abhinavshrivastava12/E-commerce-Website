// 📁 client/src/pages/ProductPage.js - CHAT BUTTON POSITION FIX
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import staticProducts from "../data/products";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import CustomerFeedback from "../components/CustomerFeedback";
import AIProductChatbot from "../components/AIProductChatbot";
import CustomerChat from "../components/CustomerChat";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [showAI, setShowAI] = useState(false);
  const [showChat, setShowChat] = useState(false);
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const staticProduct = staticProducts.find((p) => p.id === parseInt(id));
        
        if (staticProduct) {
          setProduct(staticProduct);
        } else {
          const response = await axios.get(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/products/${id}`);
          setProduct(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    document.title = `Abhi ShoppingZone - ${product?.name || "Product Details"}`;
    if (product) {
      const stored = localStorage.getItem(`reviews-${id}`);
      setReviews(stored ? JSON.parse(stored) : []);
    }
  }, [product, id]);

  const productImages = product ? [product.image, product.image, product.image] : [];
  
  const relatedProducts = product 
    ? staticProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4) 
    : [];

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      id: product.id || product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
    });
    toast.success(`🛒 ${quantity}x ${product.name} added to cart!`, {
      theme: darkMode ? "dark" : "light"
    });
  };

  // eslint-disable-next-line
  const handleSubmitReview = (e) => {
    e.preventDefault();
    const newReview = {
      rating,
      comment,
      date: new Date().toLocaleDateString(),
      userName: user?.name || "Anonymous User"
    };
    const updated = [...reviews, newReview];
    setReviews(updated);
    localStorage.setItem(`reviews-${id}`, JSON.stringify(updated));
    setComment("");
    setRating(5);
    toast.success("✅ Review submitted successfully!", {
      theme: darkMode ? "dark" : "light"
    });
  };

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : product?.rating || 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">⏳</div>
          <p className="text-xl font-bold">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Product not found!</h1>
          <Link to="/" className="text-blue-600 underline">Go back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      <button onClick={() => setDarkMode(!darkMode)} className={`fixed top-24 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-900 text-yellow-400'}`}>
        {darkMode ? '☀️' : '🌙'}
      </button>
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link to="/" className={`inline-flex items-center gap-2 font-semibold hover:underline ${darkMode ? 'text-purple-400' : 'text-blue-600'}`}>
            ← Back to Products
          </Link>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className={`rounded-3xl overflow-hidden shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <img src={productImages[selectedImage]} alt={product.name} className="w-full h-[500px] object-cover" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {productImages.map((img, idx) => (
                <button key={idx} onClick={() => setSelectedImage(idx)} className={`rounded-xl overflow-hidden transition-all duration-300 ${selectedImage === idx ? 'ring-4 ring-purple-600 scale-105' : 'opacity-60 hover:opacity-100'}`}>
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-24 object-cover" />
                </button>
              ))}
            </div>
          </div>
          
          {/* Product Details */}
          <div className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <div className="flex flex-wrap gap-2 mb-4">
              {product.trending && <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-bold">🔥 Trending</span>}
              {product.bestSeller && <span className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold">🏆 Best Seller</span>}
              {product.featured && <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-2 rounded-full text-sm font-bold">⭐ Featured</span>}
            </div>
            
            <h1 className="text-5xl font-black mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center">
                <span className="text-yellow-400 text-2xl">⭐</span>
                <span className="text-2xl font-bold ml-2">{avgRating}</span>
                <span className={`ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>({reviews.length} reviews)</span>
              </div>
              <span className={`px-4 py-2 rounded-full font-bold ${product.stock > 10 ? 'bg-green-500 text-white' : product.stock > 0 ? 'bg-yellow-500 text-black' : 'bg-red-500 text-white'}`}>
                {product.stock > 10 ? '✓ In Stock' : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of Stock'}
              </span>
            </div>
            
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-2">
                <span className={`text-6xl font-black ${darkMode ? 'text-purple-400' : 'text-red-600'}`}>₹{product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className={`text-3xl line-through ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>₹{product.originalPrice}</span>
                    <span className="bg-red-600 text-white px-4 py-2 rounded-full font-bold">{product.discount}% OFF</span>
                  </>
                )}
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Inclusive of all taxes</p>
            </div>
            
            <div className={`mb-8 p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <h3 className="text-xl font-bold mb-3">Product Description</h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                {product.description || `This is a premium quality ${product.name} from our collection. Designed with attention to detail and built to last, this product offers exceptional value for money. Perfect for daily use and comes with manufacturer warranty.`}
              </p>
            </div>
            
            <div className="mb-8">
              <label className="block text-lg font-bold mb-3">Quantity</label>
              <div className="flex items-center gap-4">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className={`w-12 h-12 rounded-xl font-bold text-xl transition-all ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}>-</button>
                <span className="text-3xl font-bold w-16 text-center">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className={`w-12 h-12 rounded-xl font-bold text-xl transition-all ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}>+</button>
              </div>
            </div>
            
            <div className="flex gap-4 mb-8">
              <button onClick={handleAddToCart} disabled={product.stock === 0} className={`flex-1 py-5 rounded-2xl font-black text-xl transition-all duration-300 transform hover:scale-105 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${darkMode ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500' : 'bg-gradient-to-r from-black to-gray-800 text-white hover:from-red-600 hover:to-pink-600'}`}>
                🛒 Add to Cart
              </button>
              <button className={`px-8 py-5 rounded-2xl font-black text-xl transition-all duration-300 transform hover:scale-105 shadow-xl ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100 border-2 border-gray-300'}`}>❤️</button>
            </div>
            
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <h3 className="text-xl font-bold mb-4">Why Buy This?</h3>
              <ul className="space-y-3">
                {['Premium Quality', 'Fast Delivery', 'Easy Returns', 'Secure Payment'].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <span className="text-green-500 text-xl">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <CustomerFeedback productId={product.id || product._id} productName={product.name} darkMode={darkMode} />
        
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className={`text-4xl font-black mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p) => (
                <Link key={p.id} to={`/product/${p.id}`} className={`block rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <img src={p.image} alt={p.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{p.name}</h3>
                    <p className={`text-xl font-bold ${darkMode ? 'text-purple-400' : 'text-red-600'}`}>₹{p.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* ✅ FIXED: Chat Buttons Position - Better Spacing */}
      {!showAI && !showChat && (
        <>
          {/* AI Chatbot Button */}
          <button 
            onClick={() => setShowAI(true)} 
            className={`fixed bottom-32 right-6 z-40 p-4 rounded-full shadow-2xl transition-all hover:scale-110 ${
              darkMode ? 'bg-purple-600 text-white' : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
            }`} 
            title="Get AI Recommendations"
          >
            <span className="text-2xl">🤖</span>
          </button>
          
          {/* Customer Chat Button */}
          <button 
            onClick={() => setShowChat(true)} 
            className={`fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-2xl transition-all hover:scale-110 ${
              darkMode ? 'bg-blue-600 text-white' : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
            }`} 
            title="Chat with Buyers"
          >
            <span className="text-2xl">💬</span>
          </button>
        </>
      )}
      
      {showAI && <AIProductChatbot products={staticProducts} onClose={() => setShowAI(false)} darkMode={darkMode} />}
      {showChat && user && <CustomerChat productId={product.id || product._id} productName={product.name} currentUser={user} onClose={() => setShowChat(false)} darkMode={darkMode} />}
    </div>
  );
};

export default ProductPage;