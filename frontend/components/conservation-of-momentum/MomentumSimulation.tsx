"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { 
  OrbitControls, 
  Environment, 
  ContactShadows,
  Center,
  Text,
  PerspectiveCamera
} from "@react-three/drei";
import * as THREE from 'three';
import CollisionBall from "./CollisionalBall";
import { calculateMomentum, calculateTotalMomentum } from "./MomentumCalculator";
import { Button } from "@/components/ui/button";
import { IoRefreshOutline } from "react-icons/io5";

interface SimulationProps {
  simulationData: {
    ball1: {
      mass: number;
      initialVelocity: number;
    };
    ball2: {
      mass: number;
      initialVelocity: number;
    };
    isRunning: boolean;
    finalVelocities?: {
      v1: number;
      v2: number;
    };
  };
  onReset: () => void;
}

export default function MomentumSimulation({ simulationData, onReset }: SimulationProps) {
  // Simulation states
  const [ball1Pos, setBall1Pos] = useState<[number, number, number]>([-4, 0, 0]);
  const [ball2Pos, setBall2Pos] = useState<[number, number, number]>([4, 0, 0]);
  const [ball1Vel, setBall1Vel] = useState(simulationData.ball1.initialVelocity);
  const [ball2Vel, setBall2Vel] = useState(simulationData.ball2.initialVelocity);
  const [hasCollided, setHasCollided] = useState(false);
  const [simulationPhase, setSimulationPhase] = useState<'ready' | 'running' | 'completed'>('ready');
  const [momentumData, setMomentumData] = useState({
    initial: 0,
    final: 0,
    difference: 0,
  });

  // Animation frame tracking
  const frameIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Simulation constants
  const SEPARATION_THRESHOLD = 0.15; // Minimum separation to avoid overlap
  const ballRadius = (mass: number) => Math.max(0.3, Math.min(0.7, 0.3 + mass * 0.04));

  // Calculate initial momentum
  useEffect(() => {
    if (simulationData.isRunning && simulationPhase === 'ready') {
      setSimulationPhase('running');
      
      const initialMomentum = calculateTotalMomentum([
        calculateMomentum(simulationData.ball1.mass, simulationData.ball1.initialVelocity),
        calculateMomentum(simulationData.ball2.mass, simulationData.ball2.initialVelocity)
      ]);
      
      setMomentumData(prev => ({
        ...prev,
        initial: initialMomentum
      }));
      
      // Reset positions
      setBall1Pos([-4, 0, 0]);
      setBall2Pos([4, 0, 0]);
      setBall1Vel(simulationData.ball1.initialVelocity);
      setBall2Vel(simulationData.ball2.initialVelocity);
      setHasCollided(false);
    }
    
    if (!simulationData.isRunning) {
      setSimulationPhase('ready');
    }
  }, [simulationData.isRunning]);

  // Animation loop
  const animate = (time: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = time;
      frameIdRef.current = requestAnimationFrame(animate);
      return;
    }

    const deltaTime = Math.min((time - lastTimeRef.current) / 1000, 0.1); // seconds, capped to avoid large jumps
    lastTimeRef.current = time;

    // Update ball positions based on velocity
    const newBall1Pos: [number, number, number] = [
      ball1Pos[0] + ball1Vel * deltaTime,
      ball1Pos[1],
      ball1Pos[2]
    ];
    
    const newBall2Pos: [number, number, number] = [
      ball2Pos[0] + ball2Vel * deltaTime,
      ball2Pos[1],
      ball2Pos[2]
    ];

    // Calculate distances between centers
    const distance = Math.abs(newBall1Pos[0] - newBall2Pos[0]);
    const combinedRadii = ballRadius(simulationData.ball1.mass) + ballRadius(simulationData.ball2.mass);

    // Check for collision
    if (distance <= combinedRadii && !hasCollided) {
      setHasCollided(true);
      
      // Apply final velocities after collision
      if (simulationData.finalVelocities) {
        setBall1Vel(simulationData.finalVelocities.v1);
        setBall2Vel(simulationData.finalVelocities.v2);
        
        // Calculate final momentum
        const finalMomentum = calculateTotalMomentum([
          calculateMomentum(simulationData.ball1.mass, simulationData.finalVelocities.v1),
          calculateMomentum(simulationData.ball2.mass, simulationData.finalVelocities.v2)
        ]);
        
        setMomentumData(prev => ({
          ...prev,
          final: finalMomentum,
          difference: Math.abs(finalMomentum - prev.initial)
        }));
      }
      
      // Adjust positions to prevent overlap
      // Move balls apart just enough to avoid intersection
      const overlap = combinedRadii - distance;
      if (overlap > 0) {
        const ball1Adjustment = overlap / 2;
        const ball2Adjustment = overlap / 2;
        
        newBall1Pos[0] -= Math.sign(ball1Vel) * ball1Adjustment;
        newBall2Pos[0] -= Math.sign(ball2Vel) * ball2Adjustment;
      }
    }
    
    // Check if simulation should end (balls off screen)
    if (
      Math.abs(newBall1Pos[0]) > 8 ||
      Math.abs(newBall2Pos[0]) > 8
    ) {
      setSimulationPhase('completed');
      cancelAnimationFrame(frameIdRef.current!);
      frameIdRef.current = null;
      lastTimeRef.current = null;
      return;
    }

    // Update positions
    setBall1Pos(newBall1Pos);
    setBall2Pos(newBall2Pos);

    // Continue animation loop
    frameIdRef.current = requestAnimationFrame(animate);
  };

  // Start/stop animation based on simulation state
  useEffect(() => {
    if (simulationPhase === 'running' && !frameIdRef.current) {
      frameIdRef.current = requestAnimationFrame(animate);
    }
    
    // Cleanup animation on unmount
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
        frameIdRef.current = null;
        lastTimeRef.current = null;
      }
    };
  }, [simulationPhase, ball1Vel, ball2Vel, ball1Pos, ball2Pos, hasCollided]);

  // Handle reset
  const handleResetClick = () => {
    if (frameIdRef.current) {
      cancelAnimationFrame(frameIdRef.current);
      frameIdRef.current = null;
      lastTimeRef.current = null;
    }
    
    onReset();
  };

  // Scale balls according to their mass
  const ball1Radius = ballRadius(simulationData.ball1.mass);
  const ball2Radius = ballRadius(simulationData.ball2.mass);

  return (
    <div className="relative h-[500px] w-full">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 2, 10]} />
        
        {/* Environment */}
        <color attach="background" args={["#f8fafc"]} />
        <ambientLight intensity={0.8} />
        <directionalLight 
          position={[10, 10, 10]} 
          intensity={1} 
          castShadow 
          shadow-mapSize-width={1024} 
          shadow-mapSize-height={1024}
        />
        <Environment preset="city" />
        
        {/* Floor/table */}
        <Center position={[0, -1.5, 0]}>
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[12, 6]} />
            <meshStandardMaterial color="#e2e8f0" />
          </mesh>
        </Center>
        
        {/* Collision balls */}
        <CollisionBall
          ballId={1}
          mass={simulationData.ball1.mass}
          radius={ball1Radius}
          position={ball1Pos}
          velocity={ball1Vel}
          color="#3b82f6"
        />
        
        <CollisionBall
          ballId={2}
          mass={simulationData.ball2.mass}
          radius={ball2Radius}
          position={ball2Pos}
          velocity={ball2Vel}
          color="#8b5cf6"
        />
        
        {/* Momentum conservation info */}
        {hasCollided && (
          <Text
            position={[0, 2, 0]}
            fontSize={0.25}
            color="black"
            anchorX="center"
            anchorY="middle"
            maxWidth={4}
            textAlign="center"
          >
            {`Momentum before: ${momentumData.initial.toFixed(2)} kg·m/s\nMomentum after: ${momentumData.final.toFixed(2)} kg·m/s\nDifference: ${momentumData.difference.toFixed(3)} kg·m/s`}
          </Text>
        )}
        
        {/* Collision marker */}
        {hasCollided && (
          <mesh position={[(ball1Pos[0] + ball2Pos[0]) / 2, 0, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial color="red" transparent opacity={0.7} />
          </mesh>
        )}
        
        {/* Ground shadows */}
        <ContactShadows
          position={[0, -1, 0]}
          opacity={0.6}
          scale={10}
          blur={1.5}
        />
        
        <OrbitControls enablePan={false} />
      </Canvas>
      
      {/* Overlay controls */}
      <div className="absolute bottom-4 right-4">
        {simulationPhase === 'completed' && (
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleResetClick}
          >
            <IoRefreshOutline className="mr-2" />
            Reset Simulation
          </Button>
        )}
      </div>
    </div>
  );
}