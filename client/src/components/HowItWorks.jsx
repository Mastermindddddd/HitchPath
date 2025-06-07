import React, { useState } from 'react';
import { motion } from 'framer-motion';

const HowItWorks = () => {
  const steps = [
    {
      step: "01",
      title: "Tell Us About Yourself",
      description: "Share your background, skills, and career aspirations with our AI system.",
      icon: "👤"
    },
    {
      step: "02",
      title: "AI Creates Your Path",
      description: "Our intelligent system analyzes your profile and generates a personalized learning roadmap.",
      icon: "🤖"
    },
    {
      step: "03",
      title: "Start Learning",
      description: "Follow your custom path with curated resources, milestones, and progress tracking.",
      icon: "🚀"
    },
    {
      step: "04",
      title: "Achieve Your Goals",
      description: "Land your dream job or advance your career with newly acquired skills and knowledge.",
      icon: "🎯"
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get started with HitchPath in just a few simple steps
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-blue-500 to-blue-200 transform -translate-y-1/2"></div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="relative mx-auto w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg">
                  {step.icon}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600 text-sm font-bold shadow">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-500 mb-3">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
            Start Your Journey Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
