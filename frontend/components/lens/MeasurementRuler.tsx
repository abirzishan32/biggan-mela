"use client";

import { useState, useRef, useEffect } from 'react';

interface MeasurementRulerProps {
  containerDimensions: { width: number, height: number };
  pixelToCm: number;
}

export default function MeasurementRuler({
  containerDimensions,
  pixelToCm
}: MeasurementRulerProps) {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [rulerLength, setRulerLength] = useState(200);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [measurement, setMeasurement] = useState(0);
  
  const rulerRef = useRef<HTMLDivElement>(null);
  
  // Update measurement when ruler length changes
  useEffect(() => {
    setMeasurement(rulerLength * pixelToCm);
  }, [rulerLength, pixelToCm]);
  
  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setStartPoint({ x: e.clientX, y: e.clientY });
  };
  
  // Handle mouse down for resizing
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setStartPoint({ x: e.clientX, y: e.clientY });
  };
  
  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - startPoint.x;
        const dy = e.clientY - startPoint.y;
        
        setPosition(prev => ({
          x: Math.max(0, Math.min(containerDimensions.width - rulerLength, prev.x + dx)),
          y: Math.max(0, Math.min(containerDimensions.height - 30, prev.y + dy))
        }));
        
        setStartPoint({ x: e.clientX, y: e.clientY });
      } else if (isResizing) {
        const dx = e.clientX - startPoint.x;
        setRulerLength(prev => Math.max(50, Math.min(containerDimensions.width - position.x, prev + dx)));
        setStartPoint({ x: e.clientX, y: e.clientY });
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };
    
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, startPoint, containerDimensions, position.x]);
  
  // Reset ruler position when container changes size
  useEffect(() => {
    // Make sure ruler stays within the container bounds
    setPosition(prev => ({
      x: Math.min(prev.x, containerDimensions.width - rulerLength),
      y: Math.min(prev.y, containerDimensions.height - 30)
    }));
    
    setRulerLength(prev => Math.min(prev, containerDimensions.width - position.x));
  }, [containerDimensions]);
  
  return (
    <div
      ref={rulerRef}
      className="absolute z-30 flex flex-col"
      style={{
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Measurement value display */}
      <div className="bg-white bg-opacity-85 px-2 py-1 text-xs rounded shadow mb-1 pointer-events-none">
        {measurement.toFixed(1)} cm
      </div>
      
      {/* Ruler */}
      <div className="flex items-center">
        <div 
          className="h-6 bg-gradient-to-b from-yellow-100 to-yellow-200 border border-yellow-400 rounded-l-md relative flex items-center"
          style={{ width: rulerLength }}
        >
          {/* Tick marks */}
          {Array.from({ length: Math.floor(rulerLength / 10) + 1 }).map((_, i) => (
            <div 
              key={i}
              className="absolute top-0 w-px h-2 bg-yellow-700"
              style={{ left: i * 10 }}
            >
              {i % 5 === 0 && (
                <div className="absolute w-px h-4 bg-yellow-800" />
              )}
              {i % 10 === 0 && (
                <div className="absolute -bottom-4 text-[8px] text-yellow-800 whitespace-nowrap" style={{ left: -2 }}>
                  {(i * 10 * pixelToCm).toFixed(0)}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Resize handle */}
        <div 
          className="w-6 h-6 bg-yellow-300 border border-yellow-500 rounded-r-md flex items-center justify-center cursor-ew-resize"
          onMouseDown={handleResizeStart}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-700" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" transform="rotate(45 10 10)" />
          </svg>
        </div>
      </div>
    </div>
  );
}