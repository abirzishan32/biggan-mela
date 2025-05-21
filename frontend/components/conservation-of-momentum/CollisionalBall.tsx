"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, Text } from "@react-three/drei";
import * as THREE from "three";

interface CollisionBallProps {
  mass: number;
  radius: number;
  position: [number, number, number];
  velocity: number;
  color: string;
  ballId: number;
  showValues?: boolean;
}

export default function CollisionBall({
  mass,
  radius,
  position,
  velocity,
  color,
  ballId,
  showValues = true,
}: CollisionBallProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<any>(null);
  const textVelRef = useRef<any>(null);
  
  // Create a trail effect
  const trailRef = useRef<THREE.InstancedMesh>(null);
  const trailCount = 20;
  const trailPositions = useRef<THREE.Vector3[]>(Array(trailCount).fill(null).map(() => new THREE.Vector3()));
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Shadow material for the base
  const shadowMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.3,
    });
  }, [color]);
  
  // Movement and effects
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Update trail
    if (trailRef.current && Math.abs(velocity) > 0.1) {
      for (let i = trailCount - 1; i > 0; i--) {
        trailPositions.current[i].copy(trailPositions.current[i-1]);
      }
      trailPositions.current[0].copy(meshRef.current.position);
      
      // Update instances
      for (let i = 0; i < trailCount; i++) {
        const pos = trailPositions.current[i];
        const scale = 1 - (i / trailCount) * 0.8;
        
        dummy.position.copy(pos);
        dummy.scale.set(scale * radius * 0.7, scale * 0.2, scale * radius * 0.7);
        dummy.updateMatrix();
        trailRef.current.setMatrixAt(i, dummy.matrix);
      }
      trailRef.current.instanceMatrix.needsUpdate = true;
    }
    
    // Update text positions
    if (textRef.current) {
      textRef.current.position.x = meshRef.current.position.x;
      textRef.current.position.y = meshRef.current.position.y + radius + 0.3;
    }
    
    if (textVelRef.current) {
      textVelRef.current.position.x = meshRef.current.position.x;
      textVelRef.current.position.y = meshRef.current.position.y - radius - 0.3;
    }
  });

  return (
    <group>
      {/* Ball */}
      <Sphere
        ref={meshRef}
        args={[radius, 32, 32]}
        position={position}
      >
        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.2}
        />
      </Sphere>
      
      {/* Shadow on ground */}
      <mesh position={[position[0], -1, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius * 0.8, 32]} />
        <primitive object={shadowMaterial} />
      </mesh>
      
      {/* Trail effect */}
      <instancedMesh
        ref={trailRef}
        args={[
          new THREE.BoxGeometry(),  // Replace null with actual geometry
          new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.2 }),  // Replace null with actual material
          trailCount
        ]}
        castShadow={false}
      >
        {/* Remove these children since we're providing them in the args */}
        {/* <boxGeometry /> */}
        {/* <meshBasicMaterial color={color} transparent opacity={0.2} /> */}
      </instancedMesh>
      
      {/* Text labels */}
      {showValues && (
        <>
          <Text
            ref={textRef}
            position={[position[0], position[1] + radius + 0.3, position[2]]}
            fontSize={0.25}
            color="black"
            anchorX="center"
            anchorY="middle"
          >
            {`Ball ${ballId}: ${mass.toFixed(1)} kg`}
          </Text>
          
          <Text
            ref={textVelRef}
            position={[position[0], position[1] - radius - 0.3, position[2]]}
            fontSize={0.25}
            color={Math.abs(velocity) < 0.1 ? "#666" : velocity > 0 ? "#22c55e" : "#ef4444"}
            anchorX="center"
            anchorY="middle"
          >
            {`v = ${velocity.toFixed(2)} m/s`}
          </Text>
        </>
      )}
    </group>
  );
}