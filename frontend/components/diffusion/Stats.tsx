"use client";

import { useEffect, useState } from 'react';
import { ParticleSettings } from './types';

interface StatsProps {
  leftParticles: ParticleSettings;
  rightParticles: ParticleSettings;
  dividerPresent: boolean;
}

// Calculate average kinetic energy
const calculateAvgKineticEnergy = (mass: number, temperature: number): number => {
  // E = (3/2) * kB * T
  // We're using arbitrary units here for simplicity
  return 1.5 * temperature;
};

// Calculate average speed
const calculateAvgSpeed = (mass: number, temperature: number): number => {
  // v = sqrt(3kT/m)
  return Math.sqrt(3 * temperature / mass);
};

export default function Stats({
  leftParticles,
  rightParticles,
  dividerPresent
}: StatsProps) {
  const [diffusionRate, setDiffusionRate] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [mixingPercentage, setMixingPercentage] = useState<number>(0);
  
  // Start timer when divider is removed
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (!dividerPresent) {
      // Reset values when divider is removed
      if (diffusionRate === null) {
        setElapsedTime(0);
        setMixingPercentage(0);
        
        // Calculate theoretical diffusion rate based on Graham's law
        const ratio = Math.sqrt(rightParticles.mass / leftParticles.mass);
        setDiffusionRate(ratio);
      }
      
      // Start timer
      interval = setInterval(() => {
        setElapsedTime(prev => {
          const newTime = prev + 0.1;
          
          // Update mixing percentage (simplified model)
          // In reality, this would be calculated from actual particle positions
          const maxMixingTime = 30; // seconds until fully mixed
          const newPercentage = Math.min(100, (newTime / maxMixingTime) * 100);
          setMixingPercentage(newPercentage);
          
          return newTime;
        });
      }, 100);
    } else {
      // Reset when divider is restored
      setDiffusionRate(null);
      setElapsedTime(0);
      setMixingPercentage(0);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [dividerPresent, leftParticles.mass, rightParticles.mass, diffusionRate]);
  
  return (
    <div className="text-white">
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="font-bold mb-3">Particle Properties</h3>
        
        <div className="space-y-4">
          {/* Left chamber stats */}
          <div className="p-3 bg-blue-900 bg-opacity-30 rounded">
            <div className="flex items-center text-blue-400 mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <h4 className="font-semibold">Left Chamber</h4>
            </div>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>Mass:</div>
              <div className="font-mono">{leftParticles.mass} AMU</div>
              
              <div>Radius:</div>
              <div className="font-mono">{leftParticles.radius} pm</div>
              
              <div>Temperature:</div>
              <div className="font-mono">{leftParticles.temperature} K</div>
              
              <div>Avg. Speed:</div>
              <div className="font-mono">
                {calculateAvgSpeed(leftParticles.mass, leftParticles.temperature).toFixed(2)} u/s
              </div>
              
              <div>Kinetic Energy:</div>
              <div className="font-mono">
                {calculateAvgKineticEnergy(leftParticles.mass, leftParticles.temperature).toFixed(2)} u
              </div>
            </div>
          </div>
          
          {/* Right chamber stats */}
          <div className="p-3 bg-red-900 bg-opacity-30 rounded">
            <div className="flex items-center text-red-400 mb-2">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <h4 className="font-semibold">Right Chamber</h4>
            </div>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>Mass:</div>
              <div className="font-mono">{rightParticles.mass} AMU</div>
              
              <div>Radius:</div>
              <div className="font-mono">{rightParticles.radius} pm</div>
              
              <div>Temperature:</div>
              <div className="font-mono">{rightParticles.temperature} K</div>
              
              <div>Avg. Speed:</div>
              <div className="font-mono">
                {calculateAvgSpeed(rightParticles.mass, rightParticles.temperature).toFixed(2)} u/s
              </div>
              
              <div>Kinetic Energy:</div>
              <div className="font-mono">
                {calculateAvgKineticEnergy(rightParticles.mass, rightParticles.temperature).toFixed(2)} u
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Diffusion statistics */}
      <div className="mt-4 bg-gray-800 p-4 rounded-lg">
        <h3 className="font-bold mb-3">Diffusion Data</h3>
        
        {diffusionRate !== null ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>Elapsed Time:</div>
              <div className="font-mono">{elapsedTime.toFixed(1)} s</div>
              
              <div>Relative Rate:</div>
              <div className="font-mono">{diffusionRate.toFixed(2)}</div>
              
              <div>Mixing Progress:</div>
              <div className="font-mono">{mixingPercentage.toFixed(1)}%</div>
            </div>
            
            <div className="mt-2">
              <div className="text-xs mb-1">Mixing Progress:</div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-green-600 h-2.5 rounded-full"
                  style={{ width: `${mixingPercentage}%` }}
                ></div>
              </div>
            </div>
            
            <div className="text-sm mt-3 bg-gray-700 p-2 rounded">
              <p>According to Graham's Law of Diffusion, the rate of diffusion is inversely proportional to the square root of the molecular masses.</p>
            </div>
          </div>
        ) : (
          <div className="text-gray-400 text-sm italic">
            Remove the divider to observe diffusion statistics
          </div>
        )}
      </div>
      
      {/* Educational information */}
      <div className="mt-4 bg-gray-800 p-4 rounded-lg">
        <h3 className="font-bold mb-2">About Diffusion</h3>
        <div className="text-sm space-y-2">
          <p>
            Diffusion is the net movement of molecules from a region of higher concentration to a region of lower concentration.
          </p>
          <p>
            The particles move randomly and eventually distribute evenly throughout the available space due to their kinetic energy.
          </p>
          <p>
            Factors affecting diffusion rate:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>Temperature (higher temperature = faster diffusion)</li>
            <li>Mass (lighter particles diffuse faster)</li>
            <li>Particle size (smaller particles diffuse faster)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}