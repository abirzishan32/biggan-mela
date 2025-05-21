"use client";

import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  useGLTF, 
  Environment, 
  ContactShadows, 
  Html,
  useHelper,
  Line,
  PresentationControls,
  Instance,
  Instances
} from '@react-three/drei';
import * as THREE from 'three';
import { calculateInducedCurrent } from '@/lib/electromagnetics';

// TypeScript interfaces for props
interface LenzLawSceneProps {
  magnetStrength: number;
  coilTurns: number;
  coilRadius: number;
  magnetVelocity: number;
  isSimulating: boolean;
  showFieldLines: boolean;
  magnetPolarity: string;
  updateData: (current: number, position: number) => void;
}

interface MagnetProps {
  strength: number;
  polarity: string;
  position: THREE.Vector3;
  showFieldLines: boolean;
  onPositionChange: (position: THREE.Vector3) => void;
}

interface CoilProps {
  turns: number;
  radius: number;
  current: number;
}

interface SimulationProps {
  magnetStrength: number;
  coilTurns: number;
  coilRadius: number;
  magnetVelocity: number;
  isSimulating: boolean;
  showFieldLines: boolean;
  magnetPolarity: string;
  updateData: (current: number, position: number) => void;
}

// Magnet component
function Magnet({ strength, polarity, position, showFieldLines, onPositionChange }: MagnetProps) {
  const magnetRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { camera, gl } = useThree();
  
  // Colors based on polarity
  const northColor = "#ff5555"; // Red
  const southColor = "#5555ff"; // Blue
  
  // Set colors based on polarity
  const topColor = polarity === 'north-south' ? northColor : southColor;
  const bottomColor = polarity === 'north-south' ? southColor : northColor;

  const [dragStart, setDragStart] = useState(0);

  const onPointerDown = (e: any) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragStart(e.point.y);
  };
  
  const onPointerUp = () => {
    setIsDragging(false);
  };
  
  const onPointerMove = (e: any) => {
    if (isDragging) {
      const newPos = new THREE.Vector3(0, position.y + (e.point.y - dragStart), 0);
      onPositionChange(newPos);
      setDragStart(e.point.y);
    }
  };

  useFrame(() => {
    if (magnetRef.current && !isDragging) {
      magnetRef.current.position.copy(position);
    }
  });
  
  // Generate magnetic field lines
  const fieldLines = [];
  if (showFieldLines) {
    const lineCount = 10;
    const linePoints = 50;
    const lineLength = 3 + (strength * 2); // Scale with magnet strength
    
    for (let i = 0; i < lineCount; i++) {
      const angle = (i / lineCount) * Math.PI * 2;
      const points = [];
      
      // Generate curve points
      for (let j = 0; j < linePoints; j++) {
        const t = j / (linePoints - 1);
        const radius = 0.2 + t * lineLength;
        const curvature = 2 - t * 2; // Controls how curved the lines are
        
        const x = Math.sin(angle) * radius;
        let y = Math.cos(angle) * radius;
        
        // Adjust y-coordinate based on polarity
        y = polarity === 'north-south' ? y : -y;
        
        // Add point to the curve
        points.push(new THREE.Vector3(x, y, 0));
      }
      
      fieldLines.push(points);
    }
  }
  
  return (
    <group 
      ref={magnetRef} 
      position={position}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerOut={onPointerUp}
      onPointerMove={onPointerMove}
    >
      {/* North pole */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
        <meshStandardMaterial color={topColor} metalness={0.6} roughness={0.2} />
      </mesh>
      
      {/* South pole */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
        <meshStandardMaterial color={bottomColor} metalness={0.6} roughness={0.2} />
      </mesh>
      
      {/* Label */}
      <Html position={[0, 0, 0.6]}>
        <div className="text-white text-center px-2 py-1 bg-gray-800 bg-opacity-75 rounded">
          {polarity === 'north-south' ? 'N/S' : 'S/N'} ({strength.toFixed(1)} T)
        </div>
      </Html>
      
      {/* Magnetic field lines */}
      {showFieldLines && fieldLines.map((points, index) => (
        <Line
          key={`field-line-${index}`}
          points={points}
          color="#ffa500" // Orange
          lineWidth={1}
          dashed={false}
          opacity={0.7}
        />
      ))}
    </group>
  );
}

// Coil component with current visualization
function Coil({ turns, radius, current }: CoilProps) {
  const coilRef = useRef<THREE.Group>(null);
  const animationSpeed = Math.abs(current) * 0.5; // Animation speed based on current magnitude
  const [rotationOffset, setRotationOffset] = useState(0);
  
  // Animate current flow
  useFrame((state) => {
    if (Math.abs(current) > 0.01) {
      // Update rotation offset for current flow animation
      setRotationOffset((prev) => prev + animationSpeed * 0.03);
      
      // Apply glow intensity based on current
      if (coilRef.current) {
        coilRef.current.children.forEach((child) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.emissive.setRGB(0, Math.min(Math.abs(current) * 0.5, 1), 0);
            child.material.emissiveIntensity = Math.min(Math.abs(current) * 2, 1);
          }
        });
      }
    }
  });
  
  // Generate the coil turns
  const coilSegments = [];
  const segmentsPerTurn = 32;
  const coilThickness = 0.05;
  const coilHeight = 2;
  const turnSpacing = coilHeight / turns;
  
  for (let i = 0; i < turns; i++) {
    const y = -coilHeight/2 + i * turnSpacing;
    
    // Create one turn of the coil
    for (let j = 0; j < segmentsPerTurn; j++) {
      const angle = (j / segmentsPerTurn) * Math.PI * 2;
      const nextAngle = ((j + 1) / segmentsPerTurn) * Math.PI * 2;
      
      const x1 = radius * Math.cos(angle);
      const z1 = radius * Math.sin(angle);
      
      const x2 = radius * Math.cos(nextAngle);
      const z2 = radius * Math.sin(nextAngle);
      
      coilSegments.push(
        <mesh 
          key={`coil-${i}-${j}`} 
          position={[(x1 + x2) / 2, y, (z1 + z2) / 2]}
          rotation={[0, -Math.atan2(z2 - z1, x2 - x1) + Math.PI/2, Math.PI/2]}
        >
          <cylinderGeometry 
            args={[
              coilThickness, 
              coilThickness, 
              Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(z2 - z1, 2)), 
              8
            ]} 
          />
          <meshStandardMaterial 
            color="#cccccc" 
            metalness={0.7} 
            roughness={0.2}
            emissive="#00ff00"
            emissiveIntensity={0}
          />
        </mesh>
      );
    }
  }
  
  // Current flow particles
  const particleCount = Math.floor(50 * Math.abs(current));
  const particles = [];
  
  if (Math.abs(current) > 0.01) {
    const particleDirection = current > 0 ? 1 : -1;
    
    for (let i = 0; i < particleCount; i++) {
      const tOffset = (i / particleCount + rotationOffset) % 1;
      const turnIndex = Math.floor(tOffset * turns) % turns;
      const segmentOffset = (tOffset * turns) % 1;
      
      const angle = segmentOffset * Math.PI * 2 * particleDirection;
      const y = -coilHeight/2 + turnIndex * turnSpacing;
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);
      
      particles.push(
        <mesh key={`particle-${i}`} position={[x, y, z]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color={current > 0 ? "#00ffff" : "#ffff00"} />
        </mesh>
      );
    }
  }
  
  return (
    <group ref={coilRef}>
      {/* Coil turns */}
      {coilSegments}
      
      {/* Current flow particles */}
      {particles}
      
      {/* Coil terminals */}
      <mesh position={[0, -coilHeight/2 - 0.2, 0]}>
        <boxGeometry args={[0.2, 0.1, 0.2]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      
      <mesh position={[0, coilHeight/2 + 0.2, 0]}>
        <boxGeometry args={[0.2, 0.1, 0.2]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  );
}

// Induced magnetic field visualization
function InducedField({ current, coilRadius }: { current: number, coilRadius: number }) {
  if (Math.abs(current) < 0.05) return null;
  
  const fieldIntensity = Math.min(Math.abs(current), 1);
  const fieldDirection = current > 0 ? 1 : -1;
  const fieldLines = [];
  const lineCount = 8;
  
  for (let i = 0; i < lineCount; i++) {
    const angle = (i / lineCount) * Math.PI * 2;
    const points = [];
    
    // Generate induced field lines (circles representing the induced magnetic field)
    const resolution = 32;
    for (let j = 0; j <= resolution; j++) {
      const t = j / resolution;
      const circleAngle = t * Math.PI * 2 * fieldDirection;
      const radius = coilRadius * 1.2;
      
      points.push(new THREE.Vector3(
        radius * Math.cos(circleAngle),
        0,
        radius * Math.sin(circleAngle)
      ));
    }
    
    fieldLines.push(
      <Line
        key={`induced-field-${i}`}
        points={points}
        color={current > 0 ? "#00ffaa" : "#ff00aa"} // Different color for different directions
        lineWidth={2}
        opacity={fieldIntensity * 0.7}
      />
    );
  }
  
  return (
    <group position={[0, 0, 0]}>
      {fieldLines}
    </group>
  );
}

// Simulation container that handles the useFrame hook
function SimulationContainer({
  magnetStrength,
  coilTurns,
  coilRadius,
  magnetVelocity,
  isSimulating,
  showFieldLines,
  magnetPolarity,
  updateData
}: SimulationProps) {
  const initialPosition = new THREE.Vector3(0, 5, 0);
  const [magnetPos, setMagnetPos] = useState(initialPosition);
  const [inducedCurrent, setInducedCurrent] = useState(0);
  const prevPosition = useRef(magnetPos.y);
  const manualControl = useRef(false);
  const prevIsSimulating = useRef(isSimulating);

  useEffect(() => {
    // If simulation was running and has been stopped, reset magnet position
    if (prevIsSimulating.current && !isSimulating) {
      setMagnetPos(initialPosition);
      setInducedCurrent(0);
      updateData(0, initialPosition.y);
    }
    
    // Update previous simulation state
    prevIsSimulating.current = isSimulating;
  }, [isSimulating, updateData]);
  
  // Calculate the flux and induced current
  useFrame((state, delta) => {
    if (manualControl.current) {
      // Calculate the induced current based on position change when dragging
      const velocity = (magnetPos.y - prevPosition.current) / delta;
      const calculatedCurrent = calculateInducedCurrent(
        magnetStrength,
        coilTurns,
        coilRadius,
        velocity,
        magnetPos.y
      );
      setInducedCurrent(calculatedCurrent);
      updateData(calculatedCurrent, magnetPos.y);
    } else if (isSimulating) {
      // Automatic simulation
      let newY = magnetPos.y;
      newY -= magnetVelocity * delta;
      
      // Reverse direction when reaching boundaries
      if (newY < -5 || newY > 5) {
        setMagnetPos(prev => new THREE.Vector3(0, Math.max(-5, Math.min(5, newY)), 0));
        // Reverse velocity
        updateData(0, magnetPos.y); // Zero current at boundaries
      } else {
        setMagnetPos(new THREE.Vector3(0, newY, 0));
        
        // Calculate the induced current
        const calculatedCurrent = calculateInducedCurrent(
          magnetStrength,
          coilTurns,
          coilRadius,
          -magnetVelocity, // Negative because moving down
          newY
        );
        setInducedCurrent(calculatedCurrent);
        updateData(calculatedCurrent, newY);
      }
    } else {
      // Not simulating
      if (inducedCurrent !== 0) {
        setInducedCurrent(0);
        updateData(0, magnetPos.y);
      }
    }
    
    prevPosition.current = magnetPos.y;
  });
  
  // Handle magnet position change from dragging
  const handleMagnetPositionChange = (position: THREE.Vector3) => {
    manualControl.current = true;
    setMagnetPos(position);
    
    // Reset to automatic after a short delay
    setTimeout(() => {
      manualControl.current = false;
    }, 100);
  };
  
  return (
    <>
      {/* Magnet */}
      <Magnet 
        strength={magnetStrength}
        polarity={magnetPolarity}
        position={magnetPos}
        showFieldLines={showFieldLines}
        onPositionChange={handleMagnetPositionChange}
      />
      
      {/* Coil */}
      <Coil 
        turns={coilTurns}
        radius={coilRadius}
        current={inducedCurrent}
      />
      
      {/* Induced magnetic field */}
      <InducedField 
        current={inducedCurrent}
        coilRadius={coilRadius}
      />
    </>
  );
}

// Main LenzLawScene component
export default function LenzLawScene({
  magnetStrength,
  coilTurns,
  coilRadius,
  magnetVelocity,
  isSimulating,
  showFieldLines,
  magnetPolarity,
  updateData
}: LenzLawSceneProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [6, 0, 6], fov: 50 }}
      >
        <color attach="background" args={["#111827"]} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} castShadow intensity={1} />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} />
        
        {/* Move simulation logic into a separate component inside Canvas */}
        <SimulationContainer
          magnetStrength={magnetStrength}
          coilTurns={coilTurns}
          coilRadius={coilRadius}
          magnetVelocity={magnetVelocity}
          isSimulating={isSimulating}
          showFieldLines={showFieldLines}
          magnetPolarity={magnetPolarity}
          updateData={updateData}
        />
        
        {/* Reference grid */}
        <gridHelper args={[20, 20, '#555', '#333']} rotation={[0, 0, 0]} />
        
        {/* Environment and controls */}
        <ContactShadows opacity={0.5} scale={10} blur={1} far={10} resolution={256} />
        <Environment preset="city" />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          target={[0, 0, 0]}
        />
        
        {/* Help indicators */}
        <Html position={[0, 6, 0]}>
          <div className="bg-black bg-opacity-50 text-white p-2 rounded text-center">
            {isSimulating 
              ? "Automatic Mode" 
              : "Drag magnet up/down to induce current"}
          </div>
        </Html>
      </Canvas>
    </div>
  );
}