// 📁 client/src/components/Footer.js - COMPLETE WITH CONTACT & SUBSCRIBE
import React, { useState } from "react";
import { toast } from "react-toastify";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error("❌ Please enter a valid email");
      return;
    }

    setLoading(true);

    // ✅ FIXED: Subscribe functionality
    try {
      // Simulate API call (you can connect to a real newsletter service)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage for now
      const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
      
      if (subscribers.includes(email)) {
        toast.info("📧 You're already subscribed!");
      } else {
        subscribers.push(email);
        localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
        toast.success("✅ Successfully subscribed to newsletter!");
        setEmail("");
      }
    } catch (error) {
      toast.error("❌ Failed to subscribe. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-3xl font-black mb-2">📧 Subscribe to Our Newsletter</h3>
              <p className="text-purple-100">Get exclusive deals, updates, and offers!</p>
            </div>
            
            <form onSubmit={handleSubscribe} className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={loading}
                className="px-6 py-4 rounded-full text-gray-900 font-semibold focus:outline-none focus:ring-4 focus:ring-white/50 w-full md:w-80 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-white text-purple-600 px-8 py-4 rounded-full font-black hover:bg-yellow-400 hover:text-black transition-all transform hover:scale-105 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '⏳' : '✓ Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* About Section */}
          <div>
            <h4 className="text-2xl font-black mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Abhi ShoppingZone
            </h4>
            <p className="text-gray-400 mb-4">
              Your one-stop destination for all shopping needs. Quality products, best prices, and amazing service!
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-purple-600 rounded-full flex items-center justify-center transition-all transform hover:scale-110">
                📘
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all transform hover:scale-110">
                🐦
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-pink-600 rounded-full flex items-center justify-center transition-all transform hover:scale-110">
                📷
              </a>
              <a href={`https://wa.me/919696400628`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-green-600 rounded-full flex items-center justify-center transition-all transform hover:scale-110">
                💬
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-xl font-bold mb-4">Quick Links</h5>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-purple-400 transition-colors">🏠 Home</a></li>
              <li><a href="/cart" className="hover:text-purple-400 transition-colors">🛒 Cart</a></li>
              <li><a href="/orders" className="hover:text-purple-400 transition-colors">📦 Orders</a></li>
              <li><a href="/seller/login" className="hover:text-purple-400 transition-colors">🏪 Seller Panel</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h5 className="text-xl font-bold mb-4">Customer Service</h5>
            <ul className="space-y-2 text-gray-400">
              <li><button onClick={() => {}} className="hover:text-purple-400 transition-colors">❓ Help Center</button></li>
              <li><button onClick={() => {}} className="hover:text-purple-400 transition-colors">🔄 Returns</button></li>
              <li><button onClick={() => {}} className="hover:text-purple-400 transition-colors">🚚 Track Order</button></li>
              <li><button onClick={() => {}} className="hover:text-purple-400 transition-colors">📞 Contact Us</button></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h5 className="text-xl font-bold mb-4">Contact Us</h5>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-xl">📧</span>
                <a href="mailto:abhinavshrivastava182@gmail.com" className="hover:text-purple-400 transition-colors break-all">
                  abhinavshrivastava182@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-xl">📱</span>
                <a href="tel:+919696400628" className="hover:text-purple-400 transition-colors">
                  +91 96964 00628
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-xl">💬</span>
                <a href={`https://wa.me/919696400628`} target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">
                  WhatsApp Support
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-xl">📍</span>
                <span>Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-center md:text-left">
              © {new Date().getFullYear()} Abhi ShoppingZone. All rights reserved by <span className="text-purple-400 font-bold">Abhinav Shrivastava</span>.
            </p>
            
            <div className="flex gap-6 text-gray-400 text-sm">
              <button onClick={() => {}} className="hover:text-purple-400 transition-colors">Privacy Policy</button>
              <button onClick={() => {}} className="hover:text-purple-400 transition-colors">Terms of Service</button>
              <button onClick={() => {}} className="hover:text-purple-400 transition-colors">Refund Policy</button>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-gray-900/50 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-green-500 text-xl">✓</span>
              <span>100% Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500 text-xl">✓</span>
              <span>7 Day Easy Returns</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500 text-xl">✓</span>
              <span>Free Shipping Over ₹500</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500 text-xl">✓</span>
              <span>24/7 Customer Support</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;