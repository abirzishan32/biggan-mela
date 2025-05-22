"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface ProcessAnimationProps {
  process: 'evaporation' | 'condensation' | 'precipitation' | 'collection';
  isActive: boolean;
  dimensions: { width: number, height: number };
  onClick: () => void;
}

export default function ProcessAnimation({ 
  process, 
  isActive, 
  dimensions,
  onClick
}: ProcessAnimationProps) {
  const [path, setPath] = useState<string>('');
  const [label, setLabel] = useState<{ text: string, position: { x: number, y: number } }>({
    text: '',
    position: { x: 0, y: 0 }
  });
  const [arrowHeadPosition, setArrowHeadPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const pathRef = useRef<SVGPathElement | null>(null);
  
  useEffect(() => {
    if (dimensions.width === 0) return;
    
    const { width, height } = dimensions;
    const groundLevel = height * 0.6;
    
    // Set path and label based on process type
    switch(process) {
      case 'evaporation':
        // From water body to sky
        setPath(`M ${width * 0.7} ${groundLevel} C ${width * 0.65} ${height * 0.4}, ${width * 0.45} ${height * 0.3}, ${width * 0.3} ${height * 0.2}`);
        setLabel({
          text: 'বাষ্পীভবন',
          position: { x: width * 0.55, y: height * 0.35 }
        });
        break;
        
      case 'condensation':
        // From vapor to cloud
        setPath(`M ${width * 0.3} ${height * 0.2} C ${width * 0.45} ${height * 0.15}, ${width * 0.55} ${height * 0.1}, ${width * 0.75} ${height * 0.15}`);
        setLabel({
          text: 'ঘনীভবন',
          position: { x: width * 0.53, y: height * 0.1 }
        });
        break;
        
      case 'precipitation':
        // From cloud to ground
        setPath(`M ${width * 0.75} ${height * 0.15} C ${width * 0.6} ${height * 0.3}, ${width * 0.45} ${height * 0.4}, ${width * 0.4} ${groundLevel}`);
        setLabel({
          text: 'বৃষ্টিপাত',
          position: { x: width * 0.55, y: height * 0.35 }
        });
        break;
        
      case 'collection':
        // From ground to underground and water bodies
        setPath(`M ${width * 0.4} ${groundLevel} C ${width * 0.45} ${groundLevel + height * 0.1}, ${width * 0.6} ${groundLevel + height * 0.15}, ${width * 0.7} ${groundLevel}`);
        setLabel({
          text: 'সংগ্রহ',
          position: { x: width * 0.55, y: groundLevel + height * 0.1 }
        });
        break;
    }
  }, [process, dimensions]);

  // Animate arrow head along the path using Framer Motion's animate
  useEffect(() => {
    if (!pathRef.current || !isActive) return;
    
    let startTime: number;
    let animationId: number;
    
    const animatePath = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const duration = 1500; // 1.5s, same as path animation
      
      if (elapsed < duration) {
        const progress = elapsed / duration;
        // Get point at current progress along the path
        if (pathRef.current) {
          const point = pathRef.current.getPointAtLength(progress * pathRef.current.getTotalLength());
          setArrowHeadPosition({ x: point.x, y: point.y });
        }
        animationId = requestAnimationFrame(animatePath);
      } else {
        // Animation complete, ensure we're at the end of the path
        if (pathRef.current) {
          const pathLength = pathRef.current.getTotalLength();
          const point = pathRef.current.getPointAtLength(pathLength);
          setArrowHeadPosition({ x: point.x, y: point.y });
        }
      }
    };
    
    // Reset to start position first
    if (pathRef.current) {
      const point = pathRef.current.getPointAtLength(0);
      setArrowHeadPosition({ x: point.x, y: point.y });
    }
    
    // Start animation after a slight delay to match path animation
    setTimeout(() => {
      animationId = requestAnimationFrame(animatePath);
    }, 100);
    
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isActive, path]);
  
  if (dimensions.width === 0 || !path) return null;
  
  return (
    <>
      <svg 
        className="absolute inset-0 z-10 pointer-events-none"
        width={dimensions.width} 
        height={dimensions.height}
      >
        <defs>
          <marker 
            id={`arrowhead-${process}`}
            markerWidth="10"
            markerHeight="7" 
            refX="0"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#2563eb" />
          </marker>
        </defs>
        
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Arrow path */}
          <motion.path
            d={path}
            fill="none"
            stroke="rgba(255, 255, 255, 0.8)"
            strokeWidth="12"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: isActive ? 1 : 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          
          <motion.path
            ref={pathRef}
            d={path}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="6"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: isActive ? 1 : 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          
          {/* Arrow head */}
          <motion.circle
            cx={arrowHeadPosition.x}
            cy={arrowHeadPosition.y}
            initial={{ opacity: 0 }}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            r="8"
            fill="#2563eb"
            stroke="white"
            strokeWidth="2"
          />
        </motion.g>
      </svg>
      
      {/* Process label */}
      <motion.div 
        className="absolute z-20 pointer-events-auto cursor-pointer"
        style={{ 
          left: label.position.x, 
          top: label.position.y,
          transform: "translate(-50%, -50%)"
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: isActive ? 1 : 0, 
          scale: isActive ? [0.9, 1.1, 1] : 0.5 
        }}
        transition={{ duration: 0.5, delay: isActive ? 1.2 : 0 }}
        onClick={onClick}
      >
        <div className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg border-2 border-white hover:bg-blue-600 transition-colors">
          {label.text}
        </div>
      </motion.div>
    </>
  );
}