import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import LockIcon from "@mui/icons-material/Lock";

const LearningPath = () => {
  const [loading, setLoading] = useState(true);
  const [learningPath, setLearningPath] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const fetchLearningPath = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");

        const { data } = await axios.get(
          "http://localhost:3000/api/generate-learning-path",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Learning Path Data:", data);
        setLearningPath(data.learningPath || []);
      } catch (error) {
        console.error(
          "Error fetching learning path:",
          error.response?.data || error.message
        );
        alert(error.response?.data?.error || "Failed to load your learning path.");
      } finally {
        setLoading(false);
      }
    };

    fetchLearningPath();
  }, []);

  const handleNextStep = () => {
    if (currentStep < learningPath.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const renderSteps = () => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          mt: 4,
        }}
      >
        {learningPath.map((step, index) => {
          const isLocked = index > currentStep;

          return (
            <Box
              key={index}
              sx={{
                p: 3,
                border: "1px solid #fff",
                borderRadius: 4,
                background: isLocked
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(255, 255, 255, 0.2)",
                filter: isLocked ? "blur(2px)" : "none",
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <Typography variant="h6" sx={{ color: "white" }}>
                  Step {index + 1}: {step.title}
                  {isLocked && (
                    <LockIcon
                      sx={{
                        color: "gray",
                        fontSize: 20,
                        ml: 1,
                      }}
                    />
                  )}
                </Typography>
                <Typography
                  sx={{
                    color: "white",
                    mt: 1,
                    fontSize: 14,
                  }}
                >
                  {step.description}
                </Typography>
                <Typography
                  sx={{
                    color: "lightgray",
                    fontStyle: "italic",
                    mt: 1,
                  }}
                >
                  Milestone: {step.milestone}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "white", mt: 2 }}
                >
                  Resources:
                </Typography>
                <ul>
                  {step.resources.map((resource, i) => (
                    <li key={i}>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: isLocked ? "gray" : "#4caf50",
                          textDecoration: isLocked ? "line-through" : "none",
                        }}
                      >
                        {resource.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
              {!isLocked && index === currentStep && (
                <Button
                  variant="contained"
                  sx={{
                    background: "#1e40af",
                    mt: 2,
                  }}
                  onClick={handleNextStep}
                >
                  Next
                </Button>
              )}
            </Box>
          );
        })}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: "auto",
        mt: 4,
        textAlign: "center",
        background: "linear-gradient(135deg, #1e3a8a, #1e40af)",
        color: "white",
        borderRadius: 4,
        p: 4,
        boxShadow: 3,
        marginBottom: "80px",
        overflow: "hidden",
      }}
    >
      {loading ? (
        <CircularProgress />
      ) : learningPath.length > 0 ? (
        <>
          <Typography variant="h4" mb={4}>
            Your Personalized Learning Path
          </Typography>
          {renderSteps()}
        </>
      ) : (
        <Typography variant="h6" color="text.secondary">
          No learning path available yet.
        </Typography>
      )}
    </Box>
  );
};

export default LearningPath;
