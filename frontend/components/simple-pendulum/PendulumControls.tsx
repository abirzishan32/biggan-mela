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
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-white">Pendulum Controls</h2>
      
      <div className="space-y-6">
        {/* Length control */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="font-medium text-gray-300">Length (m):</label>
            <span className="text-blue-300 bg-gray-700 px-2 py-0.5 rounded font-mono">
              {length.toFixed(2)} m
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="3.0"
            step="0.01"
            value={length}
            onChange={(e) => setLength(parseFloat(e.target.value))}
            className="w-full accent-blue-500"
            disabled={isSimulating}
          />
          <div className="flex justify-between text-sm text-gray-400">
            <span>0.1m</span>
            <span>3.0m</span>
          </div>
        </div>
        
        {/* Angle control */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="font-medium text-gray-300">Initial Angle (°):</label>
            <span className="text-blue-300 bg-gray-700 px-2 py-0.5 rounded font-mono">
              {angle}°
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="45"
            step="1"
            value={angle}
            onChange={(e) => setAngle(parseInt(e.target.value))}
            className="w-full accent-blue-500"
            disabled={isSimulating}
          />
          <div className="flex justify-between text-sm text-gray-400">
            <span>5°</span>
            <span>45°</span>
          </div>
        </div>
        
        {/* Damping control */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="font-medium text-gray-300">Damping:</label>
            <span className="text-blue-300 bg-gray-700 px-2 py-0.5 rounded font-mono">
              {((1 - damping) * 1000).toFixed(1)}
            </span>
          </div>
          <input
            type="range"
            min="0.995"
            max="0.9999"
            step="0.0001"
            value={damping}
            onChange={(e) => setDamping(parseFloat(e.target.value))}
            className="w-full accent-blue-500"
            disabled={isSimulating}
          />
          <div className="flex justify-between text-sm text-gray-400">
            <span>More</span>
            <span>Less</span>
          </div>
        </div>
        
        {/* Period information */}
        <div className="p-3 bg-gray-700 rounded-md border-l-4 border-blue-500">
          <h3 className="font-semibold mb-1 text-blue-300">Predicted Period</h3>
          
          <div className="grid grid-cols-2 gap-y-1 text-sm">
            <div className="text-gray-300">Small angle formula:</div>
            <div className="text-white font-mono">{theoreticalPeriod.toFixed(3)} seconds</div>
            
            <div className="text-gray-300">Exact formula:</div>
            <div className="text-white font-mono">{exactPeriod.toFixed(3)} seconds</div>
            
            <div className="col-span-2 text-xs mt-1 text-gray-400">
              For small angles, T = 2π√(L/g)
            </div>
          </div>
        </div>
        
        {/* Start/Stop button */}
        <button
          onClick={toggleSimulation}
          className={`w-full py-3 rounded-md font-semibold transition-colors ${
            isSimulating
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
        </button>
      </div>
    </div>
  );
}