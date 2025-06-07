import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Box, Typography, CircularProgress, Button, Alert, Chip, Tooltip, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import ArticleIcon from "@mui/icons-material/Article";
import CodeIcon from "@mui/icons-material/Code";
import SchoolIcon from "@mui/icons-material/School";

const LearningPath = () => {
  const [loading, setLoading] = useState(true);
  const [learningPath, setLearningPath] = useState([]);
  const [error, setError] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [savedResources, setSavedResources] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const canvasRef = useRef(null);

  // Get resource icon based on URL or title
  const getResourceIcon = (resource) => {
    const url = resource.url.toLowerCase();
    const title = resource.title.toLowerCase();
    
    if (url.includes("youtube") || url.includes("vimeo") || title.includes("video")) {
      return <OndemandVideoIcon fontSize="small" className="text-red-500" />;
    } else if (url.includes("github") || url.includes("stackoverflow") || title.includes("code")) {
      return <CodeIcon fontSize="small" className="text-gray-300" />;
    } else if (url.includes("docs") || url.includes("documentation") || title.includes("docs")) {
      return <MenuBookIcon fontSize="small" className="text-blue-400" />;
    } else if (url.includes("course") || url.includes("udemy") || url.includes("coursera")) {
      return <SchoolIcon fontSize="small" className="text-green-500" />;
    } else {
      return <ArticleIcon fontSize="small" className="text-indigo-400" />;
    }
  };

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserInfo(data.user);
    } catch (err) {
      console.error("Failed to load user profile:", err);
    }
  };

  const fetchCompletedSteps = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/progress`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCompletedSteps(data.completedSteps || []);
      setSavedResources(data.savedResources || []);
    } catch (err) {
      console.error("Failed to load progress:", err);
    }
  };

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

  const refreshLearningPath = async () => {
    setRefreshing(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      // First, clear the existing learning path
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/reset-learning-path`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Then generate a new one
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/generate-learning-path`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLearningPath(data.learningPath || []);
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to refresh your learning path.";
      setError(errorMessage);
    } finally {
      setRefreshing(false);
    }
  };

  // In the toggleStepCompletion function, replace the existing function with this:
const toggleStepCompletion = async (stepId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    const isCompleted = completedSteps.includes(stepId);
    
    // Optimistic UI update
    if (isCompleted) {
      setCompletedSteps(completedSteps.filter(id => id !== stepId));
    } else {
      setCompletedSteps([...completedSteps, stepId]);
    }

    // Send to server - make sure stepId is converted to string for consistency
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/user/progress`,
      {
        stepId: String(stepId), // Ensure consistent string format
        completed: !isCompleted
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  } catch (err) {
    console.error("Failed to update progress:", err);
    // Revert optimistic update on error
    fetchCompletedSteps();
  }
};

  const toggleSaveResource = async (resourceId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const isSaved = savedResources.includes(resourceId);
      
      // Optimistic UI update
      if (isSaved) {
        setSavedResources(savedResources.filter(id => id !== resourceId));
      } else {
        setSavedResources([...savedResources, resourceId]);
      }

      // Send to server
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/save-resource`,
        {
          resourceId,
          saved: !isSaved
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error("Failed to save resource:", err);
      // Revert optimistic update on error
      fetchCompletedSteps();
    }
  };

  // Initialize the canvas and particle animation
  useEffect(() => {
    fetchLearningPath();
    fetchUserInfo();
    fetchCompletedSteps();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // ...rest of the canvas code remains the same...
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

  // Calculate progress percentage
  const calculateProgress = () => {
    if (!learningPath.length) return 0;
  
    // Get all step IDs from the current learning path
    const currentPathStepIds = learningPath.map((step, index) => String(step.id || index + 1));
  
    // Count only completed steps that belong to this learning path
    const completedPathSteps = completedSteps.filter(stepId => 
      currentPathStepIds.includes(String(stepId))
    );
  
    return Math.round((completedPathSteps.length / learningPath.length) * 100);
  };

  // Estimate time to complete remaining steps
  const estimateTimeRemaining = () => {
  if (!learningPath.length) return "0";
  
  // Get current learning path step IDs
  const currentPathStepIds = learningPath.map((step, index) => String(step.id || index + 1));
  
  // Count completed steps for this path only
  const completedPathSteps = completedSteps.filter(stepId => 
    currentPathStepIds.includes(String(stepId))
  ).length;
  
  if (completedPathSteps === learningPath.length) return "0";
  
  // Assume average of 2 weeks per step, adjust based on pace
  const weeksPerStep = userInfo?.paceOfLearning === 'fast' ? 1 : 
                      userInfo?.paceOfLearning === 'slow' ? 3 : 2;
  
  const remainingSteps = learningPath.length - completedPathSteps;
  const remainingWeeks = remainingSteps * weeksPerStep;
  
  return remainingWeeks <= 4 ? `${remainingWeeks} weeks` : 
         `${Math.round(remainingWeeks / 4)} months`;
};

  // Validate URL function
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Function to ensure resource URLs are valid
  const validateResourceUrl = (url) => {
    if (!url) return "https://www.google.com/search?q=learning+resources";
    if (!url.startsWith("http")) url = "https://" + url;
    return isValidUrl(url) ? url : "https://www.google.com/search?q=" + encodeURIComponent(url);
  };

  const renderTimeline = () => (
  <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:w-1 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-blue-500 before:to-transparent mt-8">
    {learningPath.map((step, index) => {
      // Ensure consistent step ID format
      const stepId = String(step.id || index + 1);
      const isCompleted = completedSteps.includes(stepId);
      
      return (
      <div
        key={stepId}
        className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group ${isCompleted ? 'opacity-90' : 'opacity-100'}`}
      >
          {/* Icon with Step Number */}
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full border shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${
              isCompleted 
                ? 'bg-green-600 border-green-300 cursor-pointer' 
                : 'bg-blue-600 border-white cursor-pointer'
            } text-white font-bold`}
            onClick={() => toggleStepCompletion(stepId)}
          >
            {isCompleted ? <CheckCircleIcon /> : index + 1}
          </div>

          {/* Card */}
          <div className={`w-full sm:w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] backdrop-blur-md p-3 sm:p-4 rounded border shadow text-sm sm:text-base mt-4 sm:mt-0 ${
            isCompleted 
              ? 'bg-slate-800/30 border-green-700/50' 
              : 'bg-slate-800/50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between space-x-2 mb-1">
              <div className="font-semibold text-white flex items-center gap-2">
                {isCompleted && <CheckCircleIcon className="text-green-500" fontSize="small" />}
                <span>{step.title}</span>
                {index === 0 && !isCompleted && (
                  <Chip
                    label="Start Here"
                    size="small"
                    style={{
                      backgroundColor: '#047857',
                      color: 'white',
                      fontSize: '0.75rem',
                      marginLeft: '0.5rem'
                      }}
                  />
                )}
              </div>
              <time className="text-xs font-medium text-indigo-400">
                {step.milestone || `Week ${(index + 1) * 2}`}
              </time>
            </div>
            
            <div className="text-slate-300 mb-2">{step.description}</div>
            
            {step.tips && step.tips.length > 0 && (
              <div className="mt-2 text-sm">
                <span className="font-medium text-yellow-400">Pro Tips:</span>
                <ul className="list-disc list-inside text-slate-300 ml-1">
                  {step.tips.map((tip, i) => (
                    <li key={i} className="text-sm">{tip}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="text-sm mt-3">
              <span className="font-medium text-blue-400">Resources:</span>
              <ul className="mt-1 space-y-2">
                {step.resources && step.resources.map((resource, i) => {
                  const resourceId = `${stepId}-${i}`;
                  const isSaved = savedResources.includes(resourceId);
                  return (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1">{getResourceIcon(resource)}</span>
                      <a
                        href={validateResourceUrl(resource.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 hover:underline flex-grow"
                      >
                        {resource.title}
                      </a>
                      <Tooltip title={isSaved ? "Unsave resource" : "Save for later"}>
                        <IconButton 
                          size="small" 
                          onClick={() => toggleSaveResource(resourceId)}
                        >
                          <BookmarkIcon 
                            fontSize="small" 
                            sx={{ color: isSaved ? '#FACC15' : '#FFFFFF' }}
                          />
                        </IconButton>
                      </Tooltip>
                    </li>
                  );
                })}
              </ul>
            </div>
            
            {isCompleted && (
              <div className="mt-3 text-right">
                <Chip 
                  label="Completed" 
                  size="small" 
                  color="success" 
                  className="bg-green-800/50 text-green-300 text-xs"
                />
              </div>
            )}
          </div>
        </div>
      )})}
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
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
      ></canvas>

      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col justify-center divide-y divide-slate-700/30">
          <div className="w-full max-w-4xl mx-auto">
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
                <div className="text-center mb-10">
                  <div className="inline-block mb-4 px-4 py-1 rounded-full bg-cyan-900/30 border border-cyan-700/50 text-cyan-400 text-sm sm:text-base font-medium text-center break-words">
                    AI-POWERED
                  </div>
                  <Typography
                    variant="h4"
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
                    Your Personalized Learning Path
                  </Typography>
                  
                  {userInfo && (
                    <div className="mt-4 text-slate-300">
                      <p className="mb-2">Customized for: <span className="text-blue-400 font-medium">{userInfo.careerPath}</span> • Skill Level: <span className="text-green-400 font-medium">{userInfo.currentSkillLevel}</span></p>
                      
                      <div className="flex flex-wrap gap-2 justify-center mt-2">
                        {userInfo.preferredLearningStyle && (
                          <Chip 
                            label={`${userInfo.preferredLearningStyle} learner`}
                            size="small"
                            className="bg-indigo-900/50 text-indigo-300"
                          />
                        )}
                        {userInfo.paceOfLearning && (
                          <Chip 
                            label={`${userInfo.paceOfLearning} pace`}
                            size="small"
                            className="bg-purple-900/50 text-purple-300"
                          />
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-center gap-4 mt-6">
                    <Tooltip title="Generate a new learning path">
                      <Button 
                        variant="outlined" 
                        color="primary" 
                        onClick={refreshLearningPath}
                        disabled={refreshing}
                        startIcon={<RefreshIcon />}
                        size="small"
                      >
                        {refreshing ? "Refreshing..." : "Refresh Path"}
                      </Button>
                    </Tooltip>
                    
                    <Link to="/saved-resources">
                      <Button 
                        variant="outlined" 
                        color="secondary"
                        startIcon={<BookmarkIcon />}
                        size="small"
                      >
                        Saved Resources
                      </Button>
                    </Link>
                  </div>
                  
                  {/* Progress section */}
                  <div className="mt-8 bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg border border-slate-700">
                    <div className="flex justify-between mb-1 text-sm text-slate-300">
                      <span>Your progress</span>
                      <span>{calculateProgress()}% complete</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                      style={{ width: `${calculateProgress()}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-3 text-xs text-slate-400">
                    <span>
                    {/* Show only learning path specific progress */}
                    {completedSteps.filter(stepId => 
                      learningPath.map((step, index) => String(step.id || index + 1)).includes(String(stepId))
                      ).length} of {learningPath.length} steps completed
                    </span>
                    <span>Est. time remaining: {estimateTimeRemaining()}</span>
                  </div>
                  </div>
                </div>
                
                {renderTimeline()}
                
                <div className="mt-10 p-4 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 text-center">
                  <Typography variant="h6" className="text-blue-400 mb-2">
                    Keep Going! 🚀
                  </Typography>
                  <p className="text-slate-300">
                    Mark steps as complete to track your progress. Remember that consistent practice is key to mastering new skills.
                  </p>
                  
                  <div className="mt-4 flex justify-center">
                    <Button 
                      variant="contained" 
                      color="primary"
                      component={Link}
                      to="/community"
                      startIcon={<PlayCircleOutlineIcon />}
                    >
                      Network
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <Box textAlign="center" py={4}>
                <Typography variant="h6" className="text-center text-gray-500 mb-4">
                  No learning path available yet.
                </Typography>
                <Button variant="contained" color="primary" onClick={fetchLearningPath}>
                  Generate Path
                </Button>
              </Box>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LearningPath;