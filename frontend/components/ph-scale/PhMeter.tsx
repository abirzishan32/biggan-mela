"use client";

import { useState, useEffect } from 'react';
import { getColorForPH } from './PhCalculator';

interface PhMeterProps {
  value: number | null;
  onProbeMove: (inside: boolean) => void;
}

export default function PhMeter({ value, onProbeMove }: PhMeterProps) {
  const [displayValue, setDisplayValue] = useState<string>("--.-");
  const [blinking, setBlinking] = useState(false);
  
  // Update display value with animation
  useEffect(() => {
    if (value === null) {
      setDisplayValue("--.-");
      return;
    }
    
    // Create blinking effect when reading changes
    setBlinking(true);
    setTimeout(() => setBlinking(false), 300);
    
    // Animate value change
    let start: number;
    let animationFrameId: number;
    
    if (displayValue === "--.-") {
      start = value;
    } else {
      start = parseFloat(displayValue);
      if (isNaN(start)) start = value;
    }
    
    const duration = 500; // ms
    const startTime = performance.now();
    
    const animateValue = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease function for smoother animation
      const easedProgress = progress * (2 - progress);
      
      const current = start + (value - start) * easedProgress;
      setDisplayValue(current.toFixed(1));
      
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateValue);
      }
    };
    
    animationFrameId = requestAnimationFrame(animateValue);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [value]);
  
  // Get appropriate color based on pH
  const displayColor = value !== null 
    ? getColorForPH(value)
    : "#888888";
  
  return (
    <div className="flex flex-col items-center">
      <div 
        className={`w-64 h-32 bg-gray-700 rounded-lg p-4 border-2 
                    shadow-inner flex flex-col items-center justify-center
                    ${blinking ? 'opacity-80' : 'opacity-100'}`}
        style={{ borderColor: displayColor }}
      >
        <div className="text-sm mb-2 text-gray-300">pH METER</div>
        
        <div 
          className="font-mono text-4xl font-bold p-2 rounded w-full text-center"
          style={{ color: displayColor }}
        >
          {displayValue}
        </div>
        
        <div className="text-xs mt-3 text-gray-400">MODEL PH-1000 DIGITAL</div>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm mb-2">Measurement Status:</p>
        <div className="flex items-center justify-center">
          <div 
            className={`w-3 h-3 rounded-full mr-2 ${value !== null ? 'bg-green-500' : 'bg-red-500'}`}
          ></div>
          <span className="text-sm">{value !== null ? 'Connected' : 'Not in solution'}</span>
        </div>
      </div>
      
      <div className="mt-8 p-3 bg-gray-800 rounded-lg w-full">
        <h3 className="font-bold text-center mb-2">pH Scale Info</h3>
        <div className="text-sm space-y-1">
          <p><span className="text-red-400">0-3:</span> Strong Acid</p>
          <p><span className="text-orange-400">4-6:</span> Weak Acid</p>
          <p><span className="text-green-400">7:</span> Neutral</p>
          <p><span className="text-blue-400">8-10:</span> Weak Base</p>
          <p><span className="text-purple-400">11-14:</span> Strong Base</p>
        </div>
      </div>
    </div>
  );
}