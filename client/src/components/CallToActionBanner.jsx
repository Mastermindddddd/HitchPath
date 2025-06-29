import React from 'react';
import './cta.css';
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

const CallToActionBanner = () => {
  const navigate = useNavigate();

  const handleLearningPathClick = async () => {
      try {
        const token = localStorage.getItem("token");
    
        // If the user is not logged in, redirect to the login page with the intended path
        if (!token) {
          navigate(`/register?redirect=${encodeURIComponent("/learning-path")}`);
          return;
        }
    
        // Check user info and redirect accordingly
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user-info/completed`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        if (response.data.completed) {
          navigate("/learning-path");
        } else {
          navigate("/user-info");
        }
      } catch (error) {
        console.error("Error checking user info:", error);
        navigate("/user-info"); // Redirect to user-info as a fallback
      }
    };  
  
  return (
    <section className="gpt3__cta bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Join thousands who've already discovered their perfect learning path with AI
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-800 transform hover:scale-105 transition-all duration-300 shadow-lg"
              onClick={handleLearningPathClick}
            >
              Get Started Free
            </button>
            {/*<button className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300">
              Watch Demo (2 min)
            </button>*/}
          </div>

          <div className="mt-8 text-sm opacity-75">
            ✨ No credit card required • ⚡ Setup in under 2 minutes • 🔒 100% secure
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionBanner;
