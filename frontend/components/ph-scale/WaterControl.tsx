"use client";

interface WaterControlProps {
  onAddSolution: () => void;
  onAddWater: () => void;
  onReset: () => void;
  canAddSolution: boolean;
  canAddWater: boolean;
  className?: string;
}

export default function WaterControl({
  onAddSolution,
  onAddWater,
  onReset,
  canAddSolution,
  canAddWater,
  className = "flex flex-col space-y-3"
}: WaterControlProps) {
  return (
    <div className={className}>
      <button
        className={`py-2 px-4 rounded-lg font-medium flex items-center justify-center ${
          canAddSolution 
            ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
        }`}
        onClick={onAddSolution}
        disabled={!canAddSolution}
      >
        <span className="mr-2">🧪</span>
        Add Solution
      </button>
      
      <button
        className={`py-2 px-4 rounded-lg font-medium flex items-center justify-center ${
          canAddWater 
            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
        }`}
        onClick={onAddWater}
        disabled={!canAddWater}
      >
        <span className="mr-2">💧</span>
        Add Water
      </button>
      
      <button
        className="py-2 px-4 rounded-lg text-sm bg-red-900 hover:bg-red-800 text-white flex items-center justify-center"
        onClick={onReset}
      >
        <span className="mr-2">🔄</span>
        Reset Beaker
      </button>
    </div>
  );
}