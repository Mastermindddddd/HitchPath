import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { IoSend } from "react-icons/io5";
import { Cpu, Bot, User } from "lucide-react";
import { motion } from "framer-motion";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

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
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const botResponse = response.data.response;
      setTimeout(() => {
        setChat([...newChat, { sender: "bot", text: botResponse }]);
        setIsTyping(false);
      }, botResponse.length * 20);
    } catch (error) {
      console.error("Error sending message:", error);
      setChat([...newChat, { sender: "bot", text: "Sorry, I couldn't process your request." }]);
      setIsTyping(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, isTyping]);

  return (
    <div className="flex flex-col items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=800')] opacity-5 bg-repeat z-0" />

      <div className="w-full max-w-3xl h-[80vh] flex flex-col shadow-2xl bg-gray-900/80 backdrop-blur-sm border border-purple-500/30 rounded-xl overflow-hidden z-10">
        {/* Header */}
        <div className="p-4 border-b border-purple-500/30 bg-gradient-to-r from-blue-900 to-purple-900">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mr-3 shadow-lg shadow-purple-500/20">
              <Cpu className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-white">AssistMe</h1>
            <div className="ml-auto flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-1 animate-pulse"></div>
              <span className="text-xs text-green-400">Online</span>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-900 to-gray-950">
          {chat.length === 0 ? (
            <div className="text-gray-400 text-center mt-10">Start the conversation</div>
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
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-tr-none border border-purple-500/30"
                        : "bg-gradient-to-r from-gray-800 to-gray-700 text-gray-100 rounded-tl-none border border-blue-500/30"
                    }`}
                    dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
                  />
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
                <div className="p-3 rounded-lg bg-gradient-to-r from-gray-800 to-gray-700 text-gray-100 rounded-tl-none border border-blue-500/30">
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
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              rows={1}
              className="flex-1 resize-none bg-gray-800 border border-gray-700 focus:border-purple-500 text-white p-3 rounded-lg outline-none"
            />
            <button
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg text-white hover:brightness-110 transition shadow-lg"
            >
              <IoSend size={20} />
            </button>
            <div className="text-right">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function formatMessage(message) {
  return message
    .replace(/\*\*(.*?)\*\*/g, '<span class="text-green-400 font-semibold">$1</span>')
    .replace(/\u2022/g, '<span class="text-blue-300">&bull;</span>')
    .replace(/\n/g, "<br>");
}

export default Chatbot;
