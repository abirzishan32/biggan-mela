"use client";

interface StackProps {
  items: string[];
  currentNode: string;
}

export default function Stack({ items, currentNode }: StackProps) {
  // Reverse the items for display (so top of stack is at the top)
  const displayItems = [...items].reverse();
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 h-full">
      <h2 className="text-lg font-semibold mb-2">Stack</h2>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
        LIFO (Last In, First Out)
      </p>
      
      {/* Stack */}
      <div className="flex flex-col items-center mb-2">
        {displayItems.length > 0 ? (
          displayItems.map((item, index) => {
            const isCurrentNode = item === currentNode;
            const isTop = index === 0;
            
            return (
              <div 
                key={index} 
                className={`w-10 h-8 flex items-center justify-center 
                          border-b-0 first:rounded-t-md last:rounded-b-md last:border-b-2
                          ${isCurrentNode 
                            ? 'bg-red-500 text-white border-2 border-red-600' 
                            : 'bg-purple-500 text-white border-2 border-purple-600'
                          }
                          ${isTop ? 'relative' : ''}`}
              >
                {item}
                {isTop && (
                  <div className="absolute -top-4 left-0 right-0 text-xs text-gray-500 text-center">
                    Top
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-xs text-gray-500 italic">Empty stack</div>
        )}
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        Stack is used for backtracking in DFS
      </div>
    </div>
  );
}