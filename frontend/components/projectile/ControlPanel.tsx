"use client";

interface ControlPanelProps {
  velocity: number;
  mass: number;
  angle: number;
  airResistance: boolean;
  windSpeed: number;
  onVelocityChange: (velocity: number) => void;
  onMassChange: (mass: number) => void;
  onAngleChange: (angle: number) => void;
  onAirResistanceToggle: (enabled: boolean) => void;
  onWindSpeedChange: (windSpeed: number) => void;
  onLaunch: () => void;
  onReset: () => void;
  isSimulating: boolean;
}

export default function ControlPanel({
  velocity,
  mass,
  angle,
  airResistance,
  windSpeed,
  onVelocityChange,
  onMassChange,
  onAngleChange,
  onAirResistanceToggle,
  onWindSpeedChange,
  onLaunch,
  onReset,
  isSimulating
}: ControlPanelProps) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-4">
      <h2 className="text-lg font-bold mb-4 text-white">Projectile Controls</h2>
      
      <div className="space-y-5">
        {/* Initial Velocity */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-gray-300">Initial Velocity:</label>
            <span className="text-sm bg-gray-700 px-2 py-0.5 rounded text-blue-300 font-mono">
              {velocity.toFixed(1)} m/s
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="50"
            step="0.5"
            value={velocity}
            onChange={(e) => onVelocityChange(parseFloat(e.target.value))}
            disabled={isSimulating}
            className={`w-full accent-blue-500 ${isSimulating ? 'opacity-50' : ''}`}
          />
        </div>
        
        {/* Projectile Mass */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-gray-300">Mass:</label>
            <span className="text-sm bg-gray-700 px-2 py-0.5 rounded text-blue-300 font-mono">
              {mass.toFixed(1)} kg
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={mass}
            onChange={(e) => onMassChange(parseFloat(e.target.value))}
            disabled={isSimulating}
            className={`w-full accent-blue-500 ${isSimulating ? 'opacity-50' : ''}`}
          />
        </div>
        
        {/* Launch Angle */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-gray-300">Launch Angle:</label>
            <span className="text-sm bg-gray-700 px-2 py-0.5 rounded text-blue-300 font-mono">
              {angle.toFixed(1)}°
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="90"
            step="1"
            value={angle}
            onChange={(e) => onAngleChange(parseFloat(e.target.value))}
            disabled={isSimulating}
            className={`w-full accent-blue-500 ${isSimulating ? 'opacity-50' : ''}`}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0° (Horizontal)</span>
            <span>90° (Vertical)</span>
          </div>
        </div>
        
        {/* Air Resistance Toggle */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="air-resistance"
            checked={airResistance}
            onChange={(e) => onAirResistanceToggle(e.target.checked)}
            disabled={isSimulating}
            className="mr-2 accent-blue-500 h-4 w-4"
          />
          <label 
            htmlFor="air-resistance" 
            className={`text-sm font-medium ${isSimulating ? 'text-gray-500' : 'text-gray-300'}`}
          >
            Enable Air Resistance
          </label>
        </div>
        
        {/* Wind Speed - only shown if air resistance is enabled */}
        {airResistance && (
          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-gray-300">Wind Speed:</label>
              <span className="text-sm bg-gray-700 px-2 py-0.5 rounded text-blue-300 font-mono">
                {windSpeed.toFixed(1)} m/s
              </span>
            </div>
            <input
              type="range"
              min="-10"
              max="10"
              step="0.5"
              value={windSpeed}
              onChange={(e) => onWindSpeedChange(parseFloat(e.target.value))}
              disabled={isSimulating}
              className={`w-full accent-blue-500 ${isSimulating ? 'opacity-50' : ''}`}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>← Headwind</span>
              <span>No Wind</span>
              <span>Tailwind →</span>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="space-y-3 pt-2 border-t border-gray-700">
          <button
            onClick={onLaunch}
            disabled={isSimulating}
            className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
              isSimulating
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            Launch Projectile
          </button>
          
          <button
            onClick={onReset}
            className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-md font-medium transition-colors"
          >
            Reset Simulation
          </button>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-400">
        <p>Tip: You can also adjust the angle by dragging the red handle on the launcher.</p>
      </div>
    </div>
  );
}