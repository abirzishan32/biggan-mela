"use client";

import { MergeSortStep } from '@/lib/visualizer-adapter';
import { useEffect, useRef } from 'react';

interface SortingAnimationProps {
  step: MergeSortStep;
  isSorting: boolean;
}

export default function SortingAnimation({
  step,
  isSorting
}: SortingAnimationProps) {
  const array = step.array || [];
  const maxValue = Math.max(...array, 1);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Special visualization for merge operation
  const mergeVisualization = step.mergeArrays && (
    <div className="mt-4 mb-8 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
      <h3 className="text-sm font-semibold mb-2">Current Merge Operation</h3>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Left subarray */}
        <div>
          <div className="text-xs font-medium mb-1">Left Subarray</div>
          <div className="flex items-end gap-1 h-20">
            {step.mergeArrays.left.map((value, idx) => {
              const isActive = idx === step.mergeArrays?.leftIndex;
              
              return (
                <div 
                  key={`left-${idx}`}
                  className={`relative flex-1 transition-all ${
                    isActive ? 'bg-yellow-500' : 'bg-blue-400'
                  }`}
                  style={{ height: `${(value / maxValue) * 100}%` }}
                >
                  <div className="absolute inset-x-0 -top-5 text-center text-xs">
                    {value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Right subarray */}
        <div>
          <div className="text-xs font-medium mb-1">Right Subarray</div>
          <div className="flex items-end gap-1 h-20">
            {step.mergeArrays.right.map((value, idx) => {
              const isActive = idx === step.mergeArrays?.rightIndex;
              
              return (
                <div 
                  key={`right-${idx}`}
                  className={`relative flex-1 transition-all ${
                    isActive ? 'bg-yellow-500' : 'bg-red-400'
                  }`}
                  style={{ height: `${(value / maxValue) * 100}%` }}
                >
                  <div className="absolute inset-x-0 -top-5 text-center text-xs">
                    {value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
  
  useEffect(() => {
    // Scroll to active elements
    if (containerRef.current) {
      const activeElements = containerRef.current.querySelectorAll('.comparing, .swapped, .merging');
      if (activeElements.length > 0) {
        activeElements[0].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [step]);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Merge Sort Visualization</h2>
      
      {/* Current subarrays indicator */}
      {step.subArrayRanges && step.subArrayRanges.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Active Subarrays:</h3>
          <div className="flex flex-wrap gap-2">
            {step.subArrayRanges.map((range, idx) => (
              <div 
                key={idx}
                className="text-xs bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-md"
              >
                [{range[0]} — {range[1]}]
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Merge visualization */}
      {mergeVisualization}
      
      {/* Main array visualization */}
      <div 
        ref={containerRef}
        className="h-64 flex items-end justify-center gap-1 overflow-x-auto pb-8"
      >
        {array.map((value, index) => {
          const isComparing = step.comparingIndices?.includes(index);
          const isSwapped = step.swappedIndices?.includes(index);
          const isMerging = step.mergingIndices?.includes(index);
          const isSorted = step.sortedIndices?.includes(index);
          
          // Check if this index is in any active subarray range
          let inActiveSubArray = false;
          if (step.subArrayRanges) {
            inActiveSubArray = step.subArrayRanges.some(
              range => index >= range[0] && index <= range[1]
            );
          }
          
          // Calculate bar height based on value
          const heightPercentage = (value / maxValue) * 100;
          
          let bgColorClass = 'bg-gray-400';
          if (isComparing) bgColorClass = 'bg-yellow-500 comparing';
          else if (isSwapped) bgColorClass = 'bg-green-500 swapped';
          else if (isMerging) bgColorClass = 'bg-purple-500 merging';
          else if (isSorted) bgColorClass = 'bg-green-300';
          else if (inActiveSubArray) bgColorClass = 'bg-blue-400';
          
          return (
            <div
              key={index}
              className={`relative flex-1 min-w-8 transition-all duration-300 ease-in-out ${bgColorClass}`}
              style={{ height: `${heightPercentage}%` }}
            >
              <div className="absolute inset-x-0 -top-6 text-center text-xs">
                {value}
              </div>
              <div className="absolute inset-x-0 -bottom-6 text-center text-xs">
                {index}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-sm font-medium">
          {getStepDescription(step, isSorting)}
        </p>
      </div>
      
      <div className="mt-4">
        <div className="grid grid-cols-5 gap-2">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 mr-2"></div>
            <span className="text-xs">Comparing</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 mr-2"></div>
            <span className="text-xs">Replacing</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-500 mr-2"></div>
            <span className="text-xs">Merging</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-300 mr-2"></div>
            <span className="text-xs">Sorted</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-400 mr-2"></div>
            <span className="text-xs">Active Range</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to generate step description
function getStepDescription(step: MergeSortStep, isSorting: boolean): string {
  if (!isSorting) return 'Ready to start';
  if (!step) return '';
  
  if (step.comparingIndices?.length === 2) {
    const [i, j] = step.comparingIndices;
    return `Comparing elements at indices ${i} (value: ${step.array[i]}) and ${j} (value: ${step.array[j]})`;
  }
  
  if (step.swappedIndices?.length > 0) {
    const idx = step.swappedIndices[0];
    if (step.mergeArrays) {
      return `Placing ${step.array[idx]} at position ${idx} in the merged array`;
    }
    return `Updating element at index ${idx} to ${step.array[idx]}`;
  }
  
  if (step.mergingIndices && step.mergingIndices.length > 0) {
    const range = step.subArrayRanges && step.subArrayRanges[0];
    if (range) {
      return `Merging subarray from index ${range[0]} to ${range[1]}`;
    }
    return 'Merging subarrays';
  }
  
  if (step.subArrayRanges?.length === 2) {
    return `Splitting into two subarrays: [${step.subArrayRanges[0][0]}-${step.subArrayRanges[0][1]}] and [${step.subArrayRanges[1][0]}-${step.subArrayRanges[1][1]}]`;
  }
  
  if (step.sortedIndices?.length === step.array.length) {
    return 'Array is fully sorted!';
  }
  
  return 'Processing...';
}