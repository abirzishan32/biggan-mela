"use client";

import { useRef, useEffect } from 'react';
import { LensType, LensParameters } from './types';

interface LensVisualizerProps {
  lensType: LensType;
  lensParams: LensParameters;
  showFocalPoints: boolean;
}

export default function LensVisualizer({
  lensType,
  lensParams,
  showFocalPoints
}: LensVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Draw the lens and optical elements
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
        drawLens(ctx, canvas.width, canvas.height);
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
  
  // Redraw when lens parameters change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    drawLens(ctx, canvas.width, canvas.height);
  }, [lensType, lensParams, showFocalPoints]);
  
  const drawLens = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background with subtle grid for perspective
    drawBackground(ctx, width, height);
    
    // Draw optical axis (horizontal line)
    const centerY = height / 2;
    ctx.beginPath();
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Calculate lens position (center of canvas)
    const lensX = width / 2;
    
    // Draw focal points if enabled
    if (showFocalPoints) {
      drawFocalPoints(ctx, lensX, centerY, lensParams.focalLength, lensType);
    }
    
    // Draw the lens based on its type
    if (lensType === 'convex') {
      drawConvexLens(ctx, lensX, centerY, lensParams);
    } else {
      drawConcaveLens(ctx, lensX, centerY, lensParams);
    }
    
    // Draw optical stand (for aesthetics)
    drawLensStand(ctx, lensX, centerY, lensParams.diameter);
  };
  
  const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Create a gradient background that looks like an optical bench
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#f0f8ff');
    gradient.addColorStop(1, '#e6f0fa');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw a wooden optical bench
    const benchY = height * 0.65;
    const benchHeight = height * 0.1;
    
    // Bench surface
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, benchY, width, benchHeight);
    
    // Wood grain texture
    ctx.strokeStyle = '#6B3100';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, benchY);
      ctx.lineTo(i, benchY + benchHeight);
      ctx.stroke();
    }
    
    // Measurement markings on the bench
    ctx.fillStyle = '#FFF';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    for (let x = 0; x <= width; x += 50) {
      // Draw tick marks
      ctx.fillStyle = '#FFF';
      ctx.fillRect(x, benchY - 5, 1, 10);
      
      // Draw measurement labels
      ctx.fillStyle = '#000';
      ctx.fillText(`${x/10}`, x, benchY - 10);
    }
    
    // Draw subtle grid for reference
    ctx.lineWidth = 0.3;
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
    
    // Vertical lines
    for (let x = 0; x <= width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, benchY - 5);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= benchY - 5; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };
  
  const drawFocalPoints = (
    ctx: CanvasRenderingContext2D,
    lensX: number,
    centerY: number,
    focalLength: number,
    lensType: LensType
  ) => {
    // For convex lens, focal points are real
    // For concave lens, focal points are virtual
    const f = lensType === 'convex' ? focalLength : -focalLength;
    
    // Draw focal points
    const leftFocalX = lensX - Math.abs(f);
    const rightFocalX = lensX + Math.abs(f);
    
    // Left focal point
    ctx.beginPath();
    ctx.arc(leftFocalX, centerY, 5, 0, Math.PI * 2);
    ctx.fillStyle = lensType === 'convex' ? 'rgba(30, 144, 255, 0.8)' : 'rgba(255, 99, 71, 0.8)';
    ctx.fill();
    
    // Right focal point
    ctx.beginPath();
    ctx.arc(rightFocalX, centerY, 5, 0, Math.PI * 2);
    ctx.fillStyle = lensType === 'convex' ? 'rgba(30, 144, 255, 0.8)' : 'rgba(255, 99, 71, 0.8)';
    ctx.fill();
    
    // Label focal points
    ctx.font = '14px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('F', leftFocalX, centerY + 10);
    ctx.fillText('F′', rightFocalX, centerY + 10);
    
    // Draw focal length indicators
    ctx.beginPath();
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = 'rgba(100, 100, 100, 0.6)';
    
    // Left focal length indicator
    ctx.moveTo(lensX, centerY + 20);
    ctx.lineTo(leftFocalX, centerY + 20);
    
    // Right focal length indicator
    ctx.moveTo(lensX, centerY + 20);
    ctx.lineTo(rightFocalX, centerY + 20);
    
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Add focal length labels
    ctx.font = '12px Arial';
    ctx.fillStyle = '#666';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('f', (lensX + leftFocalX) / 2, centerY + 22);
    ctx.fillText('f', (lensX + rightFocalX) / 2, centerY + 22);
  };
  
  const drawConvexLens = (
    ctx: CanvasRenderingContext2D,
    lensX: number,
    centerY: number,
    lensParams: LensParameters
  ) => {
    const { diameter, thickness } = lensParams;
    // Increase the lens size by scaling up the diameter
    const halfHeight = diameter * 1.5; // Increased from diameter/2
    
    // Calculate control points for the lens curves
    const controlPointOffset = thickness * 3; // Increased from thickness*2
    
    // Draw lens outline
    ctx.beginPath();
    
    // Left curve (convex)
    ctx.moveTo(lensX, centerY - halfHeight);
    ctx.quadraticCurveTo(lensX - controlPointOffset, centerY, lensX, centerY + halfHeight);
    
    // Right curve (convex)
    ctx.moveTo(lensX, centerY + halfHeight);
    ctx.quadraticCurveTo(lensX + controlPointOffset, centerY, lensX, centerY - halfHeight);
    
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 3; // Increased from 2
    ctx.stroke();
    
    // Fill the lens with a gradient to give it a 3D glass-like appearance
    const gradient = ctx.createLinearGradient(lensX - thickness, centerY, lensX + thickness, centerY);
    gradient.addColorStop(0, 'rgba(173, 216, 230, 0.5)'); // More vibrant blue
    gradient.addColorStop(0.5, 'rgba(200, 240, 255, 0.7)'); // Increased opacity
    gradient.addColorStop(1, 'rgba(173, 216, 230, 0.5)');
    
    // Draw the filled lens with curved sides
    ctx.beginPath();
    
    // Left curve
    ctx.moveTo(lensX, centerY - halfHeight);
    ctx.quadraticCurveTo(lensX - controlPointOffset, centerY, lensX, centerY + halfHeight);
    
    // Right curve
    ctx.lineTo(lensX, centerY + halfHeight);
    ctx.quadraticCurveTo(lensX + controlPointOffset, centerY, lensX, centerY - halfHeight);
    
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Add light reflection effect
    ctx.beginPath();
    ctx.moveTo(lensX - thickness/2, centerY - halfHeight*0.7);
    ctx.quadraticCurveTo(lensX, centerY - halfHeight*0.3, lensX + thickness/2, centerY - halfHeight*0.7);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 2;
    ctx.stroke();
  };
  
  const drawConcaveLens = (
    ctx: CanvasRenderingContext2D,
    lensX: number,
    centerY: number,
    lensParams: LensParameters
  ) => {
    const { diameter, thickness } = lensParams;
    const halfHeight = diameter / 2;
    
    // Calculate control points for the lens curves
    const controlPointOffset = thickness * 2;
    
    // Draw lens outline
    ctx.beginPath();
    
    // Left curve (concave)
    ctx.moveTo(lensX - thickness/2, centerY - halfHeight);
    ctx.quadraticCurveTo(lensX + controlPointOffset, centerY, lensX - thickness/2, centerY + halfHeight);
    
    // Right curve (concave)
    ctx.moveTo(lensX + thickness/2, centerY - halfHeight);
    ctx.quadraticCurveTo(lensX - controlPointOffset, centerY, lensX + thickness/2, centerY + halfHeight);
    
    // Top and bottom straight edges
    ctx.moveTo(lensX - thickness/2, centerY - halfHeight);
    ctx.lineTo(lensX + thickness/2, centerY - halfHeight);
    
    ctx.moveTo(lensX - thickness/2, centerY + halfHeight);
    ctx.lineTo(lensX + thickness/2, centerY + halfHeight);
    
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Fill the lens with a gradient to give it a 3D glass-like appearance
    const gradient = ctx.createLinearGradient(lensX - thickness/2, centerY, lensX + thickness/2, centerY);
    gradient.addColorStop(0, 'rgba(200, 220, 255, 0.3)');
    gradient.addColorStop(0.5, 'rgba(220, 240, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(200, 220, 255, 0.3)');
    
    // Draw the filled lens
    ctx.beginPath();
    
    // Left curve
    ctx.moveTo(lensX - thickness/2, centerY - halfHeight);
    ctx.quadraticCurveTo(lensX + controlPointOffset, centerY, lensX - thickness/2, centerY + halfHeight);
    
    // Bottom straight edge
    ctx.lineTo(lensX + thickness/2, centerY + halfHeight);
    
    // Right curve
    ctx.quadraticCurveTo(lensX - controlPointOffset, centerY, lensX + thickness/2, centerY - halfHeight);
    
    // Top straight edge
    ctx.lineTo(lensX - thickness/2, centerY - halfHeight);
    
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Add light reflection effect
    ctx.beginPath();
    ctx.moveTo(lensX - thickness/2, centerY - halfHeight*0.7);
    ctx.lineTo(lensX + thickness/2, centerY - halfHeight*0.7);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 2;
    ctx.stroke();
  };
  
  const drawLensStand = (
    ctx: CanvasRenderingContext2D,
    lensX: number,
    centerY: number,
    diameter: number
  ) => {
    const standWidth = 20;
    const standHeight = 40;
    const standBaseWidth = 60;
    const standBaseHeight = 10;
    
    // Draw the vertical stand
    ctx.fillStyle = '#555';
    ctx.fillRect(lensX - standWidth/2, centerY + diameter/2, standWidth, standHeight);
    
    // Draw the base
    ctx.fillStyle = '#333';
    ctx.fillRect(
      lensX - standBaseWidth/2,
      centerY + diameter/2 + standHeight,
      standBaseWidth,
      standBaseHeight
    );
    
    // Draw the lens holder clips
    ctx.fillStyle = '#777';
    
    // Top clip
    ctx.beginPath();
    ctx.arc(lensX, centerY - diameter/2 - 5, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Bottom clip
    ctx.beginPath();
    ctx.arc(lensX, centerY + diameter/2 + 5, 5, 0, Math.PI * 2);
    ctx.fill();
  };
  
  return (
    <canvas 
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-0"
    />
  );
}