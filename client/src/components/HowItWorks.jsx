import { motion } from "framer-motion"
import { User, Bot, Rocket, Target, ArrowRight } from "lucide-react"
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

const HowItWorks = () => {
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

  const steps = [
    {
      step: "01",
      title: "Tell Us About Yourself",
      description: "Share your background, skills, and career aspirations with our AI system.",
      icon: User,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      step: "02",
      title: "AI Creates Your Path",
      description: "Our intelligent system analyzes your profile and generates a personalized learning roadmap.",
      icon: Bot,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      step: "03",
      title: "Start Learning",
      description: "Follow your custom path with curated resources, milestones, and progress tracking.",
      icon: Rocket,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      step: "04",
      title: "Achieve Your Goals",
      description: "Land your dream job or advance your career with newly acquired skills and knowledge.",
      icon: Target,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  return (
    <section className="py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gray-200 bg-clip-text text-transparent mb-3 sm:mb-4 md:mb-6">
            How It Works
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
            Transform your career journey with our AI-powered platform in just four simple steps
          </p>
        </motion.div>

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {steps.map((step, index) => {
              const IconComponent = step.icon
              return (
                <motion.div
                  key={index}
                  className="relative"
                  variants={itemVariants}
                  whileHover={{
                    y: -8,
                    transition: { duration: 0.3 },
                  }}
                >
                  <div
                    className={`relative p-4 sm:p-6 md:p-8 ${step.borderColor} border-2 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group`}
                  >
                    {/* Step Number Badge */}
                    <div
                      className={`absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-lg`}
                    >
                      {step.step}
                    </div>

                    {/* Icon Container */}
                    <div
                      className={`relative mx-auto w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-400 mb-2 sm:mb-3 md:mb-4 group-hover:text-white transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-500 leading-relaxed group-hover:text-gray-700 transition-colors">
                      {step.description}
                    </p>

                    {/* Arrow for mobile */}
                    {index < steps.length - 1 && (
                      <div className="sm:hidden flex justify-center mt-4">
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        <motion.div
          className="text-center mt-8 sm:mt-12 md:mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.button
            className="group relative px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-blue-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden text-sm sm:text-base"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLearningPathClick}
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Your Journey Now
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.button>

          <p className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4 px-4">No credit card required • Get started in under 2 minutes</p>
        </motion.div>
      </div>
    </section>
  )
}

export default HowItWorks