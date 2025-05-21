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
    <div className="mb-6">
      <div className="flex justify-between">
        <label className="text-lg font-semibold mb-2">Incident Angle: {incidentAngle.toFixed(1)}°</label>
        <button
          className="text-sm text-blue-600 hover:text-blue-800"
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
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      
      <div className="flex justify-between mt-1 text-sm text-gray-500">
        <span>0°</span>
        <span>45°</span>
        <span>90°</span>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mt-4">
        <button
          className="bg-gray-100 hover:bg-gray-200 py-1 rounded text-sm"
          onClick={() => onAngleChange(0)}
        >
          0° (Normal)
        </button>
        
        <button
          className="bg-gray-100 hover:bg-gray-200 py-1 rounded text-sm"
          onClick={() => onAngleChange(45)}
        >
          45°
        </button>
        
        <button
          className="bg-gray-100 hover:bg-gray-200 py-1 rounded text-sm"
          onClick={() => onAngleChange(80)}
        >
          80° (Steep)
        </button>
      </div>
    </div>
  );
}