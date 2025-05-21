"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

type Character = "boy" | "girl";
type StoryStage = "intro" | "solid" | "liquid" | "gas" | "transformation" | "conclusion";
type QuizStatus = "notStarted" | "inProgress" | "passed" | "failed";

interface StoryState {
  character: Character;
  currentStage: StoryStage;
  completedStages: StoryStage[];
  quizStatus: Record<StoryStage, QuizStatus>;
  soundEnabled: boolean;
}

interface StoryContextType {
  state: StoryState;
  selectCharacter: (character: Character) => void;
  goToStage: (stage: StoryStage) => void;
  completeStage: (stage: StoryStage) => void;
  setQuizStatus: (stage: StoryStage, status: QuizStatus) => void;
  toggleSound: () => void;
  resetStory: () => void;
}

const defaultState: StoryState = {
  character: "boy",
  currentStage: "intro",
  completedStages: [],
  quizStatus: {
    intro: "notStarted",
    solid: "notStarted",
    liquid: "notStarted",
    gas: "notStarted",
    transformation: "notStarted",
    conclusion: "notStarted",
  },
  soundEnabled: true,
};

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export function StoryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoryState>(defaultState);

  const selectCharacter = (character: Character) => {
    setState((prev) => ({ ...prev, character }));
  };

  const goToStage = (currentStage: StoryStage) => {
    setState((prev) => ({ ...prev, currentStage }));
  };

  const completeStage = (stage: StoryStage) => {
    setState((prev) => ({
      ...prev,
      completedStages: [...prev.completedStages, stage].filter(
        (value, index, array) => array.indexOf(value) === index
      ),
    }));
  };

  const setQuizStatus = (stage: StoryStage, status: QuizStatus) => {
    setState((prev) => ({
      ...prev,
      quizStatus: { ...prev.quizStatus, [stage]: status },
    }));
  };

  const toggleSound = () => {
    setState((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const resetStory = () => {
    setState(defaultState);
  };

  return (
    <StoryContext.Provider
      value={{
        state,
        selectCharacter,
        goToStage,
        completeStage,
        setQuizStatus,
        toggleSound,
        resetStory,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
}

export function useStory() {
  const context = useContext(StoryContext);
  if (context === undefined) {
    throw new Error("useStory must be used within a StoryProvider");
  }
  return context;
}