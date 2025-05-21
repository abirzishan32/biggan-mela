"use client";

import { useState } from 'react';

interface ControlPanelProps {
  magnetStrength: number;
  setMagnetStrength: (value: number) => void;
  coilTurns: number;
  setCoilTurns: (value: number) => void;
  coilRadius: number;
  setCoilRadius: (value: number) => void;
  magnetVelocity: number;
  setMagnetVelocity: (value: number) => void;
  isSimulating: boolean;
  toggleSimulation: () => void;
  resetSimulation: () => void;
  showFieldLines: boolean;
  setShowFieldLines: (value: boolean) => void;
  magnetPolarity: string;
  flipMagnetPolarity: () => void;
}

export default function ControlPanel({
  magnetStrength,
  setMagnetStrength,
  coilTurns,
  setCoilTurns,
  coilRadius,
  setCoilRadius,
  magnetVelocity,
  setMagnetVelocity,
  isSimulating,
  toggleSimulation,
  resetSimulation,
  showFieldLines,
  setShowFieldLines,
  magnetPolarity,
  flipMagnetPolarity
}: ControlPanelProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h2 className="text-xl font-semibold mb-4">Simulation Controls</h2>
      
      <div className="space-y-6">
        {/* Magnet Strength Control */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="font-medium">Magnet Strength (T):</label>
            <span>{magnetStrength.toFixed(2)} Tesla</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="2.0"
            step="0.1"
            value={magnetStrength}
            onChange={(e) => setMagnetStrength(parseFloat(e.target.value))}
            className="w-full"
            disabled={isSimulating}
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>0.1T</span>
            <span>2.0T</span>
          </div>
        </div>
        
        {/* Coil Turns Control */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="font-medium">Coil Turns:</label>
            <span>{coilTurns} turns</span>
          </div>
          <input
            type="range"
            min="5"
            max="50"
            step="5"
            value={coilTurns}
            onChange={(e) => setCoilTurns(parseInt(e.target.value))}
            className="w-full"
            disabled={isSimulating}
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>5 turns</span>
            <span>50 turns</span>
          </div>
        </div>
        
        {/* Coil Radius Control */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="font-medium">Coil Radius (m):</label>
            <span>{coilRadius.toFixed(2)} m</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={coilRadius}
            onChange={(e) => setCoilRadius(parseFloat(e.target.value))}
            className="w-full"
            disabled={isSimulating}
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>0.5m</span>
            <span>2.0m</span>
          </div>
        </div>
        
        {/* Magnet Velocity Control */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="font-medium">Magnet Velocity (m/s):</label>
            <span>{magnetVelocity.toFixed(2)} m/s</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="2.0"
            step="0.1"
            value={magnetVelocity}
            onChange={(e) => setMagnetVelocity(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>0.1 m/s</span>
            <span>2.0 m/s</span>
          </div>
        </div>
        
        {/* Visualization Controls */}
        <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
          <h3 className="font-medium">Visualization Options</h3>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="show-field-lines"
              checked={showFieldLines}
              onChange={(e) => setShowFieldLines(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="show-field-lines">Show Magnetic Field Lines</label>
          </div>
          
          <button
            onClick={flipMagnetPolarity}
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded mt-1"
          >
            Flip Magnet Polarity ({magnetPolarity === 'north-south' ? 'N/S' : 'S/N'})
          </button>
        </div>
        
        {/* Simulation Control Buttons */}
        <div className="flex space-x-2 pt-2 border-t border-gray-200">
          <button
            onClick={toggleSimulation}
            className={`flex-1 py-2 rounded font-medium ${
              isSimulating
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
          </button>
          
          <button
            onClick={resetSimulation}
            className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 rounded font-medium"
            disabled={isSimulating}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}