"use client";

import { useEffect, useState } from 'react';

interface ScoreBoardProps {
  score: number;
  level: number;
}

export default function ScoreBoard({ score, level }: ScoreBoardProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevScore, setPrevScore] = useState(score);
  
  useEffect(() => {
    if (score !== prevScore) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setPrevScore(score);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [score, prevScore]);

  return (
    <div className="flex gap-4">
      <div className={`bg-blue-800 p-3 rounded-lg text-white ${isAnimating ? 'animate-pulse' : ''}`}>
        <h3 className="text-sm uppercase font-semibold">Score</h3>
        <p className="text-2xl font-bold">{score}</p>
      </div>
      
      <div className="bg-purple-800 p-3 rounded-lg text-white">
        <h3 className="text-sm uppercase font-semibold">Level</h3>
        <p className="text-2xl font-bold">{level}</p>
      </div>
    </div>
  );
}