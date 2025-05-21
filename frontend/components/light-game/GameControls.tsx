"use client";

import { useState } from 'react';
import { Slider } from '@/components/ui/slider';

interface GameControlsProps {
  lightAngle: number;
  setLightAngle: (angle: number) => void;
  mediumType: 'air' | 'water' | 'glass' | 'oil';
  setMediumType: (medium: 'air' | 'water' | 'glass' | 'oil') => void;
}

export default function GameControls({ 
  lightAngle, 
  setLightAngle, 
  mediumType, 
  setMediumType 
}: GameControlsProps) {
  const [showInfo, setShowInfo] = useState(false);

  // Handler for Slider component that accepts array values
  const handleAngleChange = (values: number[]) => {
    // Take the first value from the array and pass it to setLightAngle
    if (values.length > 0) {
      setLightAngle(values[0]);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Controls</h2>
      
      <div className="mb-6">
        <label className="block mb-2 font-medium">Light Ray Angle: {lightAngle}°</label>
        <Slider 
          min={0}
          max={80}
          value={[lightAngle]} // Pass as an array
          onValueChange={handleAngleChange} // Use onValueChange instead of onChange
          step={1}
        />
      </div>
      
      <div className="mb-6">
        <label className="block mb-2 font-medium">Medium</label>
        <div className="grid grid-cols-2 gap-2">
          {(['water', 'glass', 'oil', 'air'] as const).map((medium) => (
            <button
              key={medium}
              className={`py-2 px-3 rounded-md ${
                mediumType === medium 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
              onClick={() => setMediumType(medium)}
            >
              {medium.charAt(0).toUpperCase() + medium.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-6">
        <button
          className="w-full py-2 px-4 bg-blue-100 hover:bg-blue-200 rounded-md"
          onClick={() => setShowInfo(!showInfo)}
        >
          {showInfo ? 'Hide Info' : 'Show Info'}
        </button>
        
        {showInfo && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md text-sm">
            <h3 className="font-bold mb-2">Refractive Indices</h3>
            <ul className="space-y-1">
              <li>Air: 1.0</li>
              <li>Water: 1.33</li>
              <li>Glass: 1.5</li>
              <li>Oil: 1.47</li>
            </ul>
            
            <h3 className="font-bold mt-3 mb-2">Physics Facts</h3>
            <p>
              The angle of refraction depends on the refractive indices of both mediums,
              following Snell's Law: n₁ sin(θ₁) = n₂ sin(θ₂)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}