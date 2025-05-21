"use client";

interface QueueProps {
  items: string[];
  currentNode: string;
}

export default function Queue({ items, currentNode }: QueueProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 h-full">
      <h2 className="text-lg font-semibold mb-2">Queue</h2>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
        FIFO (First In, First Out)
      </p>
      
      {/* Current node */}
      {currentNode && (
        <div className="mb-2">
          <div className="text-xs text-gray-500 mb-1">Current Node</div>
          <div className="inline-block w-8 h-8 flex items-center justify-center 
                    bg-red-500 text-white font-bold rounded-lg text-sm">
            {currentNode}
          </div>
        </div>
      )}
      
      {/* Queue */}
      <div className="mb-1">
        <div className="text-xs text-gray-500">Queue</div>
        <div className="flex flex-wrap items-center gap-1 mt-1">
          {items.length > 0 ? (
            items.map((item, index) => (
              <div 
                key={index} 
                className="w-8 h-8 flex items-center justify-center 
                          bg-yellow-500 text-white font-bold rounded-lg text-sm
                          border-2 border-yellow-600"
              >
                {item}
              </div>
            ))
          ) : (
            <div className="text-xs text-gray-500 italic">Empty queue</div>
          )}
        </div>
      </div>
    </div>
  );
}