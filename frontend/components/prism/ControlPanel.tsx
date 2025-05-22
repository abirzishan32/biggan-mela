"use client";

import { useState } from 'react';
import { refractiveIndices } from '@/lib/physics';

interface ControlPanelProps {
  prismAngle: number;
  setPrismAngle: (value: number) => void;
  prismMaterial: string;
  setPrismMaterial: (value: string) => void;
  incidentAngle: number;
  setIncidentAngle: (value: number) => void;
  pinDistance: number;
  setPinDistance: (value: number) => void;
  isSimulating: boolean;
  setIsSimulating: (value: boolean) => void;
  addMeasurement: () => void;
  resetMeasurements: () => void;
}

export default function ControlPanel({
  prismAngle,
  setPrismAngle,
  prismMaterial,
  setPrismMaterial,
  incidentAngle,
  setIncidentAngle,
  pinDistance,
  setPinDistance,
  isSimulating,
  setIsSimulating,
  addMeasurement,
  resetMeasurements
}: ControlPanelProps) {
  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-lg mb-4 border border-gray-800">
      <h2 className="text-lg font-semibold mb-4 text-white">Laboratory Controls</h2>
      
      <div className="space-y-5">
        {/* Prism Properties */}
        <fieldset className="border border-gray-700 rounded-md p-3 bg-gray-800">
          <legend className="text-sm font-medium px-2 text-gray-300">Prism Properties</legend>
          
          <div className="space-y-3">
            {/* Prism Angle */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-300">Prism Angle (A):</label>
                <span className="text-blue-300 bg-gray-700 px-2 py-0.5 rounded font-mono">
                  {prismAngle}°
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="90"
                step="1"
                value={prismAngle}
                onChange={(e) => setPrismAngle(parseInt(e.target.value))}
                className="w-full accent-blue-500"
                disabled={isSimulating}
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>30°</span>
                <span>60°</span>
                <span>90°</span>
              </div>
            </div>
            
            {/* Prism Material */}
            <div>
              <label className="text-sm font-medium block mb-1 text-gray-300">Material:</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(refractiveIndices).map((material) => (
                  material !== 'vacuum' && (
                    <button
                      key={material}
                      className={`py-1 px-2 text-sm rounded transition-colors ${
                        prismMaterial === material
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      }`}
                      onClick={() => setPrismMaterial(material)}
                      disabled={isSimulating}
                    >
                      {material.charAt(0).toUpperCase() + material.slice(1)}
                      <span className="text-xs block">
                        (n = {refractiveIndices[material as keyof typeof refractiveIndices].toFixed(3)})
                      </span>
                    </button>
                  )
                ))}
              </div>
            </div>
          </div>
        </fieldset>
        
        {/* Experiment Setup */}
        <fieldset className="border border-gray-700 rounded-md p-3 bg-gray-800">
          <legend className="text-sm font-medium px-2 text-gray-300">Experiment Setup</legend>
          
          <div className="space-y-3">
            {/* Incident Angle */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-300">Incident Angle (i):</label>
                <span className="text-blue-300 bg-gray-700 px-2 py-0.5 rounded font-mono">
                  {incidentAngle}°
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="1"
                value={incidentAngle}
                onChange={(e) => setIncidentAngle(parseInt(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>0°</span>
                <span>40°</span>
                <span>80°</span>
              </div>
            </div>
            
            {/* Pin Distance */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-300">Pin Distance:</label>
                <span className="text-blue-300 bg-gray-700 px-2 py-0.5 rounded font-mono">
                  {pinDistance} cm
                </span>
              </div>
              <input
                type="range"
                min="8"
                max="20"
                step="1"
                value={pinDistance}
                onChange={(e) => setPinDistance(parseInt(e.target.value))}
                className="w-full accent-blue-500"
                disabled={isSimulating}
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>8 cm</span>
                <span>20 cm</span>
              </div>
            </div>
          </div>
        </fieldset>
        
        {/* Simulation Controls */}
        <div className="space-y-3 pt-2">
          <div className="flex space-x-2">
            <button
              className={`flex-1 py-2 rounded-md font-medium transition-colors ${
                isSimulating
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
              onClick={() => setIsSimulating(!isSimulating)}
            >
              {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
            </button>
            
            <button
              className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md font-medium transition-colors"
              onClick={resetMeasurements}
            >
              Reset Data
            </button>
          </div>
          
          <button
            className="w-full py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-md font-medium transition-colors"
            onClick={addMeasurement}
            disabled={!isSimulating}
          >
            Take Measurement
          </button>
        </div>
      </div>
    </div>
  );
}