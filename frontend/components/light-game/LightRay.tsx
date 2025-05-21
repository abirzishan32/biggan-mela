"use client";

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Line, Trail } from '@react-three/drei';

interface LightRayProps {
  start: THREE.Vector3;
  end: THREE.Vector3;
  color: string;
}

export default function LightRay({ start, end, color }: LightRayProps) {
  const particleRef = useRef<any>(null);
  const trailRef = useRef<any>(null);
  
  // Create points for the light ray line
  const { points, direction, length } = useMemo(() => {
    const dir = new THREE.Vector3().subVectors(end, start).normalize();
    const len = start.distanceTo(end);
    return { 
      points: [start, end], 
      direction: dir,
      length: len
    };
  }, [start, end]);
  
  // Create particle system for light ray effect - more particles for better effect
  const particleGeometry = useMemo(() => {
    const particleCount = 35; // Increased particle count
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const t = i / (particleCount - 1);
      positions[i * 3] = start.x + direction.x * length * t;
      positions[i * 3 + 1] = start.y + direction.y * length * t;
      positions[i * 3 + 2] = start.z + direction.z * length * t;
    }
    
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [start, direction, length]);

  // Animate particles along the ray with varying speeds
  useFrame(({ clock }) => {
    if (particleRef.current) {
      const positions = particleRef.current.geometry.attributes.position.array;
      const particleCount = positions.length / 3;
      const time = clock.getElapsedTime();
      
      for (let i = 0; i < particleCount; i++) {
        // Variable speed based on particle position creates "flowing" effect
        const speed = 0.3 + 0.2 * Math.sin(i * 0.5);
        const t = ((i / (particleCount - 1)) + (time * speed)) % 1.0;
        positions[i * 3] = start.x + direction.x * length * t;
        positions[i * 3 + 1] = start.y + direction.y * length * t;
        positions[i * 3 + 2] = start.z + direction.z * length * t;
      }
      particleRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Core ray beam with glow effect */}
      <Line
        points={[start, end]}
        color={color}
        lineWidth={3}
        opacity={0.9}
        transparent
      />
      
      {/* Outer glow */}
      <Line
        points={[start, end]}
        color={color}
        lineWidth={6}
        opacity={0.3}
        transparent
      />
      
      {/* Enhanced particle effect */}
      <points ref={particleRef} geometry={particleGeometry}>
        <pointsMaterial 
          color={color} 
          size={0.15} 
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      
      {/* Light trail effect */}
      <Trail
        width={0.2}
        color={color}
        length={0.5}
        decay={1}
        attenuation={(width) => width}
      >
        <mesh position={end}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color={color} transparent />
        </mesh>
      </Trail>
    </group>
  );
}