"use client";

import { useState, useEffect } from 'react';
import DoubleSlit from '@/components/double-slit/DoubleSlit';
import ControlPanel from '@/components/double-slit/ControlPanel';
import TheoryPanel from '@/components/double-slit/TheoryPanel';
import ObservationPanel from '@/components/double-slit/ObservationPanel';
import { calculateFringeSpacing } from '@/lib/physics';

export default function DoubleSlitPage() {
  // Experiment parameters
  const [wavelength, setWavelength] = useState(550); // in nanometers
  const [slitDistance, setSlitDistance] = useState(0.2); // in mm
  const [slitWidth, setSlitWidth] = useState(0.05); // in mm
  const [screenDistance, setScreenDistance] = useState(1000); // in mm
  const [isSimulating, setIsSimulating] = useState(true);
  const [showWaves, setShowWaves] = useState(true); // Always true now, but keeping for compatibility
  const [slitPosition, setSlitPosition] = useState(0.3); // Controls slit position on x-axis (0-1)
  const [waveSpeed, setWaveSpeed] = useState(2); // Controls wave propagation speed
  
  // Calculated values
  const [fringeSpacing, setFringeSpacing] = useState(0);
  const [centralMaxima, setCentralMaxima] = useState(0);
  
  // Calculate the fringe spacing - ensure this updates in real time too
  useEffect(() => {
    const spacing = calculateFringeSpacing(wavelength, slitDistance, screenDistance);
    setFringeSpacing(spacing);
    
    // Calculate intensity of central maxima
    const intensity = calculateCentralMaximaIntensity(
      wavelength, 
      slitWidth, 
      slitDistance,
      screenDistance
    );
    setCentralMaxima(intensity);
  }, [wavelength, slitDistance, slitWidth, screenDistance]);
  
  // Calculate the theoretical intensity at the central maxima
  function calculateCentralMaximaIntensity(
    wavelength: number, 
    slitWidth: number, 
    slitDistance: number,
    screenDistance: number
  ) {
    // This is a simplification for visualization purposes
    const waveNumber = (2 * Math.PI) / (wavelength * 1e-6);
    const alpha = waveNumber * slitWidth / 2;
    const beta = waveNumber * slitDistance / 2;
    
    // Single slit factor
    const singleSlitTerm = alpha === 0 ? 1 : Math.pow(Math.sin(alpha) / alpha, 2);
    
    // Double slit interference factor
    const doubleSlitTerm = Math.pow(Math.cos(beta), 2);
    
    return singleSlitTerm * doubleSlitTerm * 100; // Normalized to percentage
  }
  
  // Measurement data
  const [measurements, setMeasurements] = useState<{position: number, intensity: number}[]>([]);
  
  // Add a measurement at the current cursor position
  const addMeasurement = (position: number, intensity: number) => {
    setMeasurements(prev => [...prev, { position, intensity }]);
  };
  
  // Reset all measurements
  const resetMeasurements = () => {
    setMeasurements([]);
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-indigo-800 text-white p-4">
        <h1 className="text-2xl font-bold">Young's Double-Slit Experiment</h1>
        <p>Explore wave-particle duality and interference patterns</p>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main visualization */}
        <div className="w-2/3 bg-gray-900 relative">
          <DoubleSlit 
            wavelength={wavelength}
            slitDistance={slitDistance}
            slitWidth={slitWidth}
            screenDistance={screenDistance}
            isSimulating={isSimulating}
            showWaves={showWaves}
            slitPosition={slitPosition}
            waveSpeed={waveSpeed}
            onMeasure={addMeasurement}
          />
          
          {/* Overlay for measurement information */}
          <div className="absolute top-4 left-4 bg-black bg-opacity-60 text-white p-3 rounded-md">
            <div className="text-lg font-bold">Fringe Spacing: {fringeSpacing.toFixed(2)} mm</div>
            <div>Wavelength: {wavelength} nm</div>
            <div>Slit Separation: {slitDistance} mm</div>
          </div>
        </div>
        
        {/* Controls and Information */}
        <div className="w-1/3 p-4 overflow-y-auto">
          <ControlPanel 
            wavelength={wavelength}
            setWavelength={setWavelength}
            slitDistance={slitDistance}
            setSlitDistance={setSlitDistance}
            slitWidth={slitWidth}
            setSlitWidth={setSlitWidth}
            screenDistance={screenDistance}
            setScreenDistance={setScreenDistance}
            isSimulating={isSimulating}
            setIsSimulating={setIsSimulating}
            slitPosition={slitPosition}
            setSlitPosition={setSlitPosition}
            waveSpeed={waveSpeed}
            setWaveSpeed={setWaveSpeed}
            resetMeasurements={resetMeasurements}
          />
          
          <ObservationPanel 
            measurements={measurements}
            fringeSpacing={fringeSpacing}
            centralMaxima={centralMaxima}
            wavelength={wavelength}
            slitDistance={slitDistance}
            screenDistance={screenDistance}
          />
          
          <TheoryPanel />
        </div>
      </div>
    </div>
  );
}