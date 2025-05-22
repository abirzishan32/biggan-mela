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
    <div className="mt-6 bg-black p-4 rounded-xl shadow-lg border border-gray-700">
      <h3 className="text-xl font-semibold mb-4 text-white">Select Material</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {materials.map(material => (
          <button
            key={material.name}
            className={`p-3 rounded-lg transition-colors flex items-center backdrop-blur-md ${
              selectedMaterial.name === material.name
                ? 'bg-indigo-800 border-2 border-indigo-400 shadow-md'
                : 'bg-gray-900 hover:bg-gray-800 border border-gray-700'
            }`}
            onClick={() => onMaterialChange(material)}
          >
            <div 
              className="w-6 h-6 rounded-full mr-3 border border-white shadow-inner" 
              style={{ backgroundColor: material.color }}
            />
            <div className="text-left">
              <div className="font-semibold text-white text-base">{material.name}</div>
              <div className="text-xs text-indigo-300">n = {material.refractiveIndex}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}