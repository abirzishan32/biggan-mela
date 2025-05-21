"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  AlertCircle, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertTriangle 
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
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }
  
  if (error) {
    return (
      <Card className="bg-gray-950 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Error</CardTitle>
          <CardDescription>
            There was a problem loading the quiz
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 text-red-500">
            <AlertCircle className="h-6 w-6" />
            <p>{error}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => router.push('/quiz')}
            variant="outline"
            className="border-gray-700 hover:bg-gray-800"
          >
            Go Back
          </Button>
        </CardFooter>
      </Card>
    )
  }
  
  if (!quiz) {
    return (
      <Card className="bg-gray-950 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Quiz Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">The requested quiz could not be found.</p>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => router.push('/quiz')}
            variant="outline"
            className="border-gray-700 hover:bg-gray-800"
          >
            Go Back
          </Button>
        </CardFooter>
      </Card>
    )
  }
  
  if (isSubmitted && quizResult) {
    return (
      <ResultSummary 
        score={quizResult.score}
        totalQuestions={quizResult.totalQuestions}
        quizId={quizId}
        timeTaken={quizResult.timeTaken}
      />
    )
  }
  
  const currentQuestion = quiz.questions[currentQuestionIndex]
  
  return (
    <>
      <div className="space-y-6 max-w-4xl mx-auto">
        <Card className="bg-gray-950 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white text-xl">{quiz.title}</CardTitle>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <CardDescription className="flex flex-wrap gap-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900/50 text-indigo-300 border border-indigo-700/30">
                  {quiz.subject}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900/50 text-purple-300 border border-purple-700/30">
                  {quiz.topic}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300 border border-blue-700/30">
                  {quiz.difficulty}
                </span>
              </CardDescription>
              
              <div className="flex items-center text-sm text-gray-400">
                <Clock className="h-4 w-4 mr-1" />
                {quiz.durationMinutes} minutes
              </div>
            </div>
          </CardHeader>
          <Separator className="bg-gray-800" />
          <CardContent className="p-6">
            <div className="mb-6">
              <QuizTimer 
                durationMinutes={quiz.durationMinutes} 
                onTimeUp={handleTimeUp}
              />
            </div>
            
            <div className="mb-4 flex justify-between items-center">
              <div className="text-sm text-gray-400">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </div>
              
              <div className="text-sm text-gray-400">
                {Object.keys(answers).length} of {quiz.questions.length} answered
              </div>
            </div>
            
            <MCQQuestion
              questionNumber={currentQuestionIndex + 1}
              questionText={currentQuestion.questionText}
              options={currentQuestion.options}
              onAnswer={(optionId) => handleAnswer(currentQuestion.id, optionId)}
              selectedOption={answers[currentQuestion.id]}
            />
            
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="border-gray-700 hover:bg-gray-800"
              >
                Previous
              </Button>
              
              {currentQuestionIndex < quiz.questions.length - 1 ? (
                <Button 
                  onClick={handleNext}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  onClick={checkSubmission}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Submit Quiz
                  <CheckCircle className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
          {quiz.questions.map((q: any, index: number) => (
            <Button 
              key={q.id}
              variant="outline"
              className={`h-10 w-10 p-0 ${
                index === currentQuestionIndex 
                  ? 'border-purple-500 bg-purple-900/20' 
                  : answers[q.id] 
                    ? 'border-green-500/50 bg-green-900/20' 
                    : 'border-gray-700'
              }`}
              onClick={() => setCurrentQuestionIndex(index)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>

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