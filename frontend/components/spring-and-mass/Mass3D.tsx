"use client";

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

interface Mass3DProps {
  mass: number;
  color?: string;
  label?: string;
  position?: [number, number, number];
  size?: number;
}

export default function Mass3D({
  mass,
  color = '#ff4040',
  label,
  position = [0, 0, 0],
  size = 1
}: Mass3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<any>(null);
  
  // Calculate size based on mass
  const massSize = Math.max(0.5, Math.min(1.5, 0.7 + mass * 0.2)) * size;
  
  // Subtle animation for the mass
  useFrame((state) => {
    if (meshRef.current) {
      // Add subtle floating effect
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.02;
      meshRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.02;
    }
    
    if (textRef.current) {
      // Keep text facing the camera
      textRef.current.lookAt(state.camera.position);
    }
  });
  
  return (
    <group position={position}>
      {/* Mass block */}
      <mesh 
        ref={meshRef} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[massSize, massSize, massSize]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.2} 
          metalness={0.1}
          envMapIntensity={1}
        />
      </mesh>
      
      {/* Mass label */}
      {label && (
        <group ref={textRef} position={[0, massSize/2 + 0.2, 0]}>
          <Text
            color="white"
            fontSize={0.2}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            {label}
          </Text>
        </group>
      )}
    </group>
  );
}