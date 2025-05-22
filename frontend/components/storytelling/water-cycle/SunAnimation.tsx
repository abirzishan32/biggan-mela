"use client";

import { motion } from 'framer-motion';

interface SunAnimationProps {
  isActive: boolean;
  position: { x: number, y: number };
}

export default function SunAnimation({ isActive, position }: SunAnimationProps) {
  return (
    <motion.div
      className="absolute z-10"
      style={{ 
        left: position.x, 
        top: position.y,
        width: 80,
        height: 80
      }}
      initial={{ scale: 0.8, opacity: 0.5 }}
      animate={{ 
        scale: isActive ? [0.9, 1.1, 1] : 0.8, 
        opacity: isActive ? 1 : 0.5,
        rotate: 360
      }}
      transition={{ 
        scale: { duration: 0.5 },
        opacity: { duration: 0.5 },
        rotate: { duration: 120, repeat: Infinity, ease: "linear" }
      }}
    >
      {/* Sun body */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-200 shadow-lg" />
      
      {/* Sun rays */}
      {isActive && (
        <div className="absolute inset-0">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-12 bg-yellow-300 origin-bottom rounded-t-lg"
              style={{
                left: '50%',
                top: '-60%',
                marginLeft: -4,
                transformOrigin: 'center bottom',
                transform: `rotate(${i * 30}deg)`
              }}
              animate={{
                opacity: [0.5, 1, 0.5],
                height: ['40%', '50%', '40%']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                repeatType: "reverse"
              }}
            />
          ))}
        </div>
      )}
      
      {/* Heat shimmer effect */}
      {isActive && (
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '150%',
            height: '150%',
            left: '-25%',
            top: '-25%',
            background: 'radial-gradient(circle, rgba(255,230,0,0.3) 0%, rgba(255,255,255,0) 70%)'
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      )}
      
      {/* Face elements */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-2/3 h-2/3">
          {/* Eyes */}
          <div className="absolute left-1/4 top-1/3 w-1/6 h-1/4 bg-yellow-900 rounded-full" />
          <div className="absolute right-1/4 top-1/3 w-1/6 h-1/4 bg-yellow-900 rounded-full" />
          
          {/* Smile */}
          <div className="absolute left-1/4 bottom-1/4 w-1/2 h-1/6 border-b-4 border-yellow-900 rounded-b-full" />
        </div>
      </div>
    </motion.div>
  );
}