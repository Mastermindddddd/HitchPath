import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Box, Typography, CircularProgress, Button, Alert, Chip, Tooltip, IconButton, TextField, InputAdornment } from "@mui/material";
import { Link } from "react-router-dom";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import DeleteIcon from "@mui/icons-material/Delete";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ArticleIcon from "@mui/icons-material/Article";
import CodeIcon from "@mui/icons-material/Code";
import SchoolIcon from "@mui/icons-material/School";
import LaunchIcon from "@mui/icons-material/Launch";

const SavedResources = () => {
  const [loading, setLoading] = useState(true);
  const [savedResources, setSavedResources] = useState([]);
  const [resourceDetails, setResourceDetails] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const canvasRef = useRef(null);

  // Get resource icon based on URL or title
  const getResourceIcon = (resource) => {
    const url = resource.url?.toLowerCase() || "";
    const title = resource.title?.toLowerCase() || "";
    
    if (url.includes("youtube") || url.includes("vimeo") || title.includes("video")) {
      return <OndemandVideoIcon fontSize="medium" className="text-red-500" />;
    } else if (url.includes("github") || url.includes("stackoverflow") || title.includes("code")) {
      return <CodeIcon fontSize="medium" className="text-gray-300" />;
    } else if (url.includes("docs") || url.includes("documentation") || title.includes("docs")) {
      return <MenuBookIcon fontSize="medium" className="text-blue-400" />;
    } else if (url.includes("course") || url.includes("udemy") || url.includes("coursera")) {
      return <SchoolIcon fontSize="medium" className="text-green-500" />;
    } else {
      return <ArticleIcon fontSize="medium" className="text-indigo-400" />;
    }
  };

  const getResourceType = (resource) => {
    const url = resource.url?.toLowerCase() || "";
    const title = resource.title?.toLowerCase() || "";
    
    if (url.includes("youtube") || url.includes("vimeo") || title.includes("video")) {
      return "video";
    } else if (url.includes("github") || url.includes("stackoverflow") || title.includes("code")) {
      return "code";
    } else if (url.includes("docs") || url.includes("documentation") || title.includes("docs")) {
      return "documentation";
    } else if (url.includes("course") || url.includes("udemy") || url.includes("coursera")) {
      return "course";
    } else {
      return "article";
    }
  };

  // Fetch saved resources and retrieve their details from the learning path
  const fetchSavedResources = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      // Fetch user's saved resource IDs from the new endpoint
      const savedResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/saved-resources`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      const savedResourceIds = savedResponse.data.savedResources || [];
      setSavedResources(savedResourceIds);
      
      // If no saved resources, we can stop here
      if (savedResourceIds.length === 0) {
        setResourceDetails([]);
        setLoading(false);
        return;
      }
      
      // Fetch the learning path to get details of saved resources
      const pathResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/generate-learning-path`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      const learningPath = pathResponse.data.learningPath || [];
      
      // Extract resource details based on saved IDs
      const details = [];
      savedResourceIds.forEach(savedId => {
      // Convert savedId to string if it's not already
      const savedIdStr = String(savedId);
      const [stepId, resourceIndex] = savedIdStr.split('-').map(part => 
        isNaN(parseInt(part)) ? part : parseInt(part)
      );
  
      const step = learningPath.find(s => (s.id || s.id === 0) ? s.id === stepId : false);
  
      if (step && step.resources && step.resources[resourceIndex]) {
        details.push({
        id: savedIdStr, // Use the string version
        ...step.resources[resourceIndex],
        stepTitle: step.title,
        stepId: step.id
        });
       }
      });
      
      setResourceDetails(details);
    } catch (err) {
      console.error("Failed to load saved resources:", err);
      const errorMessage = err.response?.data?.error || "Failed to load your saved resources.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Remove a resource from saved list
  const removeResource = async (resourceId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");
      
      // Optimistic UI update
      setSavedResources(savedResources.filter(id => id !== resourceId));
      setResourceDetails(resourceDetails.filter(resource => resource.id !== resourceId));
      
      // Send to server
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/save-resource`,
        {
          resourceId,
          saved: false
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error("Failed to remove resource:", err);
      // Revert optimistic update on error
      fetchSavedResources();
    }
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

  // Filter resources based on search query and type filter
  const filteredResources = () => {
    return resourceDetails.filter(resource => {
      const matchesSearch = 
        resource.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.stepTitle?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = 
        filterType === "all" || 
        getResourceType(resource) === filterType;
        
      return matchesSearch && matchesType;
    });
  };

  // Initialize the canvas and particle animation
  useEffect(() => {
    fetchSavedResources();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Canvas particle animation
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

  const renderResourceList = () => {
    const filtered = filteredResources();
    
    if (filtered.length === 0) {
      return (
        <div className="text-center p-8 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700">
          <Typography variant="h6" className="text-slate-300 mb-4">
            {searchQuery || filterType !== "all" 
              ? "No resources match your filters." 
              : "You haven't saved any resources yet."}
          </Typography>
          {searchQuery || filterType !== "all" ? (
            <Button 
              variant="outlined" 
              color="primary"
              onClick={() => {
                setSearchQuery("");
                setFilterType("all");
              }}
            >
              Clear Filters
            </Button>
          ) : (
            <Button 
              variant="contained" 
              color="primary"
              component={Link}
              to="/learning-path"
            >
              Explore Learning Path
            </Button>
          )}
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((resource, index) => (
          <div 
            key={resource.id} 
            className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg border border-slate-700 hover:border-blue-500/50 transition-all duration-300"
          >
            <div className="flex items-start gap-3">
              <div className="mt-1 p-2 bg-slate-700/50 rounded-lg">
                {getResourceIcon(resource)}
              </div>
              
              <div className="flex-grow">
                <div className="flex justify-between items-start gap-2">
                  <a
                    href={validateResourceUrl(resource.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 hover:underline font-medium"
                  >
                    {resource.title}
                    <LaunchIcon fontSize="small" className="ml-1" style={{ fontSize: "0.9rem" }} />
                  </a>
                  
                  <Tooltip title="Remove from saved">
                    <IconButton 
                      size="small" 
                      onClick={() => removeResource(resource.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </div>
                
                <div className="text-xs text-slate-400 mt-1">
                  From: <span className="text-green-400">{resource.stepTitle}</span>
                </div>
                
                <div className="mt-2">
                  <Chip 
                    label={getResourceType(resource)}
                    size="small"
                    className={`text-xs ${
                      getResourceType(resource) === 'video' ? 'bg-red-900/50 text-red-300' :
                      getResourceType(resource) === 'code' ? 'bg-gray-700/50 text-gray-300' :
                      getResourceType(resource) === 'documentation' ? 'bg-blue-900/50 text-blue-300' :
                      getResourceType(resource) === 'course' ? 'bg-green-900/50 text-green-300' :
                      'bg-indigo-900/50 text-indigo-300'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section
      className="relative flex flex-col justify-center min-h-screen py-8"
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

      <div className="w-full max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex flex-col justify-center">
          <div className="w-full max-w-4xl mx-auto">
            {/* Header section */}
            <div className="text-center mb-8">
              <div className="mb-4">
                <Button
                  component={Link}
                  to="/learning-path"
                  startIcon={<ArrowBackIcon />}
                  variant="text"
                  color="primary"
                  className="text-blue-400"
                >
                  Back to Learning Path
                </Button>
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
                Saved Learning Resources
              </Typography>
              
              <Typography variant="body1" className="text-slate-300 mt-2">
                Access all your bookmarked learning materials in one place
              </Typography>
            </div>
            
            {/* Search and filter section */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon className="text-slate-400" />
                    </InputAdornment>
                  ),
                  className: "bg-slate-800/50 backdrop-blur-sm rounded text-white border-slate-600"
                }}
                size="small"
              />
              
              <div className="flex gap-2 overflow-x-auto pb-1">
                <Chip 
                  icon={<FilterListIcon />}
                  label="All"
                  onClick={() => setFilterType("all")}
                  color={filterType === "all" ? "primary" : "default"}
                  className={filterType === "all" ? "bg-blue-600" : "bg-slate-700"}
                />
                <Chip 
                  icon={<OndemandVideoIcon className="text-red-400" />}
                  label="Videos"
                  onClick={() => setFilterType("video")}
                  color={filterType === "video" ? "primary" : "default"}
                  className={filterType === "video" ? "bg-blue-600" : "bg-slate-700"}
                />
                <Chip 
                  icon={<ArticleIcon className="text-indigo-400" />}
                  label="Articles"
                  onClick={() => setFilterType("article")}
                  color={filterType === "article" ? "primary" : "default"}
                  className={filterType === "article" ? "bg-blue-600" : "bg-slate-700"}
                />
                <Chip 
                  icon={<CodeIcon className="text-gray-300" />}
                  label="Code"
                  onClick={() => setFilterType("code")}
                  color={filterType === "code" ? "primary" : "default"}
                  className={filterType === "code" ? "bg-blue-600" : "bg-slate-700"}
                />
                <Chip 
                  icon={<SchoolIcon className="text-green-400" />}
                  label="Courses"
                  onClick={() => setFilterType("course")}
                  color={filterType === "course" ? "primary" : "default"}
                  className={filterType === "course" ? "bg-blue-600" : "bg-slate-700"}
                />
              </div>
            </div>
            
            {/* Resources list */}
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
              </Box>
            ) : error ? (
              <Box textAlign="center" py={4}>
                <Alert severity="error" style={{ marginBottom: "16px" }}>
                  {error}
                </Alert>
                <Button variant="contained" color="primary" onClick={fetchSavedResources}>
                  Retry
                </Button>
              </Box>
            ) : (
              <div>
                {/* Stats */}
                <div className="bg-slate-800/50 backdrop-blur-md p-4 rounded-lg border border-slate-700 mb-6">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <Typography variant="body2" className="text-slate-300">
                      <BookmarkIcon className="text-yellow-400 mr-1" fontSize="small" />
                      <span className="font-bold text-white">{resourceDetails.length}</span> resources saved
                    </Typography>
                    
                    <div className="text-sm text-slate-400 flex items-center gap-2">
                      <span className="flex items-center">
                        <OndemandVideoIcon fontSize="small" className="text-red-400 mr-1" />
                        {resourceDetails.filter(r => getResourceType(r) === "video").length}
                      </span>
                      <span className="flex items-center">
                        <ArticleIcon fontSize="small" className="text-indigo-400 mr-1" />
                        {resourceDetails.filter(r => getResourceType(r) === "article").length}
                      </span>
                      <span className="flex items-center">
                        <CodeIcon fontSize="small" className="text-gray-300 mr-1" />
                        {resourceDetails.filter(r => getResourceType(r) === "code").length}
                      </span>
                      <span className="flex items-center">
                        <SchoolIcon fontSize="small" className="text-green-400 mr-1" />
                        {resourceDetails.filter(r => getResourceType(r) === "course").length}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Resource Grid */}
                {renderResourceList()}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SavedResources;