"use client";

import DiffusionLab from '@/components/diffusion/DiffusionLab';

export default function DiffusionPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-900">
      <header className="bg-indigo-900 text-white p-4 shadow-lg">
        <h1 className="text-2xl font-bold">Particle Diffusion Simulation</h1>
        <p className="text-sm md:text-base">Observe how particles diffuse when a barrier is removed</p>
      </header>

      <main className="flex-1 overflow-hidden">
        <DiffusionLab />
      </main>
      
      <footer className="bg-gray-800 text-gray-400 text-xs p-2 text-center">
        <p>Diffusion: The net movement of particles from an area of higher concentration to an area of lower concentration</p>
      </footer>
    </div>
  );
}