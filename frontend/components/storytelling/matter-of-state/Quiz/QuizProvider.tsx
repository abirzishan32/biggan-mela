"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

// This is a minimal implementation as most quiz state is handled in StoryProvider
interface QuizState {
  currentQuizId: string | null;
  answers: Record<string, number[]>;
}

interface QuizContextType {
  state: QuizState;
  setCurrentQuiz: (quizId: string | null) => void;
  setAnswer: (questionId: string, answerIndex: number) => void;
  resetQuiz: (quizId: string) => void;
}

const initialState: QuizState = {
  currentQuizId: null,
  answers: {}
};

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<QuizState>(initialState);

  const setCurrentQuiz = (quizId: string | null) => {
    setState((prev) => ({ ...prev, currentQuizId: quizId }));
  };

  const setAnswer = (questionId: string, answerIndex: number) => {
    setState((prev) => {
      const currentAnswers = prev.answers[prev.currentQuizId || ""] || [];
      return {
        ...prev,
        answers: {
          ...prev.answers,
          [prev.currentQuizId || ""]: [...currentAnswers, answerIndex]
        }
      };
    });
  };

  const resetQuiz = (quizId: string) => {
    setState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [quizId]: [] }
    }));
  };

  return (
    <QuizContext.Provider
      value={{ state, setCurrentQuiz, setAnswer, resetQuiz }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
}