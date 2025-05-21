"use client";

import { useState } from 'react';
import { LensType, LensProperties, ObjectProperties } from './types';

interface LensControlsProps {
  lensProperties: LensProperties;
  objectProperties: ObjectProperties;
  onLensChange: (newProperties: LensProperties) => void;
  onObjectChange: (newProperties: ObjectProperties) => void;
}

export default function LensControls({
    
  lensProperties,
  objectProperties,
  onLensChange,
  onObjectChange
}: LensControlsProps) {
  const [expandedSection, setExpandedSection] = useState<'lens' | 'object' | 'both'>('both');

  // Handle lens type change
  const handleLensTypeChange = (type: LensType) => {
    // When changing lens type, adjust focal length sign
    const focalLength = Math.abs(lensProperties.focalLength) * (type === 'convex' ? 1 : -1);
    onLensChange({ ...lensProperties, type, focalLength });
  };

  // Handle focal length change
  const handleFocalLengthChange = (value: number) => {
    // Ensure focal length has correct sign based on lens type
    const focalLength = Math.abs(value) * (lensProperties.type === 'convex' ? 1 : -1);
    
    // Calculate new radius of curvature based on focal length and refractive index
    // Using the formula: 1/f = (n-1) * (1/R1 - 1/R2)
    // For a symmetric lens, R1 = -R2, so 1/f = 2(n-1)/R
    // Therefore, R = 2(n-1)f
    const radius = 2 * (lensProperties.refractiveIndex - 1) * Math.abs(focalLength);
    
    onLensChange({ 
      ...lensProperties, 
      focalLength, 
      radius 
    });
  };

  // Handle radius of curvature change
  const handleRadiusChange = (value: number) => {
    // Calculate new focal length based on radius and refractive index
    // f = R / (2 * (n-1))
    const focalLength = value / (2 * (lensProperties.refractiveIndex - 1));
    const adjustedFocalLength = Math.abs(focalLength) * (lensProperties.type === 'convex' ? 1 : -1);
    
    onLensChange({ 
      ...lensProperties, 
      radius: value, 
      focalLength: adjustedFocalLength 
    });
  };

  // Handle refractive index change
  const handleRefractiveIndexChange = (value: number) => {
    // Update focal length based on radius and new refractive index
    const focalLength = lensProperties.radius / (2 * (value - 1));
    const adjustedFocalLength = Math.abs(focalLength) * (lensProperties.type === 'convex' ? 1 : -1);
    
    onLensChange({ 
      ...lensProperties, 
      refractiveIndex: value, 
      focalLength: adjustedFocalLength 
    });
  };

  // Handle object distance change
  const handleObjectDistanceChange = (value: number) => {
    onObjectChange({ ...objectProperties, distance: value });
  };

  // Handle object height change
  const handleObjectHeightChange = (value: number) => {
    onObjectChange({ ...objectProperties, height: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Lens Type Selector */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Lens Type</h3>
        <div className="flex space-x-2">
          <button
            className={`flex-1 py-2 px-4 rounded-md border-2 transition-colors ${
              lensProperties.type === 'convex'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => handleLensTypeChange('convex')}
          >
            <div className="flex flex-col items-center">
              <svg width="40" height="40" viewBox="0 0 40 40" className="mb-1">
                <path
                  d="M10,5 Q20,20 10,35 L30,35 Q20,20 30,5 L10,5"
                  fill="rgba(173, 216, 230, 0.7)"
                  stroke="#0066cc"
                  strokeWidth="1.5"
                />
              </svg>
              <span>Convex Lens</span>
            </div>
          </button>
          
          <button
            className={`flex-1 py-2 px-4 rounded-md border-2 transition-colors ${
              lensProperties.type === 'concave'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => handleLensTypeChange('concave')}
          >
            <div className="flex flex-col items-center">
              <svg width="40" height="40" viewBox="0 0 40 40" className="mb-1">
                <path
                  d="M15,5 Q5,20 15,35 L25,35 Q35,20 25,5 L15,5"
                  fill="rgba(173, 216, 230, 0.7)"
                  stroke="#0066cc"
                  strokeWidth="1.5"
                />
              </svg>
              <span>Concave Lens</span>
            </div>
          </button>
        </div>
      </div>
      
      {/* Lens Properties */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Lens Properties</h3>
          <button
            className="text-sm text-blue-500 hover:text-blue-700"
            onClick={() => setExpandedSection(expandedSection === 'lens' ? 'both' : 'lens')}
          >
            {expandedSection === 'lens' || expandedSection === 'both' ? 'Collapse' : 'Expand'}
          </button>
        </div>
        
        {(expandedSection === 'lens' || expandedSection === 'both') && (
          <div className="space-y-4 pl-2">
            {/* Focal Length */}
            <div>
              <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Focal Length: {Math.abs(lensProperties.focalLength).toFixed(1)} cm
                  {lensProperties.type === 'convex' ? ' (positive)' : ' (negative)'}
                </label>
                <span className="text-xs text-gray-500">
                  {lensProperties.focalLength > 0 ? 'Converging' : 'Diverging'}
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={Math.abs(lensProperties.focalLength)}
                onChange={(e) => handleFocalLengthChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-1"
              />
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>5cm</span>
                <span>25cm</span>
                <span>50cm</span>
              </div>
            </div>
            
            {/* Radius of Curvature */}
            <div>
              <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Radius of Curvature: {lensProperties.radius.toFixed(1)} cm
                </label>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="1"
                value={lensProperties.radius}
                onChange={(e) => handleRadiusChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-1"
              />
            </div>
            
            {/* Refractive Index */}
            <div>
              <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Refractive Index: {lensProperties.refractiveIndex.toFixed(2)}
                </label>
              </div>
              <input
                type="range"
                min="1.3"
                max="1.8"
                step="0.01"
                value={lensProperties.refractiveIndex}
                onChange={(e) => handleRefractiveIndexChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-1"
              />
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>1.3 (Plastic)</span>
                <span>1.5 (Glass)</span>
                <span>1.8 (Dense Glass)</span>
              </div>
            </div>
            
            {/* Diameter */}
            <div>
              <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Diameter: {lensProperties.diameter.toFixed(1)} cm
                </label>
              </div>
              <input
                type="range"
                min="5"
                max="15"
                step="0.5"
                value={lensProperties.diameter}
                onChange={(e) => onLensChange({ 
                  ...lensProperties, 
                  diameter: parseFloat(e.target.value),
                  thickness: parseFloat(e.target.value) * 0.2 // Set thickness proportional to diameter
                })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-1"
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Object Properties */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Object Properties</h3>
          <button
            className="text-sm text-blue-500 hover:text-blue-700"
            onClick={() => setExpandedSection(expandedSection === 'object' ? 'both' : 'object')}
          >
            {expandedSection === 'object' || expandedSection === 'both' ? 'Collapse' : 'Expand'}
          </button>
        </div>
        
        {(expandedSection === 'object' || expandedSection === 'both') && (
          <div className="space-y-4 pl-2">
            {/* Object Distance */}
            <div>
              <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Distance from Lens: {objectProperties.distance.toFixed(1)} cm
                </label>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="1"
                value={objectProperties.distance}
                onChange={(e) => handleObjectDistanceChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-1"
              />
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>10cm</span>
                <span>50cm</span>
                <span>100cm</span>
              </div>
            </div>
            
            {/* Object Height */}
            <div>
              <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Height: {objectProperties.height.toFixed(1)} cm
                </label>
              </div>
              <input
                type="range"
                min="5"
                max="20"
                step="1"
                value={objectProperties.height}
                onChange={(e) => handleObjectHeightChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-1"
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Preset Configurations */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Preset Configurations</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            className="py-1 px-3 bg-gray-100 hover:bg-gray-200 rounded text-sm"
            onClick={() => {
              onLensChange({
                type: 'convex',
                focalLength: 20,
                radius: 40,
                diameter: 10,
                thickness: 2,
                refractiveIndex: 1.5
              });
              onObjectChange({
                distance: 30,
                height: 15
              });
            }}
          >
            Standard Convex
          </button>
          
          <button
            className="py-1 px-3 bg-gray-100 hover:bg-gray-200 rounded text-sm"
            onClick={() => {
              onLensChange({
                type: 'concave',
                focalLength: -20,
                radius: 40,
                diameter: 10,
                thickness: 2,
                refractiveIndex: 1.5
              });
              onObjectChange({
                distance: 30,
                height: 15
              });
            }}
          >
            Standard Concave
          </button>
          
          <button
            className="py-1 px-3 bg-gray-100 hover:bg-gray-200 rounded text-sm"
            onClick={() => {
              onLensChange({
                type: 'convex',
                focalLength: 15,
                radius: 30,
                diameter: 12,
                thickness: 2.4,
                refractiveIndex: 1.6
              });
              onObjectChange({
                distance: 30,
                height: 15
              });
            }}
          >
            Strong Magnifier
          </button>
          
          <button
            className="py-1 px-3 bg-gray-100 hover:bg-gray-200 rounded text-sm"
            onClick={() => {
              onLensChange({
                type: 'convex',
                focalLength: 40,
                radius: 80,
                diameter: 14,
                thickness: 2.8,
                refractiveIndex: 1.5
              });
              onObjectChange({
                distance: 80,
                height: 15
              });
            }}
          >
            Camera Lens
          </button>
        </div>
      </div>
    </div>
  );
}