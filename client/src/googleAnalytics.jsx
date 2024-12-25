import ReactGA from "react-ga4";

// Initialize Google Analytics
export const initializeGA = () => {
    try {
      ReactGA.initialize("G-RDHQW2MWPT"); // Replace with your Measurement ID
    } catch (error) {
      console.error("Google Analytics initialization failed:", error);
    }
  };
  
// Log a page view
export const logPageView = (path = window.location.pathname) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

// Log custom events
export const logEvent = (category, action, label) => {
  ReactGA.event({
    category,
    action,
    label,
  });
};
