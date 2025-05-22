"use client";

import { useState } from 'react';
import { LensProperties, ObjectProperties, ImageProperties } from './types';

interface LensFormulasProps {
  lensProperties: LensProperties;
  objectProperties: ObjectProperties;
  imageProperties: ImageProperties;
}

export default function LensFormulas({
  lensProperties,
  objectProperties,
  imageProperties
}: LensFormulasProps) {
  const [activeTab, setActiveTab] = useState<'formulas' | 'calculations' | 'theory'>('formulas');

  // Calculate magnification 
  const magnification = -imageProperties.distance / objectProperties.distance;
  
  // Lens equation values for display
  const objectDistanceInv = (1 / objectProperties.distance).toFixed(3);
  const imageDistanceInv = (1 / Math.abs(imageProperties.distance)).toFixed(3);
  const focalLengthInv = (1 / Math.abs(lensProperties.focalLength)).toFixed(3);
  
  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-4 border border-gray-800">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700 mb-4">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'formulas'
              ? 'border-b-2 border-blue-500 text-blue-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('formulas')}
        >
          Formulas
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'calculations'
              ? 'border-b-2 border-blue-500 text-blue-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('calculations')}
        >
          Calculations
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'theory'
              ? 'border-b-2 border-blue-500 text-blue-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('theory')}
        >
          Theory
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="mb-4">
        {activeTab === 'formulas' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">Lens Equation</h3>
              <div className="bg-gray-800 p-3 rounded border border-gray-700">
                <div className="text-xl font-medium mb-2 text-white text-center">
                  {lensProperties.type === 'convex' 
                    ? '1/f = 1/do + 1/di' 
                    : '1/f = 1/do + 1/di (f is negative)'}
                </div>
                <div className="text-sm text-gray-300 text-center">
                  Where f = focal length, do = object distance, di = image distance
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">Magnification</h3>
              <div className="bg-gray-800 p-3 rounded border border-gray-700">
                <div className="text-xl font-medium mb-2 text-white text-center">
                  m = -di/do = hi/ho
                </div>
                <div className="text-sm text-gray-300 text-center">
                  Where m = magnification, hi = image height, ho = object height
                </div>
                <div className="text-sm text-gray-300 mt-1 text-center">
                  • If m &gt; 0: Image is upright<br />
                  • If m &lt; 0: Image is inverted<br />
                  • If |m| &gt; 1: Image is enlarged<br />
                  • If |m| &lt; 1: Image is reduced
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">Lens Maker's Equation</h3>
              <div className="bg-gray-800 p-3 rounded border border-gray-700">
                <div className="text-xl font-medium mb-2 text-white text-center">
                  1/f = (n-1)(1/R₁ - 1/R₂)
                </div>
                <div className="text-sm text-gray-300 text-center">
                  Where n = refractive index, R₁, R₂ = radii of curvature
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'calculations' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">Current Parameters</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm bg-gray-800 p-3 rounded border border-gray-700">
                <div className="font-medium text-gray-300">Lens Type:</div>
                <div className="text-white">{lensProperties.type === 'convex' ? 'Convex (Converging)' : 'Concave (Diverging)'}</div>
                
                <div className="font-medium text-gray-300">Focal Length (f):</div>
                <div className="text-white">{lensProperties.focalLength.toFixed(1)} cm</div>
                
                <div className="font-medium text-gray-300">Object Distance (do):</div>
                <div className="text-white">{objectProperties.distance.toFixed(1)} cm</div>
                
                <div className="font-medium text-gray-300">Object Height (ho):</div>
                <div className="text-white">{objectProperties.height.toFixed(1)} cm</div>
                
                <div className="font-medium text-gray-300">Image Distance (di):</div>
                <div className="text-white">
                  {Math.abs(imageProperties.distance).toFixed(1)} cm 
                  {imageProperties.isReal ? ' (Real)' : ' (Virtual)'}
                </div>
                
                <div className="font-medium text-gray-300">Image Height (hi):</div>
                <div className="text-white">
                  {Math.abs(imageProperties.height).toFixed(1)} cm
                  {imageProperties.height > 0 ? ' (Upright)' : ' (Inverted)'}
                </div>
                
                <div className="font-medium text-gray-300">Magnification (m):</div>
                <div className="text-white">
                  {Math.abs(magnification).toFixed(2)}× 
                  {magnification > 0 ? ' (Upright)' : ' (Inverted)'}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">Lens Equation Application</h3>
              <div className="bg-blue-900/20 p-3 rounded border border-blue-900/50">
                <div className="text-center mb-2">
                  <span className="font-medium text-blue-300">1/f = 1/do + 1/di</span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-blue-200">
                  <div className="col-span-1">1/{Math.abs(lensProperties.focalLength).toFixed(1)}</div>
                  <div className="col-span-1">=</div>
                  <div className="col-span-1">1/{objectProperties.distance.toFixed(1)}</div>
                  <div className="col-span-1">+</div>
                  <div className="col-span-1">1/{Math.abs(imageProperties.distance).toFixed(1)}</div>
                  <div className="col-span-1">=</div>
                  <div className="col-span-1">{focalLengthInv}</div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center mt-2 text-blue-200">
                  <div className="col-span-1">{focalLengthInv}</div>
                  <div className="col-span-1">=</div>
                  <div className="col-span-1">{objectDistanceInv}</div>
                  <div className="col-span-1">+</div>
                  <div className="col-span-1">{imageDistanceInv}</div>
                  <div className="col-span-1">=</div>
                  <div className="col-span-1">{focalLengthInv}</div>
                </div>
                <div className="text-xs text-blue-200/80 mt-2">
                  Note: For a {lensProperties.type} lens with focal length {lensProperties.focalLength.toFixed(1)} cm and an object at {objectProperties.distance.toFixed(1)} cm, 
                  the image forms at {Math.abs(imageProperties.distance).toFixed(1)} cm {imageProperties.isReal ? 'on the opposite side (real)' : 'on the same side (virtual)'}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">Magnification Calculation</h3>
              <div className="bg-green-900/20 p-3 rounded border border-green-900/50">
                <div className="text-center mb-2">
                  <span className="font-medium text-green-300">m = -di/do = hi/ho</span>
                </div>
                <div className="text-center text-green-200">
                  m = -({imageProperties.distance.toFixed(1)}/{objectProperties.distance.toFixed(1)}) = {magnification.toFixed(2)}
                </div>
                <div className="text-center mt-1 text-green-200">
                  m = {imageProperties.height.toFixed(1)}/{objectProperties.height.toFixed(1)} = {magnification.toFixed(2)}
                </div>
                <div className="text-xs text-green-200/80 mt-2 text-center">
                  {Math.abs(magnification) > 1 
                    ? `The image is ${Math.abs(magnification).toFixed(2)}× larger than the object`
                    : `The image is ${Math.abs(magnification).toFixed(2)}× smaller than the object`
                  }
                  <br />
                  {magnification > 0 
                    ? "Since m > 0, the image is upright (same orientation as the object)"
                    : "Since m < 0, the image is inverted (flipped relative to the object)"
                  }
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'theory' && (
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">Lens Types</h3>
              <div className="flex mb-2 bg-gray-800 p-3 rounded border border-gray-700">
                <div className="w-1/2 pr-2">
                  <h4 className="font-medium text-blue-300">Convex (Converging) Lens</h4>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-gray-300">
                    <li>Thicker in the middle, thinner at the edges</li>
                    <li>Positive focal length</li>
                    <li>Converges parallel rays to a focal point</li>
                    <li>Can form both real and virtual images</li>
                    <li>Used in magnifying glasses, cameras, projectors</li>
                  </ul>
                </div>
                <div className="w-1/2 pl-2 border-l border-gray-700">
                  <h4 className="font-medium text-red-300">Concave (Diverging) Lens</h4>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-gray-300">
                    <li>Thinner in the middle, thicker at the edges</li>
                    <li>Negative focal length</li>
                    <li>Diverges parallel rays from a focal point</li>
                    <li>Forms only virtual, upright, reduced images</li>
                    <li>Used in peepholes, certain eyeglasses, telescopes</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">Principal Rays</h3>
              <p className="mb-2 text-gray-300">
                Three special rays can be used to locate the image position and size:
              </p>
              <div className="bg-gray-800 rounded p-3 border border-gray-700">
                <ol className="pl-5 list-decimal space-y-2">
                  <li>
                    <span className="font-medium text-blue-400">Parallel Ray:</span> <span className="text-gray-300">Passes parallel to the optical axis, then through the focal point (convex) or appears to come from the focal point (concave)</span>
                  </li>
                  <li>
                    <span className="font-medium text-red-400">Focal Ray:</span> <span className="text-gray-300">Passes through the focal point (convex) or heads toward the focal point (concave), then emerges parallel to the optical axis</span>
                  </li>
                  <li>
                    <span className="font-medium text-green-400">Central Ray:</span> <span className="text-gray-300">Passes through the center of the lens and continues with minimal deviation</span>
                  </li>
                </ol>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">Image Characteristics</h3>
              <div className="overflow-x-auto bg-gray-800 rounded p-3 border border-gray-700">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="border border-gray-600 px-2 py-1 text-left text-white">Lens Type</th>
                      <th className="border border-gray-600 px-2 py-1 text-left text-white">Object Position</th>
                      <th className="border border-gray-600 px-2 py-1 text-left text-white">Image Type</th>
                      <th className="border border-gray-600 px-2 py-1 text-left text-white">Orientation</th>
                      <th className="border border-gray-600 px-2 py-1 text-left text-white">Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-600 px-2 py-1 text-gray-300">Convex</td>
                      <td className="border border-gray-600 px-2 py-1 text-gray-300">do &gt; 2f</td>
                      <td className="border border-gray-600 px-2 py-1 text-gray-300">Real</td>
                      <td className="border border-gray-600 px-2 py-1 text-gray-300">Inverted</td>
                      <td className="border border-gray-600 px-2 py-1 text-gray-300">Reduced</td>
                    </tr>
                    <tr className="bg-gray-750">
                      <td className="border border-gray-600 px-2 py-1 text-gray-300">Convex</td>
                      <td className="border border-gray-600 px-2 py-1 text-gray-300">do = 2f</td>
                      <td className="border border-gray-600 px-2 py-1 text-gray-300">Real</td>
                      <td className="border border-gray-600 px-2 py-1 text-gray-300">Inverted</td>
                      <td className="border border-gray-600 px-2 py-1 text-gray-300">Same size</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-600 px-2 py-1 text-gray-300">Convex</td>
                      <td className="border border-gray-600 px-2 py-1 text-gray-300">f &lt; do &lt; 2f</td>
                      <td className="border border-gray-600 px-2 py-1 text-gray-300">Real</td>
                      <td className="border border-gray-600 px-2 py-1 text-gray-300">Inverted</td>
                      <td className="border border-gray-600 px-2 py-1 text-gray-300">Enlarged</td>
                    </tr>
                    <tr className="bg-gray-750">
                      <td className="border border-gray-600 px-2 py-1 text-gray-300">Convex</td>
                      <td className="border border-gray-600 px-2 py-1 text-gray-300">do = f</td>
                      <td className="border border-gray-600 px-2 py-1 text-gray-300">None (rays parallel)</td>
                      <td className="border border-gray-600 px-2 py-1 text-gray-300">-</td>
                      <td className="border border-gray-600 px-2 py-1 text-gray-300">-</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-600 px-2 py-1 text-gray-300">Convex</td>
                      <td className="border border-gray-600 px-2 py-1 text-gray-300">do &lt; f</td>
                      <td className="border border-gray-600 px-2 py-1 text-gray-300">Virtual</td>
                      <td className="border border-gray-600 px-2 py-1 text-gray-300">Upright</td>
                      <td className="border border-gray-600 px-2 py-1 text-gray-300">Enlarged</td>
                    </tr>
                    <tr className="bg-gray-750">
                      <td className="border border-gray-600 px-2 py-1 text-gray-300">Concave</td>
                      <td className="border border-gray-600 px-2 py-1 text-gray-300">Any distance</td>
                      <td className="border border-gray-600 px-2 py-1 text-gray-300">Virtual</td>
                      <td className="border border-gray-600 px-2 py-1 text-gray-300">Upright</td>
                      <td className="border border-gray-600 px-2 py-1 text-gray-300">Reduced</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">Sign Conventions</h3>
              <ul className="list-disc pl-5 space-y-1 bg-gray-800 p-3 rounded border border-gray-700 text-gray-300">
                <li>Object distance (do) is positive for real objects</li>
                <li>Image distance (di) is positive for real images (opposite side from object) and negative for virtual images (same side as object)</li>
                <li>Focal length (f) is positive for convex lenses and negative for concave lenses</li>
                <li>Heights are positive above the axis, negative below</li>
                <li>Magnification (m) is positive for upright images, negative for inverted images</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}