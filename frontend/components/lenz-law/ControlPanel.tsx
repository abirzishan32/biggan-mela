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
    <div className="bg-gray-900 p-4 rounded-lg shadow-lg mb-4 border border-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-white">Simulation Controls</h2>
      
      {/* Magnet Strength Control */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between">
          <label className="font-medium text-gray-300">Magnet Strength (T):</label>
          <span className="text-blue-300 bg-gray-800 px-2 py-0.5 rounded font-mono">
            {magnetStrength.toFixed(2)} Tesla
          </span>
        </div>
        <input
          type="range"
          min="0.1"
          max="2.0"
          step="0.1"
          value={magnetStrength}
          onChange={(e) => setMagnetStrength(parseFloat(e.target.value))}
          className="w-full accent-blue-500"
          disabled={isSimulating}
        />
        <div className="flex justify-between text-sm text-gray-400">
          <span>0.1T</span>
          <span>2.0T</span>
        </div>
      </div>
      
      {/* Coil Turns Control */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between">
          <label className="font-medium text-gray-300">Coil Turns:</label>
          <span className="text-blue-300 bg-gray-800 px-2 py-0.5 rounded font-mono">
            {coilTurns} turns
          </span>
        </div>
        <input
          type="range"
          min="5"
          max="50"
          step="5"
          value={coilTurns}
          onChange={(e) => setCoilTurns(parseInt(e.target.value))}
          className="w-full accent-blue-500"
          disabled={isSimulating}
        />
        <div className="flex justify-between text-sm text-gray-400">
          <span>5 turns</span>
          <span>50 turns</span>
        </div>
      </div>
      
      {/* Coil Radius Control */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between">
          <label className="font-medium text-gray-300">Coil Radius (m):</label>
          <span className="text-blue-300 bg-gray-800 px-2 py-0.5 rounded font-mono">
            {coilRadius.toFixed(2)} m
          </span>
        </div>
        <input
          type="range"
          min="0.5"
          max="2.0"
          step="0.1"
          value={coilRadius}
          onChange={(e) => setCoilRadius(parseFloat(e.target.value))}
          className="w-full accent-blue-500"
          disabled={isSimulating}
        />
        <div className="flex justify-between text-sm text-gray-400">
          <span>0.5m</span>
          <span>2.0m</span>
        </div>
      </div>
      
      {/* Magnet Velocity Control */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between">
          <label className="font-medium text-gray-300">Magnet Velocity (m/s):</label>
          <span className="text-blue-300 bg-gray-800 px-2 py-0.5 rounded font-mono">
            {magnetVelocity.toFixed(2)} m/s
          </span>
        </div>
        <input
          type="range"
          min="0.1"
          max="2.0"
          step="0.1"
          value={magnetVelocity}
          onChange={(e) => setMagnetVelocity(parseFloat(e.target.value))}
          className="w-full accent-blue-500"
        />
        <div className="flex justify-between text-sm text-gray-400">
          <span>0.1 m/s</span>
          <span>2.0 m/s</span>
        </div>
      </div>
      
      {/* Visualization Controls */}
      <div className="pt-4 mb-6 border-t border-gray-700">
        <h3 className="font-medium text-white mb-3">Visualization Options</h3>
        
        <div className="flex items-center mb-3">
          <input
            type="checkbox"
            id="show-field-lines"
            checked={showFieldLines}
            onChange={(e) => setShowFieldLines(e.target.checked)}
            className="mr-2 accent-blue-500 h-4 w-4"
          />
          <label htmlFor="show-field-lines" className="text-gray-300">
            Show Magnetic Field Lines
          </label>
        </div>
        
        <button
          onClick={flipMagnetPolarity}
          className="w-full bg-indigo-700 hover:bg-indigo-800 text-white py-2 px-4 rounded-md transition-colors font-medium"
        >
          Flip Magnet Polarity ({magnetPolarity === 'north-south' ? 'N/S' : 'S/N'})
        </button>
      </div>
      
      {/* Simulation Control Buttons */}
      <div className="flex space-x-2 pt-4 border-t border-gray-700">
        <button
          onClick={toggleSimulation}
          className={`flex-1 py-2 rounded-md font-medium transition-colors ${
            isSimulating
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
        </button>
        
        <button
          onClick={resetSimulation}
          className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md font-medium transition-colors"
          disabled={isSimulating}
        >
          Reset
        </button>
      </div>
    </div>
  );
}