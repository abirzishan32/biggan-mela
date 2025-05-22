"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface FireExtinguisherAnimationProps {
  isActive: boolean;
  startPosition: { x: number, y: number };
  endPosition: { x: number, y: number };
}

export default function FireExtinguisherAnimation({ 
  isActive, 
  startPosition, 
  endPosition 
}: FireExtinguisherAnimationProps) {
  const [showFoam, setShowFoam] = useState(false);
  
  useEffect(() => {
    if (isActive) {
      // Start foam spray after extinguisher moved into position
      const timer = setTimeout(() => {
        setShowFoam(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isActive]);
  
  return (
    <>
      <motion.div
        initial={{ x: startPosition.x, y: startPosition.y, rotate: 0 }}
        animate={isActive ? { 
          x: endPosition.x - 40, 
          y: endPosition.y - 20, 
          rotate: -45,
          transition: { duration: 1 } 
        } : {}}
        className="absolute"
      >
        {/* Fire extinguisher */}
        <div className="relative">
          <div className="w-16 h-24 bg-red-600 rounded-lg relative">
            {/* Extinguisher body */}
            <div className="w-16 h-24 bg-gradient-to-br from-red-500 to-red-700 rounded-3xl relative shadow-lg">
              {/* Pressure gauge */}
              <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white rounded-full border-2 border-gray-400"></div>
              
              {/* Handle */}
              <div className="absolute top-7 right-0 w-7 h-4 bg-gray-800 rounded-sm"></div>
              
              {/* Top part */}
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-gray-800 rounded-full"></div>
              
              {/* Hose */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 rotate-45 w-16 h-3 bg-gray-800 rounded-lg origin-left"></div>
              
              {/* Nozzle */}
              <div className="absolute -top-3 left-[80%] w-4 h-4 bg-gray-700 rounded-full"></div>
            </div>
          </div>
          
          {/* Label */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/80 px-2 rounded text-xs text-center font-semibold">
            অগ্নি<br/>নির্বাপক
          </div>
        </div>
      </motion.div>
      
      {/* Foam spray */}
      {showFoam && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 100, opacity: 0.7 }}
          transition={{ duration: 0.5 }}
          style={{ 
            position: 'absolute',
            left: endPosition.x - 20, 
            top: endPosition.y - 30,
            height: 20,
            background: 'linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%)',
            borderRadius: '4px',
            transform: 'rotate(-5deg)'
          }}
        />
      )}
    </>
  );
}