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
      <div className="flex flex-col h-screen">
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
        `}</style>
        
        <header className="bg-blue-700 text-white p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Interactive Circuit Builder</h1>
          <div className="text-sm">
            Build and simulate electronic circuits
          </div>
        </header>
        
        <div className="flex flex-1 overflow-hidden">
          <ComponentPanel />
          
          <main className="flex-1 bg-gray-100 overflow-hidden relative">
            <CircuitCanvas />
            <CircuitIndicators />
          </main>
          
          <div className="w-64 bg-gray-200 p-4 overflow-y-auto">
            <CircuitControls />
          </div>
        </div>
      </div>
    </CircuitProvider>
  );
}