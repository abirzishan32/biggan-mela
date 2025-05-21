"use client"

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import QuizForm from "@/components/quiz/QuizForm"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { Atom, BookOpen, Brain, Sparkles, Zap, Medal } from 'lucide-react'

export default function QuizPage() {
  const router = useRouter()
  
  return (
    <div className="space-y-8">
      {/* Hero section */}
      <section className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 z-0">
          <div className="absolute inset-0 opacity-20 mix-blend-overlay">
            <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="quiz-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <circle cx="5" cy="5" r="1" fill="white" opacity="0.2" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#quiz-grid)" />
            </svg>
          </div>
        </div>
        
        <div className="relative z-10 px-8 py-12 md:py-16">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center gap-3">
              <Brain className="h-8 w-8" />
              Science Quiz Generator
            </h1>
            <p className="text-white/90 mb-6">
              Test your knowledge with custom quizzes on various science topics. Choose your subject, difficulty level, and get instant feedback on your understanding.
            </p>
          </div>
        </div>
      </section>
      
      {/* Main content */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <QuizForm />
          
          <Card className="bg-gray-950 border-gray-800">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">How It Works</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 bg-purple-900/50 p-1.5 rounded-full text-purple-400">
                    <Zap className="h-4 w-4" />
                  </div>
                  <p className="text-gray-400 text-sm">Select your preferred subject, topic, and difficulty level</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 bg-purple-900/50 p-1.5 rounded-full text-purple-400">
                    <Zap className="h-4 w-4" />
                  </div>
                  <p className="text-gray-400 text-sm">Our AI generates personalized questions tailored to your choices</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 bg-purple-900/50 p-1.5 rounded-full text-purple-400">
                    <Zap className="h-4 w-4" />
                  </div>
                  <p className="text-gray-400 text-sm">Answer the questions within the time limit and get instant feedback</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 bg-purple-900/50 p-1.5 rounded-full text-purple-400">
                    <Zap className="h-4 w-4" />
                  </div>
                  <p className="text-gray-400 text-sm">Review your answers with detailed explanations to improve your knowledge</p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Popular Quiz Topics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <QuickStartCard 
              title="Physics: Mechanics" 
              icon={<Atom className="h-6 w-6" />}
              difficulty="Medium"
              onClick={() => {
                router.push('/quiz/quick/physics-mechanics')
              }}
            />
            <QuickStartCard 
              title="Chemistry: Periodic Table" 
              icon={<Sparkles className="h-6 w-6" />}
              difficulty="Easy"
              onClick={() => {
                router.push('/quiz/quick/chemistry-periodic')
              }}
            />
            <QuickStartCard 
              title="Biology: Cell Structure" 
              icon={<BookOpen className="h-6 w-6" />}
              difficulty="Medium"
              onClick={() => {
                router.push('/quiz/quick/biology-cell')
              }}
            />
            <QuickStartCard 
              title="Physics: Electromagnetism" 
              icon={<Zap className="h-6 w-6" />}
              difficulty="Hard"
              onClick={() => {
                router.push('/quiz/quick/physics-electromagnetism')
              }}
            />
          </div>
          
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-white mb-4">Quiz Leaderboard</h3>
            <Card className="bg-gray-950 border-gray-800">
              <CardContent className="p-6">
                <div className="flex justify-center">
                  <Medal className="h-16 w-16 text-yellow-500 opacity-50" />
                </div>
                <p className="text-center text-gray-400 mt-4">
                  Complete quizzes to appear on the leaderboard and compete with other science enthusiasts!
                </p>
                <div className="mt-4 text-center">
                  <Button variant="outline" className="border-gray-700 hover:bg-gray-800">
                    View Leaderboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function QuickStartCard({ 
  title, 
  icon, 
  difficulty,
  onClick 
}: { 
  title: string; 
  icon: React.ReactNode;
  difficulty: string;
  onClick: () => void;
}) {
  let difficultyColor = "bg-green-500/20 text-green-500"
  
  if (difficulty === "Medium") {
    difficultyColor = "bg-yellow-500/20 text-yellow-500"
  } else if (difficulty === "Hard") {
    difficultyColor = "bg-red-500/20 text-red-500"
  }
  
  return (
    <Button 
      variant="outline" 
      className="h-auto py-4 px-4 border-gray-800 hover:bg-gray-900 hover:border-gray-700 flex flex-col items-start" 
      onClick={onClick}
    >
      <div className="flex items-center justify-between w-full">
        <div className="p-2 bg-gray-900 rounded-lg text-purple-400">
          {icon}
        </div>
        <div className={`px-2 py-0.5 text-xs rounded-full ${difficultyColor}`}>
          {difficulty}
        </div>
      </div>
      <h3 className="text-white text-base font-medium mt-3 text-left w-full">{title}</h3>
      <p className="text-gray-400 text-xs mt-1 text-left w-full">10 questions</p>
    </Button>
  )
}