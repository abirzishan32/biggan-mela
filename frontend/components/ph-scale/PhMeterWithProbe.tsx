"use client";

import { useState, useEffect, useRef } from 'react';
import { getColorForPH } from './PhCalculator';

interface PhMeterWithProbeProps {
  value: number | null;
  probePosition: { x: number, y: number };
  isInSolution: boolean;
  meterPosition?: { x: number, y: number };
}

export default function PhMeterWithProbe({ 
  value, 
  probePosition, 
  isInSolution,
  meterPosition = { x: 400, y: 80 }
}: PhMeterWithProbeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
  }, [value, displayValue]);
  
  // Draw pH meter and connection to probe
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw connection cable from probe to meter
    drawConnection(ctx, probePosition, meterPosition);
    
    // Draw pH meter device
    drawPhMeter(ctx, meterPosition, displayValue, value, blinking, isInSolution);
    
  }, [probePosition, meterPosition, displayValue, value, blinking, isInSolution]);
  
  // Draw the connection between probe and meter
  const drawConnection = (
    ctx: CanvasRenderingContext2D, 
    probePos: { x: number, y: number }, 
    meterPos: { x: number, y: number }
  ) => {
    // Calculate control points for cable curve
    const ctrlPt1X = probePos.x + 20;
    const ctrlPt1Y = probePos.y - 80;
    const ctrlPt2X = meterPos.x - 50;
    const ctrlPt2Y = meterPos.y + 80;
    
    // Draw cable
    ctx.beginPath();
    ctx.moveTo(probePos.x, probePos.y - 40); // Top of probe
    ctx.bezierCurveTo(
      ctrlPt1X, ctrlPt1Y,
      ctrlPt2X, ctrlPt2Y,
      meterPos.x - 30, meterPos.y + 100 // Bottom of meter
    );
    
    // Cable gradient
    const gradient = ctx.createLinearGradient(
      probePos.x, probePos.y, 
      meterPos.x, meterPos.y
    );
    gradient.addColorStop(0, '#555555');
    gradient.addColorStop(0.5, '#888888');
    gradient.addColorStop(1, '#555555');
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Add cable highlights
    ctx.beginPath();
    ctx.moveTo(probePos.x, probePos.y - 40);
    ctx.bezierCurveTo(
      ctrlPt1X, ctrlPt1Y,
      ctrlPt2X, ctrlPt2Y,
      meterPos.x - 30, meterPos.y + 100
    );
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
  };
  
  // Draw the pH meter device
  const drawPhMeter = (
    ctx: CanvasRenderingContext2D, 
    position: { x: number, y: number },
    display: string,
    phValue: number | null,
    isBlinking: boolean,
    isConnected: boolean
  ) => {
    const deviceWidth = 140;
    const deviceHeight = 220;
    
    // Get color based on pH
    const meterColor = phValue !== null ? getColorForPH(phValue) : "#888888";
    
    // Device body - draw with 3D effect
    ctx.save();
    
    // Main body shadow
    ctx.beginPath();
    ctx.roundRect(
      position.x - deviceWidth/2 + 6, 
      position.y - deviceHeight/2 + 6, 
      deviceWidth, 
      deviceHeight, 
      10
    );
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fill();
    
    // Main body
    ctx.beginPath();
    ctx.roundRect(
      position.x - deviceWidth/2, 
      position.y - deviceHeight/2, 
      deviceWidth, 
      deviceHeight, 
      10
    );
    
    // Gradient for 3D effect
    const bodyGradient = ctx.createLinearGradient(
      position.x - deviceWidth/2, 
      position.y - deviceHeight/2,
      position.x + deviceWidth/2, 
      position.y + deviceHeight/2
    );
    bodyGradient.addColorStop(0, '#333333');
    bodyGradient.addColorStop(0.4, '#444444');
    bodyGradient.addColorStop(1, '#222222');
    
    ctx.fillStyle = bodyGradient;
    ctx.fill();
    
    ctx.strokeStyle = '#111111';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Screen area
    ctx.beginPath();
    ctx.roundRect(
      position.x - deviceWidth/2 + 15, 
      position.y - deviceHeight/2 + 15, 
      deviceWidth - 30, 
      70, 
      5
    );
    ctx.fillStyle = isBlinking ? 'rgba(30, 30, 50, 0.8)' : 'rgba(30, 30, 50, 1)';
    ctx.fill();
    ctx.strokeStyle = '#111111';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Display pH value
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = meterColor;
    ctx.fillText(
      display, 
      position.x, 
      position.y - deviceHeight/2 + 50
    );
    
    // pH label
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#aaaaaa';
    ctx.fillText(
      'pH', 
      position.x, 
      position.y - deviceHeight/2 + 25
    );
    
    // Model name
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#999999';
    ctx.fillText(
      'DIGITAL pH METER DX-7000', 
      position.x, 
      position.y - deviceHeight/2 + 80
    );
    
    // Draw pH scale on the meter
    drawPhScale(ctx, position, phValue);
    
    // Connection status indicator
    ctx.beginPath();
    ctx.arc(
      position.x - deviceWidth/2 + 20,
      position.y + deviceHeight/2 - 20,
      5,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = isConnected ? '#4CAF50' : '#FF5252';
    ctx.fill();
    
    // Status text
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#cccccc';
    ctx.fillText(
      isConnected ? 'PROBE CONNECTED' : 'NO CONNECTION',
      position.x - deviceWidth/2 + 30,
      position.y + deviceHeight/2 - 18
    );
    
    // Device brand
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#dddddd';
    ctx.fillText(
      'SciLab Pro', 
      position.x, 
      position.y + deviceHeight/2 - 55
    );
    
    // Input port
    ctx.beginPath();
    ctx.roundRect(
      position.x - 15,
      position.y + deviceHeight/2 - 10,
      30,
      10,
      2
    );
    ctx.fillStyle = '#111111';
    ctx.fill();
    
    // Logo
    ctx.beginPath();
    ctx.arc(
      position.x,
      position.y + deviceHeight/2 - 85,
      10,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = '#666666';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(
      position.x,
      position.y + deviceHeight/2 - 85,
      6,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = '#444444';
    ctx.fill();
    
    ctx.restore();
  };
  
  // Draw the pH scale on the meter
  const drawPhScale = (
    ctx: CanvasRenderingContext2D, 
    position: { x: number, y: number },
    currentPh: number | null
  ) => {
    const scaleWidth = 100;
    const scaleHeight = 30;
    const scaleX = position.x - scaleWidth/2;
    const scaleY = position.y + 30;
    
    // Scale background
    ctx.beginPath();
    ctx.roundRect(
      scaleX,
      scaleY,
      scaleWidth,
      scaleHeight,
      3
    );
    ctx.fillStyle = '#111111';
    ctx.fill();
    
    // pH gradient scale
    const gradient = ctx.createLinearGradient(scaleX, scaleY, scaleX + scaleWidth, scaleY);
    gradient.addColorStop(0, '#ff0000');    // pH 0 - Strong acid
    gradient.addColorStop(3/14, '#ff9900'); // pH 3 - Acid
    gradient.addColorStop(7/14, '#00cc00'); // pH 7 - Neutral
    gradient.addColorStop(10/14, '#0000ff'); // pH 10 - Base
    gradient.addColorStop(1, '#9900cc');    // pH 14 - Strong base
    
    ctx.beginPath();
    ctx.roundRect(
      scaleX + 2,
      scaleY + 2,
      scaleWidth - 4,
      scaleHeight - 14,
      2
    );
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Scale ticks
    for (let i = 0; i <= 14; i += 2) {
      const tickX = scaleX + (i / 14) * scaleWidth;
      
      // Major tick lines
      ctx.beginPath();
      ctx.moveTo(tickX, scaleY + scaleHeight - 12);
      ctx.lineTo(tickX, scaleY + scaleHeight - 5);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Tick labels
      ctx.font = '8px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(
        i.toString(),
        tickX,
        scaleY + scaleHeight - 1
      );
    }
    
    // Current pH indicator
    if (currentPh !== null) {
      const indicatorX = scaleX + (currentPh / 14) * scaleWidth;
      
      // Triangle indicator
      ctx.beginPath();
      ctx.moveTo(indicatorX, scaleY - 2);
      ctx.lineTo(indicatorX - 5, scaleY - 7);
      ctx.lineTo(indicatorX + 5, scaleY - 7);
      ctx.closePath();
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }
  };
  
  return (
    <canvas 
      ref={canvasRef}
      width={600}
      height={500}
      className="absolute top-0 left-0 pointer-events-none"
    />
  );
}