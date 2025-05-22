"use client";

import { useCircuit } from "./CircuitContext";

export default function CircuitIndicators() {
  const { state } = useCircuit();
  const { isRunning, currentFlow } = state.simulation;
  
  if (!isRunning) return null;
  
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-md px-4 py-2 shadow-lg flex items-center border border-gray-700">
      <div className="mr-3 font-medium text-sm text-gray-300">Current Flow:</div>
      <div className="relative mr-3 h-6 w-20 bg-gray-900 rounded-full overflow-hidden border border-gray-700">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-blue-400" 
          style={{ 
            width: `${Math.min(currentFlow * 50, 100)}%`,
            transition: "width 0.3s ease-in-out" 
          }} 
        />
        
        {/* Animated electrons */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div 
            key={i} 
            className="absolute top-1/2 transform -translate-y-1/2 h-2 w-2 rounded-full bg-blue-300" 
            style={{
              left: `${5 + i * 15}%`,
              animation: `flowAnimation ${1.5 / state.simulation.electronSpeed}s infinite linear ${i * 0.2}s`,
              filter: "drop-shadow(0 0 2px rgba(59, 130, 246, 0.8))" 
            }}
          />
        ))}
      </div>
      <span className="text-sm font-mono bg-gray-900 px-2 py-1 rounded text-blue-400 border border-gray-700">
        {currentFlow.toFixed(1)}A
      </span>
    </div>
  );
}