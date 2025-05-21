"use client";

import { motion } from "framer-motion";

export default function SolidAnimation() {
  // Create an array of particle positions in a grid (solid state)
  const particles = [];
  const gridSize = 5;
  const spacing = 40;
  
  // Create a 5x5 grid of particles
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      particles.push({ id: `${i}-${j}`, x: j * spacing, y: i * spacing });
    }
  }
  
  return (
    <div className="relative w-64 h-64 mx-auto">
      <div className="absolute inset-0 flex items-center justify-center">
        <svg width="200" height="200" viewBox="0 0 200 200">
          {particles.map((particle) => (
            <motion.circle
              key={particle.id}
              cx={particle.x + 20}
              cy={particle.y + 20}
              r={6}
              fill="#3B82F6"
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
                x: Math.random() * 3 - 1.5,
                y: Math.random() * 3 - 1.5,
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                repeatDelay: 0.2,
              }}
            />
          ))}
          
          {/* Lines connecting particles to show rigid structure */}
          {particles.map((particle, index) => {
            const connections = [];
            // Connect horizontally
            if (index % gridSize !== gridSize - 1) {
              connections.push(
                <motion.line
                  key={`h-${particle.id}`}
                  x1={particle.x + 20}
                  y1={particle.y + 20}
                  x2={particle.x + spacing + 20}
                  y2={particle.y + 20}
                  stroke="#93C5FD"
                  strokeWidth={1}
                />
              );
            }
            // Connect vertically
            if (index < particles.length - gridSize) {
              connections.push(
                <motion.line
                  key={`v-${particle.id}`}
                  x1={particle.x + 20}
                  y1={particle.y + 20}
                  x2={particle.x + 20}
                  y2={particle.y + spacing + 20}
                  stroke="#93C5FD"
                  strokeWidth={1}
                />
              );
            }
            return connections;
          })}
        </svg>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 text-center text-sm font-semibold text-blue-600 dark:text-blue-300">
        কঠিন অবস্থা - মলিকিউলের কাছাকাছি অবস্থান
      </div>
    </div>
  );
}