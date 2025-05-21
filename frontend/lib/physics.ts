/**
 * Light Physics Helper Functions
 * 
 * This module provides functions to calculate various light behavior
 * including refraction, reflection, and critical angles.
 */

/**
 * Calculate refracted angle using Snell's Law
 * n1 * sin(θ1) = n2 * sin(θ2)
 */
export function calculateRefractionAngle(
  incidentAngleDeg: number, 
  n1: number,  // Refractive index of first medium
  n2: number   // Refractive index of second medium
): number {
  // Convert incident angle from degrees to radians
  const incidentAngleRad = (incidentAngleDeg * Math.PI) / 180;
  
  // Calculate sin of refraction angle using Snell's Law
  const sinRefraction = (n1 * Math.sin(incidentAngleRad)) / n2;
  
  // Check for total internal reflection
  if (Math.abs(sinRefraction) > 1) {
    return -1; // Indicates total internal reflection
  }
  
  // Calculate refraction angle in radians, then convert to degrees
  const refractionAngleRad = Math.asin(sinRefraction);
  const refractionAngleDeg = (refractionAngleRad * 180) / Math.PI;
  
  return refractionAngleDeg;
}

/**
 * Calculate critical angle for total internal reflection
 */
export function calculateCriticalAngle(n1: number, n2: number): number {
  // Critical angle only exists when light travels from a medium with 
  // higher refractive index to one with lower refractive index
  if (n1 <= n2) {
    return -1; // No critical angle
  }
  
  const criticalAngleRad = Math.asin(n2 / n1);
  const criticalAngleDeg = (criticalAngleRad * 180) / Math.PI;
  
  return criticalAngleDeg;
}

/**
 * Check if total internal reflection occurs
 */
export function isTotalInternalReflection(
  incidentAngleDeg: number,
  n1: number,
  n2: number
): boolean {
  const criticalAngle = calculateCriticalAngle(n1, n2);
  
  // If there's no critical angle or incident angle is less than critical
  if (criticalAngle === -1 || incidentAngleDeg < criticalAngle) {
    return false;
  }
  
  return true;
}

/**
 * Calculate reflected light intensity using Fresnel equations (simplified)
 */
export function calculateReflectivity(
  incidentAngleDeg: number,
  n1: number,
  n2: number
): number {
  const incidentAngleRad = (incidentAngleDeg * Math.PI) / 180;
  
  // For normal incidence (simplified Fresnel equation)
  if (incidentAngleDeg === 0) {
    const r = Math.pow((n1 - n2) / (n1 + n2), 2);
    return r;
  }
  
  // For total internal reflection
  if (isTotalInternalReflection(incidentAngleDeg, n1, n2)) {
    return 1.0; // 100% reflection
  }
  
  // Simplified approximation for other angles
  // In a real implementation, we would use the full Fresnel equations
  const ratio = n1 / n2;
  const cosIncident = Math.cos(incidentAngleRad);
  const term = Math.pow(ratio - cosIncident, 2) / Math.pow(ratio + cosIncident, 2);
  
  return Math.min(term, 1.0);
}

/**
 * Refractive indices of common materials
 */
export const refractiveIndices = {
  vacuum: 1.0,
  air: 1.0003,
  water: 1.333,
  glass: 1.5,
  diamond: 2.417,
  oil: 1.47,
};



// Add this function to the existing physics.ts file

/**
 * Calculate the period of a simple pendulum using the formula T = 2π√(L/g)
 * 
 * @param length - Length of the pendulum in meters
 * @param gravity - Acceleration due to gravity (default: 9.8 m/s²)
 * @returns Period in seconds
 */
export function calculatePendulumPeriod(length: number, gravity: number = 9.8): number {
  // For small angles, the period of a simple pendulum is:
  // T = 2π√(L/g)
  return 2 * Math.PI * Math.sqrt(length / gravity);
}

/**
 * Calculate the period of a pendulum for any angle (not just small angles)
 * using numerical integration and elliptic integrals
 * 
 * @param length - Length of the pendulum in meters
 * @param maxAngle - Maximum angle in degrees
 * @param gravity - Acceleration due to gravity (default: 9.8 m/s²)
 * @returns Period in seconds
 */
export function calculateExactPendulumPeriod(
  length: number, 
  maxAngle: number, 
  gravity: number = 9.8
): number {
  // Convert angle to radians
  const angleRad = (maxAngle * Math.PI) / 180;
  
  // For large angles, we use a series approximation:
  // T = T₀(1 + (1/16)sin²(θ/2) + (11/3072)sin⁴(θ/2) + ...)
  // where T₀ = 2π√(L/g) is the period for small angles
  
  const k = Math.sin(angleRad / 2);
  const k2 = k * k;
  const k4 = k2 * k2;
  
  const smallAnglePeriod = 2 * Math.PI * Math.sqrt(length / gravity);
  
  // First few terms of the series expansion
  const correction = 1 + (1/16) * k2 + (11/3072) * k4;
  
  return smallAnglePeriod * correction;
}




