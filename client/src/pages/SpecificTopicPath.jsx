import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Typography, CircularProgress, Alert, Chip, Tooltip, IconButton } from "@mui/material";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import BookmarkIcon from "@mui/icons-material/Bookmark";            
import { Button } from "../components/ui/button";
import { 
  Sparkles, 
  Bookmark, 
  RefreshCw, 
  CheckCircle, 
  PlayCircle, 
  BookOpen, 
  Video, 
  FileText, 
  Code, 
  GraduationCap,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";

const SpecificTopicPath = () => {
  const [topic, setTopic] = useState("");
  const [details, setDetails] = useState("");
  const [generatedPath, setGeneratedPath] = useState(null);
  const [previousPaths, setPreviousPaths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [savedResources, setSavedResources] = useState([]);
  const [currentPathProgress, setCurrentPathProgress] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showPreviousPaths, setShowPreviousPaths] = useState(true);
  const canvasRef = useRef(null);

  // Get resource icon based on URL or title
  const getResourceIcon = (resource) => {
    const url = resource.url?.toLowerCase() || "";
    const title = resource.title?.toLowerCase() || "";
    
    if (url.includes("youtube") || url.includes("vimeo") || title.includes("video")) {
      return <Video size={16} className="text-red-500" />;
    } else if (url.includes("github") || url.includes("stackoverflow") || title.includes("code")) {
      return <Code size={16} className="text-gray-300" />;
    } else if (url.includes("docs") || url.includes("documentation") || title.includes("docs")) {
      return <BookOpen size={16} className="text-blue-400" />;
    } else if (url.includes("course") || url.includes("udemy") || url.includes("coursera")) {
      return <GraduationCap size={16} className="text-green-500" />;
    } else {
      return <FileText size={16} className="text-indigo-400" />;
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

  // Replace the fetchCompletedSteps function:
const fetchPathProgress = async (pathId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token || !pathId) return;

    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/user/progress/specific/${pathId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setCompletedSteps(data.completedSteps || []);
    setSavedResources(data.savedResources || []);
    setCurrentPathProgress(pathId);
  } catch (err) {
    console.error("Failed to load path progress:", err);
  }
};

  const fetchPreviousPaths = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");
      
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/specific-paths`, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPreviousPaths(data.specificPaths || []);
    } catch (error) {
      console.error("Error fetching previous paths:", error.message);
      setError("Failed to fetch your previous learning paths.");
    }
  };

  useEffect(() => {
    fetchPreviousPaths();
    fetchUserInfo();

    // Initialize canvas and particles
    const canvas = canvasRef.current;
    if (!canvas) return;
    
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

  // Replace the existing generatePath function:
const generatePath = async () => {
  setLoading(true);
  setError(null);
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/specific-path/generate`,
      { topic, details },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const newPath = data.specificPath || null;
    setGeneratedPath(newPath);
    setShowPreviousPaths(false);
    
    // Fetch progress for the newly generated path
    if (newPath) {
      fetchPathProgress(newPath.id);
    }
    
    fetchPreviousPaths();
  } catch (error) {
    console.error("Error generating path:", error.message);
    setError("Failed to generate your learning path. Please try again.");
  } finally {
    setLoading(false);
  }
};

  const refreshPath = async () => {
    if (!generatedPath) return;
    
    setRefreshing(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/specific-path/generate`,
        { topic: generatedPath.topic, details },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGeneratedPath(data.specificPath || null);
      fetchPreviousPaths();
    } catch (error) {
      console.error("Error refreshing path:", error.message);
      setError("Failed to refresh your learning path. Please try again.");
    } finally {
      setRefreshing(false);
    }
  };

  const toggleStepCompletion = async (stepId) => {
  if (!generatedPath) return;
  
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

    // Send to server with path-specific endpoint
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/user/progress/specific/${generatedPath.id}`,
      {
        stepId,
        completed: !isCompleted
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  } catch (err) {
    console.error("Failed to update progress:", err);
    // Revert optimistic update on error
    if (generatedPath) {
      fetchPathProgress(generatedPath.id);
    }
  }
};


  const toggleSaveResource = async (resourceId) => {
  if (!generatedPath) return;
  
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

    // Send to server with path-specific endpoint
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/user/save-resource/specific/${generatedPath.id}`,
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
    if (generatedPath) {
      fetchPathProgress(generatedPath.id);
    }
  }
};

  // Calculate progress percentage
  const calculateProgress = () => {
    if (!generatedPath || !generatedPath.learningPath.length) return 0;
    
    const pathStepIds = generatedPath.learningPath.map((step, index) => 
      step.id || `special-${generatedPath.id}-${index + 1}`
    );
    
    const completedPathSteps = completedSteps.filter(stepId => 
      pathStepIds.includes(stepId)
    );
    
    return Math.round((completedPathSteps.length / pathStepIds.length) * 100);
  };

  // Estimate time to complete remaining steps
  const estimateTimeRemaining = () => {
    if (!generatedPath || !generatedPath.learningPath.length) return "0";
    
    const pathStepIds = generatedPath.learningPath.map((step, index) => 
      step.id || `special-${generatedPath.id}-${index + 1}`
    );
    
    const completedPathSteps = completedSteps.filter(stepId => 
      pathStepIds.includes(stepId)
    );
    
    if (completedPathSteps.length === pathStepIds.length) return "0";
    
    // Assume average of 2 weeks per step, adjust based on pace
    const weeksPerStep = userInfo?.paceOfLearning === 'fast' ? 1 : 
                        userInfo?.paceOfLearning === 'slow' ? 3 : 2;
    
    const remainingSteps = pathStepIds.length - completedPathSteps.length;
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

  // Handler to view a specific path
  const viewPath = (path) => {
  setGeneratedPath(path);
  setShowPreviousPaths(false);
  // Fetch progress for this specific path
  fetchPathProgress(path.id);
};

  // Handler to go back to the list of paths
  const goBackToList = () => {
    setShowPreviousPaths(true);
  };

  const renderTimeline = (path) => {
    if (!path || !path.learningPath) return null;

    return (
      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:w-1 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-blue-500 before:to-transparent mt-8">
        {path.learningPath.map((step, index) => {
          const stepId = step.id || `special-${path.id}-${index + 1}`;
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
                {isCompleted ? <CheckCircle size={20} /> : index + 1}
              </div>

              {/* Card */}
              <div className={`w-full sm:w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] backdrop-blur-md p-3 sm:p-4 rounded border shadow text-sm sm:text-base mt-4 sm:mt-0 ${
                isCompleted 
                  ? 'bg-slate-800/30 border-green-700/50' 
                  : 'bg-slate-800/50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between space-x-2 mb-1">
                  <div className="font-semibold text-white flex items-center gap-2">
                    {isCompleted && <CheckCircle size={16} className="text-green-500" />}
                    <span>{step.title}</span>
                    {index === 0 && !isCompleted && (
                      <Chip 
                        label="Start Here" 
                        size="small" 
                        className="bg-green-700 text-white text-xs ml-2"
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
                        <li key={i} className="flex items-start gap-2 group/resource">
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
          );
        })}
      </div>
    );
  };

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
                Specific Topic Learning Path
              </Typography>
              
              {userInfo && (
                <div className="mt-4 text-slate-300">
                  <p className="mb-2">Your learning profile: <span className="text-blue-400 font-medium">{userInfo.careerPath}</span> • Skill Level: <span className="text-green-400 font-medium">{userInfo.currentSkillLevel}</span></p>
                  
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
                <Link to="/saved-resources">
                  <Button 
                    variant="outlined" 
                    color="secondary"
                    className="text-purple-300 border-purple-400/30 hover:bg-purple-900/20"
                  >
                    <Bookmark size={16} className="mr-2" />
                    Saved Resources
                  </Button>
                </Link>
                <Link to="/learning-path">
                  <Button 
                    variant="outlined" 
                    color="primary"
                    className="text-blue-300 border-blue-400/30 hover:bg-blue-900/20"
                  >
                    <PlayCircle size={16} className="mr-2" />
                    Main Learning Path
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Form Card */}
            <Card className="border border-cyan-700/30 bg-slate-800/50 backdrop-blur-md shadow-[0_0_15px_rgba(0,200,255,0.1)] mb-8">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center text-center mb-6">
                  <h2 className="text-xl md:text-2xl font-semibold text-white mt-2">
                    Generate Custom Topic Path
                  </h2>
                  <p className="text-slate-300 mt-2">Create a personalized learning path for any specific topic you want to master</p>
                </div>

                <div className="space-y-6 mt-6">
                  <Input
                    type="text"
                    placeholder="Enter Topic (e.g. React Hooks, Machine Learning, Blockchain)"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="bg-slate-900/50 border-cyan-700/30 text-white placeholder:text-slate-500 focus:border-cyan-500"
                  />
                  <Textarea
                    placeholder="Details about what you want to learn and your goals (e.g. Build a portfolio project, prepare for interviews, understand advanced concepts)"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    rows={4}
                    className="bg-slate-900/50 border-cyan-700/30 text-white placeholder:text-slate-500 focus:border-cyan-500"
                  />

                  <Button
                    onClick={generatePath}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-blue-500 hover:to-cyan-500 text-white border-none"
                    disabled={loading || !topic}
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
              </CardContent>
            </Card>
            
            {/* Error Message */}
            {error && (
              <Alert severity="error" style={{ marginBottom: "16px" }}>
                {error}
              </Alert>
            )}
            
            {/* Previous Paths Quick Access */}
            {previousPaths.length > 0 && showPreviousPaths && (
              <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-lg border border-slate-700 mb-8">
                <h4 className="text-lg font-semibold text-white text-center mb-4">Your Previous Paths</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {previousPaths.map((path) => (
                    <div 
                      key={path.id} 
                      className="p-3 bg-slate-900/50 rounded border border-blue-700/30 cursor-pointer hover:border-blue-500/50 transition-all duration-300"
                      onClick={() => viewPath(path)}
                    >
                      <div className="font-medium text-lg text-cyan-400 mb-1">{path.topic}</div>
                      <div className="text-xs text-slate-400">
                        {new Date(path.createdAt).toLocaleDateString()} • {path.learningPath.length} steps
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Generated Learning Path */}
            {generatedPath && !showPreviousPaths && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      onClick={goBackToList}
                      className="mr-4 text-slate-300 border-slate-400/30 hover:bg-slate-900/20"
                      size="small"
                    >
                      <ArrowLeft size={16} className="mr-1" />
                      Back to All Paths
                    </Button>
                    <Typography variant="h5" className="text-cyan-400 font-bold">
                      {generatedPath.topic}
                    </Typography>
                  </div>
                  
                  <div className="flex gap-2">
                    <Tooltip title="Generate a new version">
                      <Button 
                        variant="outlined" 
                        color="primary" 
                        onClick={refreshPath}
                        disabled={refreshing}
                        className="text-blue-300 border-blue-400/30 hover:bg-blue-900/20"
                        size="small"
                      >
                        <RefreshCw size={16} className="mr-1" />
                        {refreshing ? "Refreshing..." : "Refresh"}
                      </Button>
                    </Tooltip>
                  </div>
                </div>
                
                {/* Progress section */}
                <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg border border-slate-700 mb-8">
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
                    <span>Click step numbers to mark as complete</span>
                    <span>Est. time remaining: {estimateTimeRemaining()}</span>
                  </div>
                </div>
                
                {renderTimeline(generatedPath)}
                
                <div className="mt-10 p-4 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 text-center">
                  <Typography variant="h6" className="text-blue-400 mb-2">
                    Keep Going! 🚀
                  </Typography>
                  <p className="text-slate-300">
                    Mark steps as complete to track your progress. Save useful resources for later reference.
                  </p>
                  
                  <div className="mt-4 flex gap-4 justify-center">
                    <Button 
                      variant="contained" 
                      color="primary"
                      component={Link}
                      to="/community"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600"
                    >
                      <PlayCircle size={16} className="mr-2" />
                      Join Study Groups
                    </Button>
                    
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecificTopicPath;