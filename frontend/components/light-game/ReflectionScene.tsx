"use client";

import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Environment, ContactShadows, PerspectiveCamera } from '@react-three/drei';
import LightRay from './LightRay';

interface ReflectionSceneProps {
  lightAngle: number;
}

export default function ReflectionScene({ lightAngle }: ReflectionSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const mirrorRef = useRef<THREE.Mesh>(null);
  const [cameraPosition] = useState(() => new THREE.Vector3(6, 3, 9));
  
  // Calculate reflection angle (equals the incident angle)
  const reflectionAngle = lightAngle;

  // Calculate light ray positions
  const { incidentRay, reflectedRay } = useMemo(() => {
    const incidentAngleRad = (lightAngle * Math.PI) / 180;
    const reflectionAngleRad = (reflectionAngle * Math.PI) / 180;
    
    // Start point above the surface
    const startPoint = new THREE.Vector3(0, 3, 0);
    
    // Intersection with surface (y=0)
    const intersectionPoint = new THREE.Vector3(
      startPoint.x - 3 * Math.tan(incidentAngleRad),
      0,
      0
    );
    
    // End point of reflected ray (back up)
    const endPoint = new THREE.Vector3(
      intersectionPoint.x - 3 * Math.tan(reflectionAngleRad),
      3,
      0
    );
    
    return {
      incidentRay: {
        start: startPoint,
        end: intersectionPoint
      },
      reflectedRay: {
        start: intersectionPoint,
        end: endPoint
      }
    };
  }, [lightAngle, reflectionAngle]);

  // Add subtle animation
  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Subtle floating motion
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.05;
      groupRef.current.rotation.y += 0.001;
    }
    
    // Make mirrorRef shimmer
    if (mirrorRef.current) {
      const material = mirrorRef.current.material as THREE.MeshStandardMaterial;
      if (material.emissiveIntensity !== undefined) {
        material.emissiveIntensity = 0.1 + Math.sin(clock.getElapsedTime() * 2) * 0.05;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Custom camera positioning for better view */}
      <PerspectiveCamera makeDefault position={cameraPosition} fov={50} />
      
      {/* Environment and lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#fff" />
      <pointLight position={[-5, 5, 5]} intensity={0.5} color="#ffedd5" />
      <Environment preset="sunset" background={false} />
      
      {/* Reflective surface with improved materials */}
      <mesh 
        ref={mirrorRef}
        position={[0, -0.1, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[12, 12, 32, 32]} />
        <meshPhysicalMaterial 
          color="#90cdf4"
          metalness={0.95}
          roughness={0.05}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          reflectivity={1.0}
          emissive="#3182ce"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Base/floor */}
      <mesh position={[0, -0.15, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a202c" />
      </mesh>
      
      {/* Contact shadows for realism */}
      <ContactShadows
        position={[0, -0.09, 0]}
        opacity={0.6}
        scale={12}
        blur={1}
        far={0.5}
      />
      
      {/* Incident ray with enhanced visuals */}
      <LightRay 
        start={incidentRay.start} 
        end={incidentRay.end} 
        color="#FFD700" // Gold color for incident ray
      />
      
      {/* Reflected ray with enhanced visuals */}
      <LightRay 
        start={reflectedRay.start} 
        end={reflectedRay.end} 
        color="#FF6B6B" // Coral color for reflected ray
      />
      
      {/* Visual angle indicators with improved looks */}
      <group position={[incidentRay.end.x, 0, 0]}>
        {/* Incident angle indicator */}
        <mesh rotation={[0, 0, (Math.PI/2) - (lightAngle * Math.PI / 180)]}>
          <cylinderGeometry args={[0.02, 0.02, 1, 16]} />
          <meshStandardMaterial 
            color="#FFD700" 
            emissive="#FFD700"
            emissiveIntensity={0.5}
          />
        </mesh>
        
        {/* Reflection angle indicator */}
        <mesh rotation={[0, 0, (Math.PI/2) - (reflectionAngle * Math.PI / 180)]}>
          <cylinderGeometry args={[0.02, 0.02, 1, 16]} />
          <meshStandardMaterial 
            color="#FF6B6B"
            emissive="#FF6B6B"
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>
      
      {/* Normal line with pulsing effect */}
      <mesh position={[incidentRay.end.x, 0, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 2, 16]} />
        <meshBasicMaterial color="white" transparent opacity={0.8} />
      </mesh>
      
      {/* Intersection point marker */}
      <mesh position={incidentRay.end} castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial 
          color="white"
          emissive="white"
          emissiveIntensity={1}
        />
      </mesh>
    </group>
  );
}