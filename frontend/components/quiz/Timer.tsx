"use client"

import { useState, useEffect } from 'react'
import { Progress } from '@/components/ui/progress'
import { Timer, AlertTriangle } from 'lucide-react'

interface TimerProps {
  durationMinutes: number
  onTimeUp: () => void
}

export default function QuizTimer({ durationMinutes, onTimeUp }: TimerProps) {
  const totalSeconds = durationMinutes * 60
  const [timeLeft, setTimeLeft] = useState(totalSeconds)
  const [isWarning, setIsWarning] = useState(false)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          onTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(interval)
  }, [onTimeUp])
  
  // Set warning when less than 20% time left
  useEffect(() => {
    if (timeLeft < totalSeconds * 0.2) {
      setIsWarning(true)
    } else {
      setIsWarning(false)
    }
  }, [timeLeft, totalSeconds])
  
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  
  const formatTime = (num: number) => num.toString().padStart(2, '0')
  
  const progress = (timeLeft / totalSeconds) * 100
  
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {isWarning ? (
            <AlertTriangle className="h-5 w-5 text-red-500" />
          ) : (
            <Timer className="h-5 w-5 text-indigo-400" />
          )}
          <span className={`font-mono text-xl ${isWarning ? 'text-red-500' : 'text-white'}`}>
            {formatTime(minutes)}:{formatTime(seconds)}
          </span>
        </div>
        <span className="text-sm text-gray-400">
          {Math.floor(progress)}% time remaining
        </span>
      </div>
      <Progress 
        value={progress} 
        className={`h-2 ${isWarning ? 'bg-red-900/30' : 'bg-gray-800'}`}
      />
    </div>
  )
}