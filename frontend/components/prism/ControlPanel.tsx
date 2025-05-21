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
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h2 className="text-lg font-semibold mb-4">Laboratory Controls</h2>
      
      <div className="space-y-5">
        {/* Prism Properties */}
        <fieldset className="border border-gray-200 rounded p-3">
          <legend className="text-sm font-medium px-2">Prism Properties</legend>
          
          <div className="space-y-3">
            {/* Prism Angle */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Prism Angle (A):</label>
                <span className="text-sm">{prismAngle}°</span>
              </div>
              <input
                type="range"
                min="30"
                max="90"
                step="1"
                value={prismAngle}
                onChange={(e) => setPrismAngle(parseInt(e.target.value))}
                className="w-full"
                disabled={isSimulating}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>30°</span>
                <span>60°</span>
                <span>90°</span>
              </div>
            </div>
            
            {/* Prism Material */}
            <div>
              <label className="text-sm font-medium block mb-1">Material:</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(refractiveIndices).map((material) => (
                  material !== 'vacuum' && (
                    <button
                      key={material}
                      className={`py-1 px-2 text-sm rounded ${
                        prismMaterial === material
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 hover:bg-gray-300'
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
        <fieldset className="border border-gray-200 rounded p-3">
          <legend className="text-sm font-medium px-2">Experiment Setup</legend>
          
          <div className="space-y-3">
            {/* Incident Angle */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Incident Angle (i):</label>
                <span className="text-sm">{incidentAngle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="1"
                value={incidentAngle}
                onChange={(e) => setIncidentAngle(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0°</span>
                <span>40°</span>
                <span>80°</span>
              </div>
            </div>
            
            {/* Pin Distance */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Pin Distance:</label>
                <span className="text-sm">{pinDistance} cm</span>
              </div>
              <input
                type="range"
                min="8"
                max="20"
                step="1"
                value={pinDistance}
                onChange={(e) => setPinDistance(parseInt(e.target.value))}
                className="w-full"
                disabled={isSimulating}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>8 cm</span>
                <span>20 cm</span>
              </div>
            </div>
          </div>
        </fieldset>
        
        {/* Simulation Controls */}
        <div className="space-y-3">
          <div className="flex space-x-2">
            <button
              className={`flex-1 py-2 rounded font-medium ${
                isSimulating
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
              onClick={() => setIsSimulating(!isSimulating)}
            >
              {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
            </button>
            
            <button
              className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 rounded font-medium"
              onClick={resetMeasurements}
            >
              Reset Data
            </button>
          </div>
          
          <button
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium"
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