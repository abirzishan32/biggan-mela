"use client";

interface PhysicsCalculationsProps {
  angle: number;
  velocity: number;
  mass: number;
  airResistance: boolean;
  windSpeed: number;
  results: {
    maxHeight: number;
    distance: number;
    flightTime: number;
    initialEnergy: number;
  };
}

export default function PhysicsCalculations({
  angle,
  velocity,
  mass,
  airResistance,
  windSpeed,
  results
}: PhysicsCalculationsProps) {
  // Convert angle to radians
  const angleRadians = angle * Math.PI / 180;
  
  // Calculate theoretical values (without air resistance)
  const g = 9.81; // m/s²
  
  // Theoretical maximum height (h = v₀²sin²θ / 2g)
  const theoreticalMaxHeight = Math.pow(velocity, 2) * Math.pow(Math.sin(angleRadians), 2) / (2 * g);
  
  // Theoretical range (R = v₀²sin(2θ) / g)
  const theoreticalRange = Math.pow(velocity, 2) * Math.sin(2 * angleRadians) / g;
  
  // Theoretical flight time (t = 2v₀sinθ / g)
  const theoreticalFlightTime = 2 * velocity * Math.sin(angleRadians) / g;
  
  // Calculate horizontal and vertical components of initial velocity
  const vx = velocity * Math.cos(angleRadians);
  const vy = velocity * Math.sin(angleRadians);
  
  return (
    <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-3 text-white">Physics Analysis</h2>
      
      <div className="mb-4 bg-gray-700 p-3 rounded-md">
        <h3 className="font-semibold mb-2 text-blue-300">Initial Conditions:</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-gray-300">Velocity:</div>
          <div className="text-white font-mono">{velocity.toFixed(1)} m/s</div>
          
          <div className="text-gray-300">Angle:</div>
          <div className="text-white font-mono">{angle.toFixed(1)}°</div>
          
          <div className="text-gray-300">Mass:</div>
          <div className="text-white font-mono">{mass.toFixed(1)} kg</div>
          
          <div className="text-gray-300">Air Resistance:</div>
          <div className="text-white font-mono">{airResistance ? 'Enabled' : 'Disabled'}</div>
          
          {airResistance && (
            <>
              <div className="text-gray-300">Wind Speed:</div>
              <div className="text-white font-mono">{windSpeed.toFixed(1)} m/s</div>
            </>
          )}
        </div>
      </div>
      
      <div className="mb-4 bg-gray-700 p-3 rounded-md">
        <h3 className="font-semibold mb-2 text-blue-300">Velocity Components:</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-gray-300">Horizontal (vₓ):</div>
          <div className="text-white font-mono">{vx.toFixed(2)} m/s</div>
          
          <div className="text-gray-300">Vertical (vᵧ):</div>
          <div className="text-white font-mono">{vy.toFixed(2)} m/s</div>
        </div>
      </div>
      
      <div className="mb-4 bg-gray-700 p-3 rounded-md">
        <h3 className="font-semibold mb-2 text-blue-300">Theoretical Predictions (without air resistance):</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-gray-300">Maximum Height:</div>
          <div className="text-white font-mono">{theoreticalMaxHeight.toFixed(2)} m</div>
          
          <div className="text-gray-300">Range:</div>
          <div className="text-white font-mono">{theoreticalRange.toFixed(2)} m</div>
          
          <div className="text-gray-300">Flight Time:</div>
          <div className="text-white font-mono">{theoreticalFlightTime.toFixed(2)} s</div>
        </div>
      </div>
      
      {results.flightTime > 0 && (
        <div className="mb-4 bg-gray-700 p-3 rounded-md">
          <h3 className="font-semibold mb-2 text-blue-300">Simulation Results:</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-300">Maximum Height:</div>
            <div className="text-white font-mono">{results.maxHeight.toFixed(2)} m</div>
            
            <div className="text-gray-300">Range:</div>
            <div className="text-white font-mono">{results.distance.toFixed(2)} m</div>
            
            <div className="text-gray-300">Flight Time:</div>
            <div className="text-white font-mono">{results.flightTime.toFixed(2)} s</div>
            
            <div className="text-gray-300">Initial Energy:</div>
            <div className="text-white font-mono">{results.initialEnergy.toFixed(2)} J</div>
          </div>
          
          {airResistance && (
            <div className="mt-2 text-sm text-gray-400">
              <p className="italic">
                Results differ from theoretical predictions due to air resistance and wind effects.
              </p>
            </div>
          )}
        </div>
      )}
      
      <div className="text-sm text-gray-400 bg-gray-700 p-3 rounded-md">
        <h3 className="font-semibold mb-1 text-blue-300">Equations:</h3>
        <p>Maximum Height: h = v₀²sin²θ / 2g</p>
        <p>Range: R = v₀²sin(2θ) / g</p>
        <p>Flight Time: t = 2v₀sinθ / g</p>
      </div>
    </div>
  );
}