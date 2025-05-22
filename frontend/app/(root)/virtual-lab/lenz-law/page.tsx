"use client";

import { useState, useEffect } from 'react';
import LenzLawScene from '@/components/lenz-law/LenzLawScene';
import ControlPanel from '@/components/lenz-law/ControlPanel';
import DataPanel from '@/components/lenz-law/DataPanel';
import TheoryPanel from '@/components/lenz-law/TheoryPanel';

export default function LenzLawPage() {
  // Simulation parameters
  const [magnetStrength, setMagnetStrength] = useState(1.0); // Tesla
  const [coilTurns, setCoilTurns] = useState(20); // Number of turns in the coil
  const [coilRadius, setCoilRadius] = useState(1.0); // Meters
  const [magnetVelocity, setMagnetVelocity] = useState(0.5); // m/s
  const [isSimulating, setIsSimulating] = useState(false);
  const [showFieldLines, setShowFieldLines] = useState(true);
  const [magnetPolarity, setMagnetPolarity] = useState('north-south'); // 'north-south' or 'south-north'
  
  // Data from simulation
  const [inducedCurrent, setInducedCurrent] = useState(0);
  const [magnetPosition, setMagnetPosition] = useState(0);
  const [currentHistory, setCurrentHistory] = useState<{time: number, current: number}[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // Calculate coil area
  const coilArea = Math.PI * coilRadius * coilRadius;
  
  // Toggle simulation
  const toggleSimulation = () => {
    if (!isSimulating) {
      // Start simulation
      setIsSimulating(true);
      setCurrentHistory([]);
      setElapsedTime(0);
    } else {
      // Stop simulation
      setIsSimulating(false);
    }
  };
  
  // Reset simulation
  const resetSimulation = () => {
    setIsSimulating(false);
    setMagnetPosition(0);
    setInducedCurrent(0);
    setCurrentHistory([]);
    setElapsedTime(0);
  };
  
  // Flip magnet polarity
  const flipMagnetPolarity = () => {
    setMagnetPolarity(prev => prev === 'north-south' ? 'south-north' : 'north-south');
  };
  
  // Update simulation data
  const updateSimulationData = (current: number, position: number) => {
    setInducedCurrent(current);
    setMagnetPosition(position);
    setCurrentHistory(prev => [
      ...prev, 
      { time: elapsedTime, current }
    ].slice(-100)); // Keep last 100 data points
  };
  
  // Update elapsed time
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    
    if (isSimulating) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 0.1); // 100ms intervals
      }, 100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSimulating]);
  
  return (
    <div className="flex flex-col h-screen bg-black">
      <header className="bg-gray-900 text-white p-4 border-b border-gray-800">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-blue-300">Lenz's Law Simulator</h1>
          <p className="text-gray-300 text-sm">
            Explore electromagnetic induction and opposing forces
          </p>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 3D Simulation View */}
        <div className="w-2/3 bg-gray-900 relative border-r border-gray-800">
          <LenzLawScene 
            magnetStrength={magnetStrength}
            coilTurns={coilTurns}
            coilRadius={coilRadius}
            magnetVelocity={magnetVelocity}
            isSimulating={isSimulating}
            showFieldLines={showFieldLines}
            magnetPolarity={magnetPolarity}
            updateData={updateSimulationData}
          />
          
          {/* Overlay for data display */}
          <div className="absolute top-4 right-4 bg-gray-900 bg-opacity-80 text-white p-3 rounded-md border border-gray-700 shadow-lg">
            <div className="text-xl font-bold text-blue-300">
              Current: <span className="font-mono">{inducedCurrent.toFixed(2)} A</span>
            </div>
            <div className="text-gray-300">
              Magnet Position: <span className="font-mono">{magnetPosition.toFixed(2)} m</span>
            </div>
            <div className="text-gray-300">
              Time: <span className="font-mono">{elapsedTime.toFixed(1)} s</span>
            </div>
          </div>
        </div>
        
        {/* Controls and Information */}
        <div className="w-1/3 bg-gray-900 p-4 overflow-y-auto">
          <ControlPanel 
            magnetStrength={magnetStrength}
            setMagnetStrength={setMagnetStrength}
            coilTurns={coilTurns}
            setCoilTurns={setCoilTurns}
            coilRadius={coilRadius}
            setCoilRadius={setCoilRadius}
            magnetVelocity={magnetVelocity}
            setMagnetVelocity={setMagnetVelocity}
            isSimulating={isSimulating}
            toggleSimulation={toggleSimulation}
            resetSimulation={resetSimulation}
            showFieldLines={showFieldLines}
            setShowFieldLines={setShowFieldLines}
            magnetPolarity={magnetPolarity}
            flipMagnetPolarity={flipMagnetPolarity}
          />
          
          <DataPanel 
            inducedCurrent={inducedCurrent}
            magneticFlux={magnetStrength * coilArea * coilTurns}
            currentHistory={currentHistory}
            elapsedTime={elapsedTime}
          />
          
          <TheoryPanel />
        </div>
      </div>
    </div>
  );
}