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
    <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 shadow-lg mb-4">
      <h2 className="text-lg font-semibold mb-4 text-white">Experiment Controls</h2>
      
      <div className="space-y-5">
        {/* Light Properties */}
        <fieldset className="border border-gray-700 rounded-md p-3 bg-gray-800">
          <legend className="text-sm font-medium px-2 text-gray-300">Light Properties</legend>
          
          <div className="space-y-4">
            {/* Wavelength */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-white">Wavelength:</label>
                <span className="text-sm bg-gray-700 px-2 py-1 rounded font-mono" style={{ color: wavelengthToColor(wavelength) }}>
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
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>380 nm (Violet)</span>
                <span>750 nm (Red)</span>
              </div>
            </div>
            
            {/* Wave Speed */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-white">Wave Speed:</label>
                <span className="text-sm bg-gray-700 px-2 py-1 rounded font-mono text-white">
                  {waveSpeed.toFixed(1)}×
                </span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="5" 
                step="0.1" 
                value={waveSpeed}
                onChange={(e) => setWaveSpeed(parseFloat(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>0.5×</span>
                <span>5.0×</span>
              </div>
            </div>
          </div>
        </fieldset>
        
        {/* Experiment Setup */}
        <fieldset className="border border-gray-700 rounded-md p-3 bg-gray-800">
          <legend className="text-sm font-medium px-2 text-gray-300">Experimental Setup</legend>
          
          <div className="space-y-4">
            {/* Slit Position */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-white">Slit Position:</label>
                <span className="text-sm bg-gray-700 px-2 py-1 rounded font-mono text-white">
                  {Math.round(slitPosition * 100)}% from source
                </span>
              </div>
              <input 
                type="range" 
                min="0.15" 
                max="0.7" 
                step="0.01" 
                value={slitPosition}
                onChange={(e) => setSlitPosition(parseFloat(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>15%</span>
                <span>70%</span>
              </div>
            </div>
            
            {/* Slit Separation */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-white">Slit Separation (d):</label>
                <span className="text-sm bg-gray-700 px-2 py-1 rounded font-mono text-white">
                  {slitDistance.toFixed(2)} mm
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.5"
                step="0.01"
                value={slitDistance}
                onChange={(e) => setSlitDistance(parseFloat(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>0.05 mm</span>
                <span>0.50 mm</span>
              </div>
            </div>
            
            {/* Slit Width */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-white">Slit Width (a):</label>
                <span className="text-sm bg-gray-700 px-2 py-1 rounded font-mono text-white">
                  {slitWidth.toFixed(2)} mm
                </span>
              </div>
              <input
                type="range"
                min="0.01"
                max="0.2"
                step="0.01"
                value={slitWidth}
                onChange={(e) => setSlitWidth(parseFloat(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>0.01 mm</span>
                <span>0.20 mm</span>
              </div>
            </div>
            
            {/* Screen Distance */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-white">Screen Distance (L):</label>
                <span className="text-sm bg-gray-700 px-2 py-1 rounded font-mono text-white">
                  {screenDistance} mm
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="2000"
                step="100"
                value={screenDistance}
                onChange={(e) => setScreenDistance(parseInt(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>500 mm</span>
                <span>2000 mm</span>
              </div>
            </div>
          </div>
        </fieldset>
        
        {/* Simulation Controls */}
        <div className="flex space-x-2 pt-2">
          <button
            className={`flex-1 py-2 rounded font-medium transition-colors ${
              isSimulating
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
            onClick={() => setIsSimulating(!isSimulating)}
          >
            {isSimulating ? 'Pause Simulation' : 'Start Simulation'}
          </button>
          
          <button
            className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-medium transition-colors"
            onClick={resetMeasurements}
          >
            Reset Measurements
          </button>
        </div>
      </div>
    </div>
  );
}