"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface QuizFormProps {
  onSuccess?: (quizId: string) => void
}

export default function QuizForm({ onSuccess }: QuizFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    subject: "physics",
    topic: "",
    difficulty: "medium",
    language: "english",
    numberOfQuestions: 5
  })
  
  const subjectTopics = {
    physics: ["Mechanics", "Thermodynamics", "Electromagnetism", "Optics", "Quantum Physics", "Waves", "Nuclear Physics"],
    chemistry: ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry", "Analytical Chemistry", "Biochemistry", "Electrochemistry"],
    biology: ["Cell Biology", "Genetics", "Ecology", "Human Physiology", "Microbiology", "Botany", "Zoology"]
  }
  
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/quiz-gen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate quiz")
      }
      
      if (onSuccess) {
        onSuccess(data.quizId)
      } else {
        router.push(`/quiz/${data.quizId}`)
      }
      
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <Card className="w-full max-w-xl bg-gray-950 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Generate a Science Quiz</CardTitle>
        <CardDescription>
          Create a custom quiz based on your preferences
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select 
              value={formData.subject} 
              onValueChange={(value) => {
                handleChange("subject", value)
                handleChange("topic", "")
              }}
            >
              <SelectTrigger id="subject" className="bg-gray-900 border-gray-700">
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="physics">Physics</SelectItem>
                <SelectItem value="chemistry">Chemistry</SelectItem>
                <SelectItem value="biology">Biology</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Select 
              value={formData.topic} 
              onValueChange={(value) => handleChange("topic", value)}
            >
              <SelectTrigger id="topic" className="bg-gray-900 border-gray-700">
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                {subjectTopics[formData.subject as keyof typeof subjectTopics]?.map(topic => (
                  <SelectItem key={topic} value={topic.toLowerCase()}>{topic}</SelectItem>
                ))}
                <SelectItem value="custom">Custom Topic...</SelectItem>
              </SelectContent>
            </Select>
            
            {formData.topic === "custom" && (
              <Input
                placeholder="Enter a custom topic"
                className="mt-2 bg-gray-900 border-gray-700"
                onChange={(e) => handleChange("topic", e.target.value)}
              />
            )}
          </div>
          
          <div className="space-y-2">
            <Label>Difficulty</Label>
            <RadioGroup 
              defaultValue="medium" 
              value={formData.difficulty}
              onValueChange={(value) => handleChange("difficulty", value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="easy" id="easy" className="border-purple-600" />
                <Label htmlFor="easy">Easy</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" className="border-purple-600" />
                <Label htmlFor="medium">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hard" id="hard" className="border-purple-600" />
                <Label htmlFor="hard">Hard</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label>Language</Label>
            <RadioGroup 
              defaultValue="english" 
              value={formData.language}
              onValueChange={(value) => handleChange("language", value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="english" id="english" className="border-purple-600" />
                <Label htmlFor="english">English</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bengali" id="bengali" className="border-purple-600" />
                <Label htmlFor="bengali">Bengali</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="numberOfQuestions">Number of Questions</Label>
            <Select 
              value={formData.numberOfQuestions.toString()} 
              onValueChange={(value) => handleChange("numberOfQuestions", parseInt(value))}
            >
              <SelectTrigger id="numberOfQuestions" className="bg-gray-900 border-gray-700">
                <SelectValue placeholder="Select number of questions" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                {[5, 10, 15, 20].map(num => (
                  <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {error && (
            <div className="text-red-500 text-sm p-2 bg-red-500/10 border border-red-500/50 rounded-md">
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600"
            disabled={isLoading || !formData.topic}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Quiz...
              </>
            ) : 'Generate Quiz'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}