export interface SpringSystem {
  id: number;
  springConstant: number; // in N/m
  naturalLength: number; // in pixels
  currentLength: number; // in pixels
  attachedMass: MassBlock | null;
  isOscillating: boolean;
  oscillationAmplitude: number;
  oscillationPhase: number;
  oscillationPeriod: number;
  position: {
    x: number;
    y: number;
  };
}

export interface MassBlock {
  id: number;
  mass: number; // in kg
  color: string;
  label: string;
  isDragging: boolean;
  position: {
    x: number;
    y: number;
  };
}