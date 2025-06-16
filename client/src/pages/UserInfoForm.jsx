import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { AuthContext } from "../AuthContext";

const UserInfoForm = () => {
  const [formData, setFormData] = useState({
    preferredLearningStyle: "",
    primaryLanguage: "",
    paceOfLearning: "",
    DesiredSkill: "",
    careerPath: "",
    currentSkillLevel: "",
  });

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const totalSteps = 3;
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const navigate = useNavigate(); 
  const { user } = useContext(AuthContext);

  // Check if user is authenticated and has required data
  useEffect(() => {
    if (!user || !user.name || !user.email) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    switch (stepNumber) {
      case 2:
        if (!formData.preferredLearningStyle) newErrors.preferredLearningStyle = "Please select a learning style";
        if (!formData.primaryLanguage.trim()) newErrors.primaryLanguage = "Please enter your primary language";
        if (!formData.paceOfLearning) newErrors.paceOfLearning = "Please select your learning pace";
        break;
      case 3:
        if (!formData.DesiredSkill.trim()) newErrors.DesiredSkill = "Please describe your desired skills";
        if (!formData.careerPath.trim()) newErrors.careerPath = "Please enter your career path";
        if (!formData.currentSkillLevel) newErrors.currentSkillLevel = "Please select your current skill level";
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const handlePrev = () => setStep((prevStep) => prevStep - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(step)) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token);
      if (!token) {
        console.error("Token not found.");
        setErrors({ submit: "Authentication token not found. Please log in again." });
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("User information updated successfully:", response.data);
      
      setSubmitSuccess(true);
      setTimeout(() => {
        navigate("/learning-path");
      }, 1500);
    } catch (error) {
      console.error("Error updating user information:", error);
      setErrors({ 
        submit: error.response?.data?.message || "Failed to update information. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-center">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={user?.name || ""}
                  readOnly
                  className="w-full p-3 sm:p-4 rounded-lg border-2 border-gray-300 bg-gray-100 text-gray-700 cursor-not-allowed text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={user?.email || ""}
                  readOnly
                  className="w-full p-3 sm:p-4 rounded-lg border-2 border-gray-300 bg-gray-100 text-gray-700 cursor-not-allowed text-sm sm:text-base"
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-center">Learning Preferences</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Preferred Learning Style *
                </label>
                <select 
                  name="preferredLearningStyle" 
                  value={formData.preferredLearningStyle} 
                  onChange={handleChange}
                  className={`w-full p-3 sm:p-4 rounded-lg border-2 ${
                    errors.preferredLearningStyle ? 'border-red-500' : 'border-gray-300'
                  } focus:border-purple-600 focus:outline-none bg-white text-gray-800 text-sm sm:text-base transition-colors`}
                >
                  <option value="">Select your learning style</option>
                  <option value="visual">Visual (charts, diagrams, images)</option>
                  <option value="auditory">Auditory (listening, discussions)</option>
                  <option value="reading">Reading/Writing (text-based)</option>
                  <option value="kinesthetic">Kinesthetic (hands-on, practical)</option>
                </select>
                {errors.preferredLearningStyle && (
                  <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.preferredLearningStyle}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Primary Language *
                </label>
                <input 
                  type="text" 
                  name="primaryLanguage" 
                  value={formData.primaryLanguage} 
                  onChange={handleChange}
                  placeholder="e.g., English, Spanish, French..."
                  className={`w-full p-3 sm:p-4 rounded-lg border-2 ${
                    errors.primaryLanguage ? 'border-red-500' : 'border-gray-300'
                  } focus:border-purple-600 focus:outline-none bg-white text-gray-800 text-sm sm:text-base transition-colors`}
                />
                {errors.primaryLanguage && (
                  <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.primaryLanguage}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Pace of Learning *
                </label>
                <select 
                  name="paceOfLearning" 
                  value={formData.paceOfLearning} 
                  onChange={handleChange}
                  className={`w-full p-3 sm:p-4 rounded-lg border-2 ${
                    errors.paceOfLearning ? 'border-red-500' : 'border-gray-300'
                  } focus:border-purple-600 focus:outline-none bg-white text-gray-800 text-sm sm:text-base transition-colors`}
                >
                  <option value="">Select your preferred pace</option>
                  <option value="fast">Fast (intensive learning)</option>
                  <option value="moderate">Moderate (balanced approach)</option>
                  <option value="slow">Slow (take your time)</option>
                </select>
                {errors.paceOfLearning && (
                  <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.paceOfLearning}</p>
                )}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-center">Goals & Career</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Desired Skills *
                </label>
                <textarea 
                  name="DesiredSkill" 
                  value={formData.DesiredSkill} 
                  onChange={handleChange}
                  placeholder="Describe the skills you want to develop..."
                  rows="4"
                  className={`w-full p-3 sm:p-4 rounded-lg border-2 ${
                    errors.DesiredSkill ? 'border-red-500' : 'border-gray-300'
                  } focus:border-purple-600 focus:outline-none bg-white text-gray-800 text-sm sm:text-base resize-vertical transition-colors`}
                />
                {errors.DesiredSkill && (
                  <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.DesiredSkill}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Desired Career Path *
                </label>
                <input 
                  type="text" 
                  name="careerPath" 
                  value={formData.careerPath} 
                  onChange={handleChange}
                  placeholder="e.g., Web Developer, Data Scientist, Product Manager..."
                  className={`w-full p-3 sm:p-4 rounded-lg border-2 ${
                    errors.careerPath ? 'border-red-500' : 'border-gray-300'
                  } focus:border-purple-600 focus:outline-none bg-white text-gray-800 text-sm sm:text-base transition-colors`}
                />
                {errors.careerPath && (
                  <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.careerPath}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Current Skill Level *
                </label>
                <select 
                  name="currentSkillLevel" 
                  value={formData.currentSkillLevel} 
                  onChange={handleChange}
                  className={`w-full p-3 sm:p-4 rounded-lg border-2 ${
                    errors.currentSkillLevel ? 'border-red-500' : 'border-gray-300'
                  } focus:border-purple-600 focus:outline-none bg-white text-gray-800 text-sm sm:text-base transition-colors`}
                >
                  <option value="">Select your current level</option>
                  <option value="beginner">Beginner (just starting out)</option>
                  <option value="intermediate">Intermediate (some experience)</option>
                  <option value="advanced">Advanced (experienced)</option>
                </select>
                {errors.currentSkillLevel && (
                  <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.currentSkillLevel}</p>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Loading Spinner Component
  const LoadingSpinner = () => (
    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
  );

  // Success Animation Component
  const SuccessMessage = () => (
    <div className="text-center py-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4 animate-pulse">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-green-400 mb-2">Success!</h3>
      <p className="text-white">Your information has been saved. Redirecting...</p>
    </div>
  );

  useEffect(() => {
    const canvas = document.getElementById("cosmosCanvas");
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles = [];
    const numParticles = Math.min(150, Math.floor((window.innerWidth * window.innerHeight) / 15000));

    class Particle {
      constructor(x, y, radius, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.angle = Math.random() * Math.PI * 2;
        this.opacity = Math.random() * 0.5 + 0.3;
      }

      update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        if (this.x < 0 || this.x > canvas.width) this.angle = Math.PI - this.angle;
        if (this.y < 0 || this.y > canvas.height) this.angle = -this.angle;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < numParticles; i++) {
      particles.push(
        new Particle(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          Math.random() * 3 + 1,
          Math.random() * 0.3 + 0.1
        )
      );
    }

    function connectParticles() {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dist = Math.hypot(
            particles[a].x - particles[b].x,
            particles[a].y - particles[b].y
          );

          if (dist < 100) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - dist / 100) * 0.3})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      connectParticles();
      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  // Don't render the form if user is not authenticated
  if (!user || !user.name || !user.email) {
    return null; // Component will redirect to login via useEffect
  }

  if (submitSuccess) {
    return (
      <div className="relative p-6 sm:p-8 bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg shadow-xl text-white mb-20 mx-4 sm:mx-auto max-w-2xl">
        <canvas id="cosmosCanvas" className="absolute top-0 left-0 z-0 w-full h-full rounded-lg"></canvas>
        <div className="relative z-10">
          <SuccessMessage />
        </div>
      </div>
    );
  }

  return (
    <div className="relative p-4 sm:p-6 lg:p-8 bg-blue-900 rounded-lg shadow-xl text-white mb-8 mx-4 sm:mx-auto max-w-4xl">
      <canvas id="cosmosCanvas" className="absolute top-0 left-0 z-0 w-full h-full rounded-lg"></canvas>

      <div className="relative z-10">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-4 sm:mb-6">
          Update Your Information
        </h2>

        {/* Progress Bar */}
        <div className="relative h-2 sm:h-3 bg-gray-300 bg-opacity-30 rounded-full mb-4 sm:mb-6">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          ></div>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center items-center mb-4 sm:mb-6">
          <div className="flex space-x-2 sm:space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 ${
                  stepNumber === step
                    ? 'bg-purple-600 text-white scale-110'
                    : stepNumber < step
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-400 bg-opacity-50 text-gray-300'
                }`}
              >
                {stepNumber < step ? '✓' : stepNumber}
              </div>
            ))}
          </div>
        </div>

        <p className="text-center font-semibold mb-4 sm:mb-6 text-sm sm:text-base">
          Step {step} of {totalSteps}
        </p>

        {/* Error message for submission */}
        {errors.submit && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
            {errors.submit}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <LoadingSpinner />
            <span className="text-lg">Saving your information...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="min-h-[300px] sm:min-h-[320px]">
              {renderStep()}
            </div>
            
{/* Navigation Buttons */}
<div className="flex justify-between items-center pt-6 gap-4">
  {/* Previous Button Container - Always takes left space */}
  <div className="flex-shrink-0">
    {step > 1 ? (
      <button
        type="button"
        onClick={handlePrev}
        className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 sm:px-6 rounded-lg transition-colors duration-200 font-medium text-sm sm:text-base min-w-[100px] sm:min-w-[120px]"
      >
        <span className="hidden sm:inline">← Previous</span>
        <span className="sm:hidden">← Prev</span>
      </button>
    ) : (
      // Empty div to maintain layout when Previous button is not shown
      <div className="min-w-[100px] sm:min-w-[120px]"></div>
    )}
  </div>
  
  {/* Next/Complete Button Container - Always takes right space */}
  <div className="flex-shrink-0">
    {step < totalSteps ? (
      <button
        type="button"
        onClick={handleNext}
        className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 sm:px-6 rounded-lg transition-colors duration-200 font-medium text-sm sm:text-base min-w-[100px] sm:min-w-[120px]"
      >
        <span className="hidden sm:inline">Next →</span>
        <span className="sm:hidden">Next →</span>
      </button>
    ) : (
      <button
        type="submit"
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-4 sm:px-6 rounded-lg transition-colors duration-200 font-medium flex items-center justify-center text-sm sm:text-base min-w-[120px] sm:min-w-[140px]"
      >
        {loading && <LoadingSpinner />}
        <span className="hidden sm:inline">Complete Setup</span>
        <span className="sm:hidden">Complete</span>
      </button>
    )}
  </div>
</div>
          </form>
        )}

        {/* Progress Messages */}
        <div className="text-center mt-6 sm:mt-8">
          {step < totalSteps ? (
            <div className="bg-blue-800 bg-opacity-40 rounded-lg p-4">
              <strong className="text-blue-200">Complete Step {step}</strong>
              <span className="text-blue-100 block sm:inline sm:ml-2">
                to unlock your personalized learning path!
              </span>
            </div>
          ) : (
            <div className="bg-green-800 bg-opacity-40 rounded-lg p-4">
              <strong className="text-green-200">Almost there!</strong>
              <span className="text-green-100 block sm:inline sm:ml-2">
                Click "Complete Setup" to save your information.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfoForm;