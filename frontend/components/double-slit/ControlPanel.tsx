"use client";

import { wavelengthToColor } from '@/lib/physics';

interface ControlPanelProps {
  wavelength: number;
  setWavelength: (value: number) => void;
  slitDistance: number;
  setSlitDistance: (value: number) => void;
  slitWidth: number;
  setSlitWidth: (value: number) => void;
  screenDistance: number;
  setScreenDistance: (value: number) => void;
  isSimulating: boolean;
  setIsSimulating: (value: boolean) => void;
  slitPosition: number;
  setSlitPosition: (value: number) => void;
  waveSpeed: number;
  setWaveSpeed: (value: number) => void;
  resetMeasurements: () => void;
}

export default function ControlPanel({
  wavelength,
  setWavelength,
  slitDistance,
  setSlitDistance,
  slitWidth,
  setSlitWidth,
  screenDistance,
  setScreenDistance,
  isSimulating,
  setIsSimulating,
  slitPosition,
  setSlitPosition,
  waveSpeed,
  setWaveSpeed,
  resetMeasurements
}: ControlPanelProps) {
  // Function to get color name based on wavelength
  function getColorName(wavelength: number): string {
    if (wavelength < 450) return 'Violet';
    if (wavelength < 495) return 'Blue';
    if (wavelength < 570) return 'Green';
    if (wavelength < 590) return 'Yellow';
    if (wavelength < 620) return 'Orange';
    return 'Red';
  }
  
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h2 className="text-lg font-semibold mb-4">Experiment Controls</h2>
      
      <div className="space-y-5">
        {/* Light Properties */}
        <fieldset className="border border-gray-200 rounded p-3">
          <legend className="text-sm font-medium px-2">Light Properties</legend>
          
          <div className="space-y-3">
            {/* Wavelength */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Wavelength:</label>
                <span className="text-sm" style={{ color: wavelengthToColor(wavelength) }}>
                  {wavelength} nm ({getColorName(wavelength)})
                </span>
              </div>
              <input
                type="range"
                min="380"
                max="750"
                step="10"
                value={wavelength}
                onChange={(e) => setWavelength(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>380 nm (Violet)</span>
                <span>750 nm (Red)</span>
              </div>
            </div>
            
            {/* Wave Speed - Moved from overlay */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Wave Speed:</label>
                <span className="text-sm">{waveSpeed.toFixed(1)}×</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="5" 
                step="0.1" 
                value={waveSpeed}
                onChange={(e) => setWaveSpeed(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </fieldset>
        
        {/* Experiment Setup */}
        <fieldset className="border border-gray-200 rounded p-3">
          <legend className="text-sm font-medium px-2">Experimental Setup</legend>
          
          <div className="space-y-3">
            {/* Slit Position - Moved from overlay */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Slit Position:</label>
                <span className="text-sm">{Math.round(slitPosition * 100)}% from source</span>
              </div>
              <input 
                type="range" 
                min="0.15" 
                max="0.7" 
                step="0.01" 
                value={slitPosition}
                onChange={(e) => setSlitPosition(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            
            {/* Slit Separation */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Slit Separation (d):</label>
                <span className="text-sm">{slitDistance.toFixed(2)} mm</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.5"
                step="0.01"
                value={slitDistance}
                onChange={(e) => setSlitDistance(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            
            {/* Slit Width */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Slit Width (a):</label>
                <span className="text-sm">{slitWidth.toFixed(2)} mm</span>
              </div>
              <input
                type="range"
                min="0.01"
                max="0.2"
                step="0.01"
                value={slitWidth}
                onChange={(e) => setSlitWidth(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            
            {/* Screen Distance */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Screen Distance (L):</label>
                <span className="text-sm">{screenDistance} mm</span>
              </div>
              <input
                type="range"
                min="500"
                max="2000"
                step="100"
                value={screenDistance}
                onChange={(e) => setScreenDistance(parseInt(e.target.value))}
                className="w-full"
              />
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
              {isSimulating ? 'Pause Simulation' : 'Start Simulation'}
            </button>
            
            <button
              className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 rounded font-medium"
              onClick={resetMeasurements}
            >
              Reset Measurements
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}