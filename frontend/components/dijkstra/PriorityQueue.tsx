"use client";

interface PriorityQueueProps {
  items: {
    node: string;
    distance: number;
  }[];
  currentNode: string;
}

export default function PriorityQueue({ items, currentNode }: PriorityQueueProps) {
  // Sort the queue by distance for display
  const sortedItems = [...items].sort((a, b) => a.distance - b.distance);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 h-full">
      <h2 className="text-lg font-semibold mb-2">Priority Queue</h2>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
        Nodes ordered by distance from start
      </p>
      
      {/* Queue visualization */}
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {sortedItems.length > 0 ? (
          sortedItems.map((item, index) => (
            <div 
              key={index}
              className={`flex justify-between items-center rounded-md px-2 py-1 text-xs
                        ${item.node === currentNode 
                          ? 'bg-red-100 border border-red-300 dark:bg-red-900/20 dark:border-red-800' 
                          : 'bg-gray-100 border border-gray-200 dark:bg-gray-700 dark:border-gray-600'
                        }`}
            >
              <span className="font-medium">{item.node}</span>
              <span className={`px-1.5 py-0.5 rounded ${
                item.distance === Infinity 
                  ? 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300' 
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
              }`}>
                {item.distance === Infinity ? '∞' : item.distance}
              </span>
            </div>
          ))
        ) : (
          <div className="text-xs text-gray-500 italic">Empty queue</div>
        )}
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        Next node to visit is at the top
      </div>
    </div>
  );
}