"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CircleCheck, CircleX, ArrowRight, Medal, Clock, Brain, RefreshCw, X } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"

interface ResultSummaryProps {
  score: number
  totalQuestions: number
  quizId: string
  timeTaken?: string
  answers?: Record<string, string>
}

export default function ResultSummary({ 
  score, 
  totalQuestions,
  quizId,
  timeTaken,
  answers = {}
}: ResultSummaryProps) {
  const [showReview, setShowReview] = useState(false)
  const [quiz, setQuiz] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const percentage = Math.round((score / totalQuestions) * 100)
  
  useEffect(() => {
    // Only fetch quiz data when the review modal is opened
    if (showReview && !quiz) {
      fetchQuizDetails();
    }
  }, [showReview, quiz, quizId]);
  
  const fetchQuizDetails = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/quiz/${quizId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch quiz details");
      }
      
      const data = await response.json();
      setQuiz(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  
  const getGradeColor = () => {
    if (percentage >= 80) return "text-green-500"
    if (percentage >= 60) return "text-blue-500"
    if (percentage >= 40) return "text-yellow-500"
    return "text-red-500"
  }
  
  const getBgGradient = () => {
    if (percentage >= 80) return "from-green-500/20 to-green-900/5"
    if (percentage >= 60) return "from-blue-500/20 to-blue-900/5"
    if (percentage >= 40) return "from-yellow-500/20 to-yellow-900/5"
    return "from-red-500/20 to-red-900/5"
  }
  
  const getMessage = () => {
    if (percentage >= 80) return "Excellent work! You've mastered this topic."
    if (percentage >= 60) return "Good job! You have a solid understanding."
    if (percentage >= 40) return "Nice effort! Keep studying to improve."
    return "Keep practicing! You'll get better with more study."
  }

  const getButtonVariant = () => {
    if (percentage >= 80) return "bg-green-600 hover:bg-green-700"
    if (percentage >= 60) return "bg-blue-600 hover:bg-blue-700"
    if (percentage >= 40) return "bg-yellow-600 hover:bg-yellow-700"
    return "bg-red-600 hover:bg-red-700"
  }
  
  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <Card className="bg-black border border-gray-800 shadow-xl overflow-hidden max-w-lg mx-auto">
          <div className={`absolute inset-0 bg-gradient-to-b ${getBgGradient()} opacity-30 pointer-events-none`} />
          
          <CardHeader className="text-center pb-2 relative">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-2 inline-flex mx-auto"
            >
              <div className="p-3 rounded-full bg-gray-900/80 backdrop-blur-sm">
                <Medal className={`h-8 w-8 ${getGradeColor()}`} />
              </div>
            </motion.div>
            <CardTitle className="text-2xl text-white">Quiz Results</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-8 relative">
            {/* Score Ring */}
            <div className="flex justify-center my-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="relative"
              >
                {/* Background ring */}
                <div className="w-44 h-44 rounded-full border-8 border-gray-800 flex items-center justify-center" />
                
                {/* Progress ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="88"
                    cy="88"
                    r="76"
                    strokeWidth="12"
                    stroke="currentColor"
                    fill="transparent"
                    strokeDasharray={Math.PI * 2 * 76}
                    strokeDashoffset={Math.PI * 2 * 76 * (1 - percentage / 100)}
                    className={`transition-all duration-1000 ease-in-out ${getGradeColor()}`}
                  />
                </svg>
                
                {/* Score text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className={`text-5xl font-bold ${getGradeColor()}`}
                    >
                      {percentage}%
                    </motion.div>
                    <div className="text-sm text-gray-400 mt-1">Score</div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Score details */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="bg-gray-900/50 p-4 rounded-lg border border-gray-800"
              >
                <div className="flex justify-center mb-2">
                  <CircleCheck className="h-8 w-8 text-green-500" />
                </div>
                <div className="text-xl font-bold text-white text-center">{score}</div>
                <div className="text-xs text-gray-400 text-center">Correct</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="bg-gray-900/50 p-4 rounded-lg border border-gray-800"
              >
                <div className="flex justify-center mb-2">
                  <CircleX className="h-8 w-8 text-red-500" />
                </div>
                <div className="text-xl font-bold text-white text-center">{totalQuestions - score}</div>
                <div className="text-xs text-gray-400 text-center">Incorrect</div>
              </motion.div>
            </div>
            
            {/* Stats bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="rounded-lg bg-gray-900/30 p-3 border border-gray-800"
            >
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                <span>Performance</span>
                <span>{percentage}%</span>
              </div>
              <Progress value={percentage} className="h-2" />
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                {timeTaken && (
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{timeTaken}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Brain className="h-4 w-4 text-gray-500" />
                  <span>{totalQuestions} Questions</span>
                </div>
              </div>
            </motion.div>
            
            {/* Message */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className={`p-4 rounded-lg border text-center ${
                percentage >= 80 
                  ? "bg-green-950/10 border-green-500/30 text-green-400"
                  : percentage >= 60
                  ? "bg-blue-950/10 border-blue-500/30 text-blue-400"
                  : percentage >= 40
                  ? "bg-yellow-950/10 border-yellow-500/30 text-yellow-400"
                  : "bg-red-950/10 border-red-500/30 text-red-400"
              }`}
            >
              <p>{getMessage()}</p>
            </motion.div>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row gap-3 border-t border-gray-800 bg-gray-950/50">
            <Button 
              onClick={() => setShowReview(true)} 
              className={`w-full sm:w-auto ${getButtonVariant()}`}
            >
              <CircleCheck className="mr-2 h-4 w-4" />
              Review Answers
            </Button>
            <Link href="/quiz" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full border-gray-700 hover:bg-gray-800">
                <RefreshCw className="mr-2 h-4 w-4" />
                Take Another Quiz
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
      
      {/* Review Quiz Modal Dialog */}
      <Dialog open={showReview} onOpenChange={setShowReview}>
        <DialogContent className="bg-black border border-gray-800 text-white md:max-w-3xl max-h-[90vh] p-0">
          <DialogHeader className="px-6 pt-6 pb-2">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl text-white">Review Your Answers</DialogTitle>
              <DialogClose className="h-6 w-6 rounded-full hover:bg-gray-800 flex items-center justify-center">
                <X className="h-4 w-4" />
              </DialogClose>
            </div>
            <DialogDescription className="text-gray-400">
              Review your answers and learn from the explanations.
            </DialogDescription>
          </DialogHeader>
          
          <div className="border-t border-gray-800 my-2" />
          
          <ScrollArea className="p-6 max-h-[calc(90vh-120px)]">
            {isLoading ? (
              <div className="space-y-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-6 w-3/4 bg-gray-800" />
                    <div className="space-y-2">
                      <Skeleton className="h-12 w-full bg-gray-800" />
                      <Skeleton className="h-12 w-full bg-gray-800" />
                      <Skeleton className="h-12 w-full bg-gray-800" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="p-4 text-center">
                <p className="text-red-400">{error}</p>
                <Button 
                  onClick={fetchQuizDetails} 
                  variant="outline" 
                  className="mt-4 border-red-800/30 hover:bg-red-900/20 text-red-400"
                >
                  Try Again
                </Button>
              </div>
            ) : quiz ? (
              <div className="space-y-10">
                {quiz.questions.map((question: any, index: number) => {
                  const userAnswer = answers[question.id];
                  const correctOption = question.options.find((opt: any) => opt.isCorrect);
                  const isCorrect = userAnswer === correctOption?.id;

                  return (
                    <div key={question.id} className="space-y-4">
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 mt-0.5 flex items-center justify-center h-7 w-7 rounded-full bg-gray-900 text-gray-400 text-sm font-medium border border-gray-800">
                          {index + 1}
                        </span>
                        <div className="space-y-1">
                          <h3 className="text-white text-lg font-medium">
                            {question.questionText}
                          </h3>
                          <div 
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              isCorrect 
                                ? "bg-green-900/20 text-green-400" 
                                : "bg-red-900/20 text-red-400"
                            }`}
                          >
                            {isCorrect ? (
                              <CircleCheck className="mr-1 h-3 w-3" />
                            ) : (
                              <CircleX className="mr-1 h-3 w-3" />
                            )}
                            {isCorrect ? "Correct" : "Incorrect"}
                          </div>
                        </div>
                      </div>
                      
                      <div className="pl-10 space-y-2">
                        {question.options.map((option: any) => (
                          <div
                            key={option.id}
                            className={`p-3 rounded-md border ${
                              option.isCorrect 
                                ? "border-green-500 bg-green-900/20" 
                                : option.id === userAnswer 
                                ? "border-red-500 bg-red-900/20"
                                : "border-gray-800 bg-gray-900/30"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className={option.isCorrect ? "text-green-400" : option.id === userAnswer && !option.isCorrect ? "text-red-400" : "text-gray-300"}>
                                {option.optionText}
                              </span>
                              <div>
                                {option.isCorrect && (
                                  <CircleCheck className="h-5 w-5 text-green-500" />
                                )}
                                {option.id === userAnswer && !option.isCorrect && (
                                  <CircleX className="h-5 w-5 text-red-500" />
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {question.explanation && (
                          <div className="mt-3 p-3 rounded-md bg-indigo-950/30 border border-indigo-800/30">
                            <p className="text-indigo-300 text-sm">
                              <span className="font-semibold">Explanation:</span> {question.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40">
                <p className="text-gray-400">No quiz data available</p>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}