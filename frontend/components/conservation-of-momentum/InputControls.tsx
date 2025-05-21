"use client";

import { useState, useEffect } from "react";
import  { calculateFinalVelocities }  from "./MomentumCalculator";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { IoPlayCircleOutline, IoRefreshOutline } from "react-icons/io5";

interface Ball {
  mass: number;
  initialVelocity: number;
}

interface InputControlsProps {
  initialData: {
    ball1: Ball;
    ball2: Ball;
  };
  onStartSimulation: (data: any) => void;
  isRunning: boolean;
}

export default function InputControls({
  initialData,
  onStartSimulation,
  isRunning,
}: InputControlsProps) {
  const [ball1, setBall1] = useState<Ball>(initialData.ball1);
  const [ball2, setBall2] = useState<Ball>(initialData.ball2);
  const [finalVelocities, setFinalVelocities] = useState<{v1: number; v2: number} | null>(null);

  // Reset state when initialData changes
  useEffect(() => {
    setBall1(initialData.ball1);
    setBall2(initialData.ball2);
  }, [initialData]);

  // Calculate final velocities whenever inputs change
  useEffect(() => {
    const { v1Final, v2Final } = calculateFinalVelocities(
      ball1.mass,
      ball1.initialVelocity,
      ball2.mass,
      ball2.initialVelocity
    );
    setFinalVelocities({ v1: v1Final, v2: v2Final });
  }, [ball1, ball2]);

  const handleStartSimulation = () => {
    onStartSimulation({
      ball1,
      ball2,
      finalVelocities
    });
  };

  const handleReset = () => {
    setBall1(initialData.ball1);
    setBall2(initialData.ball2);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold text-blue-800 mb-4">Simulation Parameters</h2>
      
      <div className="space-y-6">
        <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
          <h3 className="text-lg font-medium text-blue-700 mb-3">Ball 1</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mass (kg): {ball1.mass.toFixed(1)}
              </label>
              <Slider
                disabled={isRunning}
                value={[ball1.mass]}
                min={0.1}
                max={10}
                step={0.1}
                onValueChange={(value) => setBall1({ ...ball1, mass: value[0] })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Initial Velocity (m/s): {ball1.initialVelocity.toFixed(1)}
              </label>
              <Slider
                disabled={isRunning}
                value={[ball1.initialVelocity]}
                min={-10}
                max={10}
                step={0.1}
                onValueChange={(value) => setBall1({ ...ball1, initialVelocity: value[0] })}
              />
            </div>
          </div>
        </div>
        
        <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
          <h3 className="text-lg font-medium text-purple-700 mb-3">Ball 2</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mass (kg): {ball2.mass.toFixed(1)}
              </label>
              <Slider
                disabled={isRunning}
                value={[ball2.mass]}
                min={0.1}
                max={10}
                step={0.1}
                onValueChange={(value) => setBall2({ ...ball2, mass: value[0] })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Initial Velocity (m/s): {ball2.initialVelocity.toFixed(1)}
              </label>
              <Slider
                disabled={isRunning}
                value={[ball2.initialVelocity]}
                min={-10}
                max={10}
                step={0.1}
                onValueChange={(value) => setBall2({ ...ball2, initialVelocity: value[0] })}
              />
            </div>
          </div>
        </div>
        
        {!isRunning ? (
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
            onClick={handleStartSimulation}
          >
            <IoPlayCircleOutline size={20} />
            Start Simulation
          </Button>
        ) : (
          <div className="p-4 border border-green-200 rounded-lg bg-green-50">
            <h3 className="text-lg font-medium text-green-700 mb-3">Predicted Final Velocities</h3>
            <p className="text-sm text-gray-700">Ball 1: {finalVelocities?.v1.toFixed(2)} m/s</p>
            <p className="text-sm text-gray-700">Ball 2: {finalVelocities?.v2.toFixed(2)} m/s</p>
          </div>
        )}
        
        {!isRunning && (
          <Button 
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleReset}
          >
            <IoRefreshOutline size={18} />
            Reset Values
          </Button>
        )}
      </div>
    </div>
  );
}