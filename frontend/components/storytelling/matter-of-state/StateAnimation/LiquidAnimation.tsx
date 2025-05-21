"use client";

import { motion } from "framer-motion";

export default function LiquidAnimation() {
  // Create an array of particle positions for liquid state (less structured than solid)
  const particles = [];
  const particleCount = 25;
  
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      id: `particle-${i}`,
      x: Math.random() * 160 + 20,
      y: Math.random() * 160 + 20,
    });
  }
  
  return (
    <div className="relative w-64 h-64 mx-auto">
      <div className="absolute inset-0 flex items-center justify-center">
        <svg width="200" height="200" viewBox="0 0 200 200">
          {/* Container outline */}
          <rect
            x="20"
            y="20"
            width="160"
            height="160"
            rx="5"
            fill="transparent"
            stroke="#60A5FA"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          
          {/* Particles */}
          {particles.map((particle) => (
            <motion.circle
              key={particle.id}
              cx={particle.x}
              cy={particle.y}
              r={6}
              fill="#60A5FA"
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
                x: Math.random() * 20 - 10,
                y: Math.random() * 20 - 10,
              }}
              transition={{
                duration: Math.random() * 2 + 1,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          ))}
        </svg>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 text-center text-sm font-semibold text-blue-600 dark:text-blue-300">
        তরল অবস্থা - মলিকিউলের স্বাধীন চলাচল
      </div>
    </div>
  );
}