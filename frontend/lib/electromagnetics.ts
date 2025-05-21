/**
 * Calculate the magnetic flux through a coil
 * Using Φ = B·A·cosθ
 * 
 * @param magneticField - Magnetic field strength in Tesla
 * @param area - Cross-sectional area of the coil in square meters
 * @param turns - Number of turns in the coil
 * @param angle - Angle between magnetic field and coil normal (0 for perpendicular entry)
 * @returns Magnetic flux in Weber
 */
export function calculateMagneticFlux(
  magneticField: number,
  area: number,
  turns: number,
  angle: number = 0
): number {
  const cosAngle = Math.cos(angle);
  return magneticField * area * turns * cosAngle;
}

/**
 * Calculate the proximity factor - how close the magnet is to the coil
 * Returns a value between 0 and 1, with 1 being at the center of the coil
 * 
 * @param magnetPosition - Y-position of the magnet
 * @returns Proximity factor (0-1)
 */
function calculateProximityFactor(magnetPosition: number): number {
  // Calculate distance from center of coil (at y=0)
  const distance = Math.abs(magnetPosition);
  
  // Gaussian falloff curve
  return Math.exp(-(distance * distance) / 5);
}

/**
 * Calculate the induced EMF (and current) in a coil based on Faraday's Law
 * EMF = -N * dΦ/dt
 * 
 * @param magnetStrength - Magnetic field strength in Tesla
 * @param coilTurns - Number of turns in the coil
 * @param coilRadius - Radius of the coil in meters
 * @param magnetVelocity - Velocity of the magnet in m/s
 * @param magnetPosition - Current position of the magnet
 * @returns Induced current in Amperes
 */
export function calculateInducedCurrent(
  magnetStrength: number,
  coilTurns: number,
  coilRadius: number,
  magnetVelocity: number,
  magnetPosition: number
): number {
  // Calculate coil area
  const coilArea = Math.PI * coilRadius * coilRadius;
  
  // Calculate proximity factor (how close the magnet is to the coil)
  const proximityFactor = calculateProximityFactor(magnetPosition);
  
  // Calculate the rate of change of magnetic flux
  // dΦ/dt is proportional to the velocity of the magnet and its proximity to the coil
  const fluxChangeRate = magnetStrength * coilArea * magnetVelocity * proximityFactor;
  
  // Apply Faraday's Law: EMF = -N * dΦ/dt
  // Negative sign accounts for Lenz's Law (induced current opposes the change)
  const inducedEMF = -coilTurns * fluxChangeRate;
  
  // Assuming a fixed resistance of the coil, current is proportional to EMF
  // I = EMF / R (using R=10 ohms as a simplification)
  const coilResistance = 10;
  const inducedCurrent = inducedEMF / coilResistance;
  
  return inducedCurrent;
}