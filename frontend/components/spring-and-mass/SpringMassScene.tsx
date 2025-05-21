"use client";

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useHelper, Text, Html } from '@react-three/drei';
import { SpringSystem } from './types';
import Spring3D from './Spring3D';
import Mass3D from './Mass3D';
import * as THREE from 'three';

interface SpringMassSceneProps {
  springSystems: SpringSystem[];
}

// Component for oscillation calculation display
function OscillationFormula({ 
  system, 
  position, 
  align = "left" 
}: { 
  system: SpringSystem, 
  position: [number, number, number],
  align?: "left" | "right" 
}) {
  const textRef = useRef<any>(null);
  
  useFrame(({ camera }) => {
    if (textRef.current) {
      // Make text face the camera
      textRef.current.lookAt(camera.position);
    }
  });
  
  // Only show formula if there's a mass attached
  if (!system.attachedMass) {
    return null;
  }
  
  const k = system.springConstant.toFixed(1); // Spring constant
  const m = system.attachedMass.mass.toFixed(1); // Mass
  const T = system.oscillationPeriod.toFixed(2); // Period
  
  // Current position calculation
  
  return (
    <group position={position} ref={textRef}>
      <Html
        transform
        occlude
        distanceFactor={6}
        position={[0, 0, 0]}
        style={{
          width: '220px',
          background: 'rgba(0, 0, 0, 0.7)',
          padding: '10px',
          borderRadius: '6px',
          color: 'white',
          fontSize: '12px',
          textAlign: align
        }}
      >
        <div style={{ width: '100%' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#90cdf4' }}>
            Spring-Mass Oscillation
          </div>
          <div>Period: T = 2π√(m/k)</div>
          <div>T = 2π√({m}/{k}) = {T}s</div>
          </div>
      </Html>
    </group>
  );
}

// Component for the floor/table
function Floor() {
  return (
    <group position={[0, -6, 0]}>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#444444" roughness={0.8} metalness={0.2} />
      </mesh>
      <ContactShadows 
        position={[0, 0.01, 0]} 
        opacity={0.6} 
        scale={15} 
        blur={2.5} 
        far={5} 
        resolution={512}
      />
    </group>
  );
}

// Scene lighting
function SceneLighting() {
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight 
        ref={directionalLightRef}
        position={[5, 8, 5]} 
        intensity={1} 
        castShadow 
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={20}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[-5, 5, -5]} intensity={0.5} />
    </>
  );
}

// Spring with fixed top and oscillating bottom
function AnchoredSpring({ system, position }: { system: SpringSystem, position: [number, number, number] }) {
  const springRef = useRef<THREE.Group>(null);
  
  // Calculate total length correctly for visualization
  const totalLength = system.currentLength / 40;
  const naturalLength = system.naturalLength / 40;
  
  // Calculate position for spring reference point (middle)
  const springTopPosition: [number, number, number] = [
    position[0],
    position[1], 
    position[2]
  ];
  
  // Use a ref to manipulate the spring's position and scale
  useFrame(() => {
    if (springRef.current) {
      // Keep top of spring fixed at the same position
      // We handle this by NOT scaling the top part, only the bottom part
      
      // Calculate how far to move down based on current length
      const displacement = (totalLength - naturalLength) / 2;
      
      // Move the spring's center down by half the displacement
      springRef.current.position.y = position[1] - displacement;
      
      // Scale the spring to match current length - only in y direction
      springRef.current.scale.y = totalLength / naturalLength;
    }
  });
  
  return (
    <group>
      {/* Spring constant label */}
      <Text
        position={[position[0], position[1] + 1, position[2]]}
        fontSize={0.2}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {system.springConstant.toFixed(1)} N/m
      </Text>
      
      {/* The spring itself */}
      <group ref={springRef} position={springTopPosition}>
        <Spring3D 
          length={naturalLength} // We handle scaling in the useFrame hook
          naturalLength={naturalLength}
          springConstant={system.springConstant}
          position={[0, 0, 0]} // Local position
        />
      </group>
    </group>
  );
}

// Main scene component
export default function SpringMassScene({ springSystems }: SpringMassSceneProps) {
  return (
    <Canvas shadows camera={{ position: [0, 0, 10], fov: 50 }}>
      <color attach="background" args={['#f0f0f0']} />
      
      <SceneLighting />
      
      {/* Spring systems */}
      {springSystems.map((system, index) => {
        const xOffset = (index - (springSystems.length - 1) / 2) * 3;
        const springPosition: [number, number, number] = [xOffset, 3, 0];
        
        // Calculate mass position at the bottom of the spring
        const massPosition: [number, number, number] = [
          xOffset, 
          3 - system.currentLength / 40, // Scale down to Three.js units
          0
        ];
        
        // Calculate formula display positions
        const leftFormulaPosition: [number, number, number] = [
          xOffset - 1.8, // Left of the left spring
          2,
          0
        ];
        
        const rightFormulaPosition: [number, number, number] = [
          xOffset + 1.8, // Right of the right spring
          2,
          0
        ];
        
        return (
          <group key={system.id}>
            {/* Anchored spring with fixed top */}
            <AnchoredSpring 
              system={system}
              position={springPosition}
            />
            
            {/* Mass block */}
            {system.attachedMass && (
              <Mass3D 
                mass={system.attachedMass.mass}
                color={system.attachedMass.color}
                label={system.attachedMass.label}
                position={massPosition}
              />
            )}
            
            {/* Physics formula displays */}
            {index === 0 && (
              <OscillationFormula 
                system={system} 
                position={leftFormulaPosition} 
                align="right"
              />
            )}
            
            {index === 1 && (
              <OscillationFormula 
                system={system} 
                position={rightFormulaPosition} 
                align="left"
              />
            )}
          </group>
        );
      })}
      
      <Floor />
      
      {/* Environment and controls */}
      <Environment preset="city" />
      <OrbitControls 
        enablePan={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
        minDistance={5}
        maxDistance={20}
      />
    </Canvas>
  );
}