"use client";

import { useState, useEffect } from 'react';
import Chamber from './Chamber';
import ParticleControls from './ParticleControls';
import SimulationControls from './SimulationControls';
import Stats from './Stats';
import { ParticleSettings, SimulationState } from './types';

// Define initial state as a constant to reuse in reset function
const INITIAL_STATE: SimulationState = {
    leftParticles: {
        count: 1,       // Start with 1 particle
        radius: 50,     // Initial radius of 50pm
        mass: 4,        // Default mass - Helium-like
        temperature: 300 // Room temperature
    },
    rightParticles: {
        count: 1,       // Start with 1 particle
        radius: 50,     // Initial radius of 50pm
        mass: 20,       // Default mass - Neon-like
        temperature: 300 // Room temperature
    },
    dividerPresent: true,
    isRunning: true,
    speed: 1
};

export default function DiffusionLab() {
    const [simulationState, setSimulationState] = useState<SimulationState>(INITIAL_STATE);

    const updateLeftParticles = (settings: Partial<ParticleSettings>) => {
        setSimulationState(prev => ({
            ...prev,
            leftParticles: {
                ...prev.leftParticles,
                ...settings
            }
        }));
    };

    const updateRightParticles = (settings: Partial<ParticleSettings>) => {
        setSimulationState(prev => ({
            ...prev,
            rightParticles: {
                ...prev.rightParticles,
                ...settings
            }
        }));
    };

    const toggleDivider = () => {
        setSimulationState(prev => ({
            ...prev,
            dividerPresent: !prev.dividerPresent
        }));
    };

    const toggleSimulation = () => {
        setSimulationState(prev => ({
            ...prev,
            isRunning: !prev.isRunning
        }));
    };

    const updateSpeed = (speed: number) => {
        setSimulationState(prev => ({
            ...prev,
            speed
        }));
    };

    const resetSimulation = () => {
        // Reset to initial state completely
        setSimulationState({
            ...INITIAL_STATE,
            // Add a timestamp to force reinitialization
            leftParticles: {
                ...INITIAL_STATE.leftParticles,
                count: INITIAL_STATE.leftParticles.count + Math.floor(Math.random() * 10) // Randomize initial count
            },
            rightParticles: {
                ...INITIAL_STATE.rightParticles,
                count: INITIAL_STATE.rightParticles.count + Math.floor(Math.random() * 10) // Randomize initial count
            }
        });
    };

    return (
        <div className="flex flex-col md:flex-row h-full">
            {/* Left controls panel */}
            <div className="w-full md:w-1/4 bg-gray-900 overflow-y-auto p-4">
                <h2 className="text-xl font-bold mb-4 text-white">Left Chamber</h2>
                <ParticleControls
                    settings={simulationState.leftParticles}
                    onChange={updateLeftParticles}
                    side="left"
                    disabled={simulationState.isRunning && !simulationState.dividerPresent}
                />

                <div className="mt-8 mb-6 border-t border-gray-700"></div>

                <h2 className="text-xl font-bold mb-4 text-white">Right Chamber</h2>
                <ParticleControls
                    settings={simulationState.rightParticles}
                    onChange={updateRightParticles}
                    side="right"
                    disabled={simulationState.isRunning && !simulationState.dividerPresent}
                />
            </div>

            {/* Main simulation area */}
            <div className="flex-1 flex flex-col">
                <div className="flex-1 flex items-center justify-center p-4 bg-gray-800">
                    <Chamber
                        leftParticles={simulationState.leftParticles}
                        rightParticles={simulationState.rightParticles}
                        dividerPresent={simulationState.dividerPresent}
                        isRunning={simulationState.isRunning}
                        speed={simulationState.speed}
                    />
                </div>

                <div className="bg-gray-900 p-4">
                    <SimulationControls
                        dividerPresent={simulationState.dividerPresent}
                        isRunning={simulationState.isRunning}
                        speed={simulationState.speed}
                        onToggleDivider={toggleDivider}
                        onToggleSimulation={toggleSimulation}
                        onSpeedChange={updateSpeed}
                        onReset={resetSimulation}
                    />
                </div>
            </div>

            {/* Right stats panel */}
            <div className="w-full md:w-1/4 bg-gray-900 overflow-y-auto p-4">
                <h2 className="text-xl font-bold mb-4 text-white">Statistics</h2>
                <Stats
                    leftParticles={simulationState.leftParticles}
                    rightParticles={simulationState.rightParticles}
                    dividerPresent={simulationState.dividerPresent}
                />
            </div>
        </div>
    );
}