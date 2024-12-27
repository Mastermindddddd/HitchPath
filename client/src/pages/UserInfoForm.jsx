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
  const totalSteps = 3;
  const [loading, setLoading] = useState(false); // State for loading indicator

  const navigate = useNavigate(); 
  const { user } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = () => setStep((prevStep) => prevStep + 1);
  const handlePrev = () => setStep((prevStep) => prevStep - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading indicator
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token);
      if (!token) {
        console.error("Token not found.");
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

      // Redirect to /learning-path
      navigate("/learning-path");
    } catch (error) {
      console.error("Error updating user information:", error);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h3>Step 1: Basic Information</h3>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={user?.name}
                readOnly
                className="w-full p-2 rounded-lg border-2 border-gray-300 bg-gray-200 text-gray-800 cursor-not-allowed"
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={user?.email}
                readOnly
                className="w-full p-2 rounded-lg border-2 border-gray-300 bg-gray-200 text-gray-800 cursor-not-allowed"
              />
            </label>
          </div>
        );
      case 2:
        return (
          <div>
            <h3>Step 2: Learning Preferences</h3>
            <label>
              Preferred Learning Style:
              <select name="preferredLearningStyle" value={formData.preferredLearningStyle} onChange={handleChange} 
                className="w-full p-2 rounded-lg border-2 border-gray-300 focus:border-purple-600 bg-white text-gray-800">
                <option value="">Select</option>
                <option value="visual">Visual</option>
                <option value="auditory">Auditory</option>
                <option value="reading">Reading/Writing</option>
                <option value="kinesthetic">Kinesthetic</option>
              </select>
            </label>
            <label>
              Primary Language:
              <input type="text" name="primaryLanguage" value={formData.primaryLanguage} onChange={handleChange} 
                className="w-full p-2 rounded-lg border-2 border-gray-300 focus:border-purple-600 bg-white text-gray-800" />
            </label>
            <label>
              Pace of Learning:
              <select name="paceOfLearning" value={formData.paceOfLearning} onChange={handleChange} 
                className="w-full p-2 rounded-lg border-2 border-gray-300 focus:border-purple-600 bg-white text-gray-800">
                <option value="">Select</option>
                <option value="fast">Fast</option>
                <option value="moderate">Moderate</option>
                <option value="slow">Slow</option>
              </select>
            </label>
          </div>
        );
      case 3:
        return (
          <div>
            <h3>Step 3: Goals & Career</h3>
            <label>
              Desired skills:
              <textarea name="DesiredSkill" value={formData.DesiredSkill} onChange={handleChange} className="w-full p-2 rounded-lg border-2 border-gray-300 focus:border-purple-600 bg-white text-gray-800"></textarea>
            </label>
            <label>
              Desired Career Path:
              <input type="text" name="careerPath" value={formData.careerPath} onChange={handleChange} 
                className="w-full p-2 rounded-lg border-2 border-gray-300 focus:border-purple-600 bg-white text-gray-800" />
            </label>
            <label>
              Current Skill Level:
              <select name="currentSkillLevel" value={formData.currentSkillLevel} onChange={handleChange} 
                className="w-full p-2 rounded-lg border-2 border-gray-300 focus:border-purple-600 bg-white text-gray-800">
                <option value="">Select</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </label>
          </div>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    const canvas = document.getElementById("cosmosCanvas");
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles = [];
    const numParticles = 100;

    class Particle {
      constructor(x, y, radius, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.angle = Math.random() * Math.PI * 2;
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
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.fill();
      }
    }

    for (let i = 0; i < numParticles; i++) {
      particles.push(
        new Particle(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          Math.random() * 4 + 1,
          Math.random() * 0.5 + 0.2
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

          if (dist < 120) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist / 120})`;
            ctx.lineWidth = 0.7;
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
      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  return (
    <div className="relative p-4 sm:p-6 bg-gradient-to-r from-blue-900 to-blue-400 rounded-lg shadow-xl text-white mb-20 mx-4 sm:mx-auto max-w-4xl">
      <canvas id="cosmosCanvas" className="absolute top-0 left-0 z-0 w-full h-full"></canvas>

      <div className="relative z-10">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-4 sm:mb-6">Update Your Information</h2>

        <div className="relative h-3 sm:h-4 bg-gray-300 rounded-full mb-6 sm:mb-8">
          <div
            className="absolute top-0 left-0 h-full bg-purple-600 rounded-full transition-all duration-500"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          ></div>
        </div>

        <p className="text-center font-semibold mb-4 text-sm sm:text-base">
          Step {step} of {totalSteps}
        </p>

        {loading ? (
          <div className="text-center text-white py-4">
            <span>Saving your information...</span>
            {/* You can use a spinner or a loading component here */}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStep()}
            <div className="flex justify-between mt-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 sm:px-4 rounded-lg"
                >
                  Previous
                </button>
              )}
              {step < totalSteps && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-3 sm:px-4 rounded-lg"
                >
                  Next
                </button>
              )}
              {step === totalSteps && (
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 sm:px-4 rounded-lg"
                >
                  Submit
                </button>
              )}
            </div>
          </form>
        )}

        {step < totalSteps && (
          <div className="text-center mt-4 sm:mt-6">
            <strong>Complete Step {step}</strong> to unlock more insights!
          </div>
        )}
        {step === totalSteps && (
          <div className="text-center mt-4 sm:mt-6">
            You're all set to save your information.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfoForm;
