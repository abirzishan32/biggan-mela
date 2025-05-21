"use client";

import { useState, useEffect } from 'react';
import { calculatePendulumPeriod, calculateExactPendulumPeriod } from '@/lib/physics';

// Define the props interface
interface PendulumControlsProps {
  length: number;
  setLength: (length: number) => void;
  angle: number;
  setAngle: (angle: number) => void;
  isSimulating: boolean;
  toggleSimulation: () => void;
  damping: number;
  setDamping: (damping: number) => void;
}

export default function PendulumControls({
  length,
  setLength,
  angle,
  setAngle,
  isSimulating,
  toggleSimulation,
  damping,
  setDamping
}: PendulumControlsProps) {
  // Calculate the theoretical period
  const theoreticalPeriod = calculatePendulumPeriod(length);
  const exactPeriod = calculateExactPendulumPeriod(length, angle);
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Pendulum Controls</h2>
      
      <div className="space-y-6">
        {/* Length control */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="font-medium">Length (m):</label>
            <span>{length.toFixed(2)} m</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="3.0"
            step="0.01"
            value={length}
            onChange={(e) => setLength(parseFloat(e.target.value))}
            className="w-full"
            disabled={isSimulating}
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>0.1m</span>
            <span>3.0m</span>
          </div>
        </div>
        
        {/* Angle control */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="font-medium">Initial Angle (°):</label>
            <span>{angle}°</span>
          </div>
          <input
            type="range"
            min="5"
            max="45"
            step="1"
            value={angle}
            onChange={(e) => setAngle(parseInt(e.target.value))}
            className="w-full"
            disabled={isSimulating}
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>5°</span>
            <span>45°</span>
          </div>
        </div>
        
        {/* Damping control */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="font-medium">Damping:</label>
            <span>{((1 - damping) * 1000).toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="0.995"
            max="0.9999"
            step="0.0001"
            value={damping}
            onChange={(e) => setDamping(parseFloat(e.target.value))}
            className="w-full"
            disabled={isSimulating}
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>More</span>
            <span>Less</span>
          </div>
        </div>
        
        {/* Period information */}
        <div className="p-3 bg-blue-50 rounded-md">
          <h3 className="font-semibold mb-1">Predicted Period</h3>
          
          <div className="grid grid-cols-2 gap-y-1 text-sm">
            <div>Small angle formula:</div>
            <div>{theoreticalPeriod.toFixed(3)} seconds</div>
            
            <div>Exact formula:</div>
            <div>{exactPeriod.toFixed(3)} seconds</div>
            
            <div className="col-span-2 text-xs mt-1 text-gray-600">
              For small angles, T = 2π√(L/g)
            </div>
          </div>
        </div>
        
        {/* Start/Stop button */}
        <button
          onClick={toggleSimulation}
          className={`w-full py-3 rounded-md font-semibold transition-colors ${
            isSimulating
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
        </button>
      </div>
    </div>
  );
}