"use client";

import { useRef, useEffect } from 'react';

interface TrajectoryPathProps {
  path: {x: number, y: number}[];
  projectileX: number;
  projectileY: number;
  isMoving: boolean;
  hasLanded: boolean;
  cameraOffset: { x: number, y: number };
  scale: number;
}

export default function TrajectoryPath({ 
  path, 
  projectileX, 
  projectileY,
  isMoving,
  hasLanded,
  cameraOffset,
  scale
}: TrajectoryPathProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Draw the trajectory path
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw path with camera offset
    if (path.length > 1) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      // Apply camera offset to the path
      ctx.moveTo(path[0].x - cameraOffset.x, path[0].y - cameraOffset.y);
      
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x - cameraOffset.x, path[i].y - cameraOffset.y);
      }
      
      ctx.stroke();
      
      // Draw trajectory markers at regular intervals
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      for (let i = 0; i < path.length; i += 10) { // Every 10th point
        if (i < path.length) {
          ctx.beginPath();
          ctx.arc(path[i].x - cameraOffset.x, path[i].y - cameraOffset.y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    
    // Draw projectile with camera offset
    if (isMoving || hasLanded) {
      // Shadow
      ctx.beginPath();
      ctx.ellipse(
        projectileX - cameraOffset.x, 
        canvas.height - 20, // Fixed shadow height at ground level
        10, 4, 0, 0, Math.PI * 2
      );
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fill();
      
      // Ball
      ctx.beginPath();
      ctx.arc(
        projectileX - cameraOffset.x, 
        projectileY - cameraOffset.y, 
        10, 0, Math.PI * 2
      );
      
      // Create gradient for 3D effect
      const gradient = ctx.createRadialGradient(
        projectileX - cameraOffset.x - 3, 
        projectileY - cameraOffset.y - 3, 
        1,
        projectileX - cameraOffset.x, 
        projectileY - cameraOffset.y, 
        10
      );
      gradient.addColorStop(0, '#ff5555');
      gradient.addColorStop(1, '#cc0000');
      
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Draw highlight for 3D effect
      ctx.beginPath();
      ctx.arc(
        projectileX - cameraOffset.x - 3, 
        projectileY - cameraOffset.y - 3, 
        3, 0, Math.PI * 2
      );
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fill();
    }
    
  }, [path, projectileX, projectileY, isMoving, hasLanded, cameraOffset, scale]);
  
  // Initialize canvas dimensions
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth * 2/3; // Match parent div width
      canvasRef.current.height = window.innerHeight; // Match parent div height
    }
    
    // Handle window resize
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth * 2/3;
        canvasRef.current.height = window.innerHeight;
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <canvas 
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none"
    />
  );
}