"use client";

import { MergeSortStep } from '@/lib/visualizer-adapter';

interface AlgorithmExplanationProps {
  currentStep: number;
  steps: MergeSortStep[];
}

export default function AlgorithmExplanation({
  currentStep,
  steps
}: AlgorithmExplanationProps) {
  const getCurrentExplanation = () => {
    if (currentStep === -1 || steps.length === 0) {
      return "Merge Sort is a divide-and-conquer algorithm that divides an array into equal halves, sorts them separately, and then merges the sorted halves.";
    }
    
    if (currentStep >= steps.length) {
      return "Sorting complete! The array is now fully sorted.";
    }
    
    const step = steps[currentStep];
    
    if (step.comparingIndices?.length === 2) {
      const [i, j] = step.comparingIndices;
      return `Comparing ${step.array[i]} at position ${i} with ${step.array[j]} at position ${j} to determine which goes first in the merged array.`;
    }
    
    if (step.swappedIndices?.length > 0) {
      const idx = step.swappedIndices[0];
      if (step.mergeArrays) {
        if (step.mergeArrays.leftIndex > 0 && step.mergeArrays.leftIndex <= step.mergeArrays.left.length) {
          return `Selected ${step.array[idx]} from the left subarray and placed it at position ${idx} in the merged array.`;
        } else if (step.mergeArrays.rightIndex > 0 && step.mergeArrays.rightIndex <= step.mergeArrays.right.length) {
          return `Selected ${step.array[idx]} from the right subarray and placed it at position ${idx} in the merged array.`;
        }
        return `Placing ${step.array[idx]} at position ${idx} in the merged array.`;
      }
    }
    
    if (step.mergingIndices && step.mergingIndices.length > 0) {
      const range = step.subArrayRanges && step.subArrayRanges[0];
      if (range) {
        return `Merging subarray from index ${range[0]} to ${range[1]}. This is where we combine the sorted subarrays.`;
      }
    }
    
    if (step.subArrayRanges?.length === 2) {
      return `Divide step: Splitting the array into two subarrays at indices [${step.subArrayRanges[0][0]}-${step.subArrayRanges[0][1]}] and [${step.subArrayRanges[1][0]}-${step.subArrayRanges[1][1]}].`;
    }
    
    if (step.sortedIndices?.length === step.array.length) {
      return "Merge Sort complete! All elements are in their sorted positions.";
    }
    
    return "Processing...";
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Merge Sort Algorithm</h2>
      
      <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
        <p className="text-blue-800 dark:text-blue-300">
          {getCurrentExplanation()}
        </p>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Pseudocode</h3>
        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md text-sm font-mono overflow-x-auto">
{`function mergeSort(arr, left, right) {
  if (left < right) {
    // Find the middle point
    const mid = Math.floor((left + right) / 2);
    
    // Sort first and second halves
    mergeSort(arr, left, mid);
    mergeSort(arr, mid+1, right);
    
    // Merge the sorted halves
    merge(arr, left, mid, right);
  }
}

function merge(arr, left, mid, right) {
  // Create temp arrays
  const L = arr.slice(left, mid + 1);
  const R = arr.slice(mid + 1, right + 1);
  
  // Merge the temp arrays back
  let i = 0, j = 0, k = left;
  
  while (i < L.length && j < R.length) {
    if (L[i] <= R[j]) {
      arr[k] = L[i];
      i++;
    } else {
      arr[k] = R[j];
      j++;
    }
    k++;
  }
  
  // Copy remaining elements
  while (i < L.length) {
    arr[k] = L[i];
    i++;
    k++;
  }
  
  while (j < R.length) {
    arr[k] = R[j];
    j++;
    k++;
  }
}`}
        </pre>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Characteristics</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li><strong>Time Complexity:</strong> O(n log n) in all cases</li>
          <li><strong>Space Complexity:</strong> O(n) - requires additional space for temporary arrays</li>
          <li><strong>Stable:</strong> Yes - maintains the relative order of equal elements</li>
          <li><strong>In-place:</strong> No - requires extra space proportional to the size of the input array</li>
          <li><strong>Divide & Conquer:</strong> Breaks down problem into smaller, manageable pieces</li>
          <li><strong>Advantages:</strong> Predictable performance, stable, works well for linked lists</li>
        </ul>
      </div>
    </div>
  );
}