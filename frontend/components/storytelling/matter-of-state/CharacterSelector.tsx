"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { useStory } from "./StoryProvider";

interface CharacterSelectorProps {
  onCharacterSelected: () => void;
}

export default function CharacterSelector({ onCharacterSelected }: CharacterSelectorProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<"boy" | "girl" | null>(null);
  const { selectCharacter } = useStory();

  const handleSelectCharacter = (character: "boy" | "girl") => {
    setSelectedCharacter(character);
    selectCharacter(character);
  };

  const handleContinue = () => {
    if (selectedCharacter) {
      onCharacterSelected();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-indigo-600 text-white p-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold">
            পদার্থের অবস্থা জানার অভিযাত্রা
          </h1>
          <p className="mt-2 text-indigo-100">
            একটি চরিত্র বেছে নিয়ে শুরু করো তোমার শেখার যাত্রা
          </p>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-semibold text-center mb-6 text-indigo-700 dark:text-indigo-300">
            তোমার বন্ধুকে বেছে নাও
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* Boy character */}
            <motion.div
              className={`bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 cursor-pointer flex flex-col items-center transition-all ${
                selectedCharacter === "boy"
                  ? "ring-4 ring-indigo-500 transform scale-105"
                  : "hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
              }`}
              onClick={() => handleSelectCharacter("boy")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative w-40 h-40 mb-4">
                <Image
                  src="/images/storytelling/matter-of-state/character-boy.gif"
                  alt="রাজু"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-lg font-medium text-indigo-700 dark:text-indigo-300">
                রাজু
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center mt-2">
                আমি রাজু। আমি বিজ্ঞান ভালোবাসি এবং নতুন জিনিস শিখতে খুব আগ্রহী।
              </p>
            </motion.div>

            {/* Girl character */}
            <motion.div
              className={`bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 cursor-pointer flex flex-col items-center transition-all ${
                selectedCharacter === "girl"
                  ? "ring-4 ring-indigo-500 transform scale-105"
                  : "hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
              }`}
              onClick={() => handleSelectCharacter("girl")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative w-40 h-40 mb-4">
                <Image
                  src="/images/storytelling/matter-of-state/character-girl.gif"
                  alt="মিতা"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-lg font-medium text-indigo-700 dark:text-indigo-300">
                মিতা
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center mt-2">
                আমি মিতা। আমি জানতে চাই কিভাবে সব কিছু কাজ করে এবং চারপাশের জগত সম্পর্কে জানতে ভালোবাসি।
              </p>
            </motion.div>
          </div>

          <div className="mt-8 flex justify-center">
            <motion.button
              className={`px-6 py-3 rounded-lg text-white font-medium ${
                selectedCharacter
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={handleContinue}
              disabled={!selectedCharacter}
              whileHover={selectedCharacter ? { scale: 1.05 } : {}}
              whileTap={selectedCharacter ? { scale: 0.95 } : {}}
            >
              শুরু করো
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}