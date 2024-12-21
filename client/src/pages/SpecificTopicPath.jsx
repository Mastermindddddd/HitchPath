import React, { useState, useEffect } from "react";
import axios from "axios";

const SpecificTopicPath = () => {
  const [topic, setTopic] = useState("");
  const [details, setDetails] = useState("");
  const [generatedPath, setGeneratedPath] = useState(null);
  const [previousPaths, setPreviousPaths] = useState([]);

  const fetchPreviousPaths = async () => {
    try {
      const { data } = await axios.get("/api/specific-paths", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPreviousPaths(data.specificPaths);
    } catch (error) {
      console.error("Error fetching previous paths:", error.message);
    }
  };

  useEffect(() => {
    fetchPreviousPaths();
  }, []);

  const generatePath = async () => {
    try {
      const { data } = await axios.post(
        "/api/specific-path/generate",
        { topic, details },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setGeneratedPath(data.specificPath);
      fetchPreviousPaths();
    } catch (error) {
      console.error("Error generating path:", error.message);
    }
  };

  return (
    <div className="specific-path-container">
      <h2>Generate Specific Topic Path</h2>
      <input
        type="text"
        placeholder="Enter Topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />
      <textarea
        placeholder="Details about what you want to master"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
      />
      <button onClick={generatePath}>Generate Path</button>

      {generatedPath && (
        <div className="generated-path">
          <h3>Generated Path for {generatedPath.topic}</h3>
          <ul>
            {generatedPath.learningPath.map((step) => (
              <li key={step.id}>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
                <strong>Milestone:</strong> {step.milestone}
                <ul>
                  {step.resources.map((resource, index) => (
                    <li key={index}>
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        {resource.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}

      {previousPaths.length > 0 && (
        <div className="previous-paths">
          <h3>Your Previous Paths</h3>
          <ul>
            {previousPaths.map((path) => (
              <li key={path.id}>
                <strong>{path.topic}</strong>
                <button onClick={() => setGeneratedPath(path)}>View</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SpecificTopicPath;
