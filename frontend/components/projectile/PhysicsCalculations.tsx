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
    <div className="mt-6 bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-bold mb-3">Physics Analysis</h2>
      
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Initial Conditions:</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Velocity:</div>
          <div>{velocity.toFixed(1)} m/s</div>
          
          <div>Angle:</div>
          <div>{angle.toFixed(1)}°</div>
          
          <div>Mass:</div>
          <div>{mass.toFixed(1)} kg</div>
          
          <div>Air Resistance:</div>
          <div>{airResistance ? 'Enabled' : 'Disabled'}</div>
          
          {airResistance && (
            <>
              <div>Wind Speed:</div>
              <div>{windSpeed.toFixed(1)} m/s</div>
            </>
          )}
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Velocity Components:</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Horizontal (vₓ):</div>
          <div>{vx.toFixed(2)} m/s</div>
          
          <div>Vertical (vᵧ):</div>
          <div>{vy.toFixed(2)} m/s</div>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Theoretical Predictions (without air resistance):</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Maximum Height:</div>
          <div>{theoreticalMaxHeight.toFixed(2)} m</div>
          
          <div>Range:</div>
          <div>{theoreticalRange.toFixed(2)} m</div>
          
          <div>Flight Time:</div>
          <div>{theoreticalFlightTime.toFixed(2)} s</div>
        </div>
      </div>
      
      {results.flightTime > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Simulation Results:</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Maximum Height:</div>
            <div>{results.maxHeight.toFixed(2)} m</div>
            
            <div>Range:</div>
            <div>{results.distance.toFixed(2)} m</div>
            
            <div>Flight Time:</div>
            <div>{results.flightTime.toFixed(2)} s</div>
            
            <div>Initial Energy:</div>
            <div>{results.initialEnergy.toFixed(2)} J</div>
          </div>
          
          {airResistance && (
            <div className="mt-2 text-sm">
              <p className="font-italic text-gray-600">
                Results differ from theoretical predictions due to air resistance and wind effects.
              </p>
            </div>
          )}
        </div>
      )}
      
      <div className="text-sm text-gray-600">
        <h3 className="font-semibold mb-1">Equations:</h3>
        <p>Maximum Height: h = v₀²sin²θ / 2g</p>
        <p>Range: R = v₀²sin(2θ) / g</p>
        <p>Flight Time: t = 2v₀sinθ / g</p>
      </div>
    </div>
  );
}