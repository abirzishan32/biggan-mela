"use client"

import { useState, useEffect } from 'react'
import { Progress } from '@/components/ui/progress'
import { Timer as TimerIcon, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface TimerProps {
  durationMinutes: number
  onTimeUp: () => void
}

export default function QuizTimer({ durationMinutes, onTimeUp }: TimerProps) {
  const totalSeconds = durationMinutes * 60
  const [timeLeft, setTimeLeft] = useState(totalSeconds)
  const [isWarning, setIsWarning] = useState(false)
  const [isPulsing, setIsPulsing] = useState(false)
  
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
      setIsPulsing(true)
      
      // Create pulsing effect that increases in frequency
      const pulseInterval = setInterval(() => {
        setIsPulsing(prev => !prev)
      }, Math.max(500, timeLeft * 20))
      
      return () => clearInterval(pulseInterval)
    } else {
      setIsWarning(false)
      setIsPulsing(false)
    }
  }, [timeLeft, totalSeconds])
  
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  
  const formatTime = (num: number) => num.toString().padStart(2, '0')
  
  const progress = (timeLeft / totalSeconds) * 100

  // Determine the color gradient based on time remaining
  const getProgressColor = () => {
    if (progress > 60) return "bg-gradient-to-r from-green-600 to-indigo-600" 
    if (progress > 30) return "bg-gradient-to-r from-yellow-600 to-orange-600"
    return "bg-gradient-to-r from-red-600 to-red-500"
  }
  
  return (
    <div className="space-y-2 bg-gray-900/50 p-3 rounded-lg border border-gray-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AnimatePresence mode="wait">
            {isWarning ? (
              <motion.div
                key="warning"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: isPulsing ? 1.1 : 1,
                  opacity: 1
                }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </motion.div>
            ) : (
              <motion.div
                key="timer"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TimerIcon className="h-5 w-5 text-indigo-400" />
              </motion.div>
            )}
          </AnimatePresence>
          <motion.span 
            className={`font-mono text-xl ${isWarning ? 'text-red-500' : 'text-white'}`}
            animate={{ scale: isPulsing ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
          >
            {formatTime(minutes)}:{formatTime(seconds)}
          </motion.span>
        </div>
        <span className="text-sm text-gray-400">
          {Math.floor(progress)}% remaining
        </span>
      </div>
      
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${getProgressColor()}`}
          initial={{ width: '100%' }}
          animate={{ 
            width: `${progress}%`,
            transition: { duration: 0.5, ease: "easeInOut" }
          }}
        />
      </div>
    </div>
  )
}