import { Solution } from './types';

/**
 * Calculate pH based on original solution and dilution with water
 * This uses a simplified model based on concentration
 */
export function calculateDilutedPH(
  solution: Solution, 
  solutionVolume: number, 
  waterVolume: number
): number {
  if (solutionVolume <= 0) return 7; // Pure water
  
  // Simple concentration model
  const originalHplus = Math.pow(10, -solution.basePh);
  const totalVolume = solutionVolume + waterVolume;
  const dilutionFactor = solutionVolume / totalVolume;
  
  // Diluted H+ concentration
  const dilutedHplus = originalHplus * dilutionFactor;
  
  // Convert back to pH scale
  const dilutedPH = -Math.log10(dilutedHplus);
  
  // Bound within realistic pH range
  return Math.max(0, Math.min(14, dilutedPH));
}

/**
 * Get appropriate color for the pH value
 */
export function getColorForPH(ph: number): string {
  if (ph <= 3) return '#ff0000'; // Strong acid - red
  if (ph <= 6) return '#ff9900'; // Weak acid - orange
  if (ph >= 11) return '#9900cc'; // Strong base - purple
  if (ph >= 8) return '#0000ff'; // Weak base - blue
  return '#00cc00'; // Neutral - green
}