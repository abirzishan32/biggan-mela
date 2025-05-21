"use client";

import { useState, useEffect, useRef } from 'react';
import { SpringSystem } from './types';
import SpringMassScene from './SpringMassScene';

const SPRING_LENGTH = 150; // Natural length in pixels
const GRAVITY = 9.81; // m/s²

export default function SpringMassLab() {
    // States for two spring systems
    const [springSystems, setSpringSystems] = useState<SpringSystem[]>([
        {
            id: 1,
            springConstant: 20, // N/m
            naturalLength: SPRING_LENGTH,
            currentLength: SPRING_LENGTH,
            attachedMass: null,
            isOscillating: false,
            oscillationAmplitude: 0,
            oscillationPhase: 0,
            oscillationPeriod: 0,
            position: { x: 0, y: 0 },
        },
        {
            id: 2,
            springConstant: 40, // N/m
            naturalLength: SPRING_LENGTH,
            currentLength: SPRING_LENGTH,
            attachedMass: null,
            isOscillating: false,
            oscillationAmplitude: 0,
            oscillationPhase: 0,
            oscillationPeriod: 0,
            position: { x: 0, y: 0 },
        }
    ]);

    // Mass inputs for each spring
    const [massInputs, setMassInputs] = useState([1.0, 1.0]);

    // Simulation time and control
    const [time, setTime] = useState<number>(0);
    const animationRef = useRef<number | null>(null);
    const [isSimulating, setIsSimulating] = useState<boolean>(false);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const labContainerRef = useRef<HTMLDivElement>(null);

    // Additional effects for vibrant oscillation
    const [secondaryOscillations, setSecondaryOscillations] = useState<boolean[]>([false, false]);
    const [oscillationEnergy, setOscillationEnergy] = useState<number[]>([1.0, 1.0]);

    // Initialize spring positions
    useEffect(() => {
        if (labContainerRef.current) {
            const container = labContainerRef.current;
            const containerWidth = container.clientWidth;

            // Position the springs from the ceiling
            setSpringSystems(prev => prev.map((spring, index) => ({
                ...spring,
                position: {
                    x: containerWidth * (1 / 3 + index * 1 / 3),
                    y: 70 // Distance from top
                }
            })));
        }
    }, []);

    // Animation loop with enhanced realism
    useEffect(() => {
        if (!isSimulating || isPaused) return;

        let lastTimestamp = 0;

        const animate = (timestamp: number) => {
            // Calculate actual delta time for smoother animation
            const deltaTime = lastTimestamp ? (timestamp - lastTimestamp) / 1000 : 1 / 60;
            lastTimestamp = timestamp;

            setTime(prev => prev + deltaTime);

            setSpringSystems(prev =>
                prev.map((system, index) => {
                    if (!system.isOscillating || !system.attachedMass) return system;

                    const t = time;
                    const period = system.oscillationPeriod;
                    const amplitude = system.oscillationAmplitude;
                    const phase = system.oscillationPhase;

                    // Calculate displacement using damped harmonic motion with enhancements
                    const dampingFactor = 0.998; // Less damping for more vibrant oscillation
                    const energy = oscillationEnergy[index];

                    // Primary oscillation - vertical movement
                    const dampedAmplitude = amplitude * Math.pow(dampingFactor, t * 15) * energy;
                    const displacement = dampedAmplitude * Math.sin(2 * Math.PI * t / period + phase);

                    // Add secondary oscillations for more realistic vibration
                    let secondaryDisplacement = 0;
                    if (secondaryOscillations[index]) {
                        // Higher frequency, lower amplitude secondary oscillation
                        const secondaryFreq = period / 3;
                        const secondaryAmp = dampedAmplitude * 0.15;
                        secondaryDisplacement = secondaryAmp * Math.sin(2 * Math.PI * t / secondaryFreq);
                    }

                    // Check if oscillation has effectively stopped
                    if (dampedAmplitude < 0.5) {
                        setSecondaryOscillations(prev => {
                            const newState = [...prev];
                            newState[index] = false;
                            return newState;
                        });

                        return {
                            ...system,
                            isOscillating: false,
                            currentLength: system.naturalLength + (system.attachedMass.mass * GRAVITY / system.springConstant)
                        };
                    }

                    // Randomly add energy bursts to create more natural oscillation
                    if (Math.random() < 0.003 && dampedAmplitude > 5) {
                        setSecondaryOscillations(prev => {
                            const newState = [...prev];
                            newState[index] = true;
                            return newState;
                        });

                        setOscillationEnergy(prev => {
                            const newEnergy = [...prev];
                            newEnergy[index] = Math.min(1.0, energy + 0.1);
                            return newEnergy;
                        });
                    }

                    // Calculate total displacement with secondary oscillations
                    const totalDisplacement = displacement + secondaryDisplacement;

                    // Calculate equilibrium length (stretched by the mass)
                    const equilibriumLength = system.naturalLength + (system.attachedMass.mass * GRAVITY / system.springConstant);

                    return {
                        ...system,
                        currentLength: equilibriumLength + totalDisplacement
                    };
                })
            );

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [time, isSimulating, isPaused, secondaryOscillations, oscillationEnergy]);

    // Handle spring constant changes
    const handleSpringConstantChange = (id: number, value: number) => {
        setSpringSystems(prev =>
            prev.map(system => {
                if (system.id !== id) return system;

                // Recalculate period if there's a mass attached
                let newPeriod = system.oscillationPeriod;
                if (system.attachedMass) {
                    newPeriod = calculatePeriod(system.attachedMass.mass, value);
                }

                return {
                    ...system,
                    springConstant: value,
                    oscillationPeriod: newPeriod
                };
            })
        );
    };

    // Calculate period using T = 2π√(m/k)
    const calculatePeriod = (mass: number, springConstant: number): number => {
        return 2 * Math.PI * Math.sqrt(mass / springConstant);
    };

    // Handle mass input change
    const handleMassInputChange = (index: number, value: number) => {
        const newMassInputs = [...massInputs];
        newMassInputs[index] = value;
        setMassInputs(newMassInputs);
    };

    // Start the simulation with the input masses with enhanced initial conditions
    const startSimulation = () => {
        // Reset the simulation time
        setTime(0);

        // Reset secondary oscillation effects
        setSecondaryOscillations([false, false]);
        setOscillationEnergy([1.0, 1.0]);

        // Apply masses to springs and start oscillation
        setSpringSystems(prev =>
            prev.map((system, index) => {
                const massValue = massInputs[index];

                if (massValue <= 0) {
                    return {
                        ...system,
                        attachedMass: null,
                        isOscillating: false,
                        currentLength: system.naturalLength
                    };
                }

                // Generate a color based on the mass value
                const hue = Math.floor(massValue * 60) % 360;
                const color = `hsl(${hue}, 80%, 60%)`;

                // Calculate stretched length and period
                const stretchedLength = system.naturalLength + (massValue * GRAVITY / system.springConstant);
                const period = calculatePeriod(massValue, system.springConstant);

                // Add slight phase difference between springs for more natural look
                const phaseOffset = system.id === 2 ? 0.2 : 0;

                // Scale amplitude based on mass and spring constant for more realistic initial displacement
                const initialAmplitude = Math.min(45, 30 + (massValue * 5) - (system.springConstant * 0.2));

                return {
                    ...system,
                    attachedMass: {
                        id: system.id,
                        mass: massValue,
                        color,
                        label: `${massValue}kg`,
                        isDragging: false,
                        position: {
                            x: system.position.x,
                            y: system.position.y + stretchedLength
                        }
                    },
                    isOscillating: true,
                    oscillationAmplitude: initialAmplitude,
                    oscillationPhase: phaseOffset,
                    oscillationPeriod: period,
                    currentLength: stretchedLength + initialAmplitude // Start with initial displacement
                };
            })
        );

        setIsSimulating(true);
        setIsPaused(false);
    };

    // Reset the lab
    const handleReset = () => {
        setSpringSystems(prev =>
            prev.map(system => ({
                ...system,
                attachedMass: null,
                isOscillating: false,
                currentLength: system.naturalLength,
                oscillationAmplitude: 0
            }))
        );

        setTime(0);
        setIsSimulating(false);
        setIsPaused(false);
        setSecondaryOscillations([false, false]);
        setOscillationEnergy([1.0, 1.0]);
    };

    // Toggle pause/resume
    const handlePlayPause = () => {
        setIsPaused(prev => !prev);
    };

    return (
        <div className="flex flex-col md:flex-row h-full bg-gray-900 text-white">
            {/* Main lab area with 3D scene */}
            <div
                ref={labContainerRef}
                className="flex-1 relative bg-gradient-to-b from-gray-800 to-gray-900 overflow-hidden"
                style={{ height: '70vh' }}
            >
                <SpringMassScene springSystems={springSystems} />
            </div>

            {/* Control panel */}
            <div className="w-full md:w-80 bg-gray-800 p-4 overflow-y-auto shadow-xl">
                <h2 className="text-xl font-bold mb-4">Spring & Mass Controls</h2>

                {/* Spring constants controls */}
                <div className="space-y-4 mb-6">
                    <h3 className="text-lg font-semibold">Spring Constants</h3>

                    {springSystems.map((system, index) => (
                        <div key={system.id} className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium">
                                    Spring {system.id}: {system.springConstant.toFixed(1)} N/m
                                </label>

                                {system.attachedMass && (
                                    <div className="text-xs bg-indigo-900 px-2 py-1 rounded">
                                        T = {system.oscillationPeriod.toFixed(2)}s
                                    </div>
                                )}
                            </div>

                            <input
                                type="range"
                                min="5"
                                max="100"
                                step="0.5"
                                value={system.springConstant}
                                onChange={(e) => handleSpringConstantChange(system.id, parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                disabled={isSimulating}
                            />

                            <div className="flex justify-between text-xs text-gray-400">
                                <span>Soft</span>
                                <span>Medium</span>
                                <span>Stiff</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mass inputs */}
                <div className="space-y-4 mb-6 border-t border-gray-700 pt-4">
                    <h3 className="text-lg font-semibold">Input Masses</h3>

                    {springSystems.map((system, index) => (
                        <div key={system.id} className="space-y-2">
                            <label className="text-sm font-medium">
                                Mass for Spring {system.id} (kg):
                            </label>
                            <div className="flex space-x-2">
                                <input
                                    type="number"
                                    min="0.1"
                                    max="5"
                                    step="0.1"
                                    value={massInputs[index]}
                                    onChange={(e) => handleMassInputChange(index, parseFloat(e.target.value) || 0)}
                                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    disabled={isSimulating}
                                />
                                <span className="flex items-center px-2">kg</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Simulation controls */}
                <div className="space-y-3 mb-6">
                    {!isSimulating ? (
                        <button
                            onClick={startSimulation}
                            className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors font-bold shadow-lg"
                        >
                            Start Simulation
                        </button>
                    ) : (
                        <div className="flex space-x-3">
                            <button
                                onClick={handlePlayPause}
                                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors shadow-md"
                            >
                                {isPaused ? 'Resume' : 'Pause'}
                            </button>

                            <button
                                onClick={handleReset}
                                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors shadow-md"
                            >
                                Reset
                            </button>
                        </div>
                    )}
                </div>

                {/* Hooke's Law explanation */}
                <div className="mt-6 bg-gray-700 p-3 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold mb-2">Hooke's Law</h3>
                    <p className="text-sm text-gray-300">
                        Hooke's Law states that the force exerted by a spring is proportional to its displacement:
                    </p>
                    <div className="bg-gray-900 p-2 my-2 rounded text-center">
                        <span className="text-xl font-mono">F = -kx</span>
                    </div>
                    <p className="text-sm text-gray-300">
                        Where F is the force, k is the spring constant, and x is the displacement.
                    </p>
                    
                    <h3 className="text-lg font-semibold mt-4 mb-2">Simple Harmonic Motion</h3>
                    <p className="text-sm text-gray-300">
                        The period (T) of a mass-spring system is given by:
                    </p>
                    <div className="bg-gray-900 p-2 my-2 rounded text-center">
                        <span className="text-xl font-mono">T = 2π√(m/k)</span>
                    </div>
                    <p className="text-sm text-gray-300">
                        Where m is the mass in kg and k is the spring constant in N/m.
                    </p>
                </div>
            </div>
        </div>
    );
}