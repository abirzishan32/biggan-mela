"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, Loader2, Sparkles, Atom, Beaker, Leaf } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

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

  const subjectIcons = {
    physics: <Atom className="h-5 w-5" />,
    chemistry: <Beaker className="h-5 w-5" />,
    biology: <Leaf className="h-5 w-5" />
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
    <Card className="w-full max-w-xl bg-black border border-gray-800 shadow-xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-transparent to-purple-950/20 pointer-events-none" />
      <CardHeader className="relative">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-full bg-indigo-950 text-indigo-400">
            <Brain className="h-5 w-5" />
          </div>
          <Badge variant="outline" className="bg-indigo-950/50 text-indigo-300 border-indigo-800 px-2 py-0">
            AI-Powered
          </Badge>
        </div>
        <CardTitle className="text-white text-xl">Generate a Science Quiz</CardTitle>
        <CardDescription className="text-gray-400">
          Create a custom quiz tailored to your preferences
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 relative">
          {/* Subject Selection with Icon */}
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-gray-300">Subject</Label>
            <Select 
              value={formData.subject} 
              onValueChange={(value) => {
                handleChange("subject", value)
                handleChange("topic", "")
              }}
            >
              <SelectTrigger id="subject" className="bg-gray-950 border-gray-800 focus:ring-indigo-500 h-11">
                <div className="flex items-center gap-2">
                  {subjectIcons[formData.subject as keyof typeof subjectIcons]}
                  <SelectValue placeholder="Select a subject" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-gray-950 border-gray-800">
                <SelectItem value="physics" className="focus:bg-indigo-900/20">
                  <div className="flex items-center gap-2">
                    <Atom className="h-4 w-4" />
                    <span>Physics</span>
                  </div>
                </SelectItem>
                <SelectItem value="chemistry" className="focus:bg-indigo-900/20">
                  <div className="flex items-center gap-2">
                    <Beaker className="h-4 w-4" />
                    <span>Chemistry</span>
                  </div>
                </SelectItem>
                <SelectItem value="biology" className="focus:bg-indigo-900/20">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-4 w-4" />
                    <span>Biology</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Topic Selection */}
          <div className="space-y-2">
            <Label htmlFor="topic" className="text-gray-300">Topic</Label>
            <Select 
              value={formData.topic} 
              onValueChange={(value) => handleChange("topic", value)}
            >
              <SelectTrigger id="topic" className="bg-gray-950 border-gray-800 focus:ring-indigo-500 h-11">
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent className="bg-gray-950 border-gray-800">
                {subjectTopics[formData.subject as keyof typeof subjectTopics]?.map(topic => (
                  <SelectItem key={topic} value={topic.toLowerCase()} className="focus:bg-indigo-900/20">
                    {topic}
                  </SelectItem>
                ))}
                <SelectItem value="custom" className="focus:bg-indigo-900/20">Custom Topic...</SelectItem>
              </SelectContent>
            </Select>
            
            {formData.topic === "custom" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.2 }}
              >
                <Input
                  placeholder="Enter a custom topic"
                  className="mt-2 bg-gray-950 border-gray-800 focus:ring-indigo-500 h-11"
                  onChange={(e) => handleChange("topic", e.target.value)}
                />
              </motion.div>
            )}
          </div>
          
          {/* Difficulty & Language Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Difficulty Selection */}
            <div className="space-y-2">
              <Label className="text-gray-300">Difficulty</Label>
              <div className="grid grid-cols-3 gap-2">
                {["easy", "medium", "hard"].map((level) => (
                  <Button
                    key={level}
                    type="button"
                    variant="outline"
                    size="sm"
                    className={`border ${
                      formData.difficulty === level
                        ? level === "easy" 
                          ? "border-green-500 bg-green-900/20 text-green-400" 
                          : level === "medium"
                            ? "border-yellow-500 bg-yellow-900/20 text-yellow-400"
                            : "border-red-500 bg-red-900/20 text-red-400"
                        : "border-gray-800 bg-gray-950 text-gray-400 hover:bg-gray-900"
                    }`}
                    onClick={() => handleChange("difficulty", level)}
                  >
                    <span className="capitalize">{level}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Language Selection */}
            <div className="space-y-2">
              <Label className="text-gray-300">Language</Label>
              <div className="grid grid-cols-2 gap-2">
                {["english", "bengali"].map((lang) => (
                  <Button
                    key={lang}
                    type="button"
                    variant="outline"
                    size="sm"
                    className={`border ${
                      formData.language === lang
                        ? "border-indigo-500 bg-indigo-900/20 text-indigo-400"
                        : "border-gray-800 bg-gray-950 text-gray-400 hover:bg-gray-900"
                    }`}
                    onClick={() => handleChange("language", lang)}
                  >
                    <span className="capitalize">{lang}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Number of Questions */}
          <div className="space-y-2">
            <Label htmlFor="numberOfQuestions" className="text-gray-300">Number of Questions</Label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 20].map((num) => (
                <Button
                  key={num}
                  type="button"
                  variant="outline"
                  className={`border ${
                    formData.numberOfQuestions === num
                      ? "border-indigo-500 bg-indigo-900/20 text-indigo-400"
                      : "border-gray-800 bg-gray-950 text-gray-400 hover:bg-gray-900"
                  }`}
                  onClick={() => handleChange("numberOfQuestions", num)}
                >
                  {num}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Error Display */}
          <AnimatedError error={error} />
        </CardContent>
        
        <CardFooter className="border-t border-gray-800 bg-black">
          <Button 
            type="submit" 
            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white"
            disabled={isLoading || !formData.topic}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Quiz...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Quiz
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

function AnimatedError({ error }: { error: string | null }) {
  if (!error) return null
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-3 rounded-md bg-red-900/20 border border-red-500/30 text-red-400 text-sm"
    >
      {error}
    </motion.div>
  )
}