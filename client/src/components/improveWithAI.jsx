// api/resume.js
import axios from "axios";

export async function improveWithAI({ current, type }) {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/improve-with-ai`,
      { current, type },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data.content;
  } catch (error) {
    console.error("API error:", error);
    throw new Error(
      error.response?.data?.error || "Failed to improve description"
    );
  }
}
