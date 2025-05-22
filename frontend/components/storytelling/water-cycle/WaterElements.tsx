"use client";

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface WaterElementsProps {
  dimensions: { width: number, height: number };
  currentStep: number;
  setActiveProcess: (process: string | null) => void;
}

export default function WaterElements({ 
  dimensions, 
  currentStep, 
  setActiveProcess 
}: WaterElementsProps) {
  const cloudRef = useRef<HTMLDivElement>(null);
  const rainCloudRef = useRef<HTMLDivElement>(null);
  
  // Handle positioning of elements based on dimensions
  useEffect(() => {
    if (dimensions.width === 0) return;
    
    // Positioning logic here if needed
  }, [dimensions]);
  
  return (
    <>
      {/* Water vapor particles for evaporation */}
      {(currentStep === 1 || currentStep === 5) && (
        <WaterVapor 
          width={dimensions.width} 
          height={dimensions.height} 
          count={15} 
        />
      )}
    
      {/* Normal cloud */}
      <motion.div 
        ref={cloudRef}
        className="absolute z-10"
        style={{
          left: dimensions.width * 0.75,
          top: dimensions.height * 0.15,
          width: dimensions.width * 0.2,
          height: dimensions.width * 0.1
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: (currentStep === 2 || currentStep === 5) ? 1 : 0,
          scale: (currentStep === 2 || currentStep === 5) ? 1 : 0.5,
          x: [0, 10, 0, -10, 0]
        }}
        transition={{ 
          opacity: { duration: 0.5 },
          scale: { duration: 0.5 },
          x: { 
            duration: 10, 
            repeat: Infinity,
            repeatType: "mirror"
          }
        }}
      >
        <div className="relative w-full h-full">
          <div className="absolute bg-white rounded-full w-[50%] h-[100%] top-[10%] left-[10%] shadow-lg"></div>
          <div className="absolute bg-white rounded-full w-[60%] h-[90%] top-0 left-[25%] shadow-lg"></div>
          <div className="absolute bg-white rounded-full w-[50%] h-[80%] top-[20%] left-[40%] shadow-lg"></div>
          <div className="absolute bg-white rounded-full w-[40%] h-[70%] bottom-0 left-[30%] shadow-lg"></div>
        </div>
      </motion.div>
      
      {/* Rain cloud */}
      <motion.div 
        ref={rainCloudRef}
        className="absolute z-10"
        style={{
          left: dimensions.width * 0.35,
          top: dimensions.height * 0.2,
          width: dimensions.width * 0.22,
          height: dimensions.width * 0.12
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: (currentStep === 3 || currentStep === 5) ? 1 : 0,
          scale: (currentStep === 3 || currentStep === 5) ? 1 : 0.5,
          x: [0, 15, 0, -15, 0]
        }}
        transition={{ 
          opacity: { duration: 0.5 },
          scale: { duration: 0.5 },
          x: { 
            duration: 12, 
            repeat: Infinity,
            repeatType: "mirror"
          }
        }}
      >
        <div className="relative w-full h-full">
          <div className="absolute bg-gray-400 rounded-full w-[50%] h-[100%] top-[10%] left-[10%] shadow-lg"></div>
          <div className="absolute bg-gray-500 rounded-full w-[60%] h-[90%] top-0 left-[25%] shadow-lg"></div>
          <div className="absolute bg-gray-400 rounded-full w-[50%] h-[80%] top-[20%] left-[40%] shadow-lg"></div>
          <div className="absolute bg-gray-500 rounded-full w-[40%] h-[70%] bottom-0 left-[30%] shadow-lg"></div>
        </div>
        
        {/* Raindrops */}
        {(currentStep === 3 || currentStep === 5) && (
          <Raindrops count={10} width={dimensions.width * 0.22} height={dimensions.width * 0.12} />
        )}
      </motion.div>
      
      {/* Water ripple effect for collection (Step 4) */}
      {(currentStep === 4 || currentStep === 5) && (
        <WaterRipples
          position={{ 
            x: dimensions.width * 0.4, 
            y: dimensions.height * 0.6 
          }}
          width={dimensions.width}
          height={dimensions.height}
        />
      )}
    </>
  );
}

// Water vapor component
function WaterVapor({ width, height, count }: { width: number, height: number, count: number }) {
  const [particles, setParticles] = useState<Array<{ id: number, x: number, y: number, delay: number }>>([]);
  
  useEffect(() => {
    const groundLevel = height * 0.6;
    const waterX = width * 0.7;
    
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: waterX + (Math.random() * width * 0.2) - (width * 0.1),
      y: groundLevel,
      delay: Math.random() * 2
    }));
    
    setParticles(newParticles);
  }, [width, height, count]);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute w-3 h-3 bg-white rounded-full opacity-70 shadow-lg"
          style={{ 
            left: particle.x, 
            top: particle.y,
            boxShadow: '0 0 5px rgba(255, 255, 255, 0.8)'
          }}
          animate={{
            y: [0, -height * 0.4, -height * 0.4],
            x: [0, (Math.random() * width * 0.15) - (width * 0.075), (Math.random() * width * 0.3) - (width * 0.15)],
            opacity: [0.2, 0.8, 0]
          }}
          transition={{
            duration: 4,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
}

// Raindrops component
function Raindrops({ count, width, height }: { count: number, width: number, height: number }) {
  return (
    <div className="absolute top-full left-0 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-5 bg-blue-500 rounded-b-full rounded-t-lg opacity-80"
          style={{
            left: (Math.random() * width),
            top: 0
          }}
          animate={{
            y: [0, height * 5],
            opacity: [0.8, 0]
          }}
          transition={{
            duration: 2,
            delay: Math.random() * 2,
            repeat: Infinity,
            ease: "easeIn"
          }}
        />
      ))}
    </div>
  );
}

// Water ripples component
function WaterRipples({ position, width, height }: { position: { x: number, y: number }, width: number, height: number }) {
  return (
    <div className="absolute pointer-events-none" style={{ left: position.x, top: position.y }}>
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-blue-500"
          style={{
            left: -i * 10,
            top: -i * 10,
            width: i * 20,
            height: i * 20
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 0.7, 0],
            scale: [0, 1, 2]
          }}
          transition={{
            duration: 2,
            delay: i * 0.6,
            repeat: Infinity,
            repeatDelay: 1
          }}
        />
      ))}
    </div>
  );
}