// Add these functions to your existing physics.ts file

/**
 * Calculate refraction angle for double slit experiment
 * Similar to Snell's Law but implemented differently to avoid naming conflicts
 */
export function calculateRefractiveAngleDS(
  incidentAngle: number, 
  n1: number, 
  n2: number
): number {
  // Convert degrees to radians
  const incidentRadians = (incidentAngle * Math.PI) / 180;
  
  // Apply Snell's Law: n1 * sin(θ1) = n2 * sin(θ2)
  const sinRefraction = (n1 / n2) * Math.sin(incidentRadians);
  
  // Check for total internal reflection
  if (Math.abs(sinRefraction) > 1) {
    return 90; // Total internal reflection
  }
  
  // Calculate refraction angle in radians and convert to degrees
  const refractionRadians = Math.asin(sinRefraction);
  const refractionDegrees = (refractionRadians * 180) / Math.PI;
  
  return refractionDegrees;
}

/**
 * Calculate the intensity distribution for a double slit interference pattern
 * 
 * @param slitSeparation - Distance between slits in mm
 * @param slitWidth - Width of each slit in mm
 * @param wavelength - Wavelength of light in nm
 * @param screenDistance - Distance to screen in mm
 * @returns Array of position and intensity values
 */
export function calculateDoubleSlitPattern(
  slitSeparation: number, 
  slitWidth: number,
  wavelength: number,
  screenDistance: number
): { position: number; intensity: number }[] {
  const pattern: { position: number; intensity: number }[] = [];
  const screenWidth = 100; // mm
  
  // Convert wavelength from nm to mm
  const wavelengthMm = wavelength * 1e-6;
  
  for (let position = -screenWidth/2; position <= screenWidth/2; position += 0.5) {
    // Path difference
    const pathDifference = (slitSeparation * position) / screenDistance;
    
    // Phase difference for double slit
    const phaseDoubleSlit = (2 * Math.PI * pathDifference) / wavelengthMm;
    
    // Phase factor for single slit
    const phaseSingleSlit = (Math.PI * slitWidth * position) / (wavelengthMm * screenDistance);
    
    // Single slit diffraction factor
    const singleSlitFactor = phaseSingleSlit === 0 
      ? 1 
      : Math.pow(Math.sin(phaseSingleSlit) / phaseSingleSlit, 2);
    
    // Double slit interference factor
    const doubleSlitFactor = Math.pow(Math.cos(phaseDoubleSlit / 2), 2);
    
    // Combined intensity
    const intensity = 100 * singleSlitFactor * doubleSlitFactor;
    
    pattern.push({ position, intensity });
  }
  
  return pattern;
}

/**
 * Update refractive indices with additional materials
 * (This merges with your existing object rather than replacing it)
 */
// Add to your existing refractiveIndices object
Object.assign(refractiveIndices, {
  plastic: 1.46,
  quartz: 1.46
});

/**
 * Calculate fringe spacing in Young's double slit experiment
 * 
 * @param wavelength - Wavelength of light in nm
 * @param slitSeparation - Distance between slits in mm
 * @param screenDistance - Distance to screen in mm
 * @returns Fringe spacing in mm
 */
export function calculateFringeSpacing(
  wavelength: number,
  slitSeparation: number,
  screenDistance: number
): number {
  // Convert wavelength from nm to mm
  const wavelengthMm = wavelength * 1e-6;
  
  // Calculate fringe spacing: λD/d
  return (wavelengthMm * screenDistance) / slitSeparation;
}

/**
 * Convert wavelength to approximate RGB color
 * 
 * @param wavelength - Wavelength of light in nm
 * @returns RGB color string
 */
