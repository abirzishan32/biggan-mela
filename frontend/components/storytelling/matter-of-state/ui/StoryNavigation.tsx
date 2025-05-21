"use client";

import { motion } from "framer-motion";

interface StoryNavigationProps {
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isLastScene: boolean;
}

export default function StoryNavigation({
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
  isLastScene
}: StoryNavigationProps) {
  // Add a handler to ensure the click event properly triggers
  const handleNextClick = () => {
    if (canGoNext) {
      onNext();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 flex justify-between">
      <motion.button
        className={`px-5 py-2 rounded-lg flex items-center ${
          canGoPrevious
            ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300"
            : "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500"
        }`}
        onClick={onPrevious}
        disabled={!canGoPrevious}
        whileHover={canGoPrevious ? { scale: 1.05 } : {}}
        whileTap={canGoPrevious ? { scale: 0.95 } : {}}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        আগে যাও
      </motion.button>

      <motion.button
  className={`px-5 py-2 rounded-lg flex items-center ${
    canGoNext
      ? "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
      : "bg-gray-400 text-white cursor-not-allowed dark:bg-gray-700"
  }`}
  // Make sure to call onNext directly here 
  onClick={() => {
    console.log("Button clicked, calling onNext");
    if (canGoNext) {
      onNext();
    }
  }}
  disabled={!canGoNext}
  whileHover={canGoNext ? { scale: 1.05 } : {}}
  whileTap={canGoNext ? { scale: 0.95 } : {}}
>
  {isLastScene ? "কুইজ শুরু করো" : "পরে যাও"}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 ml-1"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
</motion.button>
    </div>
  );
}