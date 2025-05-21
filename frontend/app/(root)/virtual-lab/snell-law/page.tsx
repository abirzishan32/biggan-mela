"use client";

import RefractionSimulator from '@/components/snell-law/RefractionSimulator';

export default function LightRefractionPage() {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-blue-800 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">Light Refraction Lab</h1>
        <p className="text-sm md:text-base">Explore how light bends when passing between different materials</p>
      </header>

      <main className="flex-1 overflow-hidden">
        <RefractionSimulator />
      </main>
    </div>
  );
}