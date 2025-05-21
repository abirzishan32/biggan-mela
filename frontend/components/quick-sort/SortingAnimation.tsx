"use client";

import { SortStep } from '@/lib/visualizer-adapter';

interface SortingAnimationProps {
  step: SortStep;
  isSorting: boolean;
}

export default function SortingAnimation({
  step,
  isSorting
}: SortingAnimationProps) {
  const array = step.array || [];
  const maxValue = Math.max(...array, 1);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Visualization</h2>
      
      <div className="h-64 flex items-end justify-center gap-1">
        {array.map((value, index) => {
          const isComparing = step.comparingIndices?.includes(index);
          const isSwapped = step.swappedIndices?.includes(index);
          const isPivot = step.pivotIndex === index;
          const isSorted = step.sortedIndices?.includes(index);
          const isInCurrentPartition = step.partitionRange && 
            index >= step.partitionRange[0] && 
            index <= step.partitionRange[1];
          
          // Calculate bar height based on value
          const heightPercentage = (value / maxValue) * 100;
          
          let backgroundColor;
          if (isPivot) backgroundColor = 'bg-purple-600'; // Pivot element
          else if (isSwapped) backgroundColor = 'bg-green-500'; // Just swapped
          else if (isComparing) backgroundColor = 'bg-yellow-500'; // Being compared
          else if (isSorted) backgroundColor = 'bg-green-300'; // Already sorted
          else if (isInCurrentPartition) backgroundColor = 'bg-blue-400'; // In current partition
          else backgroundColor = 'bg-gray-400'; // Not in current partition
          
          return (
            <div
              key={index}
              className={`relative w-full transition-all duration-300 ease-in-out ${backgroundColor}`}
              style={{ height: `${heightPercentage}%` }}
            >
              <div className="absolute inset-x-0 -top-6 text-center text-xs">
                {value}
              </div>
              <div className="absolute inset-x-0 -bottom-6 text-center text-xs">
                {index}
              </div>
              
              {/* Pivot indicator */}
              {isPivot && (
                <div className="absolute -top-10 left-0 right-0 text-xs font-bold text-purple-700 text-center">
                  Pivot
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-sm font-medium">
          {isSorting 
            ? getStepDescription(step)
            : 'Ready to start'
          }
        </p>
      </div>
      
      <div className="mt-4">
        <div className="grid grid-cols-5 gap-2">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-600 mr-2"></div>
            <span className="text-xs">Pivot</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 mr-2"></div>
            <span className="text-xs">Comparing</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 mr-2"></div>
            <span className="text-xs">Swapping</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-300 mr-2"></div>
            <span className="text-xs">Sorted</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-400 mr-2"></div>
            <span className="text-xs">Current Partition</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to generate step description
function getStepDescription(step: SortStep): string {
  if (!step) return '';
  
  if (step.swappedIndices?.length === 2) {
    const [i, j] = step.swappedIndices;
    if (step.pivotIndex === i || step.pivotIndex === j) {
      return `Swapping pivot (${step.array[j]}) to its sorted position`;
    }
    return `Swapping elements at indices ${i} and ${j}`;
  }
  
  if (step.comparingIndices?.length === 2) {
    const [i, j] = step.comparingIndices;
    const pivotValue = step.pivotIndex !== undefined ? step.array[step.pivotIndex] : null;
    
    return `Comparing ${step.array[i]} with pivot value ${pivotValue}`;
  }
  
  if (step.pivotIndex !== undefined) {
    return `Selected pivot: ${step.array[step.pivotIndex]} at index ${step.pivotIndex}`;
  }
  
  if (step.partitionRange) {
    const [start, end] = step.partitionRange;
    if (start > end) {
      return 'Partition complete, subarray is sorted';
    }
    return `Processing partition from index ${start} to ${end}`;
  }
  
  if (step.sortedIndices?.length === step.array.length) {
    return 'Array is fully sorted!';
  }
  
  return 'Processing...';
}