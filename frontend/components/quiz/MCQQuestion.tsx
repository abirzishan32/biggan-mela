"use client"

import { useState, useEffect } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

interface MCQQuestionProps {
  questionNumber: number
  questionText: string
  options: {
    id: string
    optionText: string
  }[]
  onAnswer: (optionId: string) => void
  selectedOption?: string
  isSubmitted?: boolean
  correctOption?: string
  explanation?: string
}

export default function MCQQuestion({
  questionNumber,
  questionText,
  options,
  onAnswer,
  selectedOption,
  isSubmitted,
  correctOption,
  explanation
}: MCQQuestionProps) {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(selectedOption)
  const [animate, setAnimate] = useState(false)
  
  // Reset animation state when question changes
  useEffect(() => {
    setAnimate(true)
    const timer = setTimeout(() => setAnimate(false), 500)
    return () => clearTimeout(timer)
  }, [questionNumber])
  
  const handleChange = (optionId: string, checked: boolean) => {
    if (isSubmitted || !checked) return
    setSelectedValue(optionId)
    onAnswer(optionId)
  }
  
  const getOptionClass = (optionId: string) => {
    if (!isSubmitted) {
      return optionId === selectedValue 
        ? "border-indigo-500 bg-indigo-900/20" 
        : "border-gray-800 hover:border-gray-700 hover:bg-gray-900"
    }
    
    if (optionId === correctOption) {
      return "border-green-500 bg-green-900/20"
    }
    
    if (optionId === selectedValue && optionId !== correctOption) {
      return "border-red-500 bg-red-900/20"
    }
    
    return "border-gray-800 opacity-50"
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8"
    >
      <div className="mb-4 flex items-start gap-3">
        <span className="flex-shrink-0 mt-0.5 flex items-center justify-center h-8 w-8 rounded-full bg-indigo-900/30 text-indigo-400 text-sm font-medium border border-indigo-500/30">
          {questionNumber}
        </span>
        <h3 className="text-lg font-medium text-white leading-tight">{questionText}</h3>
      </div>
      
      <div className="space-y-3">
        {options.map((option) => (
          <motion.div
            key={option.id}
            whileHover={!isSubmitted ? { scale: 1.01 } : {}}
            whileTap={!isSubmitted ? { scale: 0.99 } : {}}
            className={`relative flex items-start p-4 rounded-lg transition-all border ${getOptionClass(option.id)}`}
          >
            <div className="flex gap-3 items-center w-full">
              <Checkbox
                id={option.id}
                checked={selectedValue === option.id}
                onCheckedChange={(checked) => handleChange(option.id, !!checked)}
                disabled={isSubmitted}
                className={`h-5 w-5 rounded-sm ${
                  selectedValue === option.id 
                    ? 'border-indigo-500 bg-indigo-600 text-white' 
                    : 'border-gray-600'
                }`}
              />
              <Label 
                htmlFor={option.id} 
                className="flex-1 cursor-pointer text-base select-none"
              >
                {option.optionText}
              </Label>
              
              {isSubmitted && (
                <div className="flex-shrink-0 ml-2">
                  {option.id === correctOption ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : option.id === selectedValue ? (
                    <XCircle className="h-5 w-5 text-red-500" />
                  ) : null}
                </div>
              )}
            </div>
            
            {/* Highlight effect for correct/incorrect answers when submitted */}
            {isSubmitted && (
              <div 
                className={`absolute inset-0 rounded-lg pointer-events-none ${
                  option.id === correctOption 
                    ? 'ring-1 ring-green-500 ring-opacity-50' 
                    : option.id === selectedValue && option.id !== correctOption
                      ? 'ring-1 ring-red-500 ring-opacity-50'
                      : ''
                }`}
              />
            )}
          </motion.div>
        ))}
      </div>
      
      <AnimatePresence>
        {isSubmitted && explanation && (
          <motion.div 
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-lg border border-indigo-500/30 bg-indigo-950/30 backdrop-blur-sm">
              <div className="flex gap-3 items-start">
                <HelpCircle className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-indigo-300 leading-relaxed">
                    <span className="font-semibold">Explanation:</span> {explanation}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}