"use client";

import { useState, useEffect } from 'react';
import PendulumScene from '@/components/simple-pendulum/PendulumScene';
import PendulumControls from '@/components/simple-pendulum/PendulumControls';
import PendulumMath from '@/components/simple-pendulum/PendulumMath';
import { calculatePendulumPeriod } from '@/lib/physics';


export default function SimplePendulumPage() {
  // Pendulum parameters
  const [length, setLength] = useState(1.0); // in meters
  const [angle, setAngle] = useState(15); // initial angle in degrees
  const [isSimulating, setIsSimulating] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [periodCount, setPeriodCount] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null); // Fix type declaration here
  const [damping, setDamping] = useState(0.999); // damping factor (slight energy loss)
  
  // Calculate the theoretical period using the formula t = 2π√(l/g)
  const g = 9.8; // acceleration due to gravity in m/s²
  const theoreticalPeriod = calculatePendulumPeriod(length, g);
  
  // Start/stop the simulation
  const toggleSimulation = () => {
    if (!isSimulating) {
      // Start simulation
      setIsSimulating(true);
      setStartTime(Date.now());
      setElapsedTime(0);
      setPeriodCount(0);
    } else {
      // Stop simulation
      setIsSimulating(false);
      setStartTime(null);
    }
  };

  // Handle period completion (called from PendulumScene when a full cycle is completed)
  const handlePeriodComplete = () => {
    setPeriodCount(prev => prev + 1);
  };

  // Update elapsed time while simulation is running
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    
    if (isSimulating && startTime) {
      interval = setInterval(() => {
        setElapsedTime((Date.now() - startTime) / 1000);
      }, 100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSimulating, startTime]);

  // Calculate the measured period by dividing total time by number of periods
  const measuredPeriod = periodCount > 0 ? elapsedTime / periodCount : 0;
  const percentError = theoreticalPeriod > 0 && measuredPeriod > 0 
    ? Math.abs((measuredPeriod - theoreticalPeriod) / theoreticalPeriod * 100) 
    : 0;

  return (
    <div className="flex flex-col h-screen bg-black">
      <header className="bg-gray-900 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-blue-300">Simple Pendulum Physics Simulator</h1>
          <p className="text-gray-300">Explore the relationship between pendulum length and period</p>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 3D Pendulum Visualization */}
        <div className="w-2/3 bg-gray-900 relative">
          <PendulumScene 
            length={length}
            initialAngle={angle}
            isSimulating={isSimulating}
            damping={damping}
            onPeriodComplete={handlePeriodComplete}
          />
          
          {/* Overlay for time information */}
          <div className="absolute top-4 right-4 bg-gray-800 bg-opacity-90 text-white p-3 rounded-md shadow-lg">
            <div className="text-xl font-bold text-blue-300">Time: {elapsedTime.toFixed(2)}s</div>
            <div className="text-gray-300">Periods: {periodCount}</div>
            {periodCount > 0 && (
              <div className="text-gray-300">
                Measured Period: <span className="text-white font-mono">{measuredPeriod.toFixed(3)}s</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Controls and Information */}
        <div className="w-1/3 p-4 overflow-y-auto bg-gray-900">
          <PendulumControls 
            length={length}
            setLength={setLength}
            angle={angle}
            setAngle={setAngle}
            isSimulating={isSimulating}
            toggleSimulation={toggleSimulation}
            damping={damping}
            setDamping={setDamping}
          />
          
          <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-2 text-white">Experiment Results</h2>
            
            <div className="bg-gray-700 p-3 rounded-md">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-right font-medium text-gray-300">Theoretical Period:</div>
                <div className="text-white font-mono">{theoreticalPeriod.toFixed(3)} seconds</div>
                
                <div className="text-right font-medium text-gray-300">Measured Period:</div>
                <div className="text-white font-mono">{measuredPeriod > 0 ? `${measuredPeriod.toFixed(3)} seconds` : "N/A"}</div>
                
                <div className="text-right font-medium text-gray-300">Error:</div>
                <div className="text-white font-mono">{periodCount > 0 ? `${percentError.toFixed(2)}%` : "N/A"}</div>
              </div>
            </div>
            
            {periodCount > 0 && percentError < 2 && (
              <div className="mt-2 text-xs text-emerald-400 font-medium">
                Great accuracy! Your experimental measurement closely matches the theoretical prediction.
              </div>
            )}
            
            {periodCount > 0 && percentError >= 2 && percentError < 5 && (
              <div className="mt-2 text-xs text-yellow-400 font-medium">
                Good measurement! Small discrepancies can be due to damping and larger angles.
              </div>
            )}
            
            {periodCount > 0 && percentError >= 5 && (
              <div className="mt-2 text-xs text-red-400 font-medium">
                Significant error detected. Try using smaller angles or wait for more periods to improve accuracy.
              </div>
            )}
          </div>
          
          <PendulumMath />
        </div>
      </div>
    </div>
  );
}