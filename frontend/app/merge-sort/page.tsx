import MergeSortVisualizer from "@/components/merge-sort/MergeSortVisualizer";

export const metadata = {
  title: "Merge Sort Algorithm Visualization",
  description: "Interactive visualization of the merge sort algorithm",
};

export default function MergeSortPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <MergeSortVisualizer />
    </div>
  );
}