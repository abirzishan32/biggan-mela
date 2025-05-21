
"use client";

import { useState, useEffect } from 'react';

interface Challenge {
  id: number;
  title: string;
  description: string;
  targetAngle: number;
  targetMedium: 'water' | 'glass' | 'oil' | 'air';
  hint: string;
  completed: boolean;
}

interface ChallengesProps {
  level: number;
  onComplete: () => void;
  currentMedium: string;
}

export default function Challenges({ level, onComplete, currentMedium }: ChallengesProps) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  
  // Generate challenges based on level
  useEffect(() => {
    const levelChallenges: Challenge[] = [
      {
        id: level * 100 + 1,
        title: `Level ${level}: Refraction Basics`,
        description: "Set the correct medium to achieve the maximum refraction.",
        targetAngle: 45,
        targetMedium: 'glass',
        hint: "Glass has a higher refractive index than water.",
        completed: false
      },
      {
        id: level * 100 + 2,
        title: `Level ${level}: Angle of Incidence`,
        description: "Achieve total internal reflection by setting the right angle.",
        targetAngle: 60,
        targetMedium: 'water',
        hint: "The critical angle depends on the medium's refractive index.",
        completed: false
      }
    ];
    
    setChallenges(levelChallenges);
    setCurrentChallenge(levelChallenges[0]);
  }, [level]);

  // Check if challenge is completed
  useEffect(() => {
    if (currentChallenge && currentMedium === currentChallenge.targetMedium) {
      // In a real implementation, we would also check the angle
      const updatedChallenges = challenges.map(challenge => 
        challenge.id === currentChallenge.id 
          ? { ...challenge, completed: true } 
          : challenge
      );
      
      setChallenges(updatedChallenges);
      setCurrentChallenge(prev => prev ? { ...prev, completed: true } : null);
      onComplete();
    }
  }, [currentMedium, currentChallenge, challenges, onComplete]);

  const handleNextChallenge = () => {
    const currentIndex = challenges.findIndex(c => c.id === currentChallenge?.id);
    if (currentIndex < challenges.length - 1) {
      setCurrentChallenge(challenges[currentIndex + 1]);
    }
  };

  if (!currentChallenge) {
    return <div>Loading challenges...</div>;
  }

  return (
    <div className="mt-6 bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-2">{currentChallenge.title}</h2>
      <p className="mb-4">{currentChallenge.description}</p>
      
      <div className="mt-4 flex items-center">
        <div 
          className={`w-5 h-5 rounded-full mr-3 ${
            currentChallenge.completed ? 'bg-green-500' : 'bg-yellow-500'
          }`}
        />
        <p>
          {currentChallenge.completed 
            ? 'Challenge completed!' 
            : 'Challenge in progress...'}
        </p>
      </div>
      
      {!currentChallenge.completed && (
        <button 
          className="mt-3 text-blue-600 hover:underline text-sm"
          onClick={() => alert(currentChallenge.hint)}
        >
          Need a hint?
        </button>
      )}
      
      {currentChallenge.completed && (
        <button
          className="mt-4 w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={handleNextChallenge}
        >
          Next Challenge
        </button>
      )}
    </div>
  );
}