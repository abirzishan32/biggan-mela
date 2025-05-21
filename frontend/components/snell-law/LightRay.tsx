"use client";

import { useRef, useEffect } from 'react';

interface LightRayProps {
  incidentAngle: number;
  refractedAngle: number;
  isReflectionOccurring: boolean;
  showNormals: boolean;
  showAngles: boolean;
  time: number;
}

export default function LightRay({
  incidentAngle,
  refractedAngle,
  isReflectionOccurring,
  showNormals,
  showAngles,
  time
}: LightRayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Draw the light ray
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
        
        drawRays(ctx, canvas.width, canvas.height);
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
  
  // Update rays when angles or animation time changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    drawRays(ctx, canvas.width, canvas.height);
  }, [incidentAngle, refractedAngle, isReflectionOccurring, showNormals, showAngles, time]);
  
  const drawRays = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Calculate interface position (middle of the canvas)
    const interfaceY = height * 0.5;
    
    // Define the interface point (where the ray hits the interface)
    const interfaceX = width * 0.5;
    
    // Calculate angles in radians (incident angle is measured from normal)
    const incidentAngleRad = (incidentAngle * Math.PI) / 180;
    const refractedAngleRad = (refractedAngle * Math.PI) / 180;
    
    // Calculate the ray length for visualization
    const rayLength = width * 0.4;
    
    // Calculate source position for incident ray
    const sourceX = interfaceX - Math.sin(incidentAngleRad) * rayLength;
    const sourceY = interfaceY - Math.cos(incidentAngleRad) * rayLength;
    
    // Draw normal line
    if (showNormals) {
      ctx.beginPath();
      ctx.moveTo(interfaceX, interfaceY - rayLength * 0.6);
      ctx.lineTo(interfaceX, interfaceY + rayLength * 0.6);
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Label the normal
      ctx.font = '14px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'left';
      ctx.fillText('Normal', interfaceX + 5, interfaceY - rayLength * 0.3);
    }
    
    // Draw incident ray
    ctx.beginPath();
    ctx.moveTo(sourceX, sourceY);
    ctx.lineTo(interfaceX, interfaceY);
    
    // Create gradient for light ray
    const incidentGradient = ctx.createLinearGradient(sourceX, sourceY, interfaceX, interfaceY);
    incidentGradient.addColorStop(0, 'rgba(255, 255, 0, 0.4)');
    incidentGradient.addColorStop(1, 'rgba(255, 255, 0, 0.8)');
    
    ctx.strokeStyle = incidentGradient;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Add animated particles along the ray for more visual interest
    drawRayParticles(ctx, sourceX, sourceY, interfaceX, interfaceY, time);
    
    // Draw refracted or reflected ray
    if (isReflectionOccurring) {
      // Total internal reflection - draw reflected ray
      const reflectedX = interfaceX + Math.sin(incidentAngleRad) * rayLength;
      const reflectedY = interfaceY - Math.cos(incidentAngleRad) * rayLength;
      
      ctx.beginPath();
      ctx.moveTo(interfaceX, interfaceY);
      ctx.lineTo(reflectedX, reflectedY);
      
      const reflectedGradient = ctx.createLinearGradient(interfaceX, interfaceY, reflectedX, reflectedY);
      reflectedGradient.addColorStop(0, 'rgba(255, 255, 0, 0.8)');
      reflectedGradient.addColorStop(1, 'rgba(255, 255, 0, 0.4)');
      
      ctx.strokeStyle = reflectedGradient;
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Add animated particles for reflected ray
      drawRayParticles(ctx, interfaceX, interfaceY, reflectedX, reflectedY, time + 2);
      
      // Draw "Total Internal Reflection" label
      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = 'rgba(255, 50, 50, 0.8)';
      ctx.textAlign = 'center';
      ctx.fillText('Total Internal Reflection', width / 2, interfaceY + 50);
    } else {
      // Normal refraction - draw refracted ray
      const refractedX = interfaceX + Math.sin(refractedAngleRad) * rayLength;
      const refractedY = interfaceY + Math.cos(refractedAngleRad) * rayLength;
      
      ctx.beginPath();
      ctx.moveTo(interfaceX, interfaceY);
      ctx.lineTo(refractedX, refractedY);
      
      const refractedGradient = ctx.createLinearGradient(interfaceX, interfaceY, refractedX, refractedY);
      refractedGradient.addColorStop(0, 'rgba(255, 255, 0, 0.8)');
      refractedGradient.addColorStop(1, 'rgba(255, 255, 0, 0.4)');
      
      ctx.strokeStyle = refractedGradient;
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Add animated particles for refracted ray
      drawRayParticles(ctx, interfaceX, interfaceY, refractedX, refractedY, time + 2);
    }
    
    // Draw angle arcs and labels
    if (showAngles) {
      const arcRadius = 40;
      
      // Incident angle arc
      ctx.beginPath();
      ctx.arc(interfaceX, interfaceY, arcRadius, -Math.PI / 2, -incidentAngleRad - Math.PI / 2, true);
      ctx.strokeStyle = 'rgba(255, 200, 0, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Position the incident angle label
      const incidentLabelAngle = -Math.PI / 2 - incidentAngleRad / 2;
      const incidentLabelX = interfaceX + Math.cos(incidentLabelAngle) * (arcRadius + 15);
      const incidentLabelY = interfaceY + Math.sin(incidentLabelAngle) * (arcRadius + 15);
      
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = 'rgba(255, 200, 0, 0.9)';
      ctx.textAlign = 'center';
      ctx.fillText(`${incidentAngle.toFixed(1)}°`, incidentLabelX, incidentLabelY);
      
      if (!isReflectionOccurring) {
        // Refracted angle arc
        ctx.beginPath();
        ctx.arc(interfaceX, interfaceY, arcRadius, Math.PI / 2, refractedAngleRad + Math.PI / 2, true);
        ctx.strokeStyle = 'rgba(255, 200, 0, 0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Position the refracted angle label
        const refractedLabelAngle = Math.PI / 2 + refractedAngleRad / 2;
        const refractedLabelX = interfaceX + Math.cos(refractedLabelAngle) * (arcRadius + 15);
        const refractedLabelY = interfaceY + Math.sin(refractedLabelAngle) * (arcRadius + 15);
        
        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = 'rgba(255, 200, 0, 0.9)';
        ctx.textAlign = 'center';
        ctx.fillText(`${refractedAngle.toFixed(1)}°`, refractedLabelX, refractedLabelY);
      }
    }
    
    // Add light source visualization
    drawLightSource(ctx, sourceX, sourceY, time);
  };
  
  // Draw animated particles along the ray path
  const drawRayParticles = (
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    time: number
  ) => {
    const particleCount = 10;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    for (let i = 0; i < particleCount; i++) {
      // Calculate position along the ray
      const t = (((time * 2) + (i / particleCount)) % 1);
      const x = x1 + dx * t;
      const y = y1 + dy * t;
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 200, 0.8)';
      ctx.fill();
      
      // Add glow effect
      const glow = ctx.createRadialGradient(x, y, 0, x, y, 8);
      glow.addColorStop(0, 'rgba(255, 255, 200, 0.6)');
      glow.addColorStop(1, 'rgba(255, 255, 200, 0)');
      
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
    }
  };
  
  // Draw an animated light source
  const drawLightSource = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    time: number
  ) => {
    // Pulsating effect
    const pulseSize = 6 + Math.sin(time * 4) * 2;
    
    // Draw the source
    ctx.beginPath();
    ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 100, 0.8)';
    ctx.fill();
    
    // Add glow effect
    const glow = ctx.createRadialGradient(x, y, 0, x, y, pulseSize * 3);
    glow.addColorStop(0, 'rgba(255, 255, 100, 0.6)');
    glow.addColorStop(1, 'rgba(255, 255, 100, 0)');
    
    ctx.beginPath();
    ctx.arc(x, y, pulseSize * 3, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();
    
    // Draw light rays coming out of the source
    const rayCount = 8;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(time); // Rotate the rays
    
    for (let i = 0; i < rayCount; i++) {
      const angle = (i / rayCount) * Math.PI * 2;
      const innerRadius = pulseSize + 2;
      const outerRadius = pulseSize + 12;
      
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius);
      ctx.lineTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);
      
      ctx.strokeStyle = 'rgba(255, 255, 100, 0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    
    ctx.restore();
  };
  
  return (
    <canvas 
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
    />
  );
}