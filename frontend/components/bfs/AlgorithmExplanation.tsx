"use client";

import { BFSStep } from './types';

interface AlgorithmExplanationProps {
  currentStep: BFSStep | null;
}

export default function AlgorithmExplanation({
  currentStep
}: AlgorithmExplanationProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 h-full">
      <h2 className="text-lg font-semibold mb-2">Breadth-First Search (BFS)</h2>
      
      <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
        <p className="text-blue-800 dark:text-blue-300">
          BFS explores all vertices at the current depth before moving to the next depth level,
          using a queue to track the next vertices to explore.
        </p>
      </div>
      
      {/* Current state - more compact */}
      <div className="mb-3">
        <h3 className="text-sm font-semibold mb-1">Current State</h3>
        {currentStep ? (
          <div className="space-y-1 text-xs">
            <p>
              <span className="font-medium">Current:</span> {currentStep.currentNode || 'None'}
            </p>
            <p>
              <span className="font-medium">Queue:</span> {currentStep.queue.length > 0 ? currentStep.queue.join(', ') : 'Empty'}
            </p>
            <p>
              <span className="font-medium">Visited:</span> {currentStep.visited.length > 0 ? currentStep.visited.join(', ') : 'None'}
            </p>
          </div>
        ) : (
          <p className="text-xs text-gray-500">
            No step information available yet.
          </p>
        )}
      </div>
      
      {/* Algorithm pseudocode - more compact */}
      <div className="mb-3">
        <h3 className="text-sm font-semibold mb-1">Algorithm</h3>
        <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded-md text-xs font-mono overflow-x-auto">
{`function BFS(graph, startNode):
  let queue = [startNode]
  let visited = new Set([startNode])
  
  while queue is not empty:
    let current = queue.shift()
    process(current)
    
    for each neighbor of current:
      if neighbor not in visited:
        visited.add(neighbor)
        queue.push(neighbor)`}
        </pre>
      </div>
      
      {/* Characteristics - more compact */}
      <div>
        <h3 className="text-sm font-semibold mb-1">Characteristics</h3>
        <ul className="list-disc pl-4 space-y-0.5 text-xs">
          <li><strong>Time:</strong> O(V + E)</li>
          <li><strong>Space:</strong> O(V)</li>
          <li><strong>Use Cases:</strong> Shortest path (unweighted), level order traversal</li>
          <li><strong>Key Insight:</strong> Visits nodes by distance from source</li>
        </ul>
      </div>
    </div>
  );
}