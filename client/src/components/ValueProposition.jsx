import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ValueProposition = () => {
  const props = [
    {
      title: "Save 100+ Hours",
      description: "Skip the research phase. Get curated learning paths instantly.",
      gradient: "from-green-400 to-blue-500"
    },
    {
      title: "Increase Success Rate",
      description: "Follow proven pathways that align with industry demands.",
      gradient: "from-purple-400 to-pink-500"
    },
    {
      title: "Stay Current",
      description: "AI continuously updates paths based on market trends.",
      gradient: "from-yellow-400 to-orange-500"
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-200 mb-4">
            The HitchPath Advantage
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            See why smart learners choose AI-powered career guidance over traditional methods
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {props.map((prop, index) => (
            <motion.div
              key={index}
              className="relative shadow-md rounded-xl p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300"
              style={{
                borderRadius: "20px",
                boxShadow: "0 0 15px rgba(30, 144, 255, 0.5)",
                backgroundSize: "200% 200%",
                animation: "shine 3s infinite linear",
              }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="text-white">
                <h3 className="text-2xl font-bold mb-4">{prop.title}</h3>
                <p className="text-lg opacity-90">{prop.description}</p>
              </div>
              <div className="absolute top-4 right-4 w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {index + 1}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="px-8 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transform hover:scale-105 transition-all duration-300 shadow-lg">
            Experience the Difference
          </button>
        </div>
      </div>
    </section>
  );
};


export default ValueProposition;
