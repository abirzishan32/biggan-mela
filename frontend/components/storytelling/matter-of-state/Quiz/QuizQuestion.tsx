"use client";

import { motion } from "framer-motion";
import { QuizQuestion as QuizQuestionType } from "../data/quizzes";

interface QuizQuestionProps {
  question: QuizQuestionType;
  onAnswer: (answerIndex: number) => void;
  selectedAnswer?: number;
}

export default function QuizQuestion({ question, onAnswer, selectedAnswer }: QuizQuestionProps) {
  const isAnswered = selectedAnswer !== undefined;
  const isCorrect = selectedAnswer === question.correctOption;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
        {question.question}
      </h3>

      <div className="space-y-2">
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            className={`w-full text-left p-3 rounded-lg border transition-all ${
              selectedAnswer === index
                ? selectedAnswer === question.correctOption
                  ? "bg-green-100 border-green-500 dark:bg-green-900/30 dark:border-green-700"
                  : "bg-red-100 border-red-500 dark:bg-red-900/30 dark:border-red-700"
                : "bg-white border-gray-300 hover:bg-indigo-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-indigo-900/30"
            }`}
            onClick={() => !isAnswered && onAnswer(index)}
            disabled={isAnswered}
            whileHover={!isAnswered ? { scale: 1.02 } : {}}
            whileTap={!isAnswered ? { scale: 0.98 } : {}}
          >
            <div className="flex items-center">
              <div
                className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${
                  selectedAnswer === index
                    ? selectedAnswer === question.correctOption
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                    : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                {String.fromCharCode(65 + index)}
              </div>
              <span
                className={`${
                  selectedAnswer === index
                    ? selectedAnswer === question.correctOption
                      ? "text-green-700 dark:text-green-300"
                      : "text-red-700 dark:text-red-300"
                    : "text-gray-800 dark:text-gray-200"
                }`}
              >
                {option}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {isAnswered && (
        <motion.div
          className={`mt-4 p-3 rounded-lg ${
            isCorrect
              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
              : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="font-medium">
            {isCorrect ? "সঠিক উত্তর! 👏" : "দুঃখিত, ভুল উত্তর 😔"}
          </p>
          <p className="mt-1">{question.explanation}</p>
        </motion.div>
      )}
    </div>
  );
}