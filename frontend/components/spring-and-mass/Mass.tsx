"use client";

import { useRef, useEffect, useState } from 'react';
import { MassBlock } from './types';

interface MassProps {
  mass: MassBlock;
  isDraggable: boolean;
  onDragStart: (id: number) => void;
  onDrag: (id: number, position: { x: number, y: number }) => void;
  onDrop: (id: number, position: { x: number, y: number }) => void;
}

export default function Mass({ mass, isDraggable, onDragStart, onDrag, onDrop }: MassProps) {
  const massRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Mass dimensions based on weight
  const getSize = () => {
    // Base size - scale up with mass but keep reasonable limits
    const baseSize = 35;
    return baseSize + Math.min(mass.mass * 10, 30);
  };
  
  const size = getSize();
  
  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isDraggable) return;
    
    e.preventDefault();
    const element = massRef.current;
    if (!element) return;
    
    const rect = element.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    setIsDragging(true);
    onDragStart(mass.id);
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const x = e.clientX - dragOffset.x;
    const y = e.clientY - dragOffset.y;
    
    onDrag(mass.id, { x, y });
  };
  
  const handleMouseUp = (e: MouseEvent) => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    const x = e.clientX - dragOffset.x;
    const y = e.clientY - dragOffset.y;
    
    onDrop(mass.id, { x, y });
  };
  
  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isDraggable) return;
    
    const element = massRef.current;
    if (!element || e.touches.length === 0) return;
    
    const touch = e.touches[0];
    const rect = element.getBoundingClientRect();
    
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
    
    setIsDragging(true);
    onDragStart(mass.id);
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || e.touches.length === 0) return;
    
    const touch = e.touches[0];
    const x = touch.clientX - dragOffset.x;
    const y = touch.clientY - dragOffset.y;
    
    onDrag(mass.id, { x, y });
  };
  
  const handleTouchEnd = (e: TouchEvent) => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Use last known position
    if (mass.position) {
      onDrop(mass.id, mass.position);
    }
  };
  
  // Set up event listeners
  useEffect(() => {
    if (isDraggable) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, isDraggable]);
  
  // Render the mass with 3D physical appearance
  return (
    <div
      ref={massRef}
      className={`relative ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        position: mass.isDragging || !isDraggable ? 'absolute' : 'relative',
        left: mass.isDragging || !isDraggable ? 0 : 'auto',
        top: mass.isDragging || !isDraggable ? 0 : 'auto',
        transform: mass.isDragging || !isDraggable ? `translate(-50%, -50%)` : 'none',
        zIndex: mass.isDragging ? 1000 : 1
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Mass block with enhanced 3D effect */}
      <div 
        className="w-full h-full rounded-md flex items-center justify-center font-semibold transition-all"
        style={{
          backgroundColor: mass.color,
          boxShadow: `
            0 0 20px rgba(0, 0, 0, 0.3),
            inset 0 0 15px rgba(255, 255, 255, 0.3),
            inset 0 0 5px rgba(0, 0, 0, 0.5),
            0 ${size/8}px ${size/4}px rgba(0, 0, 0, 0.6)
          `,
          transform: `scale(${isDragging ? 1.05 : 1})`,
          fontSize: `${Math.max(12, Math.min(18, size/3))}px`,
          border: '1px solid rgba(0,0,0,0.2)',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)'
        }}
      >
        {mass.label}
      </div>
    </div>
  );
}