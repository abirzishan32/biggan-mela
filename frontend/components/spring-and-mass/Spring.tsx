"use client";

import { useEffect, useRef } from 'react';

interface SpringProps {
  length: number;
  naturalLength: number;
  springConstant: number;
  hasAttachedMass: boolean;
}

export default function Spring({ length, naturalLength, springConstant, hasAttachedMass }: SpringProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const springWidth = 40;
  
  // Calculate spring color based on spring constant
  // Stronger springs are more blue, weaker springs more red
  const getSpringColor = (k: number) => {
    // Map k from 10-100 to a hue value from 0 (red) to 240 (blue)
    const hue = Math.min(240, Math.max(0, (k - 10) * 2.4));
    return `hsl(${hue}, 90%, 60%)`;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    // Set canvas dimensions accounting for device pixel ratio
    canvas.width = rect.width * dpr;
    canvas.height = length * dpr;
    ctx.scale(dpr, dpr);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw spring
    drawSpring(ctx, length, springWidth, springConstant, hasAttachedMass);
    
  }, [length, naturalLength, springConstant, hasAttachedMass]);

  const drawSpring = (
    ctx: CanvasRenderingContext2D,
    length: number,
    width: number,
    springConstant: number,
    hasAttachedMass: boolean
  ) => {
    const stretched = length > naturalLength;
    const compression = stretched ? 1 : 0.7;
    
    // Calculate number of coils based on spring constant and length
    // Stronger springs have more coils
    const baseCoils = 12;
    const coils = Math.max(5, Math.min(20, baseCoils + (springConstant / 10)));
    
    // Spring parameters
    const lineWidth = 5;
    const springRadius = width / 2;
    const coilSpacing = (length - 30) / coils; // Reserve 15px for each end
    
    // Spring connector at top
    const springColor = getSpringColor(springConstant);
    
    // Add shadow for depth
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 4;
    
    // Top connector
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, 15);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#aaa';
    ctx.stroke();
    
    // Spring coils
    ctx.beginPath();
    ctx.moveTo(width / 2, 15);
    
    // First quarter turn
    ctx.bezierCurveTo(
      width / 2, 15 + coilSpacing / 4,
      width, 15 + coilSpacing / 4,
      width, 15 + coilSpacing / 2
    );
    
    // Draw each coil
    for (let i = 0; i < coils; i++) {
      const y = 15 + coilSpacing / 2 + i * coilSpacing;
      
      // Left turn
      ctx.bezierCurveTo(
        width, y + coilSpacing / 4,
        0, y + coilSpacing / 4,
        0, y + coilSpacing / 2
      );
      
      // Right turn
      ctx.bezierCurveTo(
        0, y + coilSpacing * 3/4,
        width, y + coilSpacing * 3/4,
        width, y + coilSpacing
      );
    }
    
    // Final quarter turn
    ctx.bezierCurveTo(
      width, length - 15 - coilSpacing / 4,
      width / 2, length - 15 - coilSpacing / 4,
      width / 2, length - 15
    );
    
    // Apply spring style
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = springColor;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    
    // Reset shadow for the hook
    ctx.shadowColor = 'transparent';
    
    // Bottom hook/connector
    ctx.beginPath();
    ctx.moveTo(width / 2, length - 15);
    ctx.lineTo(width / 2, length);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#aaa';
    ctx.stroke();
    
    // Add metallic highlight
    ctx.beginPath();
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = lineWidth / 2;
    ctx.stroke();
    
    // Add compression/tension indicator
    if (stretched) {
      const stretchIndicator = `Tension: ${Math.round((length - naturalLength) / naturalLength * 100)}%`;
      ctx.font = '12px Arial';
      ctx.fillStyle = 'rgba(255, 200, 200, 0.8)';
      ctx.textAlign = 'center';
      ctx.fillText(stretchIndicator, width / 2, length / 2);
    } else if (length < naturalLength) {
      const compressionIndicator = `Compression: ${Math.round((naturalLength - length) / naturalLength * 100)}%`;
      ctx.font = '12px Arial';
      ctx.fillStyle = 'rgba(200, 200, 255, 0.8)';
      ctx.textAlign = 'center';
      ctx.fillText(compressionIndicator, width / 2, length / 2);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={springWidth}
      height={length}
      className="block"
      style={{ width: springWidth, height: length }}
    />
  );
}