"use client";

import { DijkstraStep } from './types';

interface AlgorithmExplanationProps {
  currentStep: DijkstraStep | null;
}

export default function AlgorithmExplanation({
  currentStep
}: AlgorithmExplanationProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 h-full overflow-y-auto">
      <h2 className="text-lg font-semibold mb-2">Dijkstra's Algorithm</h2>
      
      <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
        <p className="text-blue-800 dark:text-blue-300">
          Dijkstra's algorithm finds the shortest path between nodes in a graph. 
          It uses a priority queue to select the unvisited node with the smallest distance.
        </p>
      </div>
      
      {/* Current state */}
      <div className="mb-3">
        <h3 className="text-sm font-semibold mb-1">Current State</h3>
        {currentStep ? (
          <div className="space-y-1 text-xs">
            <p>
              <span className="font-medium">Current Node:</span> {currentStep.currentNode || 'None'}
            </p>
            {currentStep.processingEdge && (
              <p>
                <span className="font-medium">Examining Edge:</span> {currentStep.processingEdge.source} → {currentStep.processingEdge.target} (weight: {currentStep.processingEdge.weight})
              </p>
            )}
            <p>
              <span className="font-medium">Status:</span> {' '}
              {currentStep.state === 'initial' && "Starting algorithm..."}
              {currentStep.state === 'visiting' && `Visiting node ${currentStep.currentNode}`}
              {currentStep.state === 'relaxing-edges' && (
                currentStep.processingEdge 
                  ? `Checking if path to ${currentStep.processingEdge.target} via ${currentStep.processingEdge.source} is shorter` 
                  : `Examining edges from node ${currentStep.currentNode}`
              )}
              {currentStep.state === 'complete' && "Algorithm complete!"}
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
{`function Dijkstra(graph, start, end=null):
  // Initialize distances with infinity
  let dist = {}, prev = {}
  let pq = new PriorityQueue()
  
  // Set distance for start node to 0
  for each vertex v in graph:
    dist[v] = Infinity
    prev[v] = null
  dist[start] = 0
  
  // Add start to priority queue
  pq.enqueue(start, 0)
  
  while pq is not empty:
    // Get node with minimum distance
    u = pq.dequeue()
    
    // If target is reached, we're done
    if u is end:
      break
      
    // For each neighbor of u
    for each neighbor v of u:
      // Calculate potential new distance
      alt = dist[u] + weight(u, v)
      
      // If we found a better path
      if alt < dist[v]:
        dist[v] = alt
        prev[v] = u
        pq.enqueue(v, alt)
  
  return {dist, prev}`}
        </pre>
      </div>
      
      {/* Characteristics */}
      <div>
        <h3 className="text-sm font-semibold mb-1">Characteristics</h3>
        <ul className="list-disc pl-4 space-y-0.5 text-xs">
          <li><strong>Time Complexity:</strong> O((V + E) log V) with a binary heap</li>
          <li><strong>Space Complexity:</strong> O(V) for the distance, previous, and priority queue</li>
          <li><strong>Limitations:</strong> Only works with non-negative weights</li>
          <li><strong>Data Structure:</strong> Priority Queue</li>
          <li><strong>Applications:</strong> GPS navigation, network routing, flight scheduling</li>
        </ul>
      </div>
    </div>
  );
}