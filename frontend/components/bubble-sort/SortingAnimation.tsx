"use client";

interface SortingAnimationProps {
  array: number[];
  comparingIndices: number[];
  swappedIndices: number[];
  isSorting: boolean;
}

export default function SortingAnimation({
  array,
  comparingIndices,
  swappedIndices,
  isSorting
}: SortingAnimationProps) {
  const maxValue = Math.max(...array);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Visualization</h2>
      
      <div className="h-64 flex items-end justify-center gap-1">
        {array.map((value, index) => {
          const isComparing = comparingIndices.includes(index);
          const isSwapped = swappedIndices.includes(index);
          
          // Calculate bar height based on value
          const heightPercentage = (value / maxValue) * 100;
          
          return (
            <div
              key={index}
              className={`relative w-full transition-all duration-300 ease-in-out
                ${isComparing ? 'bg-yellow-500' : isSwapped ? 'bg-green-500' : 'bg-blue-500'}`}
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
          {isSorting 
            ? (swappedIndices.length > 0 
                ? `Swapping elements at indices ${swappedIndices.join(' and ')}`
                : comparingIndices.length > 0 
                  ? `Comparing elements at indices ${comparingIndices.join(' and ')}`
                  : 'Processing...')
            : 'Ready to start'
          }
        </p>
      </div>
    </div>
  );
}