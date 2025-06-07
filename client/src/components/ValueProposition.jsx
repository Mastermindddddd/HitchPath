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
    <section className="py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-200 mb-3 sm:mb-4 px-2">
            The HitchPath Advantage
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-500 max-w-2xl mx-auto px-2">
            See why smart learners choose AI-powered career guidance over traditional methods
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {props.map((prop, index) => (
            <motion.div
              key={index}
              className="relative shadow-md rounded-xl p-3 sm:p-4 md:p-6 hover:shadow-lg transition-shadow duration-300"
              style={{
                borderRadius: "20px",
                boxShadow: "0 0 15px rgba(30, 144, 255, 0.5)",
                backgroundSize: "200% 200%",
                animation: "shine 3s infinite linear",
              }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="text-white">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 md:mb-4 pr-8 sm:pr-10 md:pr-12">
                  {prop.title}
                </h3>
                <p className="text-sm sm:text-base md:text-lg opacity-90 leading-relaxed">
                  {prop.description}
                </p>
              </div>
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-blue-800 rounded-full flex items-center justify-center text-white text-sm sm:text-lg md:text-xl font-bold">
                {index + 1}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-10 md:mt-12">
          <button className="px-6 py-3 sm:px-7 sm:py-3.5 md:px-8 md:py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800 transform hover:scale-105 transition-all duration-300 shadow-lg text-sm sm:text-base md:text-base">
            Experience the Difference
          </button>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;