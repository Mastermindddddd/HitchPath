import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Button,
  LinearProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import LockIcon from "@mui/icons-material/Lock"; // Material UI Lock Icon

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
        console.error("Error fetching learning path:", error.response?.data || error.message);
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
      <Stepper orientation="vertical" activeStep={currentStep}>
        {learningPath.map((step, index) => {
          const isLocked = index > currentStep; // Lock steps that haven't been reached yet
          return (
            <Step key={index} active={index <= currentStep}>
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <StepLabel
                  sx={{
                    color: "white",
                    "& .MuiStepLabel-label": { color: isLocked ? "gray" : "white" },
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    Step {index + 1}: {step.title}
                    {isLocked && (
                      <LockIcon sx={{ color: "gray", fontSize: 20, ml: 2 }} />
                    )}
                  </Typography>
                </StepLabel>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.3 }}
                >
                  <Typography
                    sx={{
                      color: "white",
                      mt: 1,
                      border: "1px solid #fff",
                      borderRadius: 2,
                      padding: 2,
                      filter: isLocked ? "blur(3px)" : "none", // Apply blur if locked
                    }}
                  >
                    {step.description}
                  </Typography>
                  <Typography
                    sx={{
                      color: "lightgray",
                      fontStyle: "italic",
                      mt: 1,
                      filter: isLocked ? "blur(3px)" : "none", // Apply blur if locked
                    }}
                  >
                    Milestone: {step.milestone}
                  </Typography>
                </motion.div>
              </motion.div>
            </Step>
          );
        })}
      </Stepper>
    );
  };

  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: "auto",
        textAlign: "center",
        mt: 4,
        background: "linear-gradient(135deg, #1e3a8a, #1e40af)",
        color: "white",
        borderRadius: 4,
        p: 4,
        boxShadow: 3,
        marginBottom: "80px",
      }}
    >
      {loading ? (
        <CircularProgress />
      ) : learningPath.length > 0 ? (
        <>
          <Typography variant="h4" gutterBottom>
            Your Personalized Learning Path
          </Typography>
          <LinearProgress
            variant="determinate"
            value={((currentStep + 1) / learningPath.length) * 100}
            sx={{
              height: 10,
              borderRadius: 5,
              background: "rgba(255, 255, 255, 0.3)",
              "& .MuiLinearProgress-bar": {
                background: "gold",
              },
              my: 2,
            }}
          />
          {renderSteps()}
          <Button
            variant="contained"
            sx={{
              mt: 3,
              background: "gold",
              color: "black",
              "&:hover": { background: "#ffd700" },
            }}
            disabled={currentStep === learningPath.length - 1}
            onClick={handleNextStep}
          >
            {currentStep === learningPath.length - 1
              ? "Learning Complete!"
              : "Next Step"}
          </Button>
        </>
      ) : (
        <Typography variant="h6" color="error">
          No learning path found.
        </Typography>
      )}
    </Box>
  );
};

export default LearningPath;
