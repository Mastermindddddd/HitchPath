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
  FaBookmark,
  FaBars,
  FaSignOutAlt,
  FaSignInAlt,
  FaLightbulb,
  FaRoute
} from "react-icons/fa";
import { AuthContext } from "../AuthContext"; // Import AuthContext

const Header = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [openNavigation, setOpenNavigation] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const sidebarRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  // Get user and logout function from AuthContext
  const { user, logout } = useContext(AuthContext);

  // Track scroll position for adding shadow to header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Determine if a nav item is active
  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "shadow-lg" : ""
      } ${
        openNavigation ? "bg-gray-900" : "bg-gray-900/75 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex items-center justify-between px-5 lg:px-8 py-4">
        {/* Logo */}
        <a 
          className="flex items-center space-x-3 group transition-all duration-300" 
          href="/"
        >
          <img src={"/ai-platform.svg"} width={30} height={30} alt="Brainwave" />
          <p className="text-lg font-semibold text-gray-400">h!tchpath</p>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          <NavLink path="/" label="Home" icon={<FaHome className="mr-2" />} onClick={() => handleNavigation("/")} active={isActive("/")} />
          <NavLink path="/learning-path" label="My Goal Path" icon={<FaRoute className="mr-2" />} onClick={handleLearningPathClick} active={isActive("/learning-path")} />
          <NavLink path="/generate-path" label="Custom Path" icon={<FaLightbulb className="mr-2" />} onClick={() => handleNavigation("/generate-path")} active={isActive("/generate-path")} />
          <NavLink path="/guidemate-AI" label="GuideMate" icon={<FaRobot className="mr-2" />} onClick={() => handleNavigation("/guidemate-AI")} active={isActive("/guidemate-AI")} />
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-6">
          {/* Conditional Rendering of Sign In / Sign Out */}
          {user ? (
            <button 
              className="hidden lg:flex items-center px-4 py-2 rounded-lg text-white font-medium transition-all hover:bg-red-500/20 group"
              onClick={logout}
            >
              <span className="mr-2">Sign out</span>
              <FaSignOutAlt className="group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <Link 
              to="/login" 
              className="hidden lg:flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all"
            >
              <FaSignInAlt className="mr-2" />
              <span>Sign in</span>
            </Link>
          )}

          {/* Hamburger Button with Animation */}
          <button
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/10 transition-all"
            onClick={toggleNavigation}
            aria-label={openNavigation ? "Close menu" : "Open menu"}
          >
            {openNavigation ? (
              <FaTimes size={22} className="text-white" />
            ) : (
              <FaBars size={22} className="text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Sidebar Overlay with Fade Animation */}
      <div
        className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 ease-out ${
          openNavigation ? "opacity-60 backdrop-blur-sm" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleNavigation}
      ></div>

      {/* Sidebar with Smooth Slide Animation */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white z-50 shadow-xl transition-transform duration-300 ease-out ${
          openNavigation ? "translate-x-0" : "translate-x-full"
        } rounded-l-xl w-[75%] max-w-[280px] sm:max-w-[320px]`}
      >
        <div className={`flex flex-col h-full p-4 sm:p-6 transition-opacity duration-300 ${
          openNavigation ? "opacity-100" : "opacity-0"
        }`}>
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
            onClick={toggleNavigation}
            aria-label="Close menu"
          >
            <FaTimes size={16} />
          </button>

          {/* User Profile Section - Always rendered to prevent layout shift */}
          <div className={`mb-6 pb-4 border-b border-white/10 ${user ? 'block' : 'hidden'}`}>
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold">
                {user?.email?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="ml-3">
                <p className="font-medium text-base sm:text-lg text-white">{user?.name || ''}</p>
                <p className="text-xs sm:text-sm text-gray-300">{user?.email || ''}</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <ul className="space-y-2 sm:space-y-4 flex-1">
            <SidebarNavItem 
              icon={<FaHome size={16} />} 
              label="Home" 
              onClick={() => handleNavigation("/")}
              active={isActive("/")}
            />
            <SidebarNavItem 
              icon={<FaRoute size={16} />} 
              label="My Goal Path" 
              onClick={handleLearningPathClick}
              active={isActive("/learning-path")}
            />
            <SidebarNavItem 
              icon={<FaLightbulb size={16} />} 
              label="Custom Path" 
              onClick={() => handleNavigation("/generate-path")}
              active={isActive("/generate-path")}
            />
            <SidebarNavItem 
              icon={<FaBookmark size={16} />} 
              label="Saved Resources" 
              onClick={() => handleNavigation("/saved-resources")}
              active={isActive("/saved-resources")}
            />
            <SidebarNavItem 
              icon={<FaRobot size={16} />} 
              label="GuideMate" 
              onClick={() => handleNavigation("/guidemate-AI")}
              active={isActive("/guidemate-AI")}
            />
            <SidebarNavItem 
              icon={<FaEnvelope size={16} />} 
              label="Contact Us" 
              onClick={() => handleNavigation("/contact-us")}
              active={isActive("/contact-us")}
            />
          </ul>

          {/* Sign In / Sign Out */}
          <div className="pt-4 sm:pt-6 border-t border-white/10">
            {user ? (
              <button
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-2 sm:py-3 rounded-lg flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300 text-sm sm:text-base"
                onClick={logout}
              >
                <FaSignOutAlt />
                <span>Sign Out</span>
              </button>
            ) : (
              <Link to="/login" onClick={toggleNavigation} className="block w-full">
                <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 sm:py-3 rounded-lg flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 text-sm sm:text-base">
                  <FaSignInAlt />
                  <span>Sign In</span>
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm z-50">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full opacity-30"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-500 font-bold">...</div>
          </div>
        </div>
      )}
    </div>
  );
};

// Desktop Navigation Link Component
const NavLink = ({ path, label, icon, onClick, active }) => (
  <button 
    onClick={onClick}
    className={`flex items-center text-gray-300 hover:text-white font-medium text-sm transition-all duration-300 relative group px-1 py-2 ${
      active ? "text-white" : ""
    }`}
  >
    {icon}
    {label}
    <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-300 ${
      active ? "w-full" : "w-0 group-hover:w-full"
    }`}></span>
  </button>
);

// Sidebar Navigation Item Component
const SidebarNavItem = ({ icon, label, onClick, active }) => (
  <li>
    <button 
      className={`flex items-center w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-300 text-sm sm:text-base ${
        active 
          ? "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-white" 
          : "hover:bg-white/5 text-gray-300 hover:text-white"
      }`}
      onClick={onClick}
    >
      <span className={`mr-3 ${active ? "text-blue-400" : ""}`}>{icon}</span>
      <span>{label}</span>
    </button>
  </li>
);

export default Header;