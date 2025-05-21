"use client";

import { useRef, useEffect } from 'react';
import { Material } from './types';

interface EnvironmentSceneProps {
  material: Material;
  time: number;
}

export default function EnvironmentScene({ material, time }: EnvironmentSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Draw the natural environment
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        
        drawScene(ctx, canvas.width, canvas.height);
      }
    };
    
    // Initial sizing
    resizeCanvas();
    
    // Listen for resize
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  // Update scene when material changes or animation time updates
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    drawScene(ctx, canvas.width, canvas.height);
  }, [material, time]);
  
  // Draw the natural environment scene
  const drawScene = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Calculate interface position (middle of the canvas)
    const interfaceY = height * 0.5;
    
    // Draw sky
    const skyGradient = ctx.createLinearGradient(0, 0, 0, interfaceY);
    skyGradient.addColorStop(0, '#87CEEB'); // Light blue
    skyGradient.addColorStop(1, '#E0F7FF'); // Very light blue at horizon
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, interfaceY);
    
    // Draw sun
    ctx.beginPath();
    ctx.fillStyle = '#FFFF88';
    // Use time to make sun glow
    const glowSize = 2 + Math.sin(time * 2) * 0.5;
    ctx.arc(width - 80, 80, 30 + glowSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Add subtle sun rays
    ctx.save();
    ctx.translate(width - 80, 80);
    ctx.rotate(time * 0.1); // Slow rotation of rays
    
    const rayCount = 12;
    const innerRadius = 35;
    const outerRadius = 60;
    
    ctx.beginPath();
    for (let i = 0; i < rayCount; i++) {
      const angle = (i / rayCount) * Math.PI * 2;
      const x1 = Math.cos(angle) * innerRadius;
      const y1 = Math.sin(angle) * innerRadius;
      const x2 = Math.cos(angle) * outerRadius;
      const y2 = Math.sin(angle) * outerRadius;
      
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
    }
    
    ctx.strokeStyle = 'rgba(255, 255, 128, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
    
    // Add clouds
    drawCloud(ctx, 100, 80, 60);
    drawCloud(ctx, 300, 120, 80);
    drawCloud(ctx, width - 180, 150, 50);
    
    // Draw material (water/glass/etc.)
    const materialGradient = ctx.createLinearGradient(0, interfaceY, 0, height);
    materialGradient.addColorStop(0, material.color);
    // Darker shade at the bottom
    materialGradient.addColorStop(1, adjustColorOpacity(material.color, 0.9));
    ctx.fillStyle = materialGradient;
    ctx.fillRect(0, interfaceY, width, height - interfaceY);
    
    // Draw underwater/material detail based on selected material
    drawMaterialDetail(ctx, width, height, interfaceY, material, time);
    
    // Draw interface line (subtle)
    ctx.beginPath();
    ctx.moveTo(0, interfaceY);
    ctx.lineTo(width, interfaceY);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Add subtle wave effect at interface
    drawWaveInterface(ctx, width, interfaceY, time);
  };
  
  // Draw clouds
  const drawCloud = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    
    // Draw a group of overlapping circles for a cloud shape
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.arc(x + size / 3, y - size / 4, size / 3, 0, Math.PI * 2);
    ctx.arc(x + size / 2, y, size / 3, 0, Math.PI * 2);
    ctx.arc(x + size / 4, y + size / 4, size / 3, 0, Math.PI * 2);
    ctx.arc(x - size / 3, y, size / 4, 0, Math.PI * 2);
    ctx.fill();
  };
  
  // Draw underwater/material details
  const drawMaterialDetail = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    interfaceY: number, 
    material: Material,
    time: number
  ) => {
    // Draw details based on material type
    switch (material.name) {
      case 'Water':
        // Underwater plants
        for (let i = 0; i < 8; i++) {
          const x = width * (0.1 + 0.1 * i);
          const baseHeight = 30 + Math.random() * 50;
          
          // Sway with time
          const swayX = Math.sin(time * 1.5 + i) * 5;
          
          ctx.beginPath();
          ctx.moveTo(x, height);
          
          // Draw a curved plant
          ctx.bezierCurveTo(
            x + swayX * 0.5, height - baseHeight * 0.3,
            x + swayX, height - baseHeight * 0.7,
            x + swayX, height - baseHeight
          );
          
          ctx.strokeStyle = '#1a8f45';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        
        // Add some fish
        drawFish(ctx, width * 0.3, interfaceY + 100, 15, time);
        drawFish(ctx, width * 0.7, interfaceY + 80, 10, time + 1);
        drawFish(ctx, width * 0.5, interfaceY + 140, 20, time + 2);
        break;
        
      case 'Glass':
        // Draw some crystalline structures
        for (let i = 0; i < 5; i++) {
          const x = width * (0.2 + 0.15 * i);
          const y = interfaceY + 60 + (i % 3) * 30;
          
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + 15, y - 30);
          ctx.lineTo(x + 30, y);
          ctx.lineTo(x, y);
          
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.fill();
        }
        break;
        
      case 'Diamond':
        // Draw facets and sparkles
        for (let i = 0; i < 12; i++) {
          const x = width * (0.1 + 0.07 * i);
          const y = interfaceY + 40 + (i % 5) * 30;
          
          // Facets
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + 15, y + 20);
          ctx.lineTo(x - 15, y + 20);
          ctx.closePath();
          
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.fill();
          
          // Sparkles
          if (Math.sin(time * 3 + i) > 0.7) {
            ctx.beginPath();
            const sparkleX = x + Math.cos(time) * 5;
            const sparkleY = y + Math.sin(time) * 5;
            
            // Star shape for sparkle
            for (let j = 0; j < 8; j++) {
              const angle = j * Math.PI / 4;
              const len = (j % 2 === 0) ? 4 : 2;
              const dx = Math.cos(angle) * len;
              const dy = Math.sin(angle) * len;
              
              if (j === 0) ctx.moveTo(sparkleX + dx, sparkleY + dy);
              else ctx.lineTo(sparkleX + dx, sparkleY + dy);
            }
            
            ctx.fillStyle = 'white';
            ctx.fill();
          }
        }
        break;
        
      case 'Olive Oil':
        // Draw oil bubbles
        for (let i = 0; i < 20; i++) {
          const size = 3 + Math.random() * 8;
          const x = Math.random() * width;
          const y = interfaceY + 30 + Math.random() * (height - interfaceY - 60);
          const floatY = Math.sin(time * 0.5 + i) * 5;
          
          ctx.beginPath();
          ctx.arc(x, y + floatY, size, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 200, 0.2)';
          ctx.fill();
          
          // Highlight
          ctx.beginPath();
          ctx.arc(x - size/3, y - size/3 + floatY, size/3, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.fill();
        }
        break;
        
      case 'Ice':
        // Draw crystalline patterns
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < 8; i++) {
          const centerX = width * (0.1 + 0.1 * i);
          const centerY = interfaceY + 50 + (i % 3) * 40;
          
          // Draw a snowflake-like pattern
          ctx.beginPath();
          for (let j = 0; j < 6; j++) {
            const angle = (j / 6) * Math.PI * 2;
            const x1 = centerX + Math.cos(angle) * 15;
            const y1 = centerY + Math.sin(angle) * 15;
            const x2 = centerX + Math.cos(angle) * 30;
            const y2 = centerY + Math.sin(angle) * 30;
            
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x2, y2);
            
            // Small branches
            const angle1 = angle + Math.PI / 6;
            const angle2 = angle - Math.PI / 6;
            const branchLen = 10;
            
            ctx.moveTo(x1, y1);
            ctx.lineTo(
              x1 + Math.cos(angle1) * branchLen,
              y1 + Math.sin(angle1) * branchLen
            );
            
            ctx.moveTo(x1, y1);
            ctx.lineTo(
              x1 + Math.cos(angle2) * branchLen,
              y1 + Math.sin(angle2) * branchLen
            );
          }
          ctx.stroke();
        }
        break;
    }
  };
  
  // Draw interface wave effect
  const drawWaveInterface = (
    ctx: CanvasRenderingContext2D,
    width: number, 
    interfaceY: number,
    time: number
  ) => {
    ctx.beginPath();
    
    // Draw a wavy line
    for (let x = 0; x < width; x += 10) {
      // Small wave amplitude
      const y = interfaceY + Math.sin(x * 0.05 + time * 2) * 2;
      
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.stroke();
  };
  
  // Draw animated fish
  const drawFish = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    time: number
  ) => {
    // Fish swimming motion
    const swimX = x + Math.sin(time * 2) * 20;
    
    ctx.save();
    ctx.translate(swimX, y);
    
    // Flip direction based on movement
    const direction = Math.cos(time * 2) < 0 ? -1 : 1;
    ctx.scale(direction, 1);
    
    // Fish body
    ctx.beginPath();
    ctx.ellipse(0, 0, size, size/2, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#f88';
    ctx.fill();
    
    // Tail
    ctx.beginPath();
    ctx.moveTo(size - 2, 0);
    ctx.lineTo(size + size/2, -size/2);
    ctx.lineTo(size + size/2, size/2);
    ctx.closePath();
    ctx.fillStyle = '#f88';
    ctx.fill();
    
    // Eye
    ctx.beginPath();
    ctx.arc(-size/2, 0, size/5, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(-size/2, 0, size/10, 0, Math.PI * 2);
    ctx.fillStyle = 'black';
    ctx.fill();
    
    ctx.restore();
  };
  
  // Helper function to adjust color opacity
  const adjustColorOpacity = (color: string, opacity: number): string => {
    if (color.startsWith('rgba')) {
      // Extract the RGB part and replace the opacity
      return color.replace(/rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/, `rgba($1,$2,$3,${opacity})`);
    }
    return color;
  };
  
  return (
    <canvas 
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
    />
  );
}