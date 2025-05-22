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
  const n1 = 1.0;
  const n2 = material.refractiveIndex;
  const criticalAngle = n2 > n1 ? Math.asin(n1 / n2) * 180 / Math.PI : null;

  return (
    <div className="mt-8 bg-black p-5 rounded-xl shadow-lg border border-gray-700">
      <h3 className="text-xl font-semibold mb-4 text-white">Physics Information</h3>

      <div className="space-y-6">
        <div>
          <h4 className="font-medium text-indigo-300">Selected Material: {material.name}</h4>
          <p className="text-sm text-gray-400 mt-1">{material.description}</p>
        </div>

        <div>
          <h4 className="font-medium text-indigo-300">Snell's Law</h4>
          <div className="bg-gray-900 p-4 rounded-lg mt-2 text-center border border-gray-700">
            <p className="font-semibold text-white">n₁ sin(θ₁) = n₂ sin(θ₂)</p>
            <p className="text-sm mt-2 text-gray-400">
              {n1} × sin({incidentAngle.toFixed(1)}°) = {n2} × sin({isReflectionOccurring ? 'TIR' : refractedAngle.toFixed(1) + '°'})
            </p>
          </div>
        </div>

        {isReflectionOccurring ? (
          <div className="bg-red-950 p-4 rounded-lg border border-red-700">
            <h4 className="font-semibold text-red-400">Total Internal Reflection</h4>
            <p className="text-sm mt-1 text-gray-300">
              The incident angle exceeds the critical angle for this material, causing all light to be reflected instead of refracted.
            </p>
            {criticalAngle && (
              <p className="text-sm font-medium mt-1 text-red-300">
                Critical angle: {criticalAngle.toFixed(1)}°
              </p>
            )}
          </div>
        ) : (
          <div>
            <h4 className="font-medium text-indigo-300">Refraction Index Ratio</h4>
            <p className="text-sm mt-1 text-gray-400">
              The ratio n₁/n₂ = {(n1/n2).toFixed(3)} determines how much the light bends when entering the material.
            </p>
            {n2 > n1 && criticalAngle && (
              <p className="text-sm mt-1 text-gray-500">
                For this material, total internal reflection would occur at incident angles greater than {criticalAngle.toFixed(1)}°.
              </p>
            )}
          </div>
        )}

        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
          <h4 className="font-medium text-indigo-300">Did You Know?</h4>
          <p className="text-sm mt-1 text-gray-400">
            {getFactForMaterial(material.name)}
          </p>
        </div>
      </div>
    </div>
  );
}

function getFactForMaterial(materialName: string): string {
  switch (materialName) {
    case 'Water':
      return 'Refraction in water causes objects to appear closer to the surface than they actually are. This is why it’s challenging to judge depths when diving.';
    case 'Glass':
      return 'Different types of glass have different refractive indices. Leaded crystal glass has a higher refractive index (around 1.7), which gives it more sparkle than regular glass.';
    case 'Diamond':
      return 'Diamonds have an exceptionally high refractive index, which causes light to bend dramatically and reflect internally multiple times before exiting.';
    case 'Olive Oil':
      return 'The refractive index of olive oil can be used to determine its purity. Pure extra virgin olive oil has a very specific refractive index range.';
    case 'Ice':
      return 'Ice has a slightly lower refractive index than water due to its less dense crystal structure.';
    default:
      return 'The phenomenon of refraction explains many optical illusions we see in daily life, such as the bending of a straw in water or rainbows.';
  }
}
