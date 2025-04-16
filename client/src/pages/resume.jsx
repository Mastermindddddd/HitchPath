import { useState, useEffect } from "react";
import axios from "axios"; // Make sure axios is installed
import ResumeBuilder from "../components/resume-builder";

export default function ResumePage() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await axios.get("/api/resume/get-resume");
        setResume(response.data); // Assuming response contains the resume data
      } catch (err) {
        setError("Failed to load resume.");
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <ResumeBuilder initialContent={resume?.content} />
    </div>
  );
}
