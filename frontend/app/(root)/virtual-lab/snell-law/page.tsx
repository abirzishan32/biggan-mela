"use client";

import RefractionSimulator from '@/components/snell-law/RefractionSimulator';

export default function LightRefractionPage() {
  return (
    <div className="flex flex-col h-screen bg-black">
      <header className="bg-gray-900 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-blue-300">Light Refraction Lab</h1>
          <p className="text-gray-300">Explore how light bends when passing between different materials</p>
        </div>
      </header>

      <main className="flex-1 overflow-hidden bg-gray-900">
        <RefractionSimulator />
      </main>
    </div>
  );
}