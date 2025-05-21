import DFSVisualizer from "@/components/dfs/DFSVisualizer";

export const metadata = {
  title: "Depth-First Search Visualization",
  description: "Interactive visualization of the DFS graph traversal algorithm",
};

export default function DFSPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4">
      <DFSVisualizer />
    </div>
  );
}