"use client";

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MeshDistortMaterial } from '@react-three/drei';

interface MediumProps {
  mediumType: 'air' | 'water' | 'glass' | 'oil';
  position: [number, number, number];
  size: [number, number, number];
}

export default function Medium({ mediumType, position, size }: MediumProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);
  
  // Define enhanced visual properties for each medium type
  const mediumProperties = useMemo(() => {
    switch (mediumType) {
      case 'water':
        return {
          color: new THREE.Color('#1E90FF'),
          opacity: 0.6, // Slightly more transparent
          roughness: 0.15,
          metalness: 0.5,
          emissive: new THREE.Color('#104E8B').multiplyScalar(0.3),
          emissiveIntensity: 0.3,
          clearcoat: 1.0,
          transmission: 0.95,
          ior: 1.33,
          distort: 0.3,
          distortSpeed: 0.5
        };
      case 'glass':
        return {
          color: new THREE.Color('#E1FFFF'),
          opacity: 0.25, // Significantly more transparent
          roughness: 0.05,
          metalness: 0.9,
          emissive: new THREE.Color('#FFFFFF'),
          emissiveIntensity: 0.1, // Reduced
          clearcoat: 1.0,
          transmission: 0.98,
          ior: 1.5,
          distort: 0.0,
          distortSpeed: 0
        };
      case 'oil':
        return {
          color: new THREE.Color('#556B2F').multiplyScalar(1.2),
          opacity: 0.7, // More transparent
          roughness: 0.3,
          metalness: 0.2,
          emissive: new THREE.Color('#8E8E38'),
          emissiveIntensity: 0.2,
          clearcoat: 0.8,
          transmission: 0.6,
          ior: 1.47,
          distort: 0.1,
          distortSpeed: 0.2
        };
      default: // air
        return {
          color: new THREE.Color('#E6F7FF'),
          opacity: 0.05,
          roughness: 0.1,
          metalness: 0.0,
          emissive: new THREE.Color('#FFFFFF'),
          emissiveIntensity: 0,
          clearcoat: 0,
          transmission: 1.0,
          ior: 1.0,
          distort: 0.0,
          distortSpeed: 0
        };
    }
  }, [mediumType]);

  return (
    <mesh position={position} ref={meshRef}>
      <boxGeometry args={size} />
      {mediumType === 'glass' ? (
        // Special setup for glass with higher transparency
        <meshPhysicalMaterial 
          color={mediumProperties.color}
          transparent={true}
          opacity={mediumProperties.opacity}
          roughness={mediumProperties.roughness}
          metalness={mediumProperties.metalness}
          emissive={mediumProperties.emissive}
          emissiveIntensity={mediumProperties.emissiveIntensity}
          clearcoat={mediumProperties.clearcoat}
          clearcoatRoughness={0.1}
          transmission={mediumProperties.transmission}
          ior={mediumProperties.ior}
          reflectivity={0.5}
          side={THREE.DoubleSide}
          depthWrite={false} // Important for proper transparency
        />
      ) : (
        <MeshDistortMaterial
          color={mediumProperties.color}
          transparent={true}
          opacity={mediumProperties.opacity}
          roughness={mediumProperties.roughness}
          metalness={mediumProperties.metalness}
          emissive={mediumProperties.emissive}
          emissiveIntensity={mediumProperties.emissiveIntensity}
          distort={mediumProperties.distort}
          speed={mediumProperties.distortSpeed}
        />
      )}
    </mesh>
  );
}