import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, CircularProgress } from "@mui/material";

const SpecificTopicPath = () => {
  const [topic, setTopic] = useState("");
  const [details, setDetails] = useState("");
  const [generatedPath, setGeneratedPath] = useState(null);
  const [previousPaths, setPreviousPaths] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPreviousPaths = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/specific-paths`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPreviousPaths(data.specificPaths || []);
    } catch (error) {
      console.error("Error fetching previous paths:", error.message);
    }
  };

  useEffect(() => {
    fetchPreviousPaths();
  }, []);

  const generatePath = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/specific-path/generate`,
        { topic, details },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setGeneratedPath(data.specificPath || null);
      fetchPreviousPaths();
    } catch (error) {
      console.error("Error generating path:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderTimeline = (path) => (
    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
      {path.learningPath.map((step, index) => (
        <div
          key={index}
          className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
        >
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full border border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 bg-emerald-500 text-white font-bold`}
          >
            {index + 1}
          </div>

          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-slate-200 shadow">
            <div className="flex items-center justify-between space-x-2 mb-1">
              <div className="font-bold text-slate-900">
                Step {index + 1}: {step.title}
              </div>
              <time className="text-xs font-medium text-indigo-500">
                {step.milestone}
              </time>
            </div>
            <div className="text-slate-500">{step.description}</div>
            <div className="text-sm text-gray-700 mt-2">
              <span className="font-medium">Resources:</span>
              <ul>
                {step.resources.map((resource, i) => (
                  <li key={i}>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
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

  // Canvas Animation Setup
  useEffect(() => {
    const canvas = document.getElementById('cosmosCanvas');
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

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

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.angle = Math.PI - this.angle;
        if (this.y < 0 || this.y > canvas.height) this.angle = -this.angle;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
      }
    }

    // Initialize particles
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

    // Connect particles
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

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      connectParticles();
      requestAnimationFrame(animate);
    };

    // Start Animation
    animate();
  }, []);

  return (
    <section className="flex flex-col justify-center" style={{ overflow: "visible" }}>
      <canvas id="cosmosCanvas" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}></canvas>
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-24 relative z-10">
        <div className="flex flex-col justify-center divide-y divide-slate-200">
          <div className="w-full max-w-3xl mx-auto">
            <Typography variant="h4" className="text-center mb-8">
              Generate Specific Topic Path
            </Typography>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter Topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="p-3 w-full border border-gray-300 rounded-md"
              />
              <textarea
                placeholder="Details about what you want to master"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="p-3 w-full border border-gray-300 rounded-md"
                rows="4"
              ></textarea>
              <button
                onClick={generatePath}
                className="bg-emerald-500 text-white p-3 rounded-md w-full"
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate Path"}
              </button>
            </div>
            <div className="mt-12">
              {loading ? (
                <CircularProgress />
              ) : generatedPath ? (
                <>
                  <Typography variant="h5" className="text-center mb-4">
                    Generated Path for {generatedPath.topic}
                  </Typography>
                  {renderTimeline(generatedPath)}
                </>
              ) : (
                <Typography variant="h6" className="text-center text-gray-500">
                </Typography>
              )}
            </div>
            {previousPaths.length > 0 && (
              <div className="mt-12">
                <Typography variant="h5" className="text-center mb-4">
                  Your Previous Paths
                </Typography>
                <ul className="list-disc pl-5 space-y-2">
                  {previousPaths.map((path) => (
                    <li key={path.id} className="text-emerald-600">
                      {path.topic}{" "}
                      <button
                        onClick={() => setGeneratedPath(path)}
                        className="text-blue-500 hover:underline ml-2"
                      >
                        View
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecificTopicPath;
