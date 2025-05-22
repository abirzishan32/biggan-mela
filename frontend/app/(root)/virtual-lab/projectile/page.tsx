"use client";

import { useState } from 'react';
import ProjectileSimulator from '@/components/projectile/ProjectileSimulator';

export default function ProjectilePage() {
  return (
    <div className="flex flex-col h-screen bg-black">
      <header className="bg-gray-900 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-blue-300">Projectile Motion Simulator</h1>
          <p className="text-gray-300">Explore the physics of projectile motion in a real-world environment</p>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden bg-gray-900">
        <ProjectileSimulator />
      </div>
    </div>
  );
}