"use client";

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Vector3, CylinderGeometry, MeshStandardMaterial } from 'three';

interface Spring3DProps {
  length: number;
  naturalLength: number;
  springConstant: number;
  radius?: number;
  thickness?: number;
  color?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export default function Spring3D({
  length,
  naturalLength,
  springConstant,
  radius = 0.5,
  thickness = 0.06,
  color = '#888888',
  position = [0, 0, 0],
  rotation = [0, 0, 0]
}: Spring3DProps) {
  const springRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  
  // Calculate spring color based on spring constant
  const springColor = useMemo(() => {
    // Stronger springs are more blue, weaker springs more red
    const hue = Math.min(240, Math.max(0, (springConstant - 10) * 2.4));
    return `hsl(${hue}, 90%, 60%)`;
  }, [springConstant]);
  
  // Generate spring geometry
  const { geometry, topHook, bottomConnector } = useMemo(() => {
    try {
      // Calculate number of coils based on spring constant
      const baseCoils = 12;
      const coils = Math.max(5, Math.min(20, baseCoils + (springConstant / 10)));
      
      // Spring parameters
      const points: THREE.Vector3[] = [];
      const normalLength = 5; // Standard length in 3D units
      
      // Create a helix
      const helixRadius = radius;
      const helixHeight = normalLength * 0.8; // Leave space for connectors
      const turns = coils;
      const pointsPerTurn = 16;
      const totalPoints = Math.max(16, turns * pointsPerTurn); // Ensure minimum points
      
      // Make sure we generate valid points
      for (let i = 0; i <= totalPoints; i++) {
        const t = i / totalPoints;
        const angle = t * Math.PI * 2 * turns;
        
        const x = helixRadius * Math.cos(angle);
        const y = helixHeight * t - helixHeight / 2;
        const z = helixRadius * Math.sin(angle);
        
        points.push(new Vector3(x, y, z));
      }
      
      // Ensure we have at least 2 points for the curve
      if (points.length < 2) {
        // Add fallback points if somehow we don't have enough
        points.push(new Vector3(0, -helixHeight / 2, 0));
        points.push(new Vector3(0, helixHeight / 2, 0));
      }
      
      // Create tube geometry around the helix
      const curve = new THREE.CatmullRomCurve3(points);
      
      // Validate curve before creating geometry
      if (!curve || !curve.getPoints || typeof curve.getPoints !== 'function') {
        throw new Error('Invalid curve');
      }
      
      // Use more robust parameters for TubeGeometry
      const springGeometry = new THREE.TubeGeometry(
        curve, 
        Math.min(totalPoints, 100), // Limit segments for performance
        thickness, 
        8, 
        false
      );
      
      // Create a top hook instead of a connector to ceiling
      const topHookPoints = [];
      const hookRadius = thickness * 2;
      const hookHeight = normalLength * 0.3;
      
      // Create a hook shape at the top
      for (let i = 0; i <= 16; i++) {
        const t = i / 16;
        const angle = t * Math.PI;
        
        const x = hookRadius * Math.sin(angle);
        const y = helixHeight / 2 + hookRadius * (1 - Math.cos(angle));
        const z = 0;
        
        topHookPoints.push(new Vector3(x, y, z));
      }
      
      const topHookCurve = new THREE.CatmullRomCurve3(topHookPoints);
      const topHookGeometry = new THREE.TubeGeometry(
        topHookCurve,
        16,
        thickness,
        8,
        false
      );
      
      // Create bottom connector
      const connectorHeight = normalLength * 0.1;
      const bottomConnectorGeometry = new CylinderGeometry(thickness, thickness, connectorHeight, 8);
      bottomConnectorGeometry.translate(0, -helixHeight / 2 - connectorHeight / 2, 0);
      
      return {
        geometry: springGeometry,
        topHook: topHookGeometry,
        bottomConnector: bottomConnectorGeometry
      };
    } catch (error) {
      console.error("Error creating spring geometry:", error);
      
      // Fallback to simple geometries if curve creation fails
      const height = 5;
      
      // Create simple cylinder for spring fallback
      const fallbackSpring = new THREE.CylinderGeometry(radius/2, radius/2, height, 8);
      
      // Simple top hook
      const topHookGeometry = new THREE.TorusGeometry(thickness * 2, thickness, 8, 8, Math.PI);
      topHookGeometry.translate(0, height / 2 + thickness * 2, 0);
      topHookGeometry.rotateX(Math.PI / 2);
      
      // Bottom connector
      const bottomConnectorGeometry = new CylinderGeometry(thickness, thickness, height * 0.1, 8);
      bottomConnectorGeometry.translate(0, -height / 2 - height * 0.05, 0);
      
      return {
        geometry: fallbackSpring,
        topHook: topHookGeometry,
        bottomConnector: bottomConnectorGeometry
      };
    }
  }, [springConstant, radius, thickness]);
  
  // Update spring material and scale
  useFrame(() => {
    try {
      if (materialRef.current) {
        materialRef.current.color.set(springColor);
      }
      
      if (springRef.current) {
        // Scale the spring based on current length vs natural length
        const scaleFactor = Math.max(0.1, length / naturalLength); // Prevent negative or zero scale
        springRef.current.scale.y = scaleFactor;
      }
    } catch (error) {
      console.error("Error updating spring:", error);
    }
  });
  
  return (
    <group 
      position={position} 
      rotation={rotation.map(r => r * Math.PI / 180) as [number, number, number]} 
      ref={springRef}
    >
      {/* Main spring coil */}
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial 
          ref={materialRef} 
          color={springColor} 
          roughness={0.3} 
          metalness={0.8}
          envMapIntensity={1}
        />
      </mesh>
      
      {/* Top hook - replaces ceiling bar connection */}
      <mesh geometry={topHook} castShadow>
        <meshStandardMaterial color="#aaaaaa" roughness={0.3} metalness={0.9} />
      </mesh>
      
      {/* Bottom connector */}
      <mesh geometry={bottomConnector} castShadow>
        <meshStandardMaterial color="#aaaaaa" roughness={0.3} metalness={0.9} />
      </mesh>
    </group>
  );
}