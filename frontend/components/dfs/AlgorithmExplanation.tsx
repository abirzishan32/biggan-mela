"use client";

import { DFSStep } from './types';

interface AlgorithmExplanationProps {
  currentStep: DFSStep | null;
}

export default function AlgorithmExplanation({
  currentStep
}: AlgorithmExplanationProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 h-full">
      <h2 className="text-lg font-semibold mb-2">Depth-First Search (DFS)</h2>
      
      <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
        <p className="text-blue-800 dark:text-blue-300">
          DFS explores as far as possible along each branch before backtracking, 
          using a stack data structure to keep track of nodes to visit.
        </p>
      </div>
      
      {/* Current state */}
      <div className="mb-3">
        <h3 className="text-sm font-semibold mb-1">Current State</h3>
        {currentStep ? (
          <div className="space-y-1 text-xs">
            <p>
              <span className="font-medium">Current:</span> {currentStep.currentNode || 'None'}
            </p>
            <p>
              <span className="font-medium">Stack:</span> {currentStep.stack.length > 0 ? currentStep.stack.join(', ') : 'Empty'}
            </p>
            <p>
              <span className="font-medium">Visited:</span> {currentStep.visited.length > 0 ? currentStep.visited.join(', ') : 'None'}
            </p>
            <p>
              <span className="font-medium">Status:</span> {' '}
              {currentStep.state === 'initial' && "Starting DFS..."}
              {currentStep.state === 'visiting' && `Visiting node ${currentStep.currentNode}`}
              {currentStep.state === 'processing-neighbors' && (
                currentStep.processingEdge 
                  ? `Adding node ${currentStep.processingEdge.target} to stack` 
                  : `Processing neighbors of node ${currentStep.currentNode}`
              )}
              {currentStep.state === 'backtracking' && "Backtracking - no more unvisited neighbors"}
              {currentStep.state === 'complete' && "DFS traversal complete!"}
            </p>
          </div>
        ) : (
          <p className="text-xs text-gray-500">
            No step information available yet.
          </p>
        )}
      </div>
      
      {/* Algorithm pseudocode */}
      <div className="mb-3">
        <h3 className="text-sm font-semibold mb-1">Algorithm</h3>
        <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded-md text-xs font-mono overflow-x-auto">
{`function DFS(graph, startNode):
  // Create a stack for DFS
  let stack = [startNode]
  let visited = new Set()
  
  while stack is not empty:
    // Get the top node (don't pop yet)
    let current = stack[stack.length-1]
    
    if current is not in visited:
      // Mark as visited
      visited.add(current)
      
      // Find an unvisited neighbor
      let foundUnvisited = false
      for each neighbor of current:
        if neighbor is not in visited:
          stack.push(neighbor)
          foundUnvisited = true
          break
      
      // If no unvisited neighbors, backtrack
      if not foundUnvisited:
        stack.pop()
    else:
      // Already visited, backtrack
      stack.pop()`}
        </pre>
      </div>
      
      {/* Characteristics */}
      <div>
        <h3 className="text-sm font-semibold mb-1">Characteristics</h3>
        <ul className="list-disc pl-4 space-y-0.5 text-xs">
          <li><strong>Time:</strong> O(V + E)</li>
          <li><strong>Space:</strong> O(V) for the stack and visited set</li>
          <li><strong>Use Cases:</strong> Pathfinding, topological sort, cycle detection</li>
          <li><strong>Data Structure:</strong> Stack (LIFO - Last In, First Out)</li>
          <li><strong>Key Insight:</strong> Explores deep branches before wide ones</li>
        </ul>
      </div>
    </div>
  );
}