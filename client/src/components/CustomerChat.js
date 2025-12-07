// 📁 client/src/components/CustomerChat.js - REAL USER INTEGRATION
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, Send, Users, X, Search, CheckCheck } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CustomerChatSystem = ({ productId, productName, currentUser, darkMode = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState('buyers');
  const [buyers, setBuyers] = useState([]);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // ✅ Load real buyers from database
  const loadBuyers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/chat/buyers/${productId}`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });
      
      // Transform users to buyer format
      const transformedBuyers = res.data.map(user => ({
        id: user._id,
        name: user.name,
        avatar: user.name.charAt(0).toUpperCase(),
        online: false,
        verified: true,
        purchaseDate: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
        lastMessage: 'Start a conversation',
        lastMessageTime: 'Just now'
      }));
      
      setBuyers(transformedBuyers);
    } catch (error) {
      console.error('❌ Load buyers error:', error);
      toast.error('Failed to load buyers');
    } finally {
      setLoading(false);
    }
  }, [productId, currentUser.token]);

  // ✅ Load messages between users
  const loadMessages = useCallback(async (buyerId) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/chat/messages/${productId}/${buyerId}`,
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`
          }
        }
      );
      setMessages(res.data);
    } catch (error) {
      console.error('❌ Load messages error:', error);
      toast.error('Failed to load messages');
    }
  }, [productId, currentUser.token]);

  // ✅ Send message to backend
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedBuyer) return;

    try {
      const messageData = {
        productId,
        productName,
        receiverId: selectedBuyer.id,
        content: newMessage
      };

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/chat/message`,
        messageData,
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`
          }
        }
      );

      // Add message to local state
      setMessages(prev => [...prev, res.data.chatMessage]);
      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      console.error('❌ Send message error:', error);
      toast.error('Failed to send message');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      loadBuyers();
    }
  }, [isOpen, loadBuyers]);

  useEffect(() => {
    if (selectedBuyer) {
      loadMessages(selectedBuyer.id);
    }
  }, [selectedBuyer, loadMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const filteredBuyers = buyers.filter(buyer =>
    buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    buyer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderBuyersList = () => (
    <div className="flex flex-col h-full">
      <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          💬 Chat with Buyers
        </h3>
        <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Connect with verified buyers of {productName}
        </p>

        <div className="relative">
          <Search size={18} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
            darkMode ? 'text-gray-500' : 'text-gray-400'
          }`} />
          <input
            type="text"
            placeholder="Search buyers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border-2 focus:outline-none transition-all ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-600'
            }`}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Loading buyers...</p>
          </div>
        ) : filteredBuyers.length === 0 ? (
          <div className="text-center py-12">
            <Users size={48} className={`mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              {searchQuery ? 'No buyers found matching your search' : 'No buyers available yet'}
            </p>
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
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white text-xl font-bold">
                  {buyer.avatar}
                </div>
                {buyer.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>

              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-bold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {buyer.name}
                  </span>
                  {buyer.verified && (
                    <span className="text-blue-500 text-xs">✓</span>
                  )}
                </div>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Purchased: {buyer.purchaseDate}
                </p>
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

          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white text-xl font-bold">
            {selectedBuyer?.avatar}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedBuyer?.name}
              </span>
              {selectedBuyer?.verified && (
                <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                  ✓ Verified
                </span>
              )}
            </div>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {selectedBuyer?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle size={48} className={`mx-auto mb-4 ${
              darkMode ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          messages.map(msg => {
            const isSender = msg.senderId === currentUser.id;
            return (
              <div key={msg._id} className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-2xl p-3 ${
                  isSender
                    ? 'bg-blue-600 text-white'
                    : darkMode ? 'bg-gray-800 text-white' : 'bg-white shadow text-gray-900'
                }`}>
                  <p className="text-sm">{msg.content}</p>
                  <div className="flex justify-end text-xs opacity-70 mt-1 gap-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    {isSender && <CheckCheck size={14} />}
                  </div>
                </div>
              </div>
            );
          })
        )}
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
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                : 'bg-white border-gray-300 focus:border-blue-600'
            }`}
          />

          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className={`p-2 rounded-full transition-all ${
              newMessage.trim()
                ? darkMode 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );

  // Floating Button
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 right-6 p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-40 ${
          darkMode ? 'bg-blue-600' : 'bg-gradient-to-r from-blue-600 to-cyan-600'
        } text-white relative`}
      >
        <MessageCircle size={24} />
        {buyers.filter(b => b.online).length > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
            {buyers.filter(b => b.online).length}
          </span>
        )}
      </button>
    );
  }

  // Chat Window
  return (
    <div className={`fixed bottom-6 right-6 w-[400px] h-[600px] rounded-2xl shadow-2xl overflow-hidden z-40 ${
      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
    }`}>
      <div className={`p-4 flex items-center justify-between ${
        darkMode 
          ? 'bg-gradient-to-r from-blue-900 to-cyan-900' 
          : 'bg-gradient-to-r from-blue-600 to-cyan-600'
      } text-white`}>
        <div className="flex items-center gap-3">
          <MessageCircle size={24} />
          <div>
            <h3 className="font-bold">Customer Chat</h3>
            <p className="text-xs opacity-70">
              {buyers.filter(b => b.online).length} users online
            </p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-lg">
          <X size={18} />
        </button>
      </div>

      <div className="h-[calc(100%-72px)] overflow-hidden">
        {view === 'buyers' ? renderBuyersList() : renderChat()}
      </div>
    </div>
  );
};

export default CustomerChatSystem;