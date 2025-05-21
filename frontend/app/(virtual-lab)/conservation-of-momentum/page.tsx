"use client";

import { useState } from "react";
import InputControls from "@/components/conservation-of-momentum/InputControls";
import MomentumSimulation from "@/components/conservation-of-momentum/MomentumSimulation";
import InfoPanel from "@/components/conservation-of-momentum/InfoPanel";

export default function ConservationOfMomentumPage() {
  const [simulationData, setSimulationData] = useState({
    ball1: {
      mass: 1,
      initialVelocity: 5,
    },
    ball2: {
      mass: 2,
      initialVelocity: -3,
    },
    isRunning: false,
  });

  const handleStartSimulation = (data: any) => {
    setSimulationData({
      ...data,
      isRunning: true,
    });
  };

  const handleResetSimulation = () => {
    setSimulationData((prev) => ({
      ...prev,
      isRunning: false,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-800 mb-6">
          Conservation of Momentum Lab
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
            <MomentumSimulation
              simulationData={simulationData}
              onReset={handleResetSimulation}
            />
          </div>

          <div className="space-y-6">
            <InputControls
              initialData={{
                ball1: simulationData.ball1,
                ball2: simulationData.ball2,
              }}
              onStartSimulation={handleStartSimulation}
              isRunning={simulationData.isRunning}
            />
            
            <InfoPanel />
          </div>
        </div>
      </div>
    </div>
  );
}