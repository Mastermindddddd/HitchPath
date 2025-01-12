import React, { useEffect } from "react";

const WelcomeMessage = ({ userName, onDismiss }) => {
  useEffect(() => {
    // Auto-dismiss the message after 3 seconds
    const timer = setTimeout(() => {
      onDismiss();
    }, 3000);

    return () => clearTimeout(timer); // Cleanup on component unmount
  }, [onDismiss]);

  return (
    <div
      className="fixed inset-x-0 top-[10%] mx-auto bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 
      animate-fade-in-down max-w-[90%] sm:max-w-sm text-center"
      style={{ width: 'fit-content' }}
    >
      Welcome back, {userName}!
    </div>
  );
};

export default WelcomeMessage;
