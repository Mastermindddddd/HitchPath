import React, { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { IoSend } from "react-icons/io5";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newChat = [...chat, { sender: "user", text: message }];
    setChat(newChat);
    setMessage("");

    setIsTyping(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/chatbot",
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const botResponse = response.data.response;
      setTimeout(() => {
        setChat([...newChat, { sender: "bot", text: botResponse }]);
        setIsTyping(false);
      }, botResponse.length * 20); // Simulate typing speed
    } catch (error) {
      console.error("Error sending message:", error);
      setChat([...newChat, { sender: "bot", text: "Sorry, I couldn't process your request." }]);
      setIsTyping(false);
    }
  };

  return (
    <div className="relative text-white p-4">
      {/* 3D Model Background */}
      <Background3D />

      <h1 className="text-4xl font-bold text-center mb-6">AssistMe</h1>
      <div className="chat-window bg-[#181818] rounded-lg p-4 mx-auto h-[70vh] overflow-y-auto w-full max-w-screen-md">
        {chat.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`mb-4 ${msg.sender === "user" ? "text-right" : "text-left"}`}
          >
            <p
              className="inline-block p-3 rounded-lg max-w-[80%] shadow-md"
              style={{
                backgroundColor: msg.sender === "user" ? "green" : "#333",
                color: "white",
              }}
              dangerouslySetInnerHTML={{
                __html: formatMessage(msg.text),
              }}
            ></p>
          </motion.div>
        ))}
        {isTyping && (
          <p className="text-gray-500 italic animate-pulse">Assistant is typing...</p>
        )}
      </div>
      <div className="flex items-center mt-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-3 bg-[#181818] rounded-lg text-white outline-none border border-gray-700 focus:border-green-500"
          placeholder="Write your message here..."
        />
        <button
          onClick={handleSendMessage}
          className="ml-4 bg-green-500 p-3 rounded-lg text-white hover:bg-green-600 shadow-lg transform transition-transform active:scale-95"
        >
          <IoSend size={20} />
        </button>
      </div>
    </div>
  );
};

// 3D Background Component
const Background3D = () => {
  return (
    <Canvas
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
      }}
      camera={{ position: [0, 0, 5], fov: 50 }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} />
      <Suspense fallback={null}>
        <RotatingModel />
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.02} />
    </Canvas>
  );
};

const RotatingModel = () => {
  const { scene } = useGLTF("/rotunde.glb");

  return (
    <primitive object={scene} scale={1.5} position={[0, -0.9, 0]} rotation={[0, 0, 0]} />
  );
};

function formatMessage(message) {
  return message
    .replace(/\*\*(.*?)\*\*/g, '<span class="text-green-400 font-semibold">$1</span>')
    .replace(/\u2022/g, '<span class="text-blue-300">&bull;</span>')
    .replace(/\n/g, "<br>");
}

export default Chatbot;
