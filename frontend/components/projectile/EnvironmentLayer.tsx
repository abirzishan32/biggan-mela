"use client";

import { useRef, useEffect } from 'react';

interface EnvironmentLayerProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  groundLevel: number;
  cameraOffset: { x: number, y: number };
  scale: number;
}

export default function EnvironmentLayer({ 
  canvasRef, 
  groundLevel,
  cameraOffset,
  scale
}: EnvironmentLayerProps) {
  const environmentRef = useRef<HTMLCanvasElement>(null);
  
  // Draw the environment once when component mounts or when dimensions change
  useEffect(() => {
    if (!canvasRef.current || !environmentRef.current) return;
    
    const canvas = environmentRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Match the dimensions of the main canvas
    canvas.width = canvasRef.current.width;
    canvas.height = canvasRef.current.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply camera offset for scrolling
    ctx.save();
    ctx.translate(-cameraOffset.x, -cameraOffset.y);
    
    // Calculate the extended drawing area to account for scrolling
    const drawWidth = canvas.width + cameraOffset.x * 2;
    const drawHeight = canvas.height + cameraOffset.y * 2;
    
    // Draw sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, groundLevel);
    skyGradient.addColorStop(0, '#87CEEB'); // Light blue
    skyGradient.addColorStop(1, '#E0F7FF'); // Very light blue
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, drawWidth, groundLevel);
    
    // Draw sun
    ctx.beginPath();
    ctx.fillStyle = '#FFFF88';
    ctx.arc(drawWidth - 100, 80, 40, 0, Math.PI * 2);
    ctx.fill();
    
    // Add some clouds - draw more clouds based on the extended area
    for (let x = 0; x < drawWidth; x += 300) {
      const offsetY = (x % 200) * 0.5; // Vary cloud height
      drawCloud(ctx, x, 100 + offsetY, 70 + (x % 40));
    }
    
    // Draw ground gradient
    const groundGradient = ctx.createLinearGradient(0, groundLevel, 0, canvas.height);
    groundGradient.addColorStop(0, '#7CFC00'); // Lawn green
    groundGradient.addColorStop(1, '#228B22'); // Forest green
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, groundLevel, drawWidth, drawHeight - groundLevel);
    
    // Draw ground texture (grass-like pattern) - across the entire extended width
    ctx.strokeStyle = '#006400'; // Dark green
    ctx.lineWidth = 1;
    
    for (let x = 0; x < drawWidth; x += 15) {
      const grassHeight = Math.random() * 5 + 3;
      ctx.beginPath();
      ctx.moveTo(x, groundLevel);
      ctx.lineTo(x, groundLevel - grassHeight);
      ctx.stroke();
    }
    
    // Draw trees in background - more trees for extended area
    const treeSpacing = 250;
    for (let x = 0; x < drawWidth; x += treeSpacing) {
      const treeSize = 100 + (x % 80);
      const foliageSize = treeSize * 1.8;
      drawTree(ctx, x, groundLevel, treeSize, foliageSize);
    }
    
    // Draw mountains in background
    const mountainSpacing = 300;
    for (let x = 0; x < drawWidth; x += mountainSpacing) {
      const mountainWidth = 200 + (x % 100);
      const mountainHeight = 150 + (x % 50);
      drawMountain(ctx, x, groundLevel, mountainWidth, mountainHeight);
    }
    
    // Restore the context to remove translation
    ctx.restore();
    
    // Draw a graduated scale along the bottom (to show distance)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    
    const meterWidth = scale; // Pixels per meter
    const markerSpacing = Math.max(50, meterWidth * 5); // Don't make markers too dense
    
    for (let x = 0; x < canvas.width; x += markerSpacing) {
      const adjustedX = x + cameraOffset.x;
      const meters = Math.round(adjustedX / scale);
      
      ctx.beginPath();
      ctx.moveTo(x, canvas.height - 5);
      ctx.lineTo(x, canvas.height - 15);
      ctx.stroke();
      
      ctx.fillText(`${meters}m`, x, canvas.height - 20);
    }
    
  }, [canvasRef, groundLevel, cameraOffset, scale]);
  
  // Helper function to draw a cloud
  const drawCloud = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.arc(x + size / 3, y - size / 4, size / 3, 0, Math.PI * 2);
    ctx.arc(x + size / 2, y, size / 3, 0, Math.PI * 2);
    ctx.arc(x + size / 4, y + size / 4, size / 3, 0, Math.PI * 2);
    ctx.arc(x - size / 3, y, size / 4, 0, Math.PI * 2);
    ctx.fill();
  };
  
  // Helper function to draw a tree
  const drawTree = (
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    trunkHeight: number, 
    foliageSize: number
  ) => {
    // Draw trunk
    ctx.fillStyle = '#8B4513'; // Saddle brown
    ctx.fillRect(x - 10, y - trunkHeight, 20, trunkHeight);
    
    // Draw foliage (as a set of overlapping circles for a natural look)
    ctx.fillStyle = '#228B22'; // Forest green
    ctx.beginPath();
    ctx.arc(x, y - trunkHeight - foliageSize / 2, foliageSize / 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x - foliageSize / 3, y - trunkHeight - foliageSize / 3, foliageSize / 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x + foliageSize / 3, y - trunkHeight - foliageSize / 3, foliageSize / 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x, y - trunkHeight - foliageSize / 1.5, foliageSize / 3, 0, Math.PI * 2);
    ctx.fill();
  };
  
  // Helper function to draw a mountain
  const drawMountain = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    ctx.fillStyle = '#808080'; // Gray
    ctx.beginPath();
    ctx.moveTo(x - width / 2, y);
    ctx.lineTo(x, y - height);
    ctx.lineTo(x + width / 2, y);
    ctx.closePath();
    ctx.fill();
    
    // Add snow cap
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(x - width / 6, y - height * 0.8);
    ctx.lineTo(x, y - height);
    ctx.lineTo(x + width / 6, y - height * 0.8);
    ctx.closePath();
    ctx.fill();
  };
  
  return (
    <canvas 
      ref={environmentRef}
      className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
    />
  );
}