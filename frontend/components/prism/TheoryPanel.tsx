"use client";

export default function TheoryPanel() {
  return (
    <div className="mt-4 bg-gray-900 p-4 rounded-lg shadow-lg mb-4 border border-gray-800">
      <h2 className="text-lg font-semibold mb-4 text-white">Theory and Principles</h2>
      
      <div className="space-y-4 text-sm">
        <div>
          <h3 className="font-semibold text-blue-300">Angle of Minimum Deviation</h3>
          <p className="mt-1 text-gray-300">
            The angle of deviation changes with the angle of incidence. At a certain incident angle, 
            the deviation reaches a minimum value (Dm). At this point, the ray passes symmetrically 
            through the prism, making equal angles with the normals at both faces.
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold text-blue-300">Calculating Refractive Index</h3>
          <p className="mt-1 text-gray-300">
            Once the angle of minimum deviation (Dm) is determined, the refractive index (μ) can be 
            calculated using the formula:
          </p>
          <div className="bg-gray-800 p-3 rounded my-2 text-center font-medium text-blue-300 border border-gray-700">
            μ = sin((A + Dm)/2) / sin(A/2)
          </div>
          <p className="text-gray-300">
            Where A is the angle of the prism and Dm is the angle of minimum deviation.
          </p>
        </div>
        
        <div className="bg-gray-800 p-3 rounded border border-gray-700">
          <h3 className="font-semibold text-blue-300">Experimental Precautions</h3>
          <ol className="list-decimal pl-5 mt-2 space-y-1 text-gray-300">
            <li>The angle of incidence should be between 30° - 60° for best results</li>
            <li>The pins should be fixed vertically to minimize parallax errors</li>
            <li>Maintain a distance of at least 8 cm between pins for accurate measurements</li>
            <li>Take multiple readings around the minimum deviation angle for greater precision</li>
            <li>Ensure the prism is properly positioned with its refracting edge vertical</li>
          </ol>
        </div>
        
        <div>
          <h3 className="font-semibold text-blue-300">Physical Significance</h3>
          <p className="mt-1 text-gray-300">
            The refractive index is a fundamental optical property that describes how light propagates 
            through a material. It's defined as the ratio of the speed of light in vacuum to the speed 
            of light in the medium. Materials with higher refractive indices bend light more strongly.
          </p>
        </div>
        
        <div className="text-xs text-gray-400 pt-2 border-t border-gray-700">
          <p>
            This experiment demonstrates important concepts in geometric optics including Snell's Law, 
            refraction, and the determination of optical properties of transparent materials.
          </p>
        </div>
      </div>
    </div>
  );
}