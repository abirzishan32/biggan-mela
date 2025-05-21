"use client";

import { useState, useEffect, useRef } from 'react';
import Graph from 'graphology';
import GraphVisualization from './GraphVisualization';
import GraphControls from './GraphControls';
import Queue from './Queue';
import AlgorithmExplanation from './AlgorithmExplanation';
import { BFSStep } from './types';
import { generateBFSSteps } from '@/lib/graph-algorithm/bfs';
import { generateTeachingGraph, generateRandomGraph } from '@/lib/graph-algorithm/graph-generator';

export default function BFSVisualizer() {
    const [graph, setGraph] = useState<Graph>(() => generateTeachingGraph());
    const [startNode, setStartNode] = useState<string>('A');
    const [steps, setSteps] = useState<BFSStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [speed, setSpeed] = useState<number>(1000); // ms per step

    const animationTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Generate BFS steps when graph or start node changes
    useEffect(() => {
        if (graph && startNode) {
            try {
                const newSteps = generateBFSSteps(graph, startNode);
                setSteps(newSteps);
                setCurrentStepIndex(-1);
                setIsRunning(false);
            } catch (error) {
                console.error("Error generating BFS steps:", error);
            }
        }
    }, [graph, startNode]);

    // Generate a new graph
    const handleGraphChange = (graphType: 'teaching' | 'random', nodeCount?: number, edgeProbability?: number) => {
        let newGraph;

        if (graphType === 'teaching') {
            newGraph = generateTeachingGraph();
            setStartNode('A'); // Teaching graph uses lettered nodes
        } else {
            newGraph = generateRandomGraph(nodeCount || 10, edgeProbability || 0.3);
            setStartNode('n0'); // Random graph uses numbered nodes
        }

        setGraph(newGraph);
    };

    // Start the animation
    const handleStart = () => {
        if (currentStepIndex < 0) {
            setCurrentStepIndex(0);
        }
        setIsRunning(true);
    };

    // Pause the animation
    const handlePause = () => {
        setIsRunning(false);
        if (animationTimerRef.current) {
            clearTimeout(animationTimerRef.current);
            animationTimerRef.current = null;
        }
    };

    // Reset the animation
    const handleReset = () => {
        handlePause();
        setCurrentStepIndex(-1);
    };

    // Step forward one step
    const handleStepForward = () => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
        }
    };

    // Step backward one step
    const handleStepBackward = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(currentStepIndex - 1);
        }
    };

    // Handle animation stepping
    useEffect(() => {
        if (isRunning && currentStepIndex >= 0 && currentStepIndex < steps.length - 1) {
            animationTimerRef.current = setTimeout(() => {
                setCurrentStepIndex(prev => prev + 1);
            }, speed);
        } else if (isRunning && currentStepIndex >= steps.length - 1) {
            setIsRunning(false);
        }

        return () => {
            if (animationTimerRef.current) {
                clearTimeout(animationTimerRef.current);
            }
        };
    }, [isRunning, currentStepIndex, steps, speed]);

    // Current step data
    const currentStep: BFSStep | null =
        currentStepIndex >= 0 && currentStepIndex < steps.length
            ? steps[currentStepIndex]
            : null;


    return (
        <div className="container mx-auto px-2 py-4">
            <h1 className="text-2xl font-bold text-center mb-4">BFS Algorithm Visualization</h1>

            {/* Compact layout grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                {/* Main visualization area - 8 columns */}
                <div className="lg:col-span-8 flex flex-col gap-3">
                    {/* Top row with controls and queue side by side */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                        {/* Controls - 8 columns */}
                        <div className="md:col-span-8">
                            <GraphControls
                                graph={graph}
                                onGraphChange={(newGraph) => setGraph(newGraph)}
                                onStartNodeChange={setStartNode}
                                onStart={handleStart}
                                onPause={handlePause}
                                onReset={handleReset}
                                onStepForward={handleStepForward}
                                onStepBackward={handleStepBackward}
                                onSpeedChange={setSpeed}
                                selectedStartNode={startNode}
                                isRunning={isRunning}
                                currentStepIndex={currentStepIndex}
                                totalSteps={steps.length}
                                speed={speed}
                            />
                        </div>

                        {/* Queue - 4 columns, next to controls */}
                        <div className="md:col-span-4">
                            <Queue
                                items={currentStep?.queue || []}
                                currentNode={currentStep?.currentNode || ''}
                            />
                        </div>
                    </div>

                    {/* Graph visualization, takes most of the space */}
                    <GraphVisualization
                        graph={graph}
                        currentStep={currentStep}
                        isRunning={isRunning}
                    />
                </div>

                {/* Algorithm explanation area - 4 columns */}
                <div className="lg:col-span-4">
                    <AlgorithmExplanation
                        currentStep={currentStep}
                    />
                </div>
            </div>
        </div>
    );
}