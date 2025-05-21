"use client";

import { useState, useEffect, useRef } from 'react';
import EnvironmentScene from './EnvironmentScene';
import LightRay from './LightRay';
import MaterialSelector from './MaterialSelector';
import AngleControls from './AngleControls';
import InfoPanel from './InfoPanel';
import { Material } from './types';

export default function RefractionSimulator() {
  // Simulation state
  const [incidentAngle, setIncidentAngle] = useState(30); // degrees
  const [material, setMaterial] = useState<Material>({
    name: 'Water',
    refractiveIndex: 1.33,
    color: 'rgba(64, 164, 223, 0.7)',
    description: 'Water is a transparent, nearly colorless chemical substance with a refractive index of 1.33.'
  });
  const [refractedAngle, setRefractedAngle] = useState(0);
  const [isReflectionOccurring, setIsReflectionOccurring] = useState(false);
  const [showNormals, setShowNormals] = useState(true);
  const [showAngles, setShowAngles] = useState(true);
  const [simulationTime, setSimulationTime] = useState(0);
  
  // References
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  
  // Materials library
  const materials = [
    {
      name: 'Water',
      refractiveIndex: 1.33,
      color: 'rgba(64, 164, 223, 0.7)',
      description: 'Water is a transparent, nearly colorless chemical substance with a refractive index of 1.33.'
    },
    {
      name: 'Glass',
      refractiveIndex: 1.52,
      color: 'rgba(160, 200, 255, 0.5)',
      description: 'Common glass has a refractive index of approximately 1.52, allowing light to bend more than in water.'
    },
    {
      name: 'Diamond',
      refractiveIndex: 2.42,
      color: 'rgba(220, 220, 255, 0.4)',
      description: 'Diamond has an exceptionally high refractive index of 2.42, which gives it its spectacular brilliance.'
    },
    {
      name: 'Olive Oil',
      refractiveIndex: 1.47,
      color: 'rgba(183, 193, 104, 0.7)',
      description: 'Olive oil has a yellowish-green color and a refractive index around 1.47.'
    },
    {
      name: 'Ice',
      refractiveIndex: 1.31,
      color: 'rgba(200, 240, 255, 0.5)',
      description: 'Ice has a slightly lower refractive index than water at approximately 1.31.'
    }
  ];
  
  // Calculate refracted angle using Snell's Law
  const calculateRefraction = (incidentAngleDeg: number, n1: number, n2: number) => {
    // Convert to radians for calculation
    const incidentAngleRad = (incidentAngleDeg * Math.PI) / 180;
    
    // Snell's Law: n1 * sin(θ1) = n2 * sin(θ2)
    // Therefore: sin(θ2) = (n1 / n2) * sin(θ1)
    const sinRefractedAngle = (n1 / n2) * Math.sin(incidentAngleRad);
    
    // Check for total internal reflection
    if (Math.abs(sinRefractedAngle) > 1) {
      setIsReflectionOccurring(true);
      return incidentAngleDeg; // Return the incident angle for reflection
    }
    
    setIsReflectionOccurring(false);
    
    // Convert back to degrees
    const refractedAngleDeg = (Math.asin(sinRefractedAngle) * 180) / Math.PI;
    
    return refractedAngleDeg;
  };
  
  // Update refracted angle when incident angle or material changes
  useEffect(() => {
    const n1 = 1.0; // Air refractive index
    const n2 = material.refractiveIndex;
    
    const newRefractedAngle = calculateRefraction(incidentAngle, n1, n2);
    setRefractedAngle(newRefractedAngle);
  }, [incidentAngle, material]);
  
  // Animation loop for dynamic effects
  useEffect(() => {
    const animate = () => {
      setSimulationTime(prev => prev + 0.016); // ~60fps
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, []);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Recalculate any dimension-dependent values if needed
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className="flex flex-col md:flex-row h-full w-full">
      {/* Simulation visualization area */}
      <div 
        ref={containerRef}
        className="flex-1 relative bg-gradient-to-b from-blue-400 to-blue-600 overflow-hidden min-h-[400px]"
      >
        <EnvironmentScene 
          material={material}
          time={simulationTime}
        />
        
        <LightRay
          incidentAngle={incidentAngle}
          refractedAngle={refractedAngle}
          isReflectionOccurring={isReflectionOccurring}
          showNormals={showNormals}
          showAngles={showAngles}
          time={simulationTime}
        />
        
        {/* Information overlay */}
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-75 p-3 rounded-lg shadow-lg text-sm max-w-xs">
          <h3 className="font-bold text-base mb-1">Incident Angle: {incidentAngle.toFixed(1)}°</h3>
          {isReflectionOccurring ? (
            <p className="text-red-600 font-semibold">Total Internal Reflection Occurring!</p>
          ) : (
            <p>Refracted Angle: {refractedAngle.toFixed(1)}°</p>
          )}
          <p className="mt-1 text-gray-700">Material: {material.name} (n = {material.refractiveIndex})</p>
        </div>
      </div>
      
      {/* Controls and information panel */}
      <div className="w-full md:w-80 bg-white p-4 overflow-y-auto shadow-lg">
        <h2 className="text-xl font-bold mb-4">Refraction Controls</h2>
        
        <AngleControls 
          incidentAngle={incidentAngle}
          onAngleChange={setIncidentAngle}
        />
        
        <MaterialSelector 
          materials={materials}
          selectedMaterial={material}
          onMaterialChange={setMaterial}
        />
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="show-normals"
              checked={showNormals}
              onChange={(e) => setShowNormals(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="show-normals" className="text-sm font-medium">Show Normal Line</label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="show-angles"
              checked={showAngles}
              onChange={(e) => setShowAngles(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="show-angles" className="text-sm font-medium">Show Angle Measurements</label>
          </div>
        </div>
        
        <InfoPanel 
          material={material}
          incidentAngle={incidentAngle}
          refractedAngle={refractedAngle}
          isReflectionOccurring={isReflectionOccurring}
        />
      </div>
    </div>
  );
}