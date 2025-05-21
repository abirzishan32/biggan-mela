"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CircleCheck, CircleX, ArrowRight, Medal } from "lucide-react"
import Link from "next/link"

interface ResultSummaryProps {
  score: number
  totalQuestions: number
  quizId: string
  timeTaken?: string
}

export default function ResultSummary({ 
  score, 
  totalQuestions,
  quizId,
  timeTaken 
}: ResultSummaryProps) {
  const percentage = Math.round((score / totalQuestions) * 100)
  
  const getGradeColor = () => {
    if (percentage >= 80) return "text-green-500"
    if (percentage >= 60) return "text-blue-500"
    if (percentage >= 40) return "text-yellow-500"
    return "text-red-500"
  }
  
  const getMessage = () => {
    if (percentage >= 80) return "Excellent work! You've mastered this topic."
    if (percentage >= 60) return "Good job! You have a solid understanding."
    if (percentage >= 40) return "Nice effort! Keep studying to improve."
    return "Keep practicing! You'll get better with more study."
  }
  
  return (
    <Card className="bg-gray-950 border-gray-800 text-white max-w-lg mx-auto">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl">Quiz Results</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Score display */}
        <div className="flex justify-center">
          <div className="w-36 h-36 rounded-full border-4 border-indigo-500/30 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getGradeColor()}`}>
                {percentage}%
              </div>
              <div className="text-sm text-gray-400 mt-1">Score</div>
            </div>
          </div>
        </div>
        
        {/* Score details */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-gray-900/50 p-4 rounded-lg">
            <div className="flex justify-center mb-2">
              <CircleCheck className="h-8 w-8 text-green-500" />
            </div>
            <div className="text-xl font-bold text-white">{score}</div>
            <div className="text-xs text-gray-400">Correct</div>
          </div>
          
          <div className="bg-gray-900/50 p-4 rounded-lg">
            <div className="flex justify-center mb-2">
              <CircleX className="h-8 w-8 text-red-500" />
            </div>
            <div className="text-xl font-bold text-white">{totalQuestions - score}</div>
            <div className="text-xs text-gray-400">Incorrect</div>
          </div>
        </div>
        
        {timeTaken && (
          <div className="text-center text-gray-400">
            Time taken: <span className="text-white">{timeTaken}</span>
          </div>
        )}
        
        <div className="p-4 rounded-lg bg-indigo-900/20 border border-indigo-500/30 text-center">
          <div className="flex justify-center mb-2">
            <Medal className="h-6 w-6 text-yellow-500" />
          </div>
          <p className="text-indigo-300">{getMessage()}</p>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row gap-3">
        <Link href={`/quiz/${quizId}/review`} className="w-full sm:w-auto">
          <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
            Review Answers
          </Button>
        </Link>
        <Link href="/quiz" className="w-full sm:w-auto">
          <Button variant="outline" className="w-full border-gray-700 hover:bg-gray-800">
            Take Another Quiz
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}