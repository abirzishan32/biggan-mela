import { create } from 'zustand';

type MediumType = 'air' | 'water' | 'glass' | 'oil';
type GameMode = 'refraction' | 'reflection' | 'challenge';

interface Challenge {
  id: number;
  title: string;
  description: string;
  targetAngle: number;
  targetMedium: MediumType;
  completed: boolean;
}

interface GameState {
  // Game settings
  gameMode: GameMode;
  lightAngle: number;
  mediumType: MediumType;
  showTutorial: boolean;
  
  // Game progress
  score: number;
  level: number;
  challenges: Challenge[];
  currentChallengeId: number | null;
  
  // Actions
  setGameMode: (mode: GameMode) => void;
  setLightAngle: (angle: number) => void;
  setMediumType: (medium: MediumType) => void;
  setShowTutorial: (show: boolean) => void;
  completeChallenge: (challengeId: number) => void;
  resetGame: () => void;
  incrementScore: (points: number) => void;
}

export const useGameStore = create<GameState>()((set) => ({
  // Initial state
  gameMode: 'refraction',
  lightAngle: 45,
  mediumType: 'water',
  showTutorial: true,
  score: 0,
  level: 1,
  challenges: [
    {
      id: 1,
      title: 'Level 1: Refraction Basics',
      description: 'Set the correct medium to achieve the maximum refraction.',
      targetAngle: 45,
      targetMedium: 'glass',
      completed: false
    },
    {
      id: 2,
      title: 'Level 1: Angle of Incidence',
      description: 'Achieve total internal reflection by setting the right angle.',
      targetAngle: 60,
      targetMedium: 'water',
      completed: false
    }
  ],
  currentChallengeId: 1,
  
  // Actions
  setGameMode: (mode) => set({ gameMode: mode }),
  setLightAngle: (angle) => set({ lightAngle: angle }),
  setMediumType: (medium) => set({ mediumType: medium }),
  setShowTutorial: (show) => set({ showTutorial: show }),
  
  completeChallenge: (challengeId) => set((state) => {
    // Find the challenge and mark it as complete
    const updatedChallenges = state.challenges.map(challenge =>
      challenge.id === challengeId ? { ...challenge, completed: true } : challenge
    );
    
    // Find next uncompleted challenge
    const nextChallenge = updatedChallenges.find(c => !c.completed);
    const nextChallengeId = nextChallenge ? nextChallenge.id : null;
    
    // Update level if all challenges completed
    const allCompleted = updatedChallenges.every(c => c.completed);
    const newLevel = allCompleted ? state.level + 1 : state.level;
    
    return {
      challenges: updatedChallenges,
      currentChallengeId: nextChallengeId,
      score: state.score + 100,
      level: newLevel
    };
  }),
  
  resetGame: () => set({
    gameMode: 'refraction',
    lightAngle: 45,
    mediumType: 'water',
    score: 0,
    level: 1,
    currentChallengeId: 1,
    challenges: [
      {
        id: 1,
        title: 'Level 1: Refraction Basics',
        description: 'Set the correct medium to achieve the maximum refraction.',
        targetAngle: 45,
        targetMedium: 'glass',
        completed: false
      },
      {
        id: 2,
        title: 'Level 1: Angle of Incidence',
        description: 'Achieve total internal reflection by setting the right angle.',
        targetAngle: 60,
        targetMedium: 'water',
        completed: false
      }
    ]
  }),
  
  incrementScore: (points) => set((state) => ({ 
    score: state.score + points 
  }))
}));