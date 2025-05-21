"use client";

interface SimulationControlsProps {
  dividerPresent: boolean;
  isRunning: boolean;
  speed: number;
  onToggleDivider: () => void;
  onToggleSimulation: () => void;
  onSpeedChange: (speed: number) => void;
  onReset: () => void;
}

export default function SimulationControls({
  dividerPresent,
  isRunning,
  speed,
  onToggleDivider,
  onToggleSimulation,
  onSpeedChange,
  onReset
}: SimulationControlsProps) {
  return (
    <div className="flex flex-wrap justify-center items-center gap-4 p-2 bg-gray-800 rounded-lg">
      {/* Divider control */}
      <button
        className={`px-4 py-2 rounded-lg flex items-center ${
          dividerPresent 
            ? 'bg-red-600 hover:bg-red-700' 
            : 'bg-green-600 hover:bg-green-700'
        }`}
        onClick={onToggleDivider}
      >
        <span className="mr-2">{dividerPresent ? '🧱' : '🔄'}</span>
        {dividerPresent ? 'Remove Divider' : 'Restore Divider'}
      </button>
      
      {/* Play/pause control */}
      <button
        className={`px-4 py-2 rounded-lg flex items-center ${
          isRunning 
            ? 'bg-yellow-600 hover:bg-yellow-700' 
            : 'bg-green-600 hover:bg-green-700'
        }`}
        onClick={onToggleSimulation}
      >
        <span className="mr-2">{isRunning ? '⏸️' : '▶️'}</span>
        {isRunning ? 'Pause' : 'Resume'}
      </button>
      
      {/* Speed control */}
      <div className="flex items-center bg-gray-700 px-3 py-1 rounded-lg">
        <span className="text-sm mr-2">Speed:</span>
        <input
          type="range"
          min="0.1"
          max="3"
          step="0.1"
          value={speed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          className="w-32"
        />
        <span className="text-sm ml-2 w-8">{speed.toFixed(1)}x</span>
      </div>
      
      {/* Reset button */}
      <button
        className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 flex items-center"
        onClick={onReset}
      >
        <span className="mr-2">🔄</span>
        Reset
      </button>
    </div>
  );
}