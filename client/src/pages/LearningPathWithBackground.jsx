import React from "react";
import LearningPath from "../components/LearningPath";
import Background3D from "../components/Background3D"; // Adjust the path based on your project structure

const LearningPathWithBackground = () => {
    return (
      <div style={{ position: "relative", overflow: "hidden", marginTop: "-50px",}}>
        {/* Background */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1 }}>
          <Background3D />
        </div>
  
        {/* Content */}
        <div style={{ position: "relative", zIndex: 1, marginTop: "-20px", }}>
          <LearningPath />
        </div>
      </div>
    );
  };
  
  export default LearningPathWithBackground;
  