"use client";

import { useState, useEffect } from 'react';
import Graph from 'graphology';
import { generateTeachingGraph, generateRandomGraph } from '@/lib/graph-algorithm/graph-generator';

// Extend the graph generator to create weighted graphs
function generateWeightedTeachingGraph(): Graph {
  const graph = generateTeachingGraph();
  
  // Add weights to all edges
  graph.forEachEdge((edge, attributes, source, target) => {
    graph.setEdgeAttribute(edge, "weight", Math.floor(Math.random() * 9) + 1);
  });
  
  return graph;
}

function generateWeightedRandomGraph(nodeCount: number, edgeProbability: number): Graph {
  const graph = generateRandomGraph(nodeCount, edgeProbability);
  
  // Add weights to all edges
  graph.forEachEdge((edge, attributes, source, target) => {
    graph.setEdgeAttribute(edge, "weight", Math.floor(Math.random() * 9) + 1);
  });
  
  return graph;
}

interface GraphControlsProps {
  graph: Graph;
  onGraphChange: (graph: Graph) => void;
  onStartNodeChange: (nodeId: string) => void;
  onEndNodeChange: (nodeId: string) => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onSpeedChange: (speed: number) => void;
  selectedStartNode: string;
  selectedEndNode: string;
  isRunning: boolean;
  currentStepIndex: number;
  totalSteps: number;
  speed: number;
}

export default function GraphControls({
  graph,
  onGraphChange,
  onStartNodeChange,
  onEndNodeChange,
  onStart,
  onPause,
  onReset,
  onStepForward,
  onStepBackward,
  onSpeedChange,
  selectedStartNode,
  selectedEndNode,
  isRunning,
  currentStepIndex,
  totalSteps,
  speed
}: GraphControlsProps) {
  const [graphType, setGraphType] = useState<'teaching' | 'random'>('teaching');
  const [nodeCount, setNodeCount] = useState<number>(10);
  const [edgeProbability, setEdgeProbability] = useState<number>(0.3);
  
  // Generate a new graph
  const handleGenerateGraph = () => {
    try {
      let newGraph: Graph;
      
      if (graphType === 'teaching') {
        newGraph = generateWeightedTeachingGraph();
        // Set default start and end nodes for teaching graph
        onGraphChange(newGraph);
        onStartNodeChange('A');
        onEndNodeChange('J');
      } else {
        newGraph = generateWeightedRandomGraph(nodeCount, edgeProbability);
        onGraphChange(newGraph);
        // Set first and last nodes as default start/end for random graph
        const nodes = newGraph.nodes();
        if (nodes.length > 0) {
          onStartNodeChange(nodes[0]);
          onEndNodeChange(nodes[nodes.length - 1]);
        }
      }
      
      console.log(`Generated ${graphType} graph with ${newGraph.order} nodes and ${newGraph.size} edges`);
    } catch (error) {
      console.error("Error generating graph:", error);
    }
  };
  
  // When graphType changes, update the graph
  useEffect(() => {
    if (!isRunning) {
      handleGenerateGraph();
    }
  }, [graphType]);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3">
      <h2 className="text-lg font-semibold mb-2">Controls</h2>
      
      {/* Graph type selection */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <label className="block text-xs font-medium mb-1">Graph Type</label>
          <div className="flex gap-2">
            <button
              onClick={() => setGraphType('teaching')}
              className={`px-2 py-1 text-xs rounded ${
                graphType === 'teaching' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
              disabled={isRunning}
            >
              Teaching
            </button>
            <button
              onClick={() => setGraphType('random')}
              className={`px-2 py-1 text-xs rounded ${
                graphType === 'random' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
              disabled={isRunning}
            >
              Random
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-medium mb-1">Generate</label>
          <button
            onClick={handleGenerateGraph}
            className="px-2 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 w-full"
            disabled={isRunning}
          >
            Generate Graph
          </button>
        </div>
      </div>
      
      {/* Start and end node selection */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <label className="block text-xs font-medium mb-1">Start Node</label>
          <select
            value={selectedStartNode}
            onChange={(e) => onStartNodeChange(e.target.value)}
            className="w-full px-2 py-1 text-xs border rounded-md bg-white dark:bg-gray-700 text-black dark:text-white"
            disabled={isRunning}
          >
            {graph.nodes().map((nodeId) => (
              <option key={nodeId} value={nodeId}>
                {nodeId}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-xs font-medium mb-1">Target Node</label>
          <select
            value={selectedEndNode}
            onChange={(e) => onEndNodeChange(e.target.value)}
            className="w-full px-2 py-1 text-xs border rounded-md bg-white dark:bg-gray-700 text-black dark:text-white"
            disabled={isRunning}
          >
            {graph.nodes().map((nodeId) => (
              <option key={nodeId} value={nodeId}>
                {nodeId}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Random graph parameters */}
      {graphType === 'random' && (
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label className="block text-xs font-medium mb-1">Nodes: {nodeCount}</label>
            <input
              type="range"
              min="5"
              max="20"
              value={nodeCount}
              onChange={(e) => setNodeCount(parseInt(e.target.value))}
              className="w-full h-1"
              disabled={isRunning}
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium mb-1">Density: {edgeProbability}</label>
            <input
              type="range"
              min="0.1"
              max="0.5"
              step="0.05"
              value={edgeProbability}
              onChange={(e) => setEdgeProbability(parseFloat(e.target.value))}
              className="w-full h-1"
              disabled={isRunning}
            />
          </div>
        </div>
      )}
      
      {/* Reset button and progress */}
      <div className="mb-2">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="px-2 py-1 text-xs bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:opacity-50"
              disabled={isRunning && currentStepIndex === 0}
            >
              Reset
            </button>
            <span className="text-xs font-medium">Step {currentStepIndex + 1} of {totalSteps}</span>
          </div>
          <span className="text-xs">Speed</span>
        </div>
        
        <div className="mb-2 flex items-center gap-2">
          <div className="h-1 flex-grow bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-200"
              style={{ 
                width: `${totalSteps > 0 ? (currentStepIndex / (totalSteps - 1)) * 100 : 0}%` 
              }}
            ></div>
          </div>
          
          <input
            type="range"
            min="200"
            max="2000"
            step="100"
            value={speed}
            onChange={(e) => onSpeedChange(parseInt(e.target.value))}
            className="w-16 h-1"
          />
        </div>
      </div>
      
      {/* Playback controls */}
      <div className="flex justify-between">
        <button
          onClick={onStepBackward}
          className="px-2 py-1 text-xs bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
          disabled={currentStepIndex <= 0 || isRunning}
        >
          ⏮️
        </button>
        
        {isRunning ? (
          <button
            onClick={onPause}
            className="px-2 py-1 text-xs bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none"
          >
            ⏸️
          </button>
        ) : (
          <button
            onClick={onStart}
            className="px-2 py-1 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none disabled:opacity-50"
            disabled={currentStepIndex >= totalSteps - 1}
          >
            ▶️
          </button>
        )}
        
        <button
          onClick={onStepForward}
          className="px-2 py-1 text-xs bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
          disabled={currentStepIndex >= totalSteps - 1 || isRunning}
        >
          ⏭️
        </button>
      </div>
    </div>
  );
}