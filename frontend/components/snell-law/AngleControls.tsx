"use client";

interface AngleControlsProps {
  incidentAngle: number;
  onAngleChange: (angle: number) => void;
}

export default function AngleControls({
  incidentAngle,
  onAngleChange
}: AngleControlsProps) {
  return (
    <div className="mb-6 bg-gray-800 p-4 rounded-lg shadow-lg">
      <div className="flex justify-between mb-2">
        <label className="text-lg font-semibold text-white">
          Incident Angle: <span className="text-blue-300 font-mono">{incidentAngle.toFixed(1)}°</span>
        </label>
        <button
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          onClick={() => onAngleChange(45)}
        >
          Reset to 45°
        </button>
      </div>
      
      <div className="flex items-center">
        <input
          type="range"
          min="0"
          max="89.9"
          step="0.1"
          value={incidentAngle}
          onChange={(e) => onAngleChange(parseFloat(e.target.value))}
          className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>
      
      <div className="flex justify-between mt-1 text-sm text-gray-400">
        <span>0°</span>
        <span>45°</span>
        <span>90°</span>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mt-4">
        <button
          className="bg-gray-700 hover:bg-gray-600 py-1.5 rounded text-sm text-blue-300 transition-colors"
          onClick={() => onAngleChange(0)}
        >
          0° (Normal)
        </button>
        
        <button
          className="bg-gray-700 hover:bg-gray-600 py-1.5 rounded text-sm text-blue-300 transition-colors"
          onClick={() => onAngleChange(45)}
        >
          45°
        </button>
        
        <button
          className="bg-gray-700 hover:bg-gray-600 py-1.5 rounded text-sm text-blue-300 transition-colors"
          onClick={() => onAngleChange(80)}
        >
          80° (Steep)
        </button>
      </div>
    </div>
  );
}