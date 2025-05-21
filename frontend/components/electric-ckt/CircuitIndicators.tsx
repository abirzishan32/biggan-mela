"use client";

import { useCircuit } from "./CircuitContext";

export default function CircuitIndicators() {
  const { state } = useCircuit();
  const { isRunning, currentFlow } = state.simulation;
  
  if (!isRunning) return null;
  
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-4 py-1.5 shadow-lg flex items-center">
      <div className="mr-2 font-medium text-xs">Current Flow:</div>
      <div className="relative mr-2 h-6 w-16 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-blue-600" 
          style={{ 
            width: `${Math.min(currentFlow * 50, 100)}%`,
            transition: "width 0.3s ease-in-out" 
          }} 
        />
        
        {/* Animated electrons */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div 
            key={i} 
            className="absolute top-1/2 transform -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-white" 
            style={{
              left: `${5 + i * 15}%`,
              animation: `flowAnimation ${1.5 / state.simulation.electronSpeed}s infinite linear ${i * 0.2}s`
            }}
          />
        ))}
      </div>
      <span className="text-xs font-medium">
        {currentFlow.toFixed(1)}A
      </span>
    </div>
  );
}