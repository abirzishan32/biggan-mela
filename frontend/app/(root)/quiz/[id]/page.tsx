"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { 
  AlertCircle, 
  ArrowRight,
  ArrowLeft, 
  CheckCircle, 
  Clock,  
  AlertTriangle,
  Brain
} from 'lucide-react'
import MCQQuestion from "@/components/quiz/MCQQuestion"
import QuizTimer from "@/components/quiz/Timer"
import ResultSummary from "@/components/quiz/ResultSummary"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { motion, AnimatePresence } from "framer-motion"

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const quizId = params.id as string
  
  const [quiz, setQuiz] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [quizResult, setQuizResult] = useState<any>(null)
  const [startTime, setStartTime] = useState<Date | null>(null)
  
  // Alert dialog state
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertType, setAlertType] = useState<'incomplete' | 'timeUp' | 'error'>('incomplete')
  const [alertMessage, setAlertMessage] = useState('')
  
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`/api/quiz/${quizId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch quiz")
        }
        
        const data = await response.json()
        setQuiz(data)
        setStartTime(new Date())
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchQuiz()
  }, [quizId])
  
  const handleAnswer = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }))
  }
  
  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }
  
  const calculateScore = () => {
    if (!quiz) return 0
    
    let score = 0
    quiz.questions.forEach((question: any) => {
      const userAnswer = answers[question.id]
      const correctOption = question.options.find((option: any) => option.isCorrect)
      
      if (userAnswer && correctOption && userAnswer === correctOption.id) {
        score++
      }
    })
    
    return score
  }
  
  const calculateTimeTaken = () => {
    if (!startTime) return "Not recorded"
    
    const endTime = new Date()
    const timeDiffMs = endTime.getTime() - startTime.getTime()
    const minutes = Math.floor(timeDiffMs / 60000)
    const seconds = Math.floor((timeDiffMs % 60000) / 1000)
    
    return `${minutes}m ${seconds}s`
  }
  
  const checkSubmission = () => {
    // Check if all questions are answered
    const answeredCount = Object.keys(answers).length
    
    if (answeredCount < quiz.questions.length) {
      setAlertType('incomplete')
      setAlertMessage(`You've only answered ${answeredCount} out of ${quiz.questions.length} questions. Would you like to submit anyway?`)
      setAlertOpen(true)
      return
    }
    
    // If all questions are answered, submit directly
    submitQuiz()
  }
  
  const submitQuiz = async () => {
    const score = calculateScore()
    const timeTaken = calculateTimeTaken()
    
    try {
      const response = await fetch(`/api/quiz/${quizId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          completedAt: new Date().toISOString()
        })
      })
      
      if (!response.ok) {
        throw new Error("Failed to submit quiz")
      }
      
      const result = await response.json()
      
      setQuizResult({
        score,
        totalQuestions: quiz.questions.length,
        timeTaken
      })
      
      setIsSubmitted(true)
    } catch (err: any) {
      setAlertType('error')
      setAlertMessage(err.message || 'An error occurred while submitting your quiz.')
      setAlertOpen(true)
    }
  }
  
  const handleTimeUp = () => {
    setAlertType('timeUp')
    setAlertMessage("Your quiz time has expired. Your current answers will be submitted.")
    setAlertOpen(true)
  }
  
  // Handler for alert dialog confirmation
  const handleAlertConfirm = () => {
    setAlertOpen(false)
    if (alertType === 'incomplete' || alertType === 'timeUp') {
      submitQuiz()
    }
  }
  
  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty.toLowerCase()) {
      case 'easy': 
        return 'bg-green-950/30 text-green-400 border-green-700/30';
      case 'medium': 
        return 'bg-yellow-950/30 text-yellow-400 border-yellow-700/30';
      case 'hard': 
        return 'bg-red-950/30 text-red-400 border-red-700/30';
      default:
        return 'bg-gray-950/30 text-gray-400 border-gray-700/30';
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Card className="bg-black border border-gray-800 shadow-xl">
          <CardHeader className="pb-2">
            <Skeleton className="h-7 w-3/4 bg-gray-800" />
            <Skeleton className="h-4 w-1/2 bg-gray-800 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Skeleton className="h-12 w-full bg-gray-800" />
              <div className="space-y-3">
                <Skeleton className="h-16 w-full bg-gray-800" />
                <Skeleton className="h-16 w-full bg-gray-800" />
                <Skeleton className="h-16 w-full bg-gray-800" />
                <Skeleton className="h-16 w-full bg-gray-800" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <Card className="bg-black border border-gray-800 shadow-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-transparent to-red-950/10 pointer-events-none" />
          
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-red-900/20 border border-red-800/30">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </div>
            <CardTitle className="text-white text-center">Error</CardTitle>
            <CardDescription className="text-center">
              There was a problem loading the quiz
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="p-4 rounded-lg bg-red-900/10 border border-red-800/30 text-red-400 text-center">
              {error}
            </div>
          </CardContent>
          
          <CardFooter className="justify-center border-t border-gray-800 bg-gray-950/50">
            <Button 
              onClick={() => router.push('/quiz')}
              variant="outline"
              className="border-gray-700 hover:bg-gray-800"
            >
              Go Back
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    )
  }
  
  if (!quiz) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <Card className="bg-black border border-gray-800 shadow-xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-white text-center">Quiz Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-400">The requested quiz could not be found.</p>
          </CardContent>
          <CardFooter className="justify-center border-t border-gray-800">
            <Button 
              onClick={() => router.push('/quiz')}
              variant="outline"
              className="border-gray-700 hover:bg-gray-800"
            >
              Go Back
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    )
  }
  
  if (isSubmitted && quizResult) {
    return (
      <ResultSummary 
        score={quizResult.score}
        totalQuestions={quizResult.totalQuestions}
        quizId={quizId}
        timeTaken={quizResult.timeTaken}
        answers={answers}
      />
    )
  }
  
  const currentQuestion = quiz.questions[currentQuestionIndex]
  
  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6 max-w-4xl mx-auto"
      >
        <Card className="bg-black border border-gray-800 shadow-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/10 via-transparent to-purple-950/10 pointer-events-none" />
          
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-full bg-indigo-950/50 border border-indigo-800/30">
                    <Brain className="h-4 w-4 text-indigo-400" />
                  </div>
                  <CardTitle className="text-white text-xl">{quiz.title}</CardTitle>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-indigo-950/30 text-indigo-300 border-indigo-700/30">
                    {quiz.subject}
                  </Badge>
                  <Badge variant="outline" className="bg-purple-950/30 text-purple-300 border-purple-700/30">
                    {quiz.topic}
                  </Badge>
                  <Badge variant="outline" className={getDifficultyColor(quiz.difficulty)}>
                    {quiz.difficulty}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="h-4 w-4" />
                {quiz.durationMinutes} minutes
              </div>
            </div>
          </CardHeader>
          
          <Separator className="bg-gray-800" />
          
          <CardContent className="p-6 space-y-8">
            <QuizTimer 
              durationMinutes={quiz.durationMinutes} 
              onTimeUp={handleTimeUp}
            />
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-400">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </div>
              
              <div className="text-sm text-gray-400">
                {Object.keys(answers).length} of {quiz.questions.length} answered
              </div>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <MCQQuestion
                  questionNumber={currentQuestionIndex + 1}
                  questionText={currentQuestion.questionText}
                  options={currentQuestion.options}
                  onAnswer={(optionId) => handleAnswer(currentQuestion.id, optionId)}
                  selectedOption={answers[currentQuestion.id]}
                />
              </motion.div>
            </AnimatePresence>
            
            <div className="flex justify-between pt-2">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="border-gray-700 hover:bg-gray-800 group"
              >
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                Previous
              </Button>
              
              {currentQuestionIndex < quiz.questions.length - 1 ? (
                <Button 
                  onClick={handleNext}
                  className="bg-indigo-600 hover:bg-indigo-700 group"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              ) : (
                <Button 
                  onClick={checkSubmission}
                  className="bg-green-600 hover:bg-green-700 group"
                >
                  Submit Quiz
                  <CheckCircle className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                </Button>
              )}
            </div>
          </CardContent>
          
          <Separator className="bg-gray-800" />
          
          <CardFooter className="p-4 bg-gray-950/50">
            <div className="w-full overflow-x-auto pb-2">
              <div className="flex gap-2 min-w-max">
                {quiz.questions.map((q: any, index: number) => (
                  <Button 
                    key={q.id}
                    variant="outline"
                    size="sm"
                    className={`h-9 w-9 p-0 rounded-md ${
                      index === currentQuestionIndex 
                        ? 'border-indigo-500 bg-indigo-900/20 text-indigo-400' 
                        : answers[q.id] 
                          ? 'border-green-500/30 bg-green-900/10 text-green-400' 
                          : 'border-gray-700 text-gray-400'
                    }`}
                    onClick={() => setCurrentQuestionIndex(index)}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Alert Dialog for important notifications */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent className="bg-gray-950 border border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {alertType === 'timeUp' && (
                <Clock className="h-5 w-5 text-red-400" />
              )}
              {alertType === 'incomplete' && (
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              )}
              {alertType === 'error' && (
                <AlertCircle className="h-5 w-5 text-red-400" />
              )}
              
              {alertType === 'timeUp' && "Time's Up!"}
              {alertType === 'incomplete' && "Incomplete Quiz"}
              {alertType === 'error' && "Error"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              {alertMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {alertType !== 'error' && (
              <AlertDialogCancel className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
                Cancel
              </AlertDialogCancel>
            )}
            <AlertDialogAction 
              onClick={handleAlertConfirm}
              className={
                alertType === 'error' 
                  ? "bg-gray-700 hover:bg-gray-600" 
                  : "bg-green-600 hover:bg-green-700"
              }
            >
              {alertType === 'error' ? 'OK' : 'Submit Quiz'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}