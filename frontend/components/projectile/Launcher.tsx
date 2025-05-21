"use client";

import { useState, useRef, useEffect } from 'react';

interface LauncherProps {
  x: number;
  y: number;
  angle: number;
  onAngleChange: (angle: number) => void;
  disabled: boolean;
  cameraOffset: { x: number, y: number };
}

export default function Launcher({ 
  x, 
  y, 
  angle, 
  onAngleChange, 
  disabled,
  cameraOffset
}: LauncherProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Draw the launcher
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw launcher base
    ctx.fillStyle = '#555555';
    ctx.beginPath();
    ctx.rect(x - 30, y, 60, 20);
    ctx.fill();
    
    // Draw wheels
    ctx.fillStyle = '#333333';
    ctx.beginPath();
    ctx.arc(x - 20, y + 20, 8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x + 20, y + 20, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Calculate barrel endpoint based on angle
    const barrelLength = 50;
    const endX = x + Math.cos((90 - angle) * Math.PI / 180) * barrelLength;
    const endY = y - Math.sin((90 - angle) * Math.PI / 180) * barrelLength;
    
    // Draw barrel
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.strokeStyle = disabled ? '#999999' : '#333333';
    ctx.beginPath();
    ctx.moveTo(x, y - 10);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    
    // Draw pivot point
    ctx.fillStyle = '#777777';
    ctx.beginPath();
    ctx.arc(x, y - 10, 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw angle indicator
    ctx.font = '12px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(`${angle.toFixed(1)}°`, x, y - 25);
    
    // Draw drag handle if not disabled
    if (!disabled) {
      ctx.fillStyle = '#FF4444';
      ctx.beginPath();
      ctx.arc(endX, endY, 8, 0, Math.PI * 2);
      ctx.fill();
    }
    
  }, [x, y, angle, disabled]);
  
  // Handle mouse events for dragging the launcher angle
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate barrel endpoint
    const barrelLength = 50;
    const endX = x + Math.cos((90 - angle) * Math.PI / 180) * barrelLength;
    const endY = y - Math.sin((90 - angle) * Math.PI / 180) * barrelLength;
    
    // Check if mouse is near the end of the barrel
    const distToEnd = Math.sqrt(Math.pow(mouseX - endX, 2) + Math.pow(mouseY - endY, 2));
    
    if (distToEnd < 15) {
      setIsDragging(true);
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || disabled) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate angle based on mouse position relative to launcher pivot
    const dx = mouseX - x;
    const dy = y - 10 - mouseY; // pivot point is at (x, y-10)
    
    let newAngle = Math.atan2(dy, dx) * 180 / Math.PI;
    
    // Constrain angle between 0 and 90 degrees
    if (newAngle < 0) newAngle = 0;
    if (newAngle > 90) newAngle = 90;
    
    onAngleChange(newAngle);
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Initialize canvas dimensions
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth * 2/3; // Match parent div width
      canvasRef.current.height = window.innerHeight; // Match parent div height
    }
    
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-10"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ cursor: isDragging ? 'grabbing' : (disabled ? 'default' : 'grab') }}
    />
  );
}