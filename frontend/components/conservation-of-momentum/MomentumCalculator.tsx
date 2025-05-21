/**
 * Calculate final velocities after an elastic collision
 * @param m1 Mass of ball 1 (kg)
 * @param v1 Initial velocity of ball 1 (m/s)
 * @param m2 Mass of ball 2 (kg)
 * @param v2 Initial velocity of ball 2 (m/s)
 * @returns Object containing final velocities
 */
export function calculateFinalVelocities(m1: number, v1: number, m2: number, v2: number) {
  // Elastic collision formula
  const v1Final = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
  const v2Final = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);
  
  return {
    v1Final,
    v2Final
  };
}

/**
 * Calculate momentum of an object
 * @param mass Mass (kg)
 * @param velocity Velocity (m/s)
 * @returns Momentum (kg·m/s)
 */
export function calculateMomentum(mass: number, velocity: number): number {
  return mass * velocity;
}

/**
 * Calculate total momentum of a system
 * @param momenta Array of individual momenta
 * @returns Total momentum
 */
export function calculateTotalMomentum(momenta: number[]): number {
  return momenta.reduce((sum, momentum) => sum + momentum, 0);
}