"use client";

import { useState, useEffect } from 'react';
import Beaker from './Beaker';
import PhMeter from './PhMeter';
import SolutionSelector from './SolutionSelector';
import WaterControl from './WaterControl';
import PhScale from './PhScale';
import { BeakerState, Solution } from './types';
import { solutions } from './solutions-data';
import { calculateDilutedPH } from './PhCalculator';

export default function PhScaleLab() {
  // State for the beaker content
  const [beakerState, setBeakerState] = useState<BeakerState>({
    solution: null,
    volumeSolution: 0,
    volumeWater: 0,
    currentPh: 7,
    filled: false,
    probeInside: false
  });
  
  // State for selected solution
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null);
  
  // State for pH meter
  const [phMeterValue, setPhMeterValue] = useState<number | null>(null);
  
  // State for pouring animation
  const [isPouring, setIsPouring] = useState<'none' | 'solution' | 'water'>('none');
  
  // Handle solution selection
  const handleSelectSolution = (solution: Solution) => {
    setSelectedSolution(solution);
    
    // Reset beaker if solution changes
    if (beakerState.solution?.id !== solution.id) {
      setBeakerState({
        ...beakerState,
        solution: null,
        volumeSolution: 0,
        volumeWater: 0,
        filled: false,
        currentPh: 7
      });
      setPhMeterValue(null);
    }
  };
  
  // Handle adding solution
const handleAddSolution = () => {
  if (!selectedSolution || beakerState.filled) return;
  
  // Start pouring animation
  setIsPouring('solution');
  
  // After a short delay to allow animation to show, update the beaker state
  setTimeout(() => {
    const newVolume = Math.min(100, beakerState.volumeSolution + 20);
    const newState = {
      solution: selectedSolution,
      volumeSolution: newVolume,
      volumeWater: beakerState.volumeWater,
      filled: newVolume + beakerState.volumeWater >= 100,
      probeInside: beakerState.probeInside,
      currentPh: calculateDilutedPH(selectedSolution, newVolume, beakerState.volumeWater)
    };
    
    setBeakerState(newState);
    
    // Update pH meter if probe is in the beaker
    if (beakerState.probeInside) {
      setPhMeterValue(newState.currentPh);
    }
    
    // End pouring animation
    setTimeout(() => {
      setIsPouring('none');
    }, 500);
  }, 300);
};
  
  // Handle adding water
const handleAddWater = () => {
  if (!beakerState.solution || beakerState.filled) return;
  
  // Start pouring animation
  setIsPouring('water');
  
  // After a short delay to allow animation to show, update the beaker state
  setTimeout(() => {
    const newWaterVolume = Math.min(100 - beakerState.volumeSolution, beakerState.volumeWater + 20);
    
    // Type guard to ensure beakerState.solution is not null
    if (beakerState.solution) {
      const newState = {
        ...beakerState,
        volumeWater: newWaterVolume,
        filled: beakerState.volumeSolution + newWaterVolume >= 100,
        currentPh: calculateDilutedPH(
          beakerState.solution, 
          beakerState.volumeSolution, 
          newWaterVolume
        )
      };
      
      setBeakerState(newState);
      
      // Update pH meter if probe is in the beaker
      if (beakerState.probeInside) {
        setPhMeterValue(newState.currentPh);
      }
    }
    
    // End pouring animation
    setTimeout(() => {
      setIsPouring('none');
    }, 500);
  }, 300);
};
  
  // Handle probe insertion
  const handleProbeInsert = (inside: boolean) => {
    setBeakerState(prev => ({
      ...prev,
      probeInside: inside
    }));
    
    // Show pH value only when probe is inside and there's liquid
    if (inside && (beakerState.volumeSolution > 0 || beakerState.volumeWater > 0)) {
      setPhMeterValue(beakerState.currentPh);
    } else {
      setPhMeterValue(null);
    }
  };
  
  // Handle reset
  const handleReset = () => {
    setBeakerState({
      solution: null,
      volumeSolution: 0,
      volumeWater: 0,
      currentPh: 7,
      filled: false,
      probeInside: false
    });
    setSelectedSolution(null);
    setPhMeterValue(null);
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Fixed control bar - always visible */}
      <div className="bg-gray-900 p-3 shadow-md z-20 sticky top-0">
        <WaterControl 
          onAddSolution={handleAddSolution}
          onAddWater={handleAddWater}
          onReset={handleReset}
          canAddSolution={!!selectedSolution && !beakerState.filled}
          canAddWater={!!beakerState.solution && !beakerState.filled}
          className="flex flex-row justify-center space-x-4"
        />

      </div>
      
      {/* Main content with fixed-height center and scrollable sidebars */}
      <div className="grid grid-cols-1 md:grid-cols-4 flex-1 h-[calc(100%-80px)]">
        {/* Left sidebar - Solution selector (independently scrollable) */}
        <div className="h-full md:col-span-1 bg-gray-900 overflow-hidden flex flex-col">
          <div className="p-4 sticky top-0 z-10 bg-gray-900">
            <h2 className="text-xl font-bold">Select Solution</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <SolutionSelector 
              solutions={solutions} 
              selectedSolution={selectedSolution}
              onSelect={handleSelectSolution}
            />
            
            {beakerState.solution && (
              <div className="bg-gray-800 p-3 rounded-lg mt-4">
                <h3 className="font-bold">{beakerState.solution.name}</h3>
                <p className="text-sm mt-1">{beakerState.solution.description}</p>
                <div className="mt-2">
                  <span className="text-sm">Base pH: </span>
                  <span className="font-mono">{beakerState.solution.basePh.toFixed(1)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Center section - Beaker (fixed height, never scrollable) */}
        <div className="h-[600px] md:h-full md:col-span-2 bg-gray-800 flex items-center justify-center overflow-hidden">
          <Beaker 
            state={beakerState}
            onProbeInsert={handleProbeInsert}
            isPouring={isPouring}
          />
        </div>
        
        {/* Right sidebar - pH meter and scale (independently scrollable) */}
        <div className="h-full md:col-span-1 bg-gray-900 overflow-hidden flex flex-col">
          <div className="p-4 sticky top-0 z-10 bg-gray-900">
            <h2 className="text-xl font-bold">pH Measurement</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <PhMeter 
              value={phMeterValue} 
              onProbeMove={handleProbeInsert}
            />
            
            <div className="mt-6 pb-4">
              <PhScale highlightedValue={phMeterValue} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}