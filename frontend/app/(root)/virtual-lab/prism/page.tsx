"use client";

import { useState, useEffect } from 'react';
import PrismScene from '@/components/prism/PrismScene';
import ControlPanel from '@/components/prism/ControlPanel';
import DataTable from '@/components/prism/DataTable';
import Graph from '@/components/prism/Graph';
import TheoryPanel from '@/components/prism/TheoryPanel';
import { calculateRefractionAngle, refractiveIndices } from '@/lib/physics';

export default function PrismLabPage() {
  // Prism parameters
  const [prismAngle, setPrismAngle] = useState(60); // Angle A of the prism in degrees
  const [prismMaterial, setPrismMaterial] = useState('glass');
  const [incidentAngle, setIncidentAngle] = useState(45); // Angle i in degrees
  const [isSimulating, setIsSimulating] = useState(false);
  const [pinDistance, setPinDistance] = useState(10); // Distance between pins in cm
  
  // Measured data
  const [measurementData, setMeasurementData] = useState<{incidentAngle: number, deviationAngle: number}[]>([]);
  const [minDeviation, setMinDeviation] = useState<number | null>(null);
  const [calculatedRefractiveIndex, setCalculatedRefractiveIndex] = useState<number | null>(null);
  const [actualRefractiveIndex, setActualRefractiveIndex] = useState<number>(refractiveIndices[prismMaterial as keyof typeof refractiveIndices]);
  
  // Add a new measurement to the data table
  const addMeasurement = () => {
    // Calculate the angle of deviation based on physics principles
    const n = refractiveIndices[prismMaterial as keyof typeof refractiveIndices];
    
    // Calculate first refraction (air to prism)
    const refraction1 = calculateRefractionAngle(incidentAngle, 1.0003, n);
    
    // Calculate second refraction (prism to air)
    // This is more complex and requires knowing the angle the ray makes with the second face
    const internalAngle = prismAngle - refraction1;
    const refraction2 = calculateRefractionAngle(internalAngle, n, 1.0003);
    
    // Calculate the total deviation
    const deviationAngle = incidentAngle - (refraction2 - prismAngle);
    
    // Add the new measurement to our data
    const newData = [...measurementData, { incidentAngle, deviationAngle }];
    setMeasurementData(newData);
    
    // Find the minimum deviation
    findMinimumDeviation(newData);
  };
  
  // Find the minimum deviation angle from the collected data
  const findMinimumDeviation = (data: {incidentAngle: number, deviationAngle: number}[]) => {
    if (data.length < 3) return; // Need at least a few points to find minimum
    
    // Find the minimum deviation value
    const minDev = Math.min(...data.map(d => d.deviationAngle));
    setMinDeviation(minDev);
    
    // Calculate the refractive index using the formula μ = sin((A+Dm)/2) / sin(A/2)
    const radA = (prismAngle * Math.PI) / 180;
    const radDm = (minDev * Math.PI) / 180;
    
    const refractiveIndex = Math.sin((radA + radDm) / 2) / Math.sin(radA / 2);
    setCalculatedRefractiveIndex(refractiveIndex);
  };
  
  // Reset all measurements
  const resetMeasurements = () => {
    setMeasurementData([]);
    setMinDeviation(null);
    setCalculatedRefractiveIndex(null);
  };
  
  // Update actual refractive index when material changes
  useEffect(() => {
    setActualRefractiveIndex(refractiveIndices[prismMaterial as keyof typeof refractiveIndices]);
  }, [prismMaterial]);
  
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-indigo-800 text-white p-4">
        <h1 className="text-2xl font-bold">Prism Optics Laboratory</h1>
        <p>Study the angle of minimum deviation and calculate the refractive index</p>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 3D Prism Visualization */}
        <div className="w-2/3 bg-gray-900 relative">
          <PrismScene 
            prismAngle={prismAngle}
            prismMaterial={prismMaterial}
            incidentAngle={incidentAngle}
            pinDistance={pinDistance}
            isSimulating={isSimulating}
          />
          
          {/* Overlay for angle information */}
          <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white p-3 rounded-md">
            <div className="text-lg font-bold text-gray-700">Incident Angle: {incidentAngle.toFixed(1)}°</div>
            {measurementData.length > 0 && (
              <div>Last Deviation: {measurementData[measurementData.length-1].deviationAngle.toFixed(1)}°</div>
            )}
            {minDeviation !== null && (
              <div>Min Deviation: {minDeviation.toFixed(1)}°</div>
            )}
          </div>
        </div>
        
        {/* Controls and Data */}
        <div className="w-1/3 p-4 overflow-y-auto">
          <ControlPanel 
            prismAngle={prismAngle}
            setPrismAngle={setPrismAngle}
            prismMaterial={prismMaterial}
            setPrismMaterial={setPrismMaterial}
            incidentAngle={incidentAngle}
            setIncidentAngle={setIncidentAngle}
            pinDistance={pinDistance}
            setPinDistance={setPinDistance}
            isSimulating={isSimulating}
            setIsSimulating={setIsSimulating}
            addMeasurement={addMeasurement}
            resetMeasurements={resetMeasurements}
          />
          
          <div className="mt-4 bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Results</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-3 rounded-md">
                <div className="text-sm text-blue-800 font-medium">Minimum Deviation</div>
                <div className="text-xl font-bold">{minDeviation !== null ? `${minDeviation.toFixed(2)}°` : 'N/A'}</div>
              </div>
              
              <div className="bg-green-50 p-3 rounded-md">
                <div className="text-sm text-green-800 font-medium">Calculated Refractive Index</div>
                <div className="text-xl font-bold">{calculatedRefractiveIndex !== null ? calculatedRefractiveIndex.toFixed(4) : 'N/A'}</div>
              </div>
            </div>
            
            <div className="text-sm">
              <div className="flex justify-between mb-1">
                <span>Actual Refractive Index:</span>
                <span className="font-medium">{actualRefractiveIndex.toFixed(4)}</span>
              </div>
              
              {calculatedRefractiveIndex !== null && (
                <div className="flex justify-between">
                  <span>Percentage Error:</span>
                  <span className="font-medium">
                    {Math.abs((calculatedRefractiveIndex - actualRefractiveIndex) / actualRefractiveIndex * 100).toFixed(2)}%
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <DataTable data={measurementData} />
          
          <Graph 
            data={measurementData} 
            minDeviation={minDeviation}
          />
          
          <TheoryPanel />
        </div>
      </div>
    </div>
  );
}