"use client";

import { useState } from 'react';
import LightGame from '@/components/light-game/LightGame';
import Modal from '@/components/ui/Modal';

export default function LightGamePage() {
  const [showTutorial, setShowTutorial] = useState(true);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-900 to-black p-4">
      {showTutorial && (
        <Modal 
          title="Light Physics Adventure" 
          onClose={() => setShowTutorial(false)}
        >
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Welcome to Light Physics Adventure!</h2>
            <p>Learn about refraction and reflection of light in this interactive game.</p>
            <p>Complete challenges by correctly predicting how light behaves in different mediums.</p>
            <ul className="list-disc pl-5">
              <li>Adjust the angle of light rays</li>
              <li>Change mediums (water, oil, glass)</li>
              <li>Observe how light bends and reflects</li>
              <li>Solve puzzles using your knowledge</li>
            </ul>
          </div>
        </Modal>
      )}
      <h1 className="text-4xl font-bold text-center text-white mb-6">Light Physics Adventure</h1>
      <div className="max-w-6xl mx-auto">
        <LightGame />
      </div>
    </main>
  );
}