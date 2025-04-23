import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, CircularProgress } from "@mui/material";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Sparkles } from "lucide-react";


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
    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-transparent before:via-blue-500 before:to-transparent mt-8">
      {path.learningPath.map((step, index) => (
        <div
          key={index}
          className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
        >
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full border border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 bg-blue-600 text-white font-bold`}
          >
            {index + 1}
          </div>
          
          <div className="w-full sm:w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-800/50 backdrop-blur-md  p-3 sm:p-4 rounded border border-slate-200 shadow text-sm sm:text-base mt-4 sm:mt-0">
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

  // Canvas Animation Setup
  useEffect(() => {
    const canvas = document.getElementById('cosmosCanvas');
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = Math.max(document.body.scrollHeight, window.innerHeight);
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
    <section className="relative z-10">
      <canvas
  id="cosmosCanvas"
  className="fixed inset-0 w-full h-full -z-10"
/>

      <div className="w-full max-w-6xl mx-auto px-4 py-20 relative z-10">
        <Card className="border border-cyan-700/30 bg-slate-800/50 backdrop-blur-md shadow-[0_0_15px_rgba(0,200,255,0.1)]">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center mb-6">
              <div className="inline-block mb-2 px-4 py-1 rounded-full bg-cyan-900/30 border border-cyan-700/50 text-cyan-400 text-sm sm:text-base font-medium">
                AI-POWERED
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-white mt-2">
                Generate Specific Topic Path
              </h2>
            </div>

            <div className="space-y-6 mt-6">
              <Input
                type="text"
                placeholder="Enter Topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="bg-slate-900/50 border-cyan-700/30 text-white placeholder:text-slate-500 focus:border-cyan-500"
              />
              <Textarea
                placeholder="Details about what you want to master"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={4}
                className="bg-slate-900/50 border-cyan-700/30 text-white placeholder:text-slate-500 focus:border-cyan-500"
              />

              <Button
                onClick={generatePath}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-blue-500 hover:to-cyan-500 text-white border-none"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-pulse rounded-full bg-white" />
                    <div className="mr-2 h-4 w-4 animate-pulse rounded-full bg-white animation-delay-150" />
                    <div className="mr-2 h-4 w-4 animate-pulse rounded-full bg-white animation-delay-300" />
                    <span className="ml-2">Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Path
                  </>
                )}
              </Button>
            </div>

            
            {previousPaths.length > 0 && (
              <div className="mt-12">
                <h4 className="text-lg font-semibold text-white text-center mb-4">Your Previous Paths</h4>
                <ul className="list-disc pl-5 space-y-2 text-slate-300">
                  {previousPaths.map((path) => (
                    <li key={path.id} className="text-emerald-500">
                      {path.topic}
                      <button
                        onClick={() => setGeneratedPath(path)}
                        className="text-blue-400 hover:underline ml-2"
                      >
                        View
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
        <div className="mt-12">
              {loading ? (
                <div className="flex justify-center">
                  <CircularProgress />
                </div>
              ) : generatedPath ? (
                <>
                  <h3 className="text-lg font-bold text-cyan-400 text-center mb-4">
                    Generated Path for {generatedPath.topic}
                  </h3>
                  {renderTimeline(generatedPath)}
                </>
              ) : null}
            </div>

      </div>
    </section>
  );
};

export default SpecificTopicPath;