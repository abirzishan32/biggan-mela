export interface Location {
  lat: number;
  lon: number;
}

export interface PlantResult {
  species: {
    scientificName: string;
    scientificNameWithoutAuthor?: string;
    commonNames?: string[];
    family?: {
      scientificName: string;
      scientificNameWithoutAuthor?: string;
    };
    genus?: {
      scientificName: string;
      scientificNameWithoutAuthor?: string;
    };
  };
  score: number;
  images?: Array<{
    url: {
      m: string;
    };
    organ: string;
  }>;
}

export interface PlantAnalysis {
  isRare: boolean;
  isScientificallyImportant: boolean;
  hasMedicinalValue: boolean;
  explanation: string;
  conservationStatus: string;
  shouldStore: boolean;
}

export interface BirdDetection {
  species: string;
  scientific_name: string;
  confidence: number;
  start_time?: number;
  end_time?: number;
}

export interface BirdAnalysis {
  isEndangered: boolean;
  conservationStatus: string;
  isEcologicallyImportant: boolean;
  populationTrend: string;
  habitatType: string;
  ecologicalRole: string;
  conservationRecommendations: string;
  shouldMonitor: boolean;
  explanation: string;
}

export interface PollutionDetection {
  label: string;
  score: number;
  box: {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
  };
}

export interface PollutionAnalysis {
  pollutionLevel: 'Low' | 'Medium' | 'High';
  detectedObjects: Array<{
    object: string;
    confidence: number;
    box: {
      xmin: number;
      ymin: number;
      xmax: number;
      ymax: number;
    };
  }>;
  environmentalRisks: string[];
  recommendations: string[];
  wildlifeImpact: string;
  ecosystemImpact: string;
  immediateActions: string[];
  longTermSolutions: string[];
  explanation: string;
}

export interface Observation {
  id: number;
  type: string;
  notes: string;
  location?: Location;
  status: string;
  createdAt: string;
  plantResults?: {
    results: PlantResult[];
  };
  birdResults?: BirdDetection[];
  pollutionResults?: {
    detections: PollutionDetection[];
  };
} 