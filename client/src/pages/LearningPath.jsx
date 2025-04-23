import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Box, Typography, CircularProgress, Button, Alert } from "@mui/material";
import { Link } from "react-router-dom";

const LearningPath = () => {
  const [loading, setLoading] = useState(true);
  const [learningPath, setLearningPath] = useState([]);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);

  const fetchLearningPath = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/generate-learning-path`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLearningPath(data.learningPath || []);
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to load your learning path.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLearningPath();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

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
          Math.random() * 0.1 + 0.05
        )
      );
    }

    const connectParticles = () => {
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
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });
      connectParticles();
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  const renderTimeline = () => (
    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:w-1 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-blue-500 before:to-transparent mt-8">
      {learningPath.map((step, index) => (
        <div
          key={index}
          className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
        >
          {/* Icon with Step Number */}
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full border border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 bg-blue-600 text-white font-bold`}
          >
            {index + 1}
          </div>

          {/* Card */}
          <div className="w-full sm:w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-800/50 backdrop-blur-md p-3 sm:p-4 rounded border border-slate-200 shadow text-sm sm:text-base mt-4 sm:mt-0">

            <div className="flex items-center justify-between space-x-2 mb-1">
              <div className="font-semibold text-white">
                Step {index + 1}: {step.title}
              </div>
              <time className="text-xs font-medium text-indigo-500">
                {step.milestone}
              </time>
            </div>
            <div className="text-slate-500">{step.description}</div>
            <div className="text-sm text-gray-300 mt-2">
              <span className="font-medium">Resources:</span>
              <ul>
                {step.resources.map((resource, i) => (
                  <li key={i}>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {resource.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section
      className="relative flex flex-col justify-center"
      style={{ minHeight: "100vh", overflow: "visible" }}
    >
      <canvas
  ref={canvasRef}
  style={{
    position: "fixed", // Use "fixed" to cover the whole viewport even when scrolling
    top: 0,
    left: 0,
    width: "100%", // Ensure the canvas fills horizontally
    height: "100%", // Ensure the canvas fills vertically
    zIndex: -1, // Place it behind other content
  }}
></canvas>

      {/*<div className="flex justify-center gap-4 mt-20">
        <Link to="/generate-path">
          <Button variant="contained" color="primary">
            Generate Custom Path
          </Button>
        </Link>
      </div>*/}
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col justify-center divide-y divide-slate-200">
          <div className="w-full max-w-3xl mx-auto">
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
              </Box>
            ) : error ? (
              <Box textAlign="center" py={4}>
                <Alert severity="error" style={{ marginBottom: "16px" }}>
                  {error}
                </Alert>
                <Button variant="contained" color="primary" onClick={fetchLearningPath}>
                  Retry
                </Button>
              </Box>
            ) : learningPath.length > 0 ? (
              <div>
                
                <Typography
                  variant="h4"
                  className="text-center mb-20"
                  sx={{
                    fontWeight: 700,
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: {
                      xs: "1.5rem",
                      sm: "2rem",
                      md: "2.5rem",
                    },
                    color: "primary.main",
                    letterSpacing: "0.5px",
                    lineHeight: 1.2,
                  }}
                >
                  <div className="inline-block mb-4 px-4 py-1 rounded-full bg-cyan-900/30 border border-cyan-700/50 text-cyan-400 text-sm sm:text-base font-medium text-center break-words">
                    AI-POWERED
                  </div><br/>
                  Your Personalized Learning/Career Path
                </Typography>
                {renderTimeline()}
              </div>
            ) : (
              <Typography variant="h6" className="text-center text-gray-500">
                No learning path available yet.
              </Typography>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LearningPath;