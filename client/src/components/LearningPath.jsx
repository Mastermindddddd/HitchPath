import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, CircularProgress } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
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
          `${import.meta.env.VITE_API_URL}/api/generate-learning-path`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLearningPath(data.learningPath || []);
      } catch (error) {
        console.error("Error fetching learning path:", error.message);
        alert(error.response?.data?.error || "Failed to load your learning path.");
      } finally {
        setLoading(false);
      }
    };

    fetchLearningPath();
  }, []);

  const renderTimeline = () => (
    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
      {learningPath.map((step, index) => {
        const isLocked = index > currentStep;

        return (
          <div
            key={index}
            className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group ${
              !isLocked ? "is-active" : ""
            }`}
          >
            {/* Icon */}
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${
                isLocked
                  ? "bg-gray-300 text-gray-500"
                  : "bg-emerald-500 text-white"
              }`}
            >
              {isLocked ? <LockIcon /> : <CheckCircleOutlineIcon />}
            </div>

            {/* Card */}
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
                        className={`${
                          isLocked
                            ? "text-gray-400 line-through"
                            : "text-blue-500 hover:underline"
                        }`}
                      >
                        {resource.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <section className="relative flex flex-col justify-center" style={{ minHeight: "100vh", overflow: "visible" }}>
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-24">
        <div className="flex flex-col justify-center divide-y divide-slate-200">
          <div className="w-full max-w-3xl mx-auto">
            {loading ? (
              <CircularProgress />
            ) : learningPath.length > 0 ? (
              <div>
                <Typography variant="h4" className="text-center mb-8">
                  Your Personalized Learning Path
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
