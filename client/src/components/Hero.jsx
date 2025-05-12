import { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

const Hero = () => {
  const parallaxRef = useRef(null);
  const heroRef = useRef(null);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start end', 'end start'],
  });
  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const handleLogout = () => {
    // Clear the user name from localStorage and reset state
    localStorage.removeItem("userName");
    setUserName("");
  };

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
    <section
      ref={heroRef}
      className="pt-[12rem] -mt-[9rem]"
      customPaddings
      id="hero"
    >
      <div className="md:flex items-center ">
      <div className="md:w-[478px] lg:w-[778px] lg:ml-10 px-4 sm:px-6 md:px-0">
  <h1 className="h1 mb-6 text-center md:text-left text-2xl sm:text-3xl lg:text-5xl font-bold leading-tight">
  Smart Career Paths: Designed Just for You with&nbsp;
    <span className="inline-block relative text-blue-600">
      HitchPath
    </span>
  </h1>
  <p className="body-1 max-w-xl mx-auto md:mx-0 mb-6 text-n-2 text-center md:text-left text-base sm:text-lg lg:text-xl leading-relaxed">
  Impact-Site-Verification: 014fdb9c-7eb9-4026-9264-be651fd110ff
  </p>
  <div className="flex justify-center md:justify-start mt-4">
      <button 
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300"
        onClick={handleLearningPathClick}
      >
        Get Started
      </button>
  </div>
</div>

        {/*<BackgroundCircles />*/}
        <div className="mt-4 md:mt-0 md:h-[648px] md:flex-1 relative lg:left-[10%] flex justify-center items-center">
        <motion.img 
          src={"/ai.webp"} 
          width={190} height={40} 
          alt="learnado" 
          className="h-[300px] w-auto md:absolute md:h-full md:w-auto md:max-w-none md:-left-6 lg:left-0"
          animate={{
            translateY: [-30, 30],
          }}
          transition={{
            repeat: Infinity,
            repeatType: 'mirror',
            duration: 3,
            ease: "easeInOut",
          }}
        />
        <motion.img
          src="/image-3.webp" 
          width={260} 
          height={260} 
          alt="4.small" 
          className="hidden md:block -top-8 -left-32 md:absolute"
          style={{
            translateY: translateY,
          }}
        />
        <motion.img
          src="/hero.webp" 
          width={220} 
          height={220}
          alt="Cool"
          className=" hidden lg:block absolute top-[524px] left-[448px]"
          style={{
            translateY: translateY,
          }}
        />
       
        </div>

      </div>

   
    </section>
  );
};

export default Hero;