import BFSVisualizer from "@/components/bfs/BFSVisualizer";

export const metadata = {
  title: "Breadth-First Search Algorithm Visualization",
  description: "Interactive visualization of the BFS graph traversal algorithm",
};

export default function BFSPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <BFSVisualizer />
    </div>
  );
}