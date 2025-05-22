"use client";

import { motion } from 'framer-motion';

interface FireTriangleProps {
  isActive: boolean;
}

export default function FireTriangle({ isActive }: FireTriangleProps) {
  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: isActive ? 1 : 0.8, 
        opacity: isActive ? 1 : 0
      }}
      transition={{ duration: 0.5 }}
      className="relative w-[220px] h-[200px]"
    >
      <svg width="220" height="200" viewBox="0 0 220 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.path 
          d="M110 10L200 170H20L110 10Z" 
          fill="url(#fire-triangle-gradient)"
          stroke="#FF6600"
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: isActive ? 1 : 0 }}
          transition={{ duration: 1.5, delay: 0.2 }}
        />
        
        {/* Center flame symbol */}
        <motion.path
          d="M110 50C110 50 100 65 100 75C100 85 105 90 110 90C115 90 120 85 120 75C120 65 110 50 110 50Z"
          fill="#FF4500"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        />
        
        {/* Text elements */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          {/* Top text: Heat */}
          <text x="110" y="30" textAnchor="middle" fill="#FF4500" fontWeight="bold" fontSize="14">তাপ</text>
          
          {/* Bottom left text: Fuel */}
          <text x="50" y="150" textAnchor="middle" fill="#8B4513" fontWeight="bold" fontSize="14">জ্বালানি</text>
          
          {/* Bottom right text: Oxygen */}
          <text x="170" y="150" textAnchor="middle" fill="#1E90FF" fontWeight="bold" fontSize="14">অক্সিজেন</text>
        </motion.g>
        
        <defs>
          <linearGradient id="fire-triangle-gradient" x1="110" y1="10" x2="110" y2="170" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFF00" stopOpacity="0.3" />
            <stop offset="1" stopColor="#FF4500" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}