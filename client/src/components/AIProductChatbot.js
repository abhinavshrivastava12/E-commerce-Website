// 📁 client/src/components/AIProductChatbot.js
import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, X, Minimize2 } from "lucide-react";

const AIProductChatbot = ({ products, onClose, darkMode = false }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! 👋 I'm your shopping assistant powered by Gemini AI. What are you looking for today?",
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

  // Product Context
  const buildProductContext = () => {
    return JSON.stringify(
      products.map((p) => ({
        name: p.name,
        price: p.price,
        rating: p.rating,
        category: p.category,
        discount: p.discount,
        trending: p.trending,
        bestSeller: p.bestSeller,
        featured: p.featured,
        description: p.description || "",
      }))
    );
  };

  // 🧠 Ask Gemini — through backend for safety
  const askGemini = async (text) => {
    try {
      const res = await fetch("http://localhost:5000/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: text,
          products: buildProductContext(),
        }),
      });

      const data = await res.json();
      return data;
    } catch (err) {
      console.error("🔥 Gemini API Error:", err);
      return {
        response: "❌ Gemini API error. Please try again.",
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

    // Ask backend → Gemini
    const ai = await askGemini(userInput);

    const aiMessage = {
      role: "assistant",
      content: ai.response || "No response",
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
        className="fixed bottom-6 right-6 p-4 bg-purple-600 text-white rounded-full shadow-2xl"
      >
        <Bot size={28} />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 w-[400px] h-[600px] z-50 rounded-2xl shadow-2xl overflow-hidden flex flex-col ${
        darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
      }`}
    >
      {/* HEADER */}
      <div
        className={`p-4 flex items-center justify-between ${
          darkMode
            ? "bg-gradient-to-r from-purple-900 to-pink-900"
            : "bg-gradient-to-r from-purple-600 to-pink-600"
        }`}
      >
        <div className="flex items-center gap-3 text-white">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot size={22} />
          </div>
          <div>
            <h3 className="font-bold">Gemini AI Assistant</h3>
            <p className="text-xs opacity-80">Online</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsMinimized(true)}
            className="text-white hover:bg-white/20 p-2 rounded-lg"
          >
            <Minimize2 size={18} />
          </button>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* MESSAGES */}
      <div
        className={`flex-1 p-4 overflow-y-auto space-y-4 ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {/* Avatar */}
            {msg.role === "assistant" && (
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
            )}

            {/* Bubble */}
            <div
              className={`max-w-[70%] rounded-2xl p-3 ${
                msg.role === "user"
                  ? "bg-purple-600 text-white"
                  : darkMode
                  ? "bg-gray-800 text-white border border-gray-700"
                  : "bg-white shadow text-gray-900"
              }`}
            >
              <p className="text-sm whitespace-pre-line">{msg.content}</p>

              {/* Recommendations */}
              {msg.recommendations?.length > 0 && (
                <div className="mt-2 space-y-2">
                  {msg.recommendations.map((p, idx) => (
                    <div
                      key={idx}
                      className={`p-2 text-xs rounded-lg ${
                        darkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <b>{p.name}</b>
                      <div>₹{p.price}</div>
                      {p.rating && <div>⭐ {p.rating}</div>}
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs opacity-50 mt-1">
                {msg.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {msg.role === "user" && (
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User size={18} className="text-gray-700" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <p className="text-center text-gray-500 italic text-sm">
            Gemini is typing...
          </p>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT BAR */}
      <div
        className={`p-4 border-t ${
          darkMode ? "border-gray-700" : "border-gray-300"
        }`}
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            disabled={isLoading}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask anything..."
            className={`flex-1 px-4 py-2 rounded-full border-2 ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-gray-900 border-gray-300"
            }`}
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIProductChatbot;
