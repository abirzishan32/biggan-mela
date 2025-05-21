import BubbleSortVisualizer from "@/components/bubble-sort/BubbleSortVisualizer";

export const metadata = {
  title: "Bubble Sort Algorithm Visualization",
  description: "Interactive visualization of the bubble sort algorithm",
};

export default function BubbleSortPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <BubbleSortVisualizer />
    </div>
  );
}