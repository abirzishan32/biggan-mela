"use client";

import { SpringSystem } from "./types";

interface LabControlsProps {
  springSystems: SpringSystem[];
  onSpringConstantChange: (id: number, value: number) => void;
  customMass: number;
  onCustomMassChange: (value: number) => void;
  onAddCustomMass: () => void;
  onReset: () => void;
  onPlayPause: () => void;
  isPaused: boolean;
}

export default function LabControls({
  springSystems,
  onSpringConstantChange,
  customMass,
  onCustomMassChange,
  onAddCustomMass,
  onReset,
  onPlayPause,
  isPaused
}: LabControlsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Controls</h2>
      
      {/* Spring constants control */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Spring Constants</h3>
        
        {springSystems.map((system) => (
          <div key={system.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">
                Spring {system.id}: {system.springConstant.toFixed(1)} N/m
              </label>
              
              {system.attachedMass && (
                <div className="text-xs bg-indigo-900 px-2 py-1 rounded">
                  T = {system.oscillationPeriod.toFixed(2)}s
                </div>
              )}
            </div>
            
            <input
              type="range"
              min="5"
              max="100"
              step="0.5"
              value={system.springConstant}
              onChange={(e) => onSpringConstantChange(system.id, parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            
            <div className="flex justify-between text-xs text-gray-400">
              <span>Soft</span>
              <span>Medium</span>
              <span>Stiff</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Custom mass input */}
      <div className="space-y-2 pt-2 border-t border-gray-700">
        <h3 className="text-lg font-semibold">Create Custom Mass</h3>
        
        <div className="flex space-x-2">
          <input
            type="number"
            min="0.1"
            max="5"
            step="0.1"
            value={customMass}
            onChange={(e) => onCustomMassChange(parseFloat(e.target.value))}
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <span className="flex items-center px-2">kg</span>
          <button
            onClick={onAddCustomMass}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          >
            Add
          </button>
        </div>
      </div>
      
      {/* Simulation controls */}
      <div className="flex space-x-3 pt-4 border-t border-gray-700">
        <button
          onClick={onPlayPause}
          className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        
        <button
          onClick={onReset}
          className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
        >
          Reset
        </button>
      </div>
      
      {/* Formula reference */}
      <div className="text-sm text-gray-400 pt-4 border-t border-gray-700">
        <p className="font-medium mb-1">Spring-Mass System Period</p>
        <div className="bg-gray-800 p-2 rounded flex items-center justify-center">
          <span className="font-mono">T = 2π × √(m/k)</span>
        </div>
        <p className="mt-2">Where m is mass (kg) and k is spring constant (N/m)</p>
      </div>
    </div>
  );
}