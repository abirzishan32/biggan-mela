"use client";

import { useState, useEffect, useRef } from 'react';
import SpringMassLab from '@/components/spring-and-mass/SpringMass';

export default function SpringMassPage() {
  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <header className="bg-indigo-900 text-white p-4 shadow-lg">
        <h1 className="text-2xl font-bold">Spring & Mass Laboratory</h1>
        <p className="text-sm md:text-base">Explore oscillation, period, and Hooke's Law</p>
      </header>

      <main className="flex-1 overflow-hidden">
        <SpringMassLab />
      </main>
    </div>
  );
}