"use client";

import { motion, AnimatePresence } from "framer-motion";
import React from "react";

interface AnimatedTransitionProps {
  children: React.ReactNode;
  isTransitioning: boolean;
}

export default function AnimatedTransition({ children, isTransitioning }: AnimatedTransitionProps) {
  return (
    <div className="relative w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={isTransitioning ? "transitioning" : "content"}
          initial={{ opacity: 0, x: isTransitioning ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: isTransitioning ? -100 : 100 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="w-full"
        >
          {isTransitioning ? (
            <div className="min-h-[500px] flex items-center justify-center">
              <div className="flex flex-col items-center">
                <svg
                  className="animate-spin h-12 w-12 text-indigo-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="mt-4 text-lg font-medium text-indigo-600 dark:text-indigo-400">
                  পরবর্তী অধ্যায়ে যাচ্ছি...
                </p>
              </div>
            </div>
          ) : (
            children
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}