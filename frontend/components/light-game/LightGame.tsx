"use client";

import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import RefractionScene from './RefractionScene';
import ReflectionScene from './ReflectionScene';
import GameControls from './GameControls';
import ScoreBoard from './ScoreBoard';
import Challenges from './Challenges';

type GameMode = 'refraction' | 'reflection' | 'challenge';
type MediumType = 'air' | 'water' | 'glass' | 'oil';

export default function LightGame() {
  const [gameMode, setGameMode] = useState<GameMode>('refraction');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [mediumType, setMediumType] = useState<MediumType>('water');
  const [lightAngle, setLightAngle] = useState(45);
  // For challenge mode, we need to track which type of challenge we're on
  const [challengeType, setChallengeType] = useState<'refraction' | 'reflection'>('refraction');
  
  // Refractive indices for different mediums
  const refractiveIndices = {
    air: 1.0,
    water: 1.33,
    glass: 1.5,
    oil: 1.47
  };

  // Handle successful challenge completion
  const handleChallengeComplete = () => {
    setScore(prev => prev + 100);
    if (score >= level * 300) {
      setLevel(prev => prev + 1);
    }
  };

  return (
    <div className="flex flex-col h-[80vh]">
      <div className="flex justify-between mb-4">
        <div className="space-x-4">
          <button 
            className={`px-4 py-2 rounded ${gameMode === 'refraction' ? 'bg-blue-600 text-white' : 'bg-blue-200'}`}
            onClick={() => {
              setGameMode('refraction');
              setChallengeType('refraction');
            }}
          >
            Refraction Lab
          </button>
          <button 
            className={`px-4 py-2 rounded ${gameMode === 'reflection' ? 'bg-blue-600 text-white' : 'bg-blue-200'}`}
            onClick={() => {
              setGameMode('reflection');
              setChallengeType('reflection');
            }}
          >
            Reflection Lab
          </button>
          <button 
            className={`px-4 py-2 rounded ${gameMode === 'challenge' ? 'bg-blue-600 text-white' : 'bg-blue-200'}`}
            onClick={() => setGameMode('challenge')}
          >
            Challenges
          </button>
        </div>
        <ScoreBoard score={score} level={level} />
      </div>
      
      <div className="flex flex-1 gap-4">
        <div className="w-3/4 bg-gray-800 rounded-lg overflow-hidden">
          <Canvas shadows>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            {gameMode === 'refraction' && (
              <RefractionScene 
                mediumType={mediumType} 
                refractiveIndex={refractiveIndices[mediumType]} 
                lightAngle={lightAngle} 
              />
            )}
            {gameMode === 'reflection' && (
              <ReflectionScene lightAngle={lightAngle} />
            )}
            {gameMode === 'challenge' && (
              challengeType === 'refraction' ? (
                <RefractionScene 
                  mediumType={mediumType} 
                  refractiveIndex={refractiveIndices[mediumType]} 
                  lightAngle={lightAngle} 
                />
              ) : (
                <ReflectionScene lightAngle={lightAngle} />
              )
            )}
            <OrbitControls enableZoom={false} />
          </Canvas>
        </div>
        
        <div className="w-1/4">
          <GameControls 
            lightAngle={lightAngle} 
            setLightAngle={setLightAngle}
            mediumType={mediumType}
            setMediumType={setMediumType}
          />
          
          {gameMode === 'challenge' && (
            <Challenges 
              level={level} 
              onComplete={handleChallengeComplete}
              currentMedium={mediumType}
            />
          )}
          
          <div className="mt-6 bg-blue-100 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Physics Facts</h3>
            <p className="text-sm">
              {(gameMode === 'refraction' || (gameMode === 'challenge' && challengeType === 'refraction'))
                ? `Refraction occurs when light passes from one medium to another, causing it to bend. The refractive index of ${mediumType} is ${refractiveIndices[mediumType]}.`
                : 'Reflection is when light bounces off a surface. The angle of incidence equals the angle of reflection.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}