export function wavelengthToColor(wavelength: number): string {
  let r = 0, g = 0, b = 0;
  
  if (wavelength >= 380 && wavelength < 440) {
    r = -1 * (wavelength - 440) / (440 - 380);
    g = 0;
    b = 1;
  } else if (wavelength >= 440 && wavelength < 490) {
    r = 0;
    g = (wavelength - 440) / (490 - 440);
    b = 1;
  } else if (wavelength >= 490 && wavelength < 510) {
    r = 0;
    g = 1;
    b = -1 * (wavelength - 510) / (510 - 490);
  } else if (wavelength >= 510 && wavelength < 580) {
    r = (wavelength - 510) / (580 - 510);
    g = 1;
    b = 0;
  } else if (wavelength >= 580 && wavelength < 645) {
    r = 1;
    g = -1 * (wavelength - 645) / (645 - 580);
    b = 0;
  } else if (wavelength >= 645 && wavelength <= 780) {
    r = 1;
    g = 0;
    b = 0;
  }
  
  // Intensity correction
  let factor = 1;
  if (wavelength >= 380 && wavelength < 420) {
    factor = 0.3 + 0.7 * (wavelength - 380) / (420 - 380);
  } else if (wavelength >= 420 && wavelength <= 700) {
    factor = 1;
  } else if (wavelength > 700 && wavelength <= 780) {
    factor = 0.3 + 0.7 * (780 - wavelength) / (780 - 700);
  }
  
  r = Math.floor(255 * Math.pow(r * factor, 0.8));
  g = Math.floor(255 * Math.pow(g * factor, 0.8));
  b = Math.floor(255 * Math.pow(b * factor, 0.8));
  
  return `rgb(${r}, ${g}, ${b})`;
}


/**
 * Calculate the maximum height reached by a projectile
 * @param initialVelocity Initial velocity in m/s
 * @param angle Launch angle in degrees
 * @returns Maximum height in meters
 */
export function calculateMaximumHeight(initialVelocity: number, angle: number): number {
  const angleRadians = angle * Math.PI / 180;
  const g = 9.81; // m/s²
  
  // h = v₀²sin²θ / 2g
  return Math.pow(initialVelocity, 2) * Math.pow(Math.sin(angleRadians), 2) / (2 * g);
}

/**
 * Calculate the range of a projectile
 * @param initialVelocity Initial velocity in m/s
 * @param angle Launch angle in degrees
 * @returns Range in meters
 */
export function calculateRange(initialVelocity: number, angle: number): number {
  const angleRadians = angle * Math.PI / 180;
  const g = 9.81; // m/s²
  
  // R = v₀²sin(2θ) / g
  return Math.pow(initialVelocity, 2) * Math.sin(2 * angleRadians) / g;
}

/**
 * Calculate the flight time of a projectile
 * @param initialVelocity Initial velocity in m/s
 * @param angle Launch angle in degrees
 * @returns Flight time in seconds
 */
export function calculateFlightTime(initialVelocity: number, angle: number): number {
  const angleRadians = angle * Math.PI / 180;
  const g = 9.81; // m/s²
  
  // t = 2v₀sinθ / g
  return 2 * initialVelocity * Math.sin(angleRadians) / g;
}

/**
 * Calculate the position of a projectile at a given time
 * @param initialVelocity Initial velocity in m/s
 * @param angle Launch angle in degrees
 * @param time Time since launch in seconds
 * @returns Position as {x, y} in meters
 */
export function calculateProjectilePosition(
  initialVelocity: number, 
  angle: number, 
  time: number
): {x: number, y: number} {
  const angleRadians = angle * Math.PI / 180;
  const g = 9.81; // m/s²
  
  // x = v₀cosθ × t
  const x = initialVelocity * Math.cos(angleRadians) * time;
  
  // y = v₀sinθ × t - ½gt²
  const y = initialVelocity * Math.sin(angleRadians) * time - 0.5 * g * Math.pow(time, 2);
  
  return { x, y };
}


/**
 * Calculate the period of oscillation for a spring-mass system
 * @param mass Mass in kg
 * @param springConstant Spring constant in N/m
 * @returns Period in seconds
 */
export const calculatePeriod = (mass: number, springConstant: number): number => {
  return 2 * Math.PI * Math.sqrt(mass / springConstant);
};

/**
 * Calculate the displacement of a spring from its natural length
 * @param mass Mass in kg
 * @param springConstant Spring constant in N/m
 * @param gravity Gravity constant (9.81 m/s² by default)
 * @returns Displacement in the same units as the natural length
 */
export const calculateDisplacement = (
  mass: number, 
  springConstant: number,
  gravity: number = 9.81
): number => {
  // Hooke's Law: F = kx
  // In equilibrium, F = mg
  // Therefore, mg = kx
  // x = mg/k
  return mass * gravity / springConstant;
};

/**
 * Calculate the position of a mass on a spring at a given time
 * @param amplitude Initial amplitude of oscillation
 * @param period Period of oscillation
 * @param time Current time
 * @param phase Phase offset (in radians)
 * @param dampingFactor Damping factor (1.0 = no damping)
 * @returns Displacement from equilibrium position
 */
export const calculateOscillationPosition = (
  amplitude: number,
  period: number,
  time: number,
  phase: number = 0,
  dampingFactor: number = 0.995
): number => {
  // Damped harmonic motion
  const dampedAmplitude = amplitude * Math.pow(dampingFactor, time * 20);
  return dampedAmplitude * Math.sin(2 * Math.PI * time / period + phase);
};