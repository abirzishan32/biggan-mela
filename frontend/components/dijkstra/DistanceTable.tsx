"use client";

interface DistanceTableProps {
  distances: Record<string, number>;
  previous: Record<string, string | null>;
  visited: string[];
  currentNode: string;
  targetNode?: string;
  shortestPath?: string[];
}

export default function DistanceTable({
  distances,
  previous,
  visited,
  currentNode,
  targetNode,
  shortestPath
}: DistanceTableProps) {
  // Sort nodes for consistent display
  const nodes = Object.keys(distances).sort();
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3">
      <h2 className="text-lg font-semibold mb-2">Distances & Paths</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="px-2 py-1 text-left">Node</th>
              <th className="px-2 py-1 text-left">Distance</th>
              <th className="px-2 py-1 text-left">Previous</th>
              <th className="px-2 py-1 text-left">Path</th>
            </tr>
          </thead>
          <tbody>
            {nodes.map((node) => {
              // Determine if this node is in the shortest path
              const isInPath = shortestPath?.includes(node) || false;
              const isVisited = visited.includes(node);
              
              // Generate the path for this node
              const nodePath: string[] = [];
              let current = node;
              while (current) {
                nodePath.unshift(current);
                current = previous[current] || '';
              }
              
              return (
                <tr 
                  key={node} 
                  className={`
                    ${node === currentNode ? 'bg-red-50 dark:bg-red-900/10' : ''}
                    ${node === targetNode ? 'bg-green-50 dark:bg-green-900/10' : ''}
                    ${isInPath && !isVisited ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''}
                    ${isVisited && !isInPath ? 'bg-blue-50 dark:bg-blue-900/10' : ''}
                    ${isVisited && isInPath ? 'bg-purple-50 dark:bg-purple-900/10' : ''}
                    border-b dark:border-gray-700
                  `}
                >
                  <td className="px-2 py-1 font-medium">{node}</td>
                  <td className="px-2 py-1">
                    {distances[node] === Infinity ? '∞' : distances[node]}
                  </td>
                  <td className="px-2 py-1">{previous[node] || '-'}</td>
                  <td className="px-2 py-1 truncate max-w-[120px]">
                    {nodePath.length > 1 ? nodePath.join(' → ') : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}