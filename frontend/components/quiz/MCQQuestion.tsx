"use client"

import { useState } from 'react'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle } from 'lucide-react'

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
  
  const handleChange = (value: string) => {
    if (isSubmitted) return
    setSelectedValue(value)
    onAnswer(value)
  }
  
  const getOptionClass = (optionId: string) => {
    if (!isSubmitted) return ""
    
    if (optionId === correctOption) {
      return "border-green-500 bg-green-500/10 text-green-500"
    }
    
    if (optionId === selectedValue && optionId !== correctOption) {
      return "border-red-500 bg-red-500/10 text-red-500"
    }
    
    return "opacity-60"
  }
  
  return (
    <Card className="mb-6 bg-gray-950 border-gray-800">
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-purple-600/20 text-purple-400 text-sm font-medium">
            {questionNumber}
          </span>
          <CardTitle className="text-lg">{questionText}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedValue}
          onValueChange={handleChange}
          className="space-y-3"
          disabled={isSubmitted}
        >
          {options.map((option) => (
            <div
              key={option.id}
              className={`flex items-center space-x-2 p-3 border rounded-md transition-all ${
                getOptionClass(option.id) || "border-gray-700"
              }`}
            >
              <RadioGroupItem 
                value={option.id} 
                id={option.id}
                className="border-purple-500"
                disabled={isSubmitted}
              />
              <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                {option.optionText}
              </Label>
              
              {isSubmitted && option.id === correctOption && (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )}
              
              {isSubmitted && option.id === selectedValue && option.id !== correctOption && (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
          ))}
        </RadioGroup>
        
        {isSubmitted && explanation && (
          <div className="mt-4 p-3 border border-indigo-500/30 rounded-md bg-indigo-500/10">
            <p className="text-sm text-indigo-300">
              <span className="font-semibold">Explanation:</span> {explanation}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}