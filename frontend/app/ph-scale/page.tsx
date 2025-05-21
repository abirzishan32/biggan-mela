"use client";

import PhScaleLab from '@/components/ph-scale/PhScaleLab';

export default function PhScalePage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-900">
      <header className="bg-indigo-900 text-white p-4 shadow-lg">
        <h1 className="text-2xl font-bold">Interactive pH Scale Laboratory</h1>
        <p className="text-sm md:text-base">Explore acidity and alkalinity of common solutions</p>
      </header>

      <main className="flex-1 overflow-hidden">
        <PhScaleLab />
      </main>
      
      <footer className="bg-gray-800 text-gray-400 text-xs p-2 text-center">
        <p>pH Scale = -log[H⁺] • Acidic: pH &lt; 7 • Neutral: pH = 7 • Alkaline: pH &gt; 7</p>
      </footer>
    </div>
  );
}