import { useState, useRef, useEffect, useContext } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import {
  FaHome,
  FaInfoCircle,
  FaTag,
  FaEnvelope,
  FaTimes,
  FaRobot,
  FaUser,
  FaThLarge,
} from "react-icons/fa";
import { AuthContext } from "../AuthContext"; // Import AuthContext

const Header = () => {
  const pathname = useLocation();
  const navigate = useNavigate();
  const [openNavigation, setOpenNavigation] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const sidebarRef = useRef(null);

  // Get user and logout function from AuthContext
  const { user, logout } = useContext(AuthContext);

  // Open/Close Sidebar
  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleNavigation = (path) => {
    setLoading(true); // Set loading state
    setTimeout(() => {
      navigate(path);
      setOpenNavigation(false); // Close sidebar
      enablePageScroll(); // Re-enable page scroll
      setLoading(false); // Reset loading state
    }, 200); // Add a small delay for smoother UX
  };

  const handleLearningPathClick = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user-info/completed`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.completed) {
        navigate("/learning-path");
      } else {
        navigate("/user-info");
      }
    } catch (error) {
      console.error("Error checking user info:", error);
      navigate("/user-info"); // Fallback
    } finally {
      setOpenNavigation(false); // Close sidebar
      enablePageScroll(); // Re-enable page scroll
      setLoading(false); // Reset loading
    }
  };

  // Close Sidebar when clicking outside
  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setOpenNavigation(false);
      enablePageScroll();
    }
  };

  useEffect(() => {
    if (openNavigation) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openNavigation]);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 border-b border-n-6 ${
        openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center px-5 lg:px-7.5 xl:px-10 py-4">
        {/* Logo */}
        <a className="block w-[12rem] xl:mr-8 flex items-center space-x-2" href="/">
          <img src={"/ai-platform.svg"} width={30} height={30} alt="Brainwave" />
          <p className="text-lg font-semibold text-gray-400">hitchpath</p>
        </a>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Conditional Rendering of Sign In / Sign Out */}
          {user ? (
            <button className="hidden lg:flex" onClick={logout}>
              Sign out
            </button>
          ) : (
            <Link to="/login" onClick={toggleNavigation}>
              <button className="hidden lg:flex">Sign in</button>
            </Link>
          )}

          {/* Hamburger/Cross Button */}
          <button
            className="flex text-xl"
            onClick={toggleNavigation}
            style={{ fontSize: "1.5rem" }}
          >
            {openNavigation ? <FaTimes size={32} /> : "☰"}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      {openNavigation && (
        <div
          className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity`}
        >
          <div
            ref={sidebarRef}
            className={`fixed top-0 right-0 h-full w-[60%] max-w-[300px] bg-[#001f3f] text-white z-50 shadow-lg transform translate-x-0 transition-transform duration-300 ease-in-out md:w-[60%] sm:w-[75%]`}
          >
            <div className="flex flex-col h-full p-6">
              {/* Close Button */}
              <button
                className="text-white text-lg self-end mb-4"
                onClick={toggleNavigation}
              >
                <FaTimes />
              </button>

              {/* Navigation Tabs */}
              <ul className="space-y-6 text-lg font-medium">
                <li
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => handleNavigation("/")}
                >
                  <FaHome size={20} />
                  <span className="text-lg sm:text-base">Home</span>
                </li>
                <li className="flex items-center gap-3 cursor-pointer">
                  <FaUser size={20} />
                  <button onClick={handleLearningPathClick}>
                    <span className="text-lg sm:text-base">My Goal Path</span>
                  </button>
                </li>
                <li
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => handleNavigation("/generate-path")}
                >
                  <FaThLarge size={20} />
                  <span className="text-lg sm:text-base">Custom path</span>
                </li>
                <li
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => handleNavigation("/resume-builder")}
                >
                  <FaThLarge size={20} />
                  <span className="text-lg sm:text-base">Generate resume</span>
                </li>
                <li
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => handleNavigation("/guidemate-AI")}
                >
                  <FaRobot size={20} />
                  <span className="text-lg sm:text-base">GuideMate</span>
                </li>
                <li
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => handleNavigation("/contact-us")}
                >
                  <FaEnvelope size={20} />
                  <span className="text-lg sm:text-base">Contact Us</span>
                </li>
              </ul>

              {/* Sign In / Sign Out */}
              <div className="mt-auto">
                {user && (
                  <div className="mb-6 text-center">
                    <span className="text-xs sm:text-[10px] md:text-sm text-gray-300">Logged in</span>
                    <p className="font-semibold text-sm sm:text-xs md:text-lg">{user.email}</p>
                  </div>
                )}
                {user ? (
                  <button
                    className="w-full bg-blue-500 text-white py-2 rounded-lg"
                    onClick={logout}
                  >
                    Sign Out
                  </button>
                ) : (
                  <Link to="/login">
                    <button className="w-full bg-blue-500 text-white py-2 rounded-lg">
                      Sign In
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};

export default Header;
