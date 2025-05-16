import { useState, useEffect } from "react";

/**
 * Custom hook for responsive design
 * @param {string} query - Media query string (e.g., "(min-width: 768px)")
 * @returns {boolean} - Whether the media query matches
 */
function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    // Set the initial value
    setMatches(mediaQuery.matches);
    
    // Create an event listener function
    const handler = (event) => setMatches(event.matches);
    
    // Add the event listener
    mediaQuery.addEventListener("change", handler);
    
    // Clean up
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

export default useMediaQuery;