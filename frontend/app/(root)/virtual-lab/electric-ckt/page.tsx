"use client";

import { useState, useRef, useEffect } from "react";
import CircuitCanvas from "@/components/electric-ckt/CircuitCanvas";
import ComponentPanel from "@/components/electric-ckt/ComponentPanel";
import CircuitControls from "@/components/electric-ckt/CircuitControls";
import CircuitIndicators from "@/components/electric-ckt/CircuitIndicators";
import { CircuitProvider } from "@/components/electric-ckt/CircuitContext";

export default function CircuitBuilderPage() {
  return (
    <CircuitProvider>
      <div className="flex flex-col h-screen bg-gray-900">
        <style jsx global>{`
          @keyframes flowAnimation {
            0% { transform: translateX(-10px) translateY(-50%); }
            100% { transform: translateX(120px) translateY(-50%); }
          }
          
          @keyframes pulseGlow {
            0% { opacity: 0.4; }
            50% { opacity: 1; }
            100% { opacity: 0.4; }
          }
          
          .dark-circuit-canvas {
            background-color: #1a1a1a;
            background-image: 
              linear-gradient(rgba(50, 50, 50, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(50, 50, 50, 0.3) 1px, transparent 1px);
            background-size: 20px 20px;
          }
        `}</style>
        
        <header className="bg-gray-800 text-white p-4 flex items-center justify-between border-b border-gray-700">
          <h1 className="text-2xl font-bold text-blue-300">Interactive Circuit Builder</h1>
          <div className="text-sm text-gray-300">
            Build and simulate electronic circuits
          </div>
        </header>
        
        <div className="flex flex-1 overflow-hidden">
          <ComponentPanel />
          
          <main className="flex-1 bg-gray-900 overflow-hidden relative">
            <CircuitCanvas />
            <CircuitIndicators />
          </main>
          
          <div className="w-72 bg-gray-800 p-4 overflow-y-auto border-l border-gray-700">
            <CircuitControls />
          </div>
        </div>
      </div>
    </CircuitProvider>
  );
}