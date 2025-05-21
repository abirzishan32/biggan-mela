"use client";

import { motion } from "framer-motion";
import { QuizQuestion } from "../data/quizzes";

interface ResultScreenProps {
  score: number;
  total: number;
  passingScore: number;
  questions: QuizQuestion[];
  answers: number[];
  onContinue: () => void;
}

export default function ResultScreen({
  score,
  total,
  passingScore,
  questions,
  answers,
  onContinue
}: ResultScreenProps) {
  const isPassed = score >= passingScore;
  const percentage = Math.round((score / total) * 100);

  return (
    <div className="space-y-6">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className={`w-32 h-32 rounded-full mx-auto flex items-center justify-center ${
            isPassed
              ? "bg-green-100 dark:bg-green-900/30"
              : "bg-red-100 dark:bg-red-900/30"
          }`}
        >
          <span
            className={`text-4xl font-bold ${
              isPassed
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {score}/{total}
          </span>
        </div>

        <h3
          className={`text-2xl font-bold mt-4 ${
            isPassed
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {isPassed ? "অভিনন্দন! 🎉" : "পুনরায় চেষ্টা করো! 🔄"}
        </h3>

        <p className="mt-2 text-gray-600 dark:text-gray-300">
          তুমি {total} টির মধ্যে {score} টি সঠিক উত্তর দিয়েছ ({percentage}%)
        </p>

        {!isPassed && (
          <p className="mt-2 text-red-600 dark:text-red-400">
            পাশ করতে তোমার ন্যূনতম {passingScore} টি সঠিক উত্তর দরকার
          </p>
        )}
      </motion.div>

      <div className="space-y-4">
        <h4 className="font-medium text-gray-700 dark:text-gray-200">
          সঠিক উত্তরঃ
        </h4>

        {questions.map((question, index) => {
          const isCorrect = answers[index] === question.correctOption;

          return (
            <div
              key={question.id}
              className={`p-3 rounded-lg ${
                isCorrect
                  ? "bg-green-50 border-l-4 border-green-500 dark:bg-green-900/10 dark:border-green-700"
                  : "bg-red-50 border-l-4 border-red-500 dark:bg-red-900/10 dark:border-red-700"
              }`}
            >
              <p
                className={`font-medium ${
                  isCorrect
                    ? "text-green-700 dark:text-green-400"
                    : "text-red-700 dark:text-red-400"
                }`}
              >
                {index + 1}. {question.question}
              </p>
              <div className="mt-1 text-sm">
                <p>
                  <span className="font-medium">সঠিক উত্তরঃ</span>{" "}
                  {question.options[question.correctOption]}
                </p>
                {!isCorrect && (
                  <p className="text-red-600 dark:text-red-400">
                    <span className="font-medium">তোমার উত্তরঃ</span>{" "}
                    {answers[index] !== undefined
                      ? question.options[answers[index]]
                      : "কোনো উত্তর দেয়নি"}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center mt-6">
        <motion.button
          className={`px-6 py-3 rounded-lg text-white font-medium ${
            isPassed
              ? "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
              : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
          }`}
          onClick={onContinue}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isPassed ? "পরবর্তী অধ্যায়ে যাও" : "আবার চেষ্টা করো"}
        </motion.button>
      </div>
    </div>
  );
}