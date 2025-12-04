import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, Send, Users, X, Search, CheckCheck } from 'lucide-react';

const CustomerChatSystem = ({ productId, productName, currentUser, darkMode = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState('buyers');
  const [buyers, setBuyers] = useState([]);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  // ---------------------------------------------
  // FIX 1 → loadBuyers placed ABOVE useEffect
  // ---------------------------------------------
  const loadBuyers = useCallback(() => {
    const mockBuyers = [
      { id: 1, name: 'Rahul Kumar', avatar: '👨', purchaseDate: '2024-01-15', verified: true, online: true, lastMessage: 'Great product!', lastMessageTime: '2 hours ago' },
      { id: 2, name: 'Priya Sharma', avatar: '👩', purchaseDate: '2024-02-20', verified: true, online: false, lastMessage: 'Worth the money', lastMessageTime: '1 day ago' },
      { id: 3, name: 'Amit Patel', avatar: '👨', purchaseDate: '2024-03-10', verified: true, online: true, lastMessage: 'Happy with my purchase', lastMessageTime: '3 hours ago' },
      { id: 4, name: 'Sneha Reddy', avatar: '👩', purchaseDate: '2024-02-05', verified: false, online: false, lastMessage: 'Good quality', lastMessageTime: '2 days ago' }
    ];

    const stored = localStorage.getItem(`buyers-${productId}`);
    setBuyers(stored ? JSON.parse(stored) : mockBuyers);
  }, [productId]);

  // ---------------------------------------------
  // FIX 2 → loadMessages ABOVE useEffect + useCallback added
  // ---------------------------------------------
  const loadMessages = useCallback((buyerId) => {
    const key = `chat-${productId}-${currentUser.id}-${buyerId}`;
    const stored = localStorage.getItem(key);
    setMessages(stored ? JSON.parse(stored) : []);
  }, [productId, currentUser.id]);

  const saveMessages = (updatedMessages) => {
    const key = `chat-${productId}-${currentUser.id}-${selectedBuyer.id}`;
    localStorage.setItem(key, JSON.stringify(updatedMessages));
    setMessages(updatedMessages);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedBuyer) return;

    const message = {
      id: Date.now(),
      senderId: currentUser.id,
      receiverId: selectedBuyer.id,
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false
    };

    const updated = [...messages, message];
    saveMessages(updated);
    setNewMessage('');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // ---------------------------------------------
  // EFFECTS (Now correct order)
  // ---------------------------------------------

  // Load buyers
  useEffect(() => {
    loadBuyers();
  }, [loadBuyers]);

  // Load messages WHEN buyer changes
  useEffect(() => {
    if (selectedBuyer) {
      loadMessages(selectedBuyer.id);
    }
  }, [selectedBuyer, loadMessages]);

  // Auto-scroll
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const filteredBuyers = buyers.filter(buyer =>
    buyer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ---------------------------------------------
  // UI RENDER FUNCTIONS
  // ---------------------------------------------

  const renderBuyersList = () => (
    <div className="flex flex-col h-full">
      <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>💬 Chat with Buyers</h3>
        <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Connect with verified buyers of {productName}</p>

        <div className="relative">
          <Search size={18} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <input
            type="text"
            placeholder="Search buyers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border-2 focus:outline-none transition-all ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {filteredBuyers.length === 0 ? (
          <div className="text-center py-12">
            <Users size={48} className={`mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>No buyers found</p>
          </div>
        ) : (
          filteredBuyers.map(buyer => (
            <button
              key={buyer.id}
              onClick={() => {
                setSelectedBuyer(buyer);
                setView('chat');
              }}
              className={`w-full p-4 rounded-xl mb-2 transition-all ${
                darkMode ? 'hover:bg-gray-700 bg-gray-800' : 'hover:bg-gray-100 bg-white shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-2xl">{buyer.avatar}</div>
                  {buyer.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-bold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{buyer.name}</span>
                    {buyer.verified && <span className="text-blue-500 text-xs">✓</span>}
                  </div>
                  <p className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{buyer.lastMessage}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Purchased: {new Date(buyer.purchaseDate).toLocaleDateString()}</p>
                </div>

                <div className="text-xs text-gray-500">{buyer.lastMessageTime}</div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );

  const renderChat = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setView('buyers')}
            className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            ←
          </button>

          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-xl">
            {selectedBuyer?.avatar}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedBuyer?.name}</span>
              {selectedBuyer?.verified && (
                <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">✓ Verified</span>
              )}
            </div>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {selectedBuyer?.online ? '🟢 Online' : '⚫ Offline'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {messages.map(msg => {
          const isSender = msg.senderId === currentUser.id;
          return (
            <div key={msg.id} className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-2xl p-3 ${
                isSender
                  ? 'bg-purple-600 text-white'
                  : darkMode ? 'bg-gray-800 text-white' : 'bg-white shadow text-gray-900'
              }`}>
                <p className="text-sm">{msg.content}</p>
                <div className="flex justify-end text-xs opacity-70 mt-1 gap-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                  {isSender && <CheckCheck size={14} />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type message..."
            className={`flex-1 px-4 py-2 rounded-full border-2 focus:outline-none ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
            }`}
          />

          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className={`p-2 rounded-full ${
              darkMode ? 'bg-purple-600 hover:bg-purple-500' : 'bg-gradient-to-r from-purple-600 to-pink-600'
            } text-white`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );

  // ---------------------------------------------
  // Floating Button
  // ---------------------------------------------
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 right-6 p-4 rounded-full shadow-2xl hover:scale-110 ${
          darkMode ? 'bg-blue-600' : 'bg-gradient-to-r from-blue-600 to-cyan-600'
        } text-white relative`}
      >
        <MessageCircle size={24} />
        <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
          {buyers.filter(b => b.online).length}
        </span>
      </button>
    );
  }

  // ---------------------------------------------
  // Chat Window
  // ---------------------------------------------
  return (
    <div className={`fixed bottom-6 right-6 w-[400px] h-[600px] rounded-2xl shadow-2xl overflow-hidden ${
      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
    }`}>
      <div className={`p-4 flex items-center justify-between ${
        darkMode ? 'bg-gradient-to-r from-blue-900 to-cyan-900' : 'bg-gradient-to-r from-blue-600 to-cyan-600'
      } text-white`}>
        <div className="flex items-center gap-3">
          <MessageCircle size={24} />
          <div>
            <h3 className="font-bold">Customer Chat</h3>
            <p className="text-xs opacity-70">{buyers.filter(b => b.online).length} buyers online</p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-lg">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {view === 'buyers' ? renderBuyersList() : renderChat()}
      </div>
    </div>
  );
};

export default CustomerChatSystem;
