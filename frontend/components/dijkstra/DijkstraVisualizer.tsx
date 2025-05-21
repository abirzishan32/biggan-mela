"use client";

import { useState, useEffect, useRef } from 'react';
import Graph from 'graphology';
import GraphVisualization from './GraphVisualization';
import GraphControls from './GraphControls';
import PriorityQueue from './PriorityQueue';
import DistanceTable from './DistanceTable';
import AlgorithmExplanation from './AlgorithmExplanation';
import { DijkstraStep } from './types';
import { generateDijkstraSteps } from '@/lib/graph-algorithm/dijkstra';
import { generateWeightedTeachingGraph } from '@/lib/graph-algorithm/graph-generator';

// Get or create the necessary graph generators
function getInitialGraph(): Graph {
  // Try to import the weighted graph generator
  try {
    // First try to use the existing one if available
    const graph = generateWeightedTeachingGraph();
    return graph;
  } catch (e) {
    // If not available, create a new weighted graph from the teaching graph
    try {
      const { generateTeachingGraph } = require('@/lib/graph-algorithm/graph-generator');
      const graph = generateTeachingGraph();
      
      // Add weights to all edges
      graph.forEachEdge((edge:string, attributes:any, source:string, target:string) => {
        graph.setEdgeAttribute(edge, "weight", Math.floor(Math.random() * 9) + 1);
      });
      
      return graph;
    } catch (e) {
      // If all else fails, create a minimal graph
      const graph = new Graph();
      const nodes = ['A', 'B', 'C', 'D'];
      
      // Add nodes
      nodes.forEach((node, i) => {
        graph.addNode(node, { 
          x: 0.2 + (i % 2) * 0.6, 
          y: 0.2 + Math.floor(i / 2) * 0.6,
          size: 10,
          color: '#6366F1'
        });
      });
      
      // Add edges
      graph.addEdge('A', 'B', { weight: 2 });
      graph.addEdge('A', 'C', { weight: 3 });
      graph.addEdge('B', 'D', { weight: 4 });
      graph.addEdge('C', 'D', { weight: 1 });
      
      return graph;
    }
  }
}

export default function DijkstraVisualizer() {
  const [graph, setGraph] = useState<Graph>(() => getInitialGraph());
  const [startNode, setStartNode] = useState<string>('A');
  const [endNode, setEndNode] = useState<string>('J');
  const [steps, setSteps] = useState<DijkstraStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1000); // ms per step
  
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Generate Dijkstra steps when graph or start/end nodes change
  useEffect(() => {
    if (graph && startNode) {
      try {
        const newSteps = generateDijkstraSteps(graph, startNode, endNode);
        setSteps(newSteps);
        setCurrentStepIndex(-1);
        setIsRunning(false);
      } catch (error) {
        console.error("Error generating Dijkstra steps:", error);
      }
    }
  }, [graph, startNode, endNode]);
  
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
  const currentStep: DijkstraStep | null = 
    currentStepIndex >= 0 && currentStepIndex < steps.length 
      ? steps[currentStepIndex] 
      : null;
  
  return (
    <div className="container mx-auto px-2 py-4">
      <h1 className="text-2xl font-bold text-center mb-4">Dijkstra's Algorithm Visualization</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Main visualization area - 8 columns */}
        <div className="lg:col-span-8 space-y-3">
          <div className="grid grid-cols-12 gap-3">
            {/* Controls - 8 columns */}
            <div className="col-span-8">
              <GraphControls 
                graph={graph}
                onGraphChange={setGraph}
                onStartNodeChange={setStartNode}
                onEndNodeChange={setEndNode}
                onStart={handleStart}
                onPause={handlePause}
                onReset={handleReset}
                onStepForward={handleStepForward}
                onStepBackward={handleStepBackward}
                onSpeedChange={setSpeed}
                selectedStartNode={startNode}
                selectedEndNode={endNode}
                isRunning={isRunning}
                currentStepIndex={currentStepIndex}
                totalSteps={steps.length}
                speed={speed}
              />
            </div>
            
            {/* Priority Queue - 4 columns */}
            <div className="col-span-4">
              <PriorityQueue 
                items={currentStep?.priorityQueue || []}
                currentNode={currentStep?.currentNode || ''}
              />
            </div>
          </div>
          
          {/* Graph visualization */}
          <GraphVisualization 
            graph={graph}
            currentStep={currentStep}
            isRunning={isRunning}
          />
          
          {/* Distance table */}
          <DistanceTable 
            distances={currentStep?.distances || {}}
            previous={currentStep?.previous || {}}
            visited={currentStep?.visited || []}
            currentNode={currentStep?.currentNode || ''}
            targetNode={currentStep?.targetNode}
            shortestPath={currentStep?.shortestPath}
          />
        </div>
        
        {/* Algorithm explanation - 4 columns */}
        <div className="lg:col-span-4">
          <AlgorithmExplanation 
            currentStep={currentStep}
          />
        </div>
      </div>
    </div>
  );
}