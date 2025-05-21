
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

export default function Tooltip({ text, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="cursor-help"
      >
        {children}
      </div>
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="absolute z-10 w-64 bg-black dark:bg-gray-900 text-white text-sm rounded-lg py-2 px-3 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {text}
            <div className="absolute w-3 h-3 bg-black dark:bg-gray-900 transform rotate-45 left-1/2 -translate-x-1/2 -bottom-1"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}