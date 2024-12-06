import { useState, useRef, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { FaHome, FaInfoCircle, FaTag, FaEnvelope, FaTimes } from "react-icons/fa";
import { brainwave } from "../assets";

const Header = () => {
  const pathname = useLocation();
  const [openNavigation, setOpenNavigation] = useState(false);
  const sidebarRef = useRef(null);

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

  const handleSignIn = () => {
    setOpenNavigation(false);
    enablePageScroll();
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
        <a className="block w-[12rem] xl:mr-8" href="/">
          <img src={brainwave} width={190} height={40} alt="Brainwave" />
        </a>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 ml-auto">
        <Link to="/login" onClick={handleSignIn}>
  <button className="hidden lg:flex">Sign in</button>
</Link>

          {/* Hamburger/Cross Button */}
          <button className="flex px-3" onClick={toggleNavigation}>
            {openNavigation ? <FaTimes size={24} /> : "☰"}
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
            className="fixed top-0 right-0 h-full w-[80%] max-w-[300px] bg-[#001f3f] text-white z-50 shadow-lg transform translate-x-0 transition-transform duration-300 ease-in-out"
          >
            <div className="flex flex-col h-full p-6">
              {/* Navigation Tabs */}
              <ul className="space-y-6 text-lg font-medium">
                <li className="flex items-center gap-3 cursor-pointer">
                  <FaHome size={20} />
                  Home
                </li>
                <Link to="/dashboard" className="flex items-center gap-3 cursor-pointer">
                <li className="flex items-center gap-3 cursor-pointer">
                  <FaEnvelope size={20} />
                  Dashboard
                </li>
                </Link>
                <li className="flex items-center gap-3 cursor-pointer">
                  <FaInfoCircle size={20} />
                  About
                </li>
                <li className="flex items-center gap-3 cursor-pointer">
                  <FaTag size={20} />
                  Features
                </li>
                <li className="flex items-center gap-3 cursor-pointer">
                  <FaEnvelope size={20} />
                  Contact
                </li>
              </ul>

              {/* Sign In Button */}
              <div className="mt-auto">
              <Link to="/login">
                <button className="w-full bg-blue-500 text-white py-2 rounded-lg">
                  Sign In
                </button>
              </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
