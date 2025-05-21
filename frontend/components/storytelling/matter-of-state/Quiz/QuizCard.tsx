"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Quiz, QuizQuestion as QuestionType } from "../data/quizzes";
import QuizQuestion from "./QuizQuestion";
import ResultScreen from "./ResultScreen";

interface QuizCardProps {
  quiz: Quiz;
  onComplete: (passed: boolean) => void;
}

export default function QuizCard({ quiz, onComplete }: QuizCardProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = quiz.questions[currentQuestionIndex];

  // Handle answering a question
  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);

    // Update score
    if (answerIndex === currentQuestion.correctOption) {
      setScore((prevScore) => prevScore + 1);
    }

    // Wait a moment to show the correct/incorrect feedback
    setTimeout(() => {
      if (currentQuestionIndex < quiz.questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      } else {
        setShowResults(true);
      }
    }, 1500);
  };

  // Handle quiz completion
  const handleContinue = () => {
    const passed = score >= quiz.passingScore;
    onComplete(passed);
    
    if (!passed) {
      // Reset for retry
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setShowResults(false);
      setScore(0);
    }
  };

  return (
    <motion.div 
      className="max-w-3xl w-full mx-auto px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white">
          <h2 className="text-2xl font-bold text-center">{quiz.title}</h2>
          <p className="mt-2 text-center text-indigo-100">{quiz.description}</p>
          
          {!showResults && (
            <div className="flex justify-between items-center mt-4 text-sm">
              <span className="bg-indigo-800/50 px-3 py-1 rounded-full">
                প্রশ্ন {currentQuestionIndex + 1}/{quiz.questions.length}
              </span>
              <span className="bg-indigo-800/50 px-3 py-1 rounded-full">
                পাশ করতে নম্বর: {quiz.passingScore}/{quiz.questions.length}
              </span>
            </div>
          )}
        </div>

        <div className="p-6 md:p-8">
          {!showResults ? (
            <QuizQuestion
              question={currentQuestion}
              onAnswer={handleAnswer}
              selectedAnswer={answers[currentQuestionIndex]}
            />
          ) : (
            <ResultScreen
              score={score}
              total={quiz.questions.length}
              passingScore={quiz.passingScore}
              questions={quiz.questions}
              answers={answers}
              onContinue={handleContinue}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}