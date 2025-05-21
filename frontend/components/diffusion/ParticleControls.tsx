"use client";

import { ParticleSettings } from './types';

interface ParticleControlsProps {
  settings: ParticleSettings;
  onChange: (settings: Partial<ParticleSettings>) => void;
  side: 'left' | 'right';
  disabled?: boolean;
}

export default function ParticleControls({
  settings,
  onChange,
  side,
  disabled = false
}: ParticleControlsProps) {
  const handleChange = (
    key: keyof ParticleSettings,
    value: number,
    min: number,
    max: number
  ) => {
    const clampedValue = Math.max(min, Math.min(max, value));
    onChange({ [key]: clampedValue });
  };
  
  return (
    <div className={`rounded-lg p-4 bg-gray-800 text-white ${disabled ? 'opacity-70' : ''}`}>
      <div className="text-center mb-4">
        <div 
          className={`w-8 h-8 mx-auto rounded-full`}
          style={{ backgroundColor: side === 'left' ? '#3B82F6' : '#EF4444' }}
        ></div>
        <div className="mt-1 text-sm font-medium">
          {side === 'left' ? 'Left Chamber' : 'Right Chamber'}
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Particle Count */}
        <div>
          <label className="flex justify-between mb-1">
            <span className="text-sm">Number of Particles</span>
            <span className="text-sm font-mono">{settings.count}</span>
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={settings.count}
            onChange={(e) => handleChange('count', parseInt(e.target.value), 1, 100)}
            className="w-full"
            disabled={disabled}
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>1</span>
            <span>100</span>
          </div>
        </div>
        
        {/* Particle Radius */}
        <div>
          <label className="flex justify-between mb-1">
            <span className="text-sm">Radius (pm)</span>
            <span className="text-sm font-mono">{settings.radius}</span>
          </label>
          <input
            type="range"
            min="5"
            max="100"
            step="5"
            value={settings.radius}
            onChange={(e) => handleChange('radius', parseInt(e.target.value), 5, 100)}
            className="w-full"
            disabled={disabled}
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>5</span>
            <span>100</span>
          </div>
        </div>
        
        {/* Particle Mass */}
        <div>
          <label className="flex justify-between mb-1">
            <span className="text-sm">Mass (AMU)</span>
            <span className="text-sm font-mono">{settings.mass}</span>
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={settings.mass}
            onChange={(e) => handleChange('mass', parseInt(e.target.value), 1, 50)}
            className="w-full"
            disabled={disabled}
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>1</span>
            <span>50</span>
          </div>
        </div>
        
        {/* Temperature */}
        <div>
          <label className="flex justify-between mb-1">
            <span className="text-sm">Temperature (K)</span>
            <span className="text-sm font-mono">{settings.temperature}</span>
          </label>
          <input
            type="range"
            min="100"
            max="1000"
            step="10"
            value={settings.temperature}
            onChange={(e) => handleChange('temperature', parseInt(e.target.value), 100, 1000)}
            className="w-full"
            disabled={disabled}
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>100</span>
            <span>1000</span>
          </div>
        </div>
      </div>
      
      {/* Example gases */}
      <div className="mt-4 pt-3 border-t border-gray-700">
        <div className="text-sm mb-2">Preset Gases:</div>
        <div className="grid grid-cols-2 gap-2">
          <button 
            className="text-xs bg-blue-800 hover:bg-blue-700 rounded px-2 py-1 disabled:opacity-50"
            onClick={() => onChange({ mass: 4, radius: 120, temperature: 300 })}
            disabled={disabled}
          >
            Helium
          </button>
          <button 
            className="text-xs bg-blue-800 hover:bg-blue-700 rounded px-2 py-1 disabled:opacity-50"
            onClick={() => onChange({ mass: 20, radius: 180, temperature: 300 })}
            disabled={disabled}
          >
            Neon
          </button>
          <button 
            className="text-xs bg-blue-800 hover:bg-blue-700 rounded px-2 py-1 disabled:opacity-50"
            onClick={() => onChange({ mass: 16, radius: 140, temperature: 300 })}
            disabled={disabled}
          >
            Oxygen
          </button>
          <button 
            className="text-xs bg-blue-800 hover:bg-blue-700 rounded px-2 py-1 disabled:opacity-50"
            onClick={() => onChange({ mass: 28, radius: 150, temperature: 300 })}
            disabled={disabled}
          >
            Nitrogen
          </button>
        </div>
      </div>
    </div>
  );
}