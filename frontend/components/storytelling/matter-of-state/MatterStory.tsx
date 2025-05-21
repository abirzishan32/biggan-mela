"use client";

import { useState, useEffect } from "react";
import { useStory } from "./StoryProvider";
import StoryScene from "./StoryScene";
import QuizCard from "./Quiz/QuizCard";
import CharacterSelector from "./CharacterSelector";
import AnimatedTransition from "./AnimatedTransition";
import StoryNavigation from "./ui/StoryNavigation";
import SoundButton from "./ui/SoundButton";
import { stories } from "./data/stories";
import { quizzes } from "./data/quizzes";


export default function MatterStory() {
  const { state, goToStage } = useStory();
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showCharacterSelector, setShowCharacterSelector] = useState(true);

  // Find the current story based on the stage
  const currentStory = stories.find((story) => story.stage === state.currentStage);
  const currentScene = currentStory?.scenes[currentSceneIndex];
  const currentQuiz = quizzes.find((quiz) => quiz.stage === state.currentStage);

  // For character selection at the beginning
  const handleCharacterSelected = () => {
    setShowCharacterSelector(false);
    goToStage("intro");
  };

  // Handle navigation through the story
  const handleNextScene = () => {
  if (!currentStory) return;

  // If there are more scenes in the current story
  if (currentSceneIndex < currentStory.scenes.length - 1) {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSceneIndex(currentSceneIndex + 1);
      setIsTransitioning(false);
    }, 500);
  } else {
    // End of the current story section
    if (state.currentStage === "intro") {
      // For intro, go directly to the next stage without quiz
      setIsTransitioning(true);
      const nextStage = "solid";
      
      setTimeout(() => {
        goToStage(nextStage);
        setCurrentSceneIndex(0);
        setIsTransitioning(false);
      }, 1000);
    } else {
      // For other stages, show quiz
      setShowQuiz(true);
    }
  }
};

  const handlePreviousScene = () => {
    if (currentSceneIndex > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSceneIndex(currentSceneIndex - 1);
        setIsTransitioning(false);
      }, 500);
    }
  };

  // When the quiz is completed successfully, move to the next stage
  const handleQuizComplete = (passed: boolean) => {
    if (passed) {
      setShowQuiz(false);
      setIsTransitioning(true);
      
      // Determine the next stage
      const stageOrder: ("intro" | "solid" | "liquid" | "gas" | "transformation" | "conclusion")[] = [
        "intro", "solid", "liquid", "gas", "transformation", "conclusion"
      ];
      
      const currentIndex = stageOrder.indexOf(state.currentStage);
      if (currentIndex < stageOrder.length - 1) {
        const nextStage = stageOrder[currentIndex + 1];
        
        setTimeout(() => {
          goToStage(nextStage);
          setCurrentSceneIndex(0);
          setIsTransitioning(false);
        }, 1000);
      }
    } else {
      // Failed quiz, retry current story
      setShowQuiz(false);
      setCurrentSceneIndex(0);
    }
  };

  // Reset scene index when stage changes
  useEffect(() => {
    setCurrentSceneIndex(0);
    setShowQuiz(false);
  }, [state.currentStage]);

  if (showCharacterSelector) {
    return <CharacterSelector onCharacterSelected={handleCharacterSelected} />;
  }

  return (
    <div className="container mx-auto py-6 px-4 min-h-screen flex flex-col items-center">

      
      <div className="absolute top-4 right-4">
        <SoundButton />
      </div>
      
      {showQuiz && currentQuiz ? (
        <QuizCard quiz={currentQuiz} onComplete={handleQuizComplete} />
      ) : (
        <>
          <AnimatedTransition isTransitioning={isTransitioning}>
            {currentStory && currentScene && (
              <StoryScene 
                scene={currentScene}
                characterType={state.character}
                stage={currentStory.stage}
              />
            )}
          </AnimatedTransition>
          
          <StoryNavigation
            onNext={handleNextScene}
            onPrevious={handlePreviousScene}
            canGoNext={!!currentStory}
            canGoPrevious={currentSceneIndex > 0}
            isLastScene={!!currentStory && currentSceneIndex === currentStory.scenes.length - 1}
          />
        </>
      )}
    </div>
  );
}