"use client";

import { Material } from './types';

interface MaterialSelectorProps {
  materials: Material[];
  selectedMaterial: Material;
  onMaterialChange: (material: Material) => void;
}

export default function MaterialSelector({
  materials,
  selectedMaterial,
  onMaterialChange
}: MaterialSelectorProps) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Select Material</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {materials.map(material => (
          <button
            key={material.name}
            className={`p-2 rounded-lg transition-colors flex items-center ${
              selectedMaterial.name === material.name
                ? 'bg-blue-100 border-2 border-blue-500'
                : 'bg-gray-100 hover:bg-gray-200 border-2 border-transparent'
            }`}
            onClick={() => onMaterialChange(material)}
          >
            <div 
              className="w-6 h-6 rounded-full mr-2" 
              style={{ backgroundColor: material.color }}
            />
            <div className="text-left">
              <div className="font-medium">{material.name}</div>
              <div className="text-xs text-gray-600">n = {material.refractiveIndex}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}