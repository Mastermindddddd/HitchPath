import React from 'react';
import {Link} from 'react-router-dom';
import './cta.css';

const CTA = () => (
  <div className="gpt3__cta bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-12">
    <div className="gpt3__cta-content">
      <p>Start Your Personalized Learning Journey with AI Today!</p>
      <h3>Register Today & start exploring the endless possibilities.</h3>
    </div>
    <div className="gpt3__cta-btn">
      <Link to="/register">
      <button type="button">Get Started</button>
      </Link>
    </div>
  </div>
);

export default CTA;
