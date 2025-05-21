// filepath: /Volumes/Meow/Science-game/choto-game/components/storytelling/matter-of-state/ui/ProgressIndicator.tsx
"use client";

import { useStory } from "../StoryProvider";
import { motion } from "framer-motion";

export default function ProgressIndicator() {
  const { state } = useStory();
  const stages = ["intro", "solid", "liquid", "gas", "transformation", "conclusion"];
  const currentStageIndex = stages.indexOf(state.currentStage);
  
  return (
    <div className="w-full max-w-md mx-auto my-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
          অগ্রগতি
        </span>
        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          {Math.round((currentStageIndex / (stages.length - 1)) * 100)}%
        </span>
      </div>
      
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-indigo-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      
      <div className="flex justify-between mt-1">
        {stages.map((stage, index) => (
          <div key={stage} className="flex flex-col items-center">
            <div 
              className={`w-3 h-3 rounded-full ${
                index <= currentStageIndex 
                  ? 'bg-indigo-600' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
            <span className="text-xs mt-1 hidden md:block">
              {index === 0 && "শুরু"}
              {index === stages.length - 1 && "শেষ"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}