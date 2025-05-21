"use client";

import { motion } from "framer-motion";

export default function GasAnimation() {
  // Create an array of particle positions for gas state (completely random)
  const particles = [];
  const particleCount = 15;
  
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      id: `gas-${i}`,
      x: Math.random() * 180 + 10,
      y: Math.random() * 180 + 10,
    });
  }
  
  return (
    <div className="relative w-64 h-64 mx-auto">
      <div className="absolute inset-0 flex items-center justify-center">
        <svg width="200" height="200" viewBox="0 0 200 200">
          {/* Container outline */}
          <rect
            x="10"
            y="10"
            width="180"
            height="180"
            rx="5"
            fill="transparent"
            stroke="#93C5FD"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          
          {/* Particles */}
          {particles.map((particle) => (
            <motion.circle
              key={particle.id}
              cx={particle.x}
              cy={particle.y}
              r={5}
              fill="#93C5FD"
              initial={{ opacity: 0.7 }}
              animate={{
                x: Math.random() * 160 - 80,
                y: Math.random() * 160 - 80,
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear",
              }}
            />
          ))}
        </svg>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 text-center text-sm font-semibold text-blue-600 dark:text-blue-300">
        গ্যাসীয় অবস্থা - দূরে দূরে মলিকিউল
      </div>
    </div>
  );
}