import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { IoSend } from "react-icons/io5";
import { Cpu, Bot, User, Plus, MessageSquare, Trash2, ArrowLeftCircle, X, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useMediaQuery from "../components/hooks/useMediaQuery"; // We'll create this custom hook

const Chatbot = () => {
  // State
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [recentChats, setRecentChats] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  
  // Check if device is at least medium sized (>=768px)
  const isDesktop = useMediaQuery("(min-width: 768px)");
  
  // Show sidebar by default on desktop
  useEffect(() => {
    if (isDesktop) {
      setShowSidebar(true);
    } else {
      setShowSidebar(false);
    }
  }, [isDesktop]);

  // Fetch recent chats on component mount
  useEffect(() => {
    fetchRecentChats();
  }, []);

  const fetchRecentChats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/chats`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRecentChats(response.data.chats);
    } catch (error) {
      console.error("Error fetching recent chats:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newChat = [...chat, { sender: "user", text: message }];
    setChat(newChat);
    setMessage("");
    setIsTyping(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/chatbot`,
        { message, chatId: currentChatId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const botResponse = response.data.response;
      
      // Update current chat ID if it's a new chat
      if (!currentChatId && response.data.chatId) {
        setCurrentChatId(response.data.chatId);
      }
      
      // Add typing effect
      setTimeout(() => {
        setChat([...newChat, { sender: "bot", text: botResponse }]);
        setIsTyping(false);
        
        // Refresh recent chats after interaction
        fetchRecentChats();
      }, Math.min(1000, botResponse.length * 10)); // Cap the typing time to 1 second max
    } catch (error) {
      console.error("Error sending message:", error);
      setChat([...newChat, { sender: "bot", text: "Sorry, I couldn't process your request." }]);
      setIsTyping(false);
    }
  };

  const loadChat = async (chatId) => {
    try {
      setIsTyping(true); // Show loading indicator
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/chats/${chatId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setChat(response.data.chat.messages);
      setCurrentChatId(chatId);
      
      // On mobile, hide sidebar after selecting a chat
      if (!isDesktop) {
        setShowSidebar(false);
      }
      
      // Update the active chat in the UI
      setRecentChats(prevChats => {
        return prevChats.map(chat => {
          if (chat.id === chatId) {
            return { ...chat, active: true };
          }
          return { ...chat, active: false };
        });
      });
      
      setIsTyping(false);
    } catch (error) {
      console.error("Error loading chat:", error);
      setIsTyping(false);
    }
  };

  const startNewChat = () => {
    setChat([]);
    setCurrentChatId(null);
    
    // On mobile, hide sidebar after starting new chat
    if (!isDesktop) {
      setShowSidebar(false);
    }
    
    // Update UI to show no active chat
    setRecentChats(prevChats => {
      return prevChats.map(chat => ({ ...chat, active: false }));
    });
    
    // Focus on the input field
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const deleteChat = async (chatId, e) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    
    try {
      setIsTyping(true); // Show loading state
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/chats/${chatId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Refresh the chat list
      fetchRecentChats();
      
      // If the deleted chat was the current one, start a new chat
      if (chatId === currentChatId) {
        startNewChat();
      }
      setIsTyping(false)
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const handleKeyDown = (e) => {
    // Send message on Enter key without Shift key
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default to avoid newline
      handleSendMessage();
    }
  };

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, isTyping]);

  // Focus textarea on component mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Format timestamp for chat preview
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Today - show time
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      // Last week - show day name
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      // Older - show date
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 relative h-screen">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=800')] opacity-5 bg-repeat z-0 fixed" />

      <div className="w-full max-w-6xl h-[85vh] flex shadow-2xl bg-gray-900/80 backdrop-blur-sm border border-purple-500/30 rounded-xl overflow-hidden z-10 relative">
        {/* Sidebar (Recent Chats) */}
        <AnimatePresence mode="wait">
          {showSidebar && (
            <motion.div 
              initial={{ 
                x: isDesktop ? 0 : -300,
                opacity: isDesktop ? 1 : 0,
                position: isDesktop ? "relative" : "absolute"
              }}
              animate={{ 
                x: 0, 
                opacity: 1,
                position: isDesktop ? "relative" : "absolute"
              }}
              exit={{ 
                x: isDesktop ? 0 : -300,
                opacity: isDesktop ? 1 : 0 
              }}
              transition={{ duration: 0.3 }}
              className={`h-full border-r border-purple-500/30 bg-gray-900 
                          ${isDesktop ? 'w-[300px]' : 'w-[280px] left-0 top-0 bottom-0 z-20 shadow-lg shadow-black/50'}`}
            >
              <div className="p-4 border-b border-purple-500/30 bg-gradient-to-r from-blue-900 to-purple-900 flex items-center justify-between">
                <h2 className="text-white font-semibold flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Recent Chats
                </h2>
                {!isDesktop && (
                  <button 
                    onClick={() => setShowSidebar(false)}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
              
              <div className="p-2">
                <button 
                  onClick={startNewChat}
                  className="w-full p-3 rounded-lg mb-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center hover:brightness-110 transition"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Chat
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto max-h-[calc(100%-125px)]">
                {recentChats.length === 0 ? (
                  <div className="p-4 text-gray-400 text-center">
                    No recent chats
                  </div>
                ) : (
                  <div className="space-y-1 p-2">
                    {recentChats.map((chat) => (
                      <div 
                        key={chat.id}
                        onClick={() => loadChat(chat.id)}
                        className={`p-3 rounded-lg cursor-pointer flex justify-between items-start group transition duration-200 ${
                          currentChatId === chat.id 
                            ? "bg-blue-600/20 border border-blue-500/40" 
                            : "hover:bg-gray-800 border border-transparent"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <h3 className="text-sm font-medium text-white truncate max-w-[160px]">
                              {chat.title}
                            </h3>
                            <span className="text-xs text-gray-400">
                              {formatDate(chat.updatedAt)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-300 truncate">
                            {chat.preview}
                          </p>
                        </div>
                        <button 
                          onClick={(e) => deleteChat(chat.id, e)}
                          className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Chat Container */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-purple-500/30 bg-gradient-to-r from-blue-900 to-purple-900 flex items-center">
            {/* Sidebar toggle button */}
            {!isDesktop && (
              <button 
                onClick={() => setShowSidebar(!showSidebar)}
                className="mr-3 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/20"
              >
                <Menu className="h-4 w-4 text-white" />
              </button>
            )}
            
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mr-3 shadow-lg shadow-purple-500/20">
              <Cpu className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-white">AssistMe</h1>
            <div className="ml-auto flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-1 animate-pulse"></div>
              <span className="text-xs text-green-400">Online</span>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-900 to-gray-950">
            {chat.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">AssistMe is ready!</h2>
                <p className="text-gray-400 max-w-md">Ask any question or share what's on your mind.</p>
              </div>
            ) : (
              chat.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex items-start max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div
                      className={`flex items-center justify-center h-8 w-8 rounded-full ${
                        msg.sender === "user"
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 ml-2 shadow-lg shadow-purple-500/20"
                          : "bg-gradient-to-r from-cyan-500 to-blue-500 mr-2 shadow-lg shadow-blue-500/20"
                      }`}
                    >
                      {msg.sender === "user" ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div
                      className={`p-3 rounded-lg ${
                        msg.sender === "user"
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-tr-none border border-purple-500/30 shadow-md"
                          : "bg-gradient-to-r from-gray-800 to-gray-700 text-gray-100 rounded-tl-none border border-blue-500/30 shadow-md"
                      }`}
                    >
                      <div 
                        className="message-content"
                        dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))
            )}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start max-w-[80%]">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 mr-2 shadow-lg shadow-blue-500/20">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-to-r from-gray-800 to-gray-700 text-gray-100 rounded-tl-none border border-blue-500/30 shadow-md">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-purple-500/30 bg-gray-900">
            <div className="flex items-end space-x-2">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write your message here..."
                rows={1}
                className="flex-1 resize-none bg-gray-800 border border-gray-700 focus:border-purple-500 text-white p-3 rounded-lg outline-none transition-all min-h-10 max-h-32"
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className={`bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg text-white transition shadow-lg flex items-center justify-center ${
                  message.trim() ? "hover:brightness-110" : "opacity-50 cursor-not-allowed"
                }`}
              >
                <IoSend size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile when sidebar is open */}
      {showSidebar && !isDesktop && (
        <div 
          className="fixed inset-0 bg-black/40 z-10"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </div>
  );
};

function formatMessage(message) {
  return message
    .replace(/\*\*(.*?)\*\*/g, '<span class="text-blue-500 font-semibold">$1</span>')
    .replace(/\u2022/g, '<span class="text-blue-300">&bull;</span>')
    .replace(/\n/g, "<br>");
}

export default Chatbot;