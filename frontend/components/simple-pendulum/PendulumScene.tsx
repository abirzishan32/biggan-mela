"use client";

import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows, Text } from '@react-three/drei';
import * as THREE from 'three';

// TypeScript interfaces for component props
interface PendulumBobProps {
  position: [number, number, number];
  radius: number;
  color?: string;
}

interface PendulumStringProps {
  start: [number, number, number];
  end: [number, number, number];
  thickness?: number;
}

interface MountPointProps {
  position: [number, number, number];
}

interface RulerMarkingsProps {
  maxLength: number;
}

interface PendulumProps {
  length: number;
  initialAngle: number;
  isSimulating: boolean;
  damping: number;
  onPeriodComplete: () => void;
}

interface PendulumSceneProps {
  length: number;
  initialAngle: number;
  isSimulating: boolean;
  damping: number;
  onPeriodComplete: () => void;
}

// Pendulum bob component
function PendulumBob({ position, radius, color = "#e74c3c" }: PendulumBobProps) {
  return (
    <mesh position={position} castShadow>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial 
        color={color} 
        metalness={0.6}
        roughness={0.3}
      />
    </mesh>
  );
}

// Pendulum string component
function PendulumString({ start, end, thickness = 0.015 }: PendulumStringProps) {
  const direction = new THREE.Vector3().subVectors(
    new THREE.Vector3(...end), 
    new THREE.Vector3(...start)
  );
  const length = direction.length();
  
  // Align cylinder with the direction between start and end
  const midpoint = new THREE.Vector3().addVectors(
    new THREE.Vector3(...start), 
    new THREE.Vector3(...end)
  ).multiplyScalar(0.5);
  const orientation = new THREE.Quaternion();
  
  // Create a vector for the default up direction of a cylinder (along y-axis)
  const up = new THREE.Vector3(0, 1, 0);
  
  // Calculate the rotation to align with our direction
  const normalizedDirection = direction.clone().normalize();
  orientation.setFromUnitVectors(up, normalizedDirection);
  
  return (
    <mesh position={midpoint} quaternion={orientation} castShadow>
      <cylinderGeometry args={[thickness, thickness, length, 12]} />
      <meshStandardMaterial color="#444" metalness={0.5} roughness={0.5} />
    </mesh>
  );
}

// Mount point for the pendulum
function MountPoint({ position }: MountPointProps) {
  return (
    <mesh position={position}>
      <cylinderGeometry args={[0.1, 0.1, 0.1, 16]} />
      <meshStandardMaterial color="#555" metalness={0.7} roughness={0.3} />
    </mesh>
  );
}

// Grid for scale reference
function ReferenceGrid() {
  return (
    <group position={[0, -0.01, 0]} rotation={[-Math.PI/2, 0, 0]}>
      <gridHelper args={[10, 10, '#888', '#444']} />
      <mesh receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#f0f0f0" opacity={0.2} transparent />
      </mesh>
    </group>
  );
}

// Ruler markings to show the scale
function RulerMarkings({ maxLength }: RulerMarkingsProps) {
  const markings = [];
  const interval = 0.25; // 25 cm intervals
  
  for (let i = 0; i <= maxLength; i += interval) {
    const isWholeMeter = Math.abs(Math.round(i) - i) < 0.01;
    const size = isWholeMeter ? 0.1 : 0.05;
    const color = isWholeMeter ? "#ff3333" : "#666666";
    
    markings.push(
      <group key={i} position={[0, -i, 0]}>
        <mesh position={[-0.1, 0, 0]}>
          <boxGeometry args={[size, 0.01, 0.01]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {isWholeMeter && (
          <Text
            position={[-0.2, 0, 0]}
            color="black"
            anchorX="right"
            anchorY="middle"
            fontSize={0.08}
          >
            {i}m
          </Text>
        )}
      </group>
    );
  }
  
  return <group>{markings}</group>;
}

// Main pendulum physics and animation component
function Pendulum({ 
  length, 
  initialAngle, 
  isSimulating, 
  damping,
  onPeriodComplete 
}: PendulumProps) {
  const pivotPoint: [number, number, number] = [0, 0, 0];
  const maxLength = 3.0; // Maximum pendulum length for visualization
  
  // Physics state
  const [angle, setAngle] = useState(initialAngle * Math.PI / 180);
  const [angularVelocity, setAngularVelocity] = useState(0);
  const [lastDirection, setLastDirection] = useState(0);
  const periodsCompleted = useRef(0);
  const lastPeriodTime = useRef(0);
  
  const gravity = 9.8; // m/s²
  const timeStep = 1/60; // 60 fps
  
  // Calculate bob position based on angle and length
  const bobPosition: [number, number, number] = [
    Math.sin(angle) * length,
    -Math.cos(angle) * length,
    0
  ];
  
  // Physics simulation logic
  useFrame((state) => {
    if (!isSimulating) {
      // Reset to initial position when not simulating
      setAngle(initialAngle * Math.PI / 180);
      setAngularVelocity(0);
      periodsCompleted.current = 0;
      lastPeriodTime.current = 0;
      return;
    }
    
    // Simple pendulum physics: θ'' = -(g/L)sin(θ)
    const angularAcceleration = -(gravity / length) * Math.sin(angle);
    
    // Update angular velocity with damping
    const newAngularVelocity = angularVelocity + angularAcceleration * timeStep;
    setAngularVelocity(newAngularVelocity * damping);
    
    // Update angle
    setAngle(angle + newAngularVelocity * timeStep);
    
    // Detect when the pendulum completes a period (crosses center with same direction)
    const currentDirection = Math.sign(newAngularVelocity);
    
    // Detect zero crossing with consistent direction (completes a full period)
    if (Math.abs(angle) < 0.05 && // Close to center
        currentDirection !== 0 &&  // Moving
        lastDirection !== currentDirection && // Changed direction
        state.clock.elapsedTime - lastPeriodTime.current > 1.0) { // Prevent multiple triggers
      
      periodsCompleted.current += 0.5; // Each zero crossing is half a period
      
      // Only call the callback on full periods
      if (periodsCompleted.current % 1 === 0) {
        onPeriodComplete();
        lastPeriodTime.current = state.clock.elapsedTime;
      }
    }
    
    if (currentDirection !== 0) {
      setLastDirection(currentDirection);
    }
  });

  return (
    <group>
      <MountPoint position={pivotPoint} />
      <PendulumString 
        start={pivotPoint} 
        end={bobPosition} 
      />
      <PendulumBob 
        position={bobPosition} 
        radius={0.1 + (length/10)} // Size scales slightly with length 
      />
      <RulerMarkings maxLength={maxLength} />
    </group>
  );
}

// Main scene component
export default function PendulumScene({ 
  length, 
  initialAngle, 
  isSimulating,
  damping,
  onPeriodComplete
}: PendulumSceneProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [2, 0, 5], fov: 50 }}
      >
        <color attach="background" args={["#f0f0f0"]} />
        <ambientLight intensity={0.5} />
        <spotLight position={[0, 5, 5]} angle={0.3} penumbra={1} castShadow intensity={1} />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} />
        
        <Pendulum 
          length={length}
          initialAngle={initialAngle}
          isSimulating={isSimulating}
          damping={damping}
          onPeriodComplete={onPeriodComplete}
        />
        
        <ReferenceGrid />
        <ContactShadows opacity={0.5} scale={10} blur={1} far={10} resolution={256} />
        <Environment preset="city" />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          target={[0, -length/2, 0]} // Focus camera on pendulum
        />
      </Canvas>
    </div>
  );
}