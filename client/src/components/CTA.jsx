import React from 'react';
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import './cta.css';

const CTA = () => {
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
    <div className="gpt3__cta bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-12">
      <div className="gpt3__cta-content">
        <p>Start Your Personalized Learning Journey with AI Today!</p>
        <h3>Register Today & start exploring the endless possibilities.</h3>
      </div>
      <div className="gpt3__cta-btn">
        <button 
          type="button" 
          className='bg-blue-600 hover:bg-blue-800'
          onClick={handleLearningPathClick}
        >
          Get Started
        </button>
      </div>
    </div>
  )
};

export default CTA;
