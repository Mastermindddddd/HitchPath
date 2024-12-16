import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { MeshStandardMaterial } from "three";

const RotatingModel = () => {
  const { scene } = useGLTF("/rotunde.glb");

  return (
    <primitive
      object={scene}
      scale={1.5}
      position={[0, -0.9, 0]}
      rotation={[0, 0, 0]}
    />
  );
};

const Background3D = () => {
    return (
      <Canvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        
        }}
        camera={{
          position: [0, 0, 5], // Adjust camera position to focus on the center
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} />
        <Suspense fallback={null}>
          <RotatingModel />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false} // Disables panning to keep the model centered
          autoRotate
          autoRotateSpeed={0.02} // Slow rotation speed
        />
      </Canvas>
    );
  };
  
  

export default Background3D;
