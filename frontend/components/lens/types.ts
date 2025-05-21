export type LensType = 'convex' | 'concave';

// Add ImageType enum that was missing
export type ImageType = 'real' | 'virtual';

// Rename LensParameters to match the existing LensProperties interface
// or add it as an alias for backward compatibility
export type LensParameters = LensProperties;

export interface LensProperties {
  type: LensType;
  focalLength: number; // in cm
  radius: number; // radius of curvature in cm
  diameter: number; // in cm
  thickness: number; // in cm
  refractiveIndex: number;
}

export interface ObjectProperties {
  distance: number; // in cm, distance from lens
  height: number; // in cm
}

export interface ImageProperties {
  distance: number; // in cm, distance from lens (positive = real, negative = virtual)
  height: number; // in cm (positive = upright, negative = inverted)
  isReal: boolean;
  isMagnified: boolean;
}

export interface MeasurementPoint {
  x: number;
  y: number;
  label: string;
}

export interface RulerProperties {
  position: { x: number, y: number };
  rotation: number; // in degrees
  length: number; // in cm
  isVisible: boolean;
}

export interface PrincipalRay {
  path: { x: number, y: number }[];
  type: 'parallel' | 'central' | 'focal';
  color: string;
}