"use client";

import { useRef, useEffect } from 'react';
import { ParticleSettings } from './types';
import { useParticlePhysics } from './useParticlePhysics';

interface ChamberProps {
  leftParticles: ParticleSettings;
  rightParticles: ParticleSettings;
  dividerPresent: boolean;
  isRunning: boolean;
  speed: number;
}

// Chamber dimensions
const CHAMBER_WIDTH = 800;
const CHAMBER_HEIGHT = 500;
const DIVIDER_WIDTH = 6;
const DIVIDER_X = CHAMBER_WIDTH / 2 - DIVIDER_WIDTH / 2;

export default function Chamber({
  leftParticles,
  rightParticles,
  dividerPresent,
  isRunning,
  speed
}: ChamberProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Use custom hook for particle physics
  const particles = useParticlePhysics(
    leftParticles,
    rightParticles,
    dividerPresent,
    isRunning,
    speed
  );
  
  // Render the chamber and particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw chamber background
    ctx.fillStyle = '#1A202C';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw chamber border
    ctx.strokeStyle = '#4A5568';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
    // Draw divider
    if (dividerPresent) {
      ctx.fillStyle = '#718096';
      ctx.fillRect(DIVIDER_X, 0, DIVIDER_WIDTH, canvas.height);
    }
    
    // Draw particles
    particles.forEach(particle => {
      // Skip rendering if particle has invalid coordinates or radius
      if (!isFinite(particle.x) || !isFinite(particle.y) || 
          !isFinite(particle.radius) || particle.radius <= 0) {
        return;
      }
      
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      
      try {
        // Create gradient for 3D effect with safety checks
        const highlightX = particle.x - particle.radius * 0.3;
        const highlightY = particle.y - particle.radius * 0.3;
        
        // Ensure all values are valid numbers
        if (isFinite(highlightX) && isFinite(highlightY) && 
            isFinite(particle.x) && isFinite(particle.y) && 
            isFinite(particle.radius) && particle.radius > 0) {
          
          const gradient = ctx.createRadialGradient(
            highlightX, 
            highlightY,
            0,
            particle.x,
            particle.y,
            particle.radius
          );
          
          gradient.addColorStop(0, particle.color === '#3B82F6' ? '#60A5FA' : '#F87171');
          gradient.addColorStop(1, particle.color);
          
          ctx.fillStyle = gradient;
        } else {
          // Fallback if we can't create a gradient
          ctx.fillStyle = particle.color;
        }
      } catch (error) {
        // Fallback in case gradient creation fails
        ctx.fillStyle = particle.color;
      }
      
      ctx.fill();
      
      // Add highlight for 3D effect - with safety checks
      try {
        const highlightX = particle.x - particle.radius * 0.3;
        const highlightY = particle.y - particle.radius * 0.3;
        const highlightRadius = particle.radius * 0.25;
        
        if (isFinite(highlightX) && isFinite(highlightY) && 
            isFinite(highlightRadius) && highlightRadius > 0) {
          
          ctx.beginPath();
          ctx.arc(
            highlightX, 
            highlightY, 
            highlightRadius, 
            0, 
            Math.PI * 2
          );
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.fill();
        }
      } catch (error) {
        // Silently fail if highlight can't be drawn
      }
      
      // Optional: Draw sides label for debugging
      // if (true) { // Set to true to see particle origin
      //   ctx.font = '10px Arial';
      //   ctx.fillStyle = 'white';
      //   ctx.textAlign = 'center';
      //   ctx.fillText(
      //     particle.originalSide === 'left' ? 'L' : 'R',
      //     particle.x,
      //     particle.y + 3
      //   );
      // }
    });
    
    // Draw legend
    ctx.font = '14px Arial';
    ctx.fillStyle = '#3B82F6';
    ctx.fillText(`Left Particles: ${leftParticles.count}`, 10, 20);
    
    ctx.fillStyle = '#EF4444';
    ctx.fillText(`Right Particles: ${rightParticles.count}`, canvas.width - 160, 20);
    
  }, [particles, dividerPresent, leftParticles, rightParticles]);
  
  return (
    <div className="relative border-4 border-gray-700 rounded-lg overflow-hidden bg-gray-900 shadow-xl">
      <canvas
        ref={canvasRef}
        width={CHAMBER_WIDTH}
        height={CHAMBER_HEIGHT}
        className="max-w-full h-auto"
      />
      <div className="absolute bottom-2 right-2 bg-gray-800 bg-opacity-70 text-white text-xs px-2 py-1 rounded">
        Speed: {speed.toFixed(1)}x
      </div>
    </div>
  );
}