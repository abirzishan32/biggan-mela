"use client";

import { useState } from 'react';
import ProjectileSimulator from '@/components/projectile/ProjectileSimulator';

export default function ProjectilePage() {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-green-800 text-white p-4">
        <h1 className="text-2xl font-bold">Projectile Motion Simulator</h1>
        <p>Explore the physics of projectile motion in a real-world environment</p>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <ProjectileSimulator />
      </div>
    </div>
  );
}