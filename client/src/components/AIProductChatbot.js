// 📁 client/src/components/AIProductChatbot.js
import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, X, Minimize2, Sparkles } from "lucide-react"; // Sparkles icon added
import { useAuth } from "../context/AuthContext"; // Auth Context import kiya

const AIProductChatbot = ({ products, onClose, darkMode = false }) => {
  const { user } = useAuth(); // User info access kiya
  const userName = user ? user.name : "Guest";

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi ${userName}! 👋 Welcome to Abhi ShoppingZone.\nI can help you with product specs, recommendations, or just chat! What's on your mind?`,
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto Scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Product Context Builder
  const buildProductContext = () => {
    return products.map((p) => ({
      name: p.name,
      price: p.price,
      category: p.category,
      description: p.description || "No description available",
      features: p.specs || "Standard features", // Assuming specs might be a field
    }));
  };

  // 🧠 Ask Gemini
  const askGemini = async (text) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/gemini`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: text, // Fixed key name match with backend
          products: buildProductContext(),
          userName: userName, // Name bheja backend ko
        }),
      });

      const data = await res.json();
      return data;
    } catch (err) {
      console.error("🔥 Gemini API Error:", err);
      return {
        response: "❌ Connection failed. Please check your internet or try again later.",
        products: [],
      };
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput("");
    setIsLoading(true);

    // Ask backend
    const ai = await askGemini(userInput);

    const aiMessage = {
      role: "assistant",
      content: ai.response || "I'm not sure how to answer that, but I'm learning!",
      recommendations: ai.products || [],
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsLoading(false);
  };

  // MINIMIZED MODE
  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform z-50"
      >
        <Bot size={28} />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 w-[380px] h-[600px] z-50 rounded-2xl shadow-2xl overflow-hidden flex flex-col border ${
        darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      {/* HEADER */}
      <div
        className={`p-4 flex items-center justify-between ${
          darkMode
            ? "bg-gray-800 border-b border-gray-700"
            : "bg-gradient-to-r from-blue-600 to-purple-600"
        }`}
      >
        <div className="flex items-center gap-3 text-white">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
            <Sparkles size={20} className="text-yellow-300" />
          </div>
          <div>
            <h3 className="font-bold text-base">Abhi AI Assistant</h3>
            <p className="text-xs opacity-90 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Online & Ready
            </p>
          </div>
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
          >
            <Minimize2 size={18} />
          </button>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-red-500/20 p-2 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* MESSAGES */}
      <div
        className={`flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-300 ${
          darkMode ? "bg-gray-900 scrollbar-thumb-gray-600" : "bg-gray-50"
        }`}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 animate-fadeIn ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {/* Assistant Avatar */}
            {msg.role === "assistant" && (
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex-shrink-0 flex items-center justify-center border border-indigo-200">
                <Bot size={16} className="text-indigo-600" />
              </div>
            )}

            {/* Message Bubble */}
            <div
              className={`max-w-[75%] rounded-2xl p-3.5 shadow-sm ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : darkMode
                  ? "bg-gray-800 text-gray-100 border border-gray-700 rounded-tl-none"
                  : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>

              {/* Product Cards in Chat */}
              {msg.recommendations?.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs font-semibold opacity-70 mb-1">Recommended for you:</p>
                  {msg.recommendations.map((p, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-2 rounded-lg border ${
                        darkMode 
                          ? "bg-gray-700 border-gray-600 hover:bg-gray-600" 
                          : "bg-gray-50 border-gray-200 hover:bg-blue-50"
                      } transition-colors cursor-pointer`}
                    >
                      <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center text-lg">
                        🛍️
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold truncate">{p.name}</h4>
                        <div className="flex justify-between items-center mt-0.5">
                          <span className="text-xs font-bold text-green-600">₹{p.price}</span>
                          {p.rating && <span className="text-[10px] text-yellow-500">★ {p.rating}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <p className={`text-[10px] mt-1.5 text-right ${
                msg.role === "user" ? "text-blue-200" : "text-gray-400"
              }`}>
                {msg.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {/* User Avatar */}
            {msg.role === "user" && (
              <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center">
                <User size={16} className="text-gray-600" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-gray-400 text-xs ml-11">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
            Thinking...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <div
        className={`p-3 border-t ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
        }`}
      >
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
           darkMode 
             ? "bg-gray-900 border-gray-700 focus-within:border-blue-500" 
             : "bg-gray-50 border-gray-200 focus-within:border-blue-500 focus-within:shadow-sm"
        }`}>
          <input
            type="text"
            value={input}
            disabled={isLoading}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about products or say hi..."
            className={`flex-1 bg-transparent outline-none text-sm ${
              darkMode ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-400"
            }`}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`p-2 rounded-full transition-all ${
              input.trim() 
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:scale-105" 
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Send size={18} />
          </button>
        </div>
        <div className="text-center mt-2">
           <p className="text-[10px] text-gray-400">Powered by Gemini AI ✨</p>
        </div>
      </div>
    </div>
  );
};

export default AIProductChatbot;