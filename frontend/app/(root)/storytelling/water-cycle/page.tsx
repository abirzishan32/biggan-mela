"use client";

import { useState } from 'react';
import WaterCycleScene from '@/components/storytelling/water-cycle/WaterCycleScene';
import LearningControls from '@/components/storytelling/water-cycle/LearningControls';

export default function WaterCyclePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [activeProcess, setActiveProcess] = useState<string | null>(null);
  
  const steps = [
    { id: "intro", title: "পানি চক্র" },
    { id: "evaporation", title: "বাষ্পীভবন" },
    { id: "condensation", title: "ঘনীভবন" },
    { id: "precipitation", title: "বৃষ্টিপাত" },
    { id: "collection", title: "সংগ্রহ" },
    { id: "complete", title: "সম্পূর্ণ চক্র" },
  ];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-sky-100 to-blue-200">
      <header className="bg-sky-500 text-white p-2 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-xl md:text-2xl font-bold text-center">পানি চক্র</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-3 flex flex-col h-full overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Main visualization area */}
          <div className="bg-white rounded-xl overflow-hidden shadow-xl flex-1">
            <WaterCycleScene 
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
      
      
    </div>
  );
}