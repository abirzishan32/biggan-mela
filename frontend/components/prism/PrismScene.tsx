"use client";

import { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  ContactShadows, 
  Html,
  Line,
  PresentationControls,
  Text
} from '@react-three/drei';
import * as THREE from 'three';
import { calculateRefractionAngle, refractiveIndices } from '@/lib/physics';

// TypeScript interfaces for props
interface PrismSceneProps {
  prismAngle: number;
  prismMaterial: string;
  incidentAngle: number;
  pinDistance: number;
  isSimulating: boolean;
}

interface PrismProps {
  angle: number;
  material: string;
  height: number;
}

interface LightRayProps {
  incidentAngle: number;
  prismAngle: number;
  refractiveIndex: number;
  pinDistance: number;
}

interface PinProps {
  position: [number, number, number];
  color?: string;
  height?: number;
}

// Create a pin for the laboratory setup
function Pin({ position, color = "#ff3333", height = 0.3 }: PinProps) {
  return (
    <group position={position}>
      {/* Pin head */}
      <mesh position={[0, height, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.2} />
      </mesh>
      
      {/* Pin body */}
      <mesh position={[0, height/2, 0]}>
        <cylinderGeometry args={[0.02, 0.02, height, 8]} />
        <meshStandardMaterial color="#cccccc" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Pin shadow on paper */}
      <mesh position={[0, 0.001, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <circleGeometry args={[0.03, 16]} />
        <meshBasicMaterial color="#333333" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

// Create a drawing board with paper
function DrawingBoard() {
  return (
    <group>
      {/* Drawing board (wooden base) */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <boxGeometry args={[15, 15, 0.2]} />
        <meshStandardMaterial color="#8b4513" roughness={0.8} />
      </mesh>
      
      {/* Paper */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.4} />
      </mesh>
      
      {/* Grid lines on paper */}
      {Array.from({ length: 28 }).map((_, i) => {
        const pos = -7 + i * 0.5;
        return (
          <group key={`grid-${i}`}>
            {/* Horizontal line */}
            <Line 
              points={[[-7, 0, pos], [7, 0, pos]]}
              color="#cccccc"
              lineWidth={i % 2 === 0 ? 2 : 1}
              opacity={i % 2 === 0 ? 0.8 : 0.4}
            />
            
            {/* Vertical line */}
            <Line 
              points={[[pos, 0, -7], [pos, 0, 7]]}
              color="#cccccc"
              lineWidth={i % 2 === 0 ? 2 : 1}
              opacity={i % 2 === 0 ? 0.8 : 0.4}
            />
          </group>
        );
      })}
      
      {/* Protractor at the center */}
      <mesh position={[0, 0.001, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <circleGeometry args={[3, 32]} />
        <meshBasicMaterial transparent opacity={0.2} color="#3333ff" />
      </mesh>
      
      {/* Protractor degree markings */}
      {Array.from({ length: 36 }).map((_, i) => {
        const angle = (i * 10 * Math.PI) / 180;
        const startRadius = 2.8;
        const endRadius = i % 3 === 0 ? 3.0 : 2.9;
        return (
          <Line 
            key={`angle-${i}`}
            points={[
              [Math.sin(angle) * startRadius, 0.002, Math.cos(angle) * startRadius],
              [Math.sin(angle) * endRadius, 0.002, Math.cos(angle) * endRadius]
            ]}
            color="#333333"
            lineWidth={i % 3 === 0 ? 2 : 1}
          />
        );
      })}
      
      {/* Degree labels for major angles */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
        const angle = (deg * Math.PI) / 180;
        const radius = 3.2;
        return (
          <Text
            key={`deg-${deg}`}
            position={[Math.sin(angle) * radius, 0.002, Math.cos(angle) * radius]}
            rotation={[-Math.PI/2, 0, -angle + Math.PI/2]}
            fontSize={0.2}
            color="#000000"
          >
            {deg}°
          </Text>
        );
      })}
    </group>
  );
}

// Create a prism
function Prism({ angle, material, height = 0.5 }: PrismProps) {
  const shape = useMemo(() => {
    // Create a triangle shape for the prism base
    const shape = new THREE.Shape();
    
    // Calculate the side length based on the angle
    const sideLength = 2;
    const halfBaseLength = sideLength * Math.sin(angle * Math.PI / 360);
    const height = sideLength * Math.cos(angle * Math.PI / 360);
    
    // Draw the triangle starting from the top
    shape.moveTo(0, height);
    shape.lineTo(-halfBaseLength, 0);
    shape.lineTo(halfBaseLength, 0);
    shape.lineTo(0, height);
    
    return shape;
  }, [angle]);
  
  // Get the material color and properties
  const materialColor = useMemo(() => {
    switch(material) {
      case 'glass': return { color: '#a6d8ff', opacity: 0.6, ior: 1.5 };
      case 'diamond': return { color: '#f0f4ff', opacity: 0.8, ior: 2.417 };
      case 'water': return { color: '#c2e3ff', opacity: 0.5, ior: 1.333 };
      case 'oil': return { color: '#ffeca9', opacity: 0.7, ior: 1.47 };
      default: return { color: '#a6d8ff', opacity: 0.6, ior: 1.5 };
    }
  }, [material]);
  
  return (
    <group>
      <mesh rotation={[0, Math.PI/2, 0]} position={[0, height/2, 0]}>
        <extrudeGeometry 
          args={[
            shape, 
            { 
              depth: 0.01, 
              bevelEnabled: false
            }
          ]} 
        />
        <meshPhysicalMaterial 
          color={materialColor.color}
          transparent
          opacity={materialColor.opacity}
          metalness={0.1}
          roughness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          ior={materialColor.ior}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// Create light rays that show refraction
function LightRay({ incidentAngle, prismAngle, refractiveIndex, pinDistance }: LightRayProps) {
  // Calculate the light path through the prism
  const lightPath = useMemo(() => {
    // Convert angles to radians
    const iRad = (incidentAngle * Math.PI) / 180;
    const aRad = (prismAngle * Math.PI) / 180;
    
    // Starting point of the incident ray
    const startPoint = new THREE.Vector3(-pinDistance, 0.1, 0);
    
    // Direction of the incident ray
    const incidentDir = new THREE.Vector3(
      Math.cos(iRad),
      0,
      -Math.sin(iRad)
    ).normalize();
    
    // Calculate intersection with prism (simplified)
    const toIntersection = 5; // Distance to the prism face
    const intersectionPoint = new THREE.Vector3().copy(startPoint).add(
      incidentDir.clone().multiplyScalar(toIntersection)
    );
    
    // Calculate refraction at first face
    const r1 = calculateRefractionAngle(incidentAngle, 1.0003, refractiveIndex);
    const r1Rad = (r1 * Math.PI) / 180;
    
    const refractedDir1 = new THREE.Vector3(
      Math.cos(r1Rad),
      0,
      -Math.sin(r1Rad)
    ).normalize();
    
    // Calculate internal path length
    const internalPathLength = 2.0; // Simplification
    const exitPoint = new THREE.Vector3().copy(intersectionPoint).add(
      refractedDir1.clone().multiplyScalar(internalPathLength)
    );
    
    // Calculate second refraction (exit from prism)
    // This is a simplification - in reality the calculation would be based on prism geometry
    const internalAngle = prismAngle - r1;
    const r2 = calculateRefractionAngle(internalAngle, refractiveIndex, 1.0003);
    const r2Rad = (r2 * Math.PI) / 180;
    
    const refractedDir2 = new THREE.Vector3(
      Math.cos(r2Rad - aRad + Math.PI),
      0,
      -Math.sin(r2Rad - aRad + Math.PI)
    ).normalize();
    
    // Calculate final ray segment
    const finalPoint = new THREE.Vector3().copy(exitPoint).add(
      refractedDir2.clone().multiplyScalar(5)
    );
    
    // Compute the total deviation angle
    const deviationAngle = incidentAngle - (r2 - prismAngle);
    
    return {
      points: [startPoint, intersectionPoint, exitPoint, finalPoint],
      deviation: deviationAngle
    };
  }, [incidentAngle, prismAngle, refractiveIndex, pinDistance]);
  
  return (
    <group>
      {/* Incident ray */}
      <Line 
        points={[lightPath.points[0], lightPath.points[1]]} 
        color="#ff0000"
        lineWidth={3}
      />
      
      {/* Ray inside prism */}
      <Line 
        points={[lightPath.points[1], lightPath.points[2]]} 
        color="#ff8800"
        lineWidth={3}
      />
      
      {/* Refracted ray */}
      <Line 
        points={[lightPath.points[2], lightPath.points[3]]} 
        color="#ff0000"
        lineWidth={3}
      />
      
      {/* Add visual pins to mark the path */}
      <Pin position={[lightPath.points[0].x, 0, lightPath.points[0].z]} color="#3333ff" />
      <Pin position={[lightPath.points[3].x, 0, lightPath.points[3].z]} color="#33ff33" />
      
      {/* Label for deviation angle */}
      <Html 
        position={[lightPath.points[3].x, 0.5, lightPath.points[3].z]}
        center
      >
        <div className="bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
          Deviation: {lightPath.deviation.toFixed(2)}°
        </div>
      </Html>
    </group>
  );
}

// Main scene simulation
function PrismSimulation({ 
  prismAngle, 
  prismMaterial, 
  incidentAngle,
  pinDistance,
  isSimulating 
}: PrismSceneProps) {
  const refractiveIndex = refractiveIndices[prismMaterial as keyof typeof refractiveIndices];
  
  return (
    <group>
      <DrawingBoard />
      
      <Prism 
        angle={prismAngle} 
        material={prismMaterial}
        height={0.5}
      />
      
      {isSimulating && (
        <LightRay 
          incidentAngle={incidentAngle}
          prismAngle={prismAngle}
          refractiveIndex={refractiveIndex}
          pinDistance={pinDistance}
        />
      )}
      
      {/* Incident angle indicator */}
      <group>
        <Line 
          points={[
            [0, 0.01, 0],
            [-3, 0.01, 0]
          ]}
          color="#333333"
          lineWidth={1}
          dashed
        />
        
        <Line 
          points={[
            [0, 0.01, 0],
            [-3 * Math.cos(incidentAngle * Math.PI / 180), 0.01, 3 * Math.sin(incidentAngle * Math.PI / 180)]
          ]}
          color="#333333"
          lineWidth={1}
          dashed
        />
        
        {/* Angle arc */}
        {Array.from({ length: incidentAngle + 1 }).map((_, i) => (
          <Line 
            key={`arc-${i}`}
            points={[
              [0.5 * Math.cos((i - 0.5) * Math.PI / 180), 0.01, 0.5 * Math.sin((i - 0.5) * Math.PI / 180)],
              [0.5 * Math.cos((i + 0.5) * Math.PI / 180), 0.01, 0.5 * Math.sin((i + 0.5) * Math.PI / 180)]
            ]}
            color="#ff3333"
            lineWidth={2}
          />
        ))}
      </group>
    </group>
  );
}

// Main PrismScene component
export default function PrismScene({ 
  prismAngle, 
  prismMaterial, 
  incidentAngle,
  pinDistance,
  isSimulating 
}: PrismSceneProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 8, 8], fov: 50 }}
      >
        <color attach="background" args={["#f0f0f0"]} />
        <ambientLight intensity={0.7} />
        <spotLight position={[5, 10, 5]} angle={0.3} penumbra={1} castShadow intensity={1} />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} />
        
        <PrismSimulation 
          prismAngle={prismAngle}
          prismMaterial={prismMaterial}
          incidentAngle={incidentAngle}
          pinDistance={pinDistance}
          isSimulating={isSimulating}
        />
        
        <ContactShadows opacity={0.5} scale={20} blur={1} far={10} resolution={256} />
        <Environment preset="sunset" />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          target={[0, 0, 0]}
          maxPolarAngle={Math.PI / 2.1}
        />
        
        {/* Laboratory instructions */}
        <Html position={[-6, 0.5, -6]}>
          <div className="bg-black bg-opacity-75 text-white p-3 rounded w-64">
            <h3 className="font-medium text-lg">Instructions:</h3>
            <ol className="list-decimal pl-5 space-y-1 text-sm mt-2">
              <li>Set the incident angle between 30° - 60°</li>
              <li>Press "Take Measurement" to record data</li>
              <li>Repeat with different angles to find the minimum deviation</li>
              <li>Use the formula μ = sin((A+Dm)/2) / sin(A/2) to calculate index</li>
            </ol>
          </div>
        </Html>
      </Canvas>
    </div>
  );
}