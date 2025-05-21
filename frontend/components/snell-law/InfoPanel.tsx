"use client";

import { Material } from './types';

interface InfoPanelProps {
  material: Material;
  incidentAngle: number;
  refractedAngle: number;
  isReflectionOccurring: boolean;
}

export default function InfoPanel({
  material,
  incidentAngle,
  refractedAngle,
  isReflectionOccurring
}: InfoPanelProps) {
  // Calculate critical angle for total internal reflection (if applicable)
  const n1 = 1.0; // Air
  const n2 = material.refractiveIndex;
  const criticalAngle = n2 > n1 ? Math.asin(n1 / n2) * 180 / Math.PI : null;
  
  return (
    <div className="mt-8 bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Physics Information</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-700">Selected Material: {material.name}</h4>
          <p className="text-sm text-gray-600 mt-1">{material.description}</p>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-700">Snell's Law</h4>
          <div className="bg-white p-2 rounded border mt-1 text-center">
            <p className="font-medium">n₁ sin(θ₁) = n₂ sin(θ₂)</p>
            <p className="text-sm mt-1">
              {n1} × sin({incidentAngle.toFixed(1)}°) = {n2} × sin({isReflectionOccurring ? 'TIR' : refractedAngle.toFixed(1) + '°'})
            </p>
          </div>
        </div>
        
        {isReflectionOccurring ? (
          <div className="bg-red-50 p-3 rounded border border-red-200">
            <h4 className="font-medium text-red-700">Total Internal Reflection</h4>
            <p className="text-sm mt-1">
              The incident angle exceeds the critical angle for this material, causing all light to be reflected instead of refracted.
            </p>
            {criticalAngle && (
              <p className="text-sm font-medium mt-1">
                Critical angle: {criticalAngle.toFixed(1)}°
              </p>
            )}
          </div>
        ) : (
          <div>
            <h4 className="font-medium text-gray-700">Refraction Index Ratio</h4>
            <p className="text-sm mt-1">
              The ratio n₁/n₂ = {(n1/n2).toFixed(3)} determines how much the light bends when entering the material.
            </p>
            {n2 > n1 && criticalAngle && (
              <p className="text-sm mt-1">
                For this material, total internal reflection would occur at incident angles greater than {criticalAngle.toFixed(1)}°.
              </p>
            )}
          </div>
        )}
        
        <div>
          <h4 className="font-medium text-gray-700">Did You Know?</h4>
          <p className="text-sm mt-1">
            {getFactForMaterial(material.name)}
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper function to get interesting facts about materials
function getFactForMaterial(materialName: string): string {
  switch (materialName) {
    case 'Water':
      return 'Refraction in water causes objects to appear closer to the surface than they actually are. This is why its challenging to judge depths when diving.';
    case 'Glass':
      return 'Different types of glass have different refractive indices. Leaded crystal glass has a higher refractive index (around 1.7), which gives it more sparkle than regular glass.';
    case 'Diamond':
      return 'Diamonds have an exceptionally high refractive index, which causes light to bend dramatically and reflect internally multiple times before exiting. This creates the distinctive brilliance and fire that diamonds are known for.';
    case 'Olive Oil':
      return 'The refractive index of olive oil can actually be used to determine its purity. Pure extra virgin olive oil has a very specific refractive index range.';
    case 'Ice':
      return 'Ice has a slightly lower refractive index than water, despite being the same chemical compound. This is because the crystal structure of ice is less dense than liquid water.';
    default:
      return 'The phenomenon of refraction explains many optical illusions we see in daily life, from the apparent bending of a straw in a glass of water to the formation of rainbows.';
  }
}