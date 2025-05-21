"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface TransformationAnimationProps {
  type: "solidToLiquid" | "liquidToGas" | "gasToLiquid" | "liquidToSolid";
}

export default function TransformationAnimation({ type }: TransformationAnimationProps) {
  const [particles, setParticles] = useState<Array<{ id: string; x: number; y: number }>>([]);
  
  useEffect(() => {
    // Create particles based on transformation type
    let newParticles: Array<{ id: string; x: number; y: number }> = [];
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: `p-${i}`,
        x: Math.random() * 180 + 10,
        y: Math.random() * 180 + 10,
      });
    }
    
    setParticles(newParticles);
  }, [type]);

  const getAnimationProps = () => {
    switch (type) {
      case "solidToLiquid":
        return {
          initial: { scale: 1, x: 0, y: 0 },
          animate: (i: number) => ({
            scale: [1, 1.1],
            x: i % 2 === 0 ? [0, 10, 5, 15] : [0, -10, -5, -15],
            y: [0, 10, 20, 30],
            transition: {
              duration: 3,
              repeat: Infinity,
              repeatType: "loop",
            },
          }),
          color: "#3B82F6",
          title: "কঠিন থেকে তরল",
          description: "তাপ দিলে কঠিন পদার্থ গলে তরল হয়",
        };
        
      case "liquidToGas":
        return {
          initial: { scale: 1, y: 150, opacity: 1 },
          animate: (i: number) => ({
            scale: [1, 0.8, 0.6],
            y: [150, 100, 50, 0, -50],
            opacity: [1, 0.9, 0.7, 0.5, 0],
            transition: {
              duration: 3,
              repeat: Infinity,
              repeatType: "loop",
              delay: i * 0.2,
            },
          }),
          color: "#60A5FA",
          title: "তরল থেকে গ্যাস",
          description: "তাপ দিলে তরল পদার্থ বাষ্পীভূত হয়ে গ্যাস হয়",
        };
        
      case "gasToLiquid":
        return {
          initial: { scale: 0.6, y: 0, opacity: 0.5 },
          animate: (i: number) => ({
            scale: [0.6, 0.8, 1],
            y: [0, 50, 100, 150],
            opacity: [0.5, 0.7, 0.9, 1],
            transition: {
              duration: 3,
              repeat: Infinity,
              repeatType: "loop",
              delay: i * 0.1,
            },
          }),
          color: "#93C5FD",
          title: "গ্যাস থেকে তরল",
          description: "ঠান্ডা করলে গ্যাস ঘনীভূত হয়ে তরল হয়",
        };
        
      case "liquidToSolid":
        return {
          initial: { scale: 1, x: 10, y: 10 },
          animate: (i: number) => ({
            scale: 1,
            x: 0,
            y: 0,
            transition: {
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
              repeatDelay: 1,
            },
          }),
          color: "#2563EB",
          title: "তরল থেকে কঠিন",
          description: "ঠান্ডা করলে তরল পদার্থ জমে কঠিন হয়",
        };
        
      default:
        return {
          initial: {},
          animate: () => ({}),
          color: "#3B82F6",
          title: "",
          description: "",
        };
    }
  };

  const { initial, animate, color, title, description } = getAnimationProps();

  return (
    <div className="relative w-[200px] h-[200px] mx-auto">
      <div className="absolute inset-0 flex items-center justify-center">
        <svg width="200" height="200" viewBox="0 0 200 200">
          {particles.map((particle, i) => (
            <motion.circle
              key={particle.id}
              cx={particle.x}
              cy={particle.y}
              r={6}
              fill={color}
              initial={initial}
              animate={animate(i)}
            />
          ))}
        </svg>
      </div>
      
      <div className="absolute -bottom-8 left-0 right-0 text-center text-sm font-semibold text-blue-600 dark:text-blue-300">
        {title}
      </div>
      <div className="absolute -bottom-16 left-0 right-0 text-center text-xs text-blue-500 dark:text-blue-400">
        {description}
      </div>
    </div>
  );
}