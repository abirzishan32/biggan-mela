export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
  color: string;
  originalSide: 'left' | 'right';
}

export interface ParticleSettings {
  count: number;
  radius: number; // in picometers (pm)
  mass: number;   // in atomic mass units (AMU)
  temperature: number; // in Kelvin
}

export interface SimulationState {
  leftParticles: ParticleSettings;
  rightParticles: ParticleSettings;
  dividerPresent: boolean;
  isRunning: boolean;
  speed: number;
}