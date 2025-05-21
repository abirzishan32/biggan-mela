export interface Solution {
  id: string;
  name: string;
  basePh: number;  // pH of undiluted solution
  color: string;   // Color of solution for visualization
  icon: string;    // Icon for UI
  description: string;
  examples?: string[];
}

export interface BeakerState {
  solution: Solution | null;
  volumeSolution: number;  // in milliliters
  volumeWater: number;     // in milliliters
  currentPh: number;
  filled: boolean;
  probeInside: boolean;
}