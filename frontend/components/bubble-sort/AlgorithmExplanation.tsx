"use client";

import { SortStep } from '@/lib/visualizer-adapter';

interface AlgorithmExplanationProps {
  currentStep: number;
  steps: SortStep[];
}

export default function AlgorithmExplanation({
  currentStep,
  steps
}: AlgorithmExplanationProps) {
  const getCurrentExplanation = () => {
    if (currentStep === -1) {
      return "Bubble Sort works by repeatedly stepping through the list, comparing adjacent elements, and swapping them if they're in the wrong order.";
    }
    
    if (currentStep >= steps.length) {
      return "Sorting complete! The array is now fully sorted.";
    }
    
    const step = steps[currentStep];
    
    if (step.swappedIndices.length > 0) {
      const [i, j] = step.swappedIndices;
      return `Swapping elements at indices ${i} and ${j} because ${steps[currentStep-1].array[i]} > ${steps[currentStep-1].array[j]}.`;
    }
    
    if (step.comparingIndices.length > 0) {
      const [i, j] = step.comparingIndices;
      return `Comparing elements at indices ${i} (value: ${step.array[i]}) and ${j} (value: ${step.array[j]}).`;
    }
    
    return "Processing...";
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Bubble Sort Algorithm</h2>
      
      <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
        <p className="text-blue-800 dark:text-blue-300">
          {getCurrentExplanation()}
        </p>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Pseudocode</h3>
        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md text-sm font-mono overflow-x-auto">
{`function bubbleSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Compare adjacent elements
      if (arr[j] > arr[j + 1]) {
        // Swap them if they are in wrong order
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
      }
    }
  }
  
  return arr;
}`}
        </pre>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Characteristics</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li><strong>Time Complexity:</strong> O(n²) in worst and average cases</li>
          <li><strong>Space Complexity:</strong> O(1)</li>
          <li><strong>Stable:</strong> Yes - the relative order of equal elements is preserved</li>
          <li><strong>In-place:</strong> Yes - requires only a constant amount O(1) of additional memory space</li>
        </ul>
      </div>
    </div>
  );
}