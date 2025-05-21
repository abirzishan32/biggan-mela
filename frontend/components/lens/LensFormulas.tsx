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
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Tab Navigation */}
      <div className="flex border-b mb-4">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'formulas'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('formulas')}
        >
          Formulas
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'calculations'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('calculations')}
        >
          Calculations
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'theory'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
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
              <h3 className="text-lg font-semibold mb-2">Lens Equation</h3>
              <div className="bg-gray-50 p-3 rounded text-center">
                <div className="text-xl font-medium mb-2">
                  {lensProperties.type === 'convex' 
                    ? '1/f = 1/do + 1/di' 
                    : '1/f = 1/do + 1/di (f is negative)'}
                </div>
                <div className="text-sm text-gray-600">
                  Where f = focal length, do = object distance, di = image distance
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Magnification</h3>
              <div className="bg-gray-50 p-3 rounded text-center">
                <div className="text-xl font-medium mb-2">
                  m = -di/do = hi/ho
                </div>
                <div className="text-sm text-gray-600">
                  Where m = magnification, hi = image height, ho = object height
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  • If m &gt; 0: Image is upright<br />
                  • If m &lt; 0: Image is inverted<br />
                  • If |m| &gt; 1: Image is enlarged<br />
                  • If |m| &lt; 1: Image is reduced
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Lens Maker's Equation</h3>
              <div className="bg-gray-50 p-3 rounded text-center">
                <div className="text-xl font-medium mb-2">
                  1/f = (n-1)(1/R₁ - 1/R₂)
                </div>
                <div className="text-sm text-gray-600">
                  Where n = refractive index, R₁, R₂ = radii of curvature
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'calculations' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Current Parameters</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div className="font-medium">Lens Type:</div>
                <div>{lensProperties.type === 'convex' ? 'Convex (Converging)' : 'Concave (Diverging)'}</div>
                
                <div className="font-medium">Focal Length (f):</div>
                <div>{lensProperties.focalLength.toFixed(1)} cm</div>
                
                <div className="font-medium">Object Distance (do):</div>
                <div>{objectProperties.distance.toFixed(1)} cm</div>
                
                <div className="font-medium">Object Height (ho):</div>
                <div>{objectProperties.height.toFixed(1)} cm</div>
                
                <div className="font-medium">Image Distance (di):</div>
                <div>
                  {Math.abs(imageProperties.distance).toFixed(1)} cm 
                  {imageProperties.isReal ? ' (Real)' : ' (Virtual)'}
                </div>
                
                <div className="font-medium">Image Height (hi):</div>
                <div>
                  {Math.abs(imageProperties.height).toFixed(1)} cm
                  {imageProperties.height > 0 ? ' (Upright)' : ' (Inverted)'}
                </div>
                
                <div className="font-medium">Magnification (m):</div>
                <div>
                  {Math.abs(magnification).toFixed(2)}× 
                  {magnification > 0 ? ' (Upright)' : ' (Inverted)'}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Lens Equation Application</h3>
              <div className="bg-blue-50 p-3 rounded border border-blue-100">
                <div className="text-center mb-2">
                  <span className="font-medium">1/f = 1/do + 1/di</span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  <div className="col-span-1">1/{Math.abs(lensProperties.focalLength).toFixed(1)}</div>
                  <div className="col-span-1">=</div>
                  <div className="col-span-1">1/{objectProperties.distance.toFixed(1)}</div>
                  <div className="col-span-1">+</div>
                  <div className="col-span-1">1/{Math.abs(imageProperties.distance).toFixed(1)}</div>
                  <div className="col-span-1">=</div>
                  <div className="col-span-1">{focalLengthInv}</div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center mt-2">
                  <div className="col-span-1">{focalLengthInv}</div>
                  <div className="col-span-1">=</div>
                  <div className="col-span-1">{objectDistanceInv}</div>
                  <div className="col-span-1">+</div>
                  <div className="col-span-1">{imageDistanceInv}</div>
                  <div className="col-span-1">=</div>
                  <div className="col-span-1">{focalLengthInv}</div>
                </div>
                <div className="text-xs text-gray-600 mt-2">
                  Note: For a {lensProperties.type} lens with focal length {lensProperties.focalLength.toFixed(1)} cm and an object at {objectProperties.distance.toFixed(1)} cm, 
                  the image forms at {Math.abs(imageProperties.distance).toFixed(1)} cm {imageProperties.isReal ? 'on the opposite side (real)' : 'on the same side (virtual)'}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Magnification Calculation</h3>
              <div className="bg-green-50 p-3 rounded border border-green-100">
                <div className="text-center mb-2">
                  <span className="font-medium">m = -di/do = hi/ho</span>
                </div>
                <div className="text-center">
                  m = -({imageProperties.distance.toFixed(1)}/{objectProperties.distance.toFixed(1)}) = {magnification.toFixed(2)}
                </div>
                <div className="text-center mt-1">
                  m = {imageProperties.height.toFixed(1)}/{objectProperties.height.toFixed(1)} = {magnification.toFixed(2)}
                </div>
                <div className="text-xs text-gray-600 mt-2 text-center">
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
              <h3 className="text-lg font-semibold mb-2">Lens Types</h3>
              <div className="flex mb-2">
                <div className="w-1/2 pr-2">
                  <h4 className="font-medium">Convex (Converging) Lens</h4>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Thicker in the middle, thinner at the edges</li>
                    <li>Positive focal length</li>
                    <li>Converges parallel rays to a focal point</li>
                    <li>Can form both real and virtual images</li>
                    <li>Used in magnifying glasses, cameras, projectors</li>
                  </ul>
                </div>
                <div className="w-1/2 pl-2">
                  <h4 className="font-medium">Concave (Diverging) Lens</h4>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
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
              <h3 className="text-lg font-semibold mb-2">Principal Rays</h3>
              <p className="mb-2">
                Three special rays can be used to locate the image position and size:
              </p>
              <div className="bg-gray-50 rounded p-3">
                <ol className="pl-5 list-decimal space-y-2">
                  <li>
                    <span className="font-medium text-blue-600">Parallel Ray:</span> Passes parallel to the optical axis, then through the focal point (convex) or appears to come from the focal point (concave)
                  </li>
                  <li>
                    <span className="font-medium text-red-600">Focal Ray:</span> Passes through the focal point (convex) or heads toward the focal point (concave), then emerges parallel to the optical axis
                  </li>
                  <li>
                    <span className="font-medium text-green-600">Central Ray:</span> Passes through the center of the lens and continues with minimal deviation
                  </li>
                </ol>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Image Characteristics</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-2 py-1 text-left">Lens Type</th>
                      <th className="border px-2 py-1 text-left">Object Position</th>
                      <th className="border px-2 py-1 text-left">Image Type</th>
                      <th className="border px-2 py-1 text-left">Orientation</th>
                      <th className="border px-2 py-1 text-left">Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-2 py-1">Convex</td>
                      <td className="border px-2 py-1">do &gt; 2f</td>
                      <td className="border px-2 py-1">Real</td>
                      <td className="border px-2 py-1">Inverted</td>
                      <td className="border px-2 py-1">Reduced</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border px-2 py-1">Convex</td>
                      <td className="border px-2 py-1">do = 2f</td>
                      <td className="border px-2 py-1">Real</td>
                      <td className="border px-2 py-1">Inverted</td>
                      <td className="border px-2 py-1">Same size</td>
                    </tr>
                    <tr>
                      <td className="border px-2 py-1">Convex</td>
                      <td className="border px-2 py-1">f &lt; do &lt; 2f</td>
                      <td className="border px-2 py-1">Real</td>
                      <td className="border px-2 py-1">Inverted</td>
                      <td className="border px-2 py-1">Enlarged</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border px-2 py-1">Convex</td>
                      <td className="border px-2 py-1">do = f</td>
                      <td className="border px-2 py-1">None (rays parallel)</td>
                      <td className="border px-2 py-1">-</td>
                      <td className="border px-2 py-1">-</td>
                    </tr>
                    <tr>
                      <td className="border px-2 py-1">Convex</td>
                      <td className="border px-2 py-1">do &lt; f</td>
                      <td className="border px-2 py-1">Virtual</td>
                      <td className="border px-2 py-1">Upright</td>
                      <td className="border px-2 py-1">Enlarged</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border px-2 py-1">Concave</td>
                      <td className="border px-2 py-1">Any distance</td>
                      <td className="border px-2 py-1">Virtual</td>
                      <td className="border px-2 py-1">Upright</td>
                      <td className="border px-2 py-1">Reduced</td>
                    </tr>
                  </tbody>
                </table>
              </div>


            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Sign Conventions</h3>
              <ul className="list-disc pl-5 space-y-1">
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