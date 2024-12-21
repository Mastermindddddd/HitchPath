import React, { useState, useEffect } from "react";
import axios from "axios";

const SpecificTopicPath = () => {
  const [topic, setTopic] = useState("");
  const [details, setDetails] = useState("");
  const [generatedPath, setGeneratedPath] = useState(null);
  const [previousPaths, setPreviousPaths] = useState([]);

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
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Generate Specific Topic Path</h2>
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Enter Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          style={styles.input}
        />
        <textarea
          placeholder="Details about what you want to master"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          style={styles.textarea}
        />
        <button onClick={generatePath} style={styles.button}>
          Generate Path
        </button>
      </div>

      {generatedPath ? (
        <div style={styles.section}>
          <h3 style={styles.subheading}>Generated Path for {generatedPath.topic}</h3>
          {generatedPath.learningPath?.length > 0 ? (
            <ul style={styles.list}>
              {generatedPath.learningPath.map((step) => (
                <li key={step.id} style={styles.listItem}>
                  <h4 style={styles.stepTitle}>{step.title}</h4>
                  <p>{step.description}</p>
                  <strong>Milestone:</strong> {step.milestone}
                  <ul style={styles.resourceList}>
                    {step.resources?.map((resource, index) => (
                      <li key={index} style={styles.resourceItem}>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          {resource.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p style={styles.message}>No learning path available.</p>
          )}
        </div>
      ) : (
        <p style={styles.message}>No path generated yet.</p>
      )}

      {previousPaths.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.subheading}>Your Previous Paths</h3>
          <ul style={styles.list}>
            {previousPaths.map((path) => (
              <li key={path.id} style={styles.listItem}>
                <strong>{path.topic}</strong>
                <button
                  onClick={() => setGeneratedPath(path)}
                  style={styles.secondaryButton}
                >
                  View
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "'Arial', sans-serif",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  textarea: {
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    height: "100px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  section: {
    marginTop: "30px",
  },
  subheading: {
    color: "#007BFF",
    marginBottom: "10px",
  },
  list: {
    listStyleType: "none",
    padding: "0",
  },
  listItem: {
    backgroundColor: "#fff",
    padding: "15px",
    borderRadius: "4px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    marginBottom: "10px",
  },
  stepTitle: {
    marginBottom: "5px",
    color: "#007BFF",
  },
  resourceList: {
    listStyleType: "disc",
    paddingLeft: "20px",
  },
  resourceItem: {
    marginBottom: "5px",
  },
  secondaryButton: {
    marginTop: "10px",
    padding: "5px 10px",
    fontSize: "14px",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  message: {
    textAlign: "center",
    color: "#555",
  },
};

export default SpecificTopicPath;
