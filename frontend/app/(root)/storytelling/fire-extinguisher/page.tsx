"use client";

import { useState } from 'react';
import FireScene from '@/components/storytelling/fire-extinguisher/FireScene';
import LearningControls from '@/components/storytelling/fire-extinguisher/LearningControls';
import { Flame, Shield, AlertTriangle } from 'lucide-react';

export default function FireExtinguisherPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [activeProcess, setActiveProcess] = useState<string | null>(null);
  
  const steps = [
    { id: "intro", title: "শুরু" },
    { id: "fire", title: "আগুন" },
    { id: "extinguisher", title: "অগ্নি নির্বাপক" },
    { id: "extinguishing", title: "আগুন নেভানো" },
    { id: "complete", title: "শিক্ষা" },
  ];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-amber-100 to-orange-200">
      <header className="bg-gradient-to-r from-amber-500 to-red-500 text-white p-2 shadow-lg">
        <div className="container mx-auto flex items-center justify-center gap-2">
          <Flame className="h-6 w-6" />
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-center">অগ্নি নির্বাপক</h1>
            <p className="text-center text-white/80 text-sm">কীভাবে আগুন নেভানো যায়?</p>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-3 flex flex-col h-full overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Safety Notice */}
          <div className="bg-red-100 border-l-4 border-red-500 p-2 flex items-center gap-2 mb-3 rounded-r-lg">
            <AlertTriangle size={20} className="text-red-500 shrink-0" />
            <p className="text-sm text-red-700">
              <span className="font-medium">সতর্কতা:</span> আগুন বিপদজনক! কখনো নিজে আগুন নিয়ে পরীক্ষা করবে না। এটি একটি শিক্ষামূলক সিমুলেশন।
            </p>
          </div>
          
          {/* Main visualization area */}
          <div className="bg-white rounded-xl overflow-hidden shadow-xl flex-1">
            <FireScene 
              currentStep={currentStep} 
              activeProcess={activeProcess} 
              setActiveProcess={setActiveProcess} 
            />
          </div>
          
          {/* Controls area */}
          <div className="mt-3 flex-shrink-0">
            <LearningControls 
              steps={steps}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              setActiveProcess={setActiveProcess}
            />
          </div>
        </div>
      </main>
      
      <footer className="bg-gradient-to-r from-amber-500/20 to-red-500/20 p-2 text-center text-amber-800 text-xs">
        <p>বিজ্ঞানযজ্ঞ | শিশুদের জন্য অগ্নি নিরাপত্তা শিক্ষা</p>
      </footer>
    </div>
  );
}