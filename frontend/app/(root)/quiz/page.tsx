"use client"

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import QuizForm from "@/components/quiz/QuizForm"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { 
  Atom, 
  BookOpen, 
  Brain, 
  Medal, 
  Clock, 
  Loader2, 
  AlertCircle,
  Filter,
  Beaker,
  Leaf,
  Trophy,
  Users,
  CheckCircle,
  X,
  BarChart4,
  BarChart
} from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

type Quiz = {
  id: string
  title: string
  subject: string
  topic: string
  difficulty: string
  durationMinutes: number
  language: string
  createdAt: string
  questions: {
    id: string
  }[]
}

type LeaderboardUser = {
  id: string
  name: string
  avatar?: string
  score: number
  quizzesCompleted: number
  avgScore: number
  bestSubject: string
  rank: number
}

export default function QuizPage() {
  const router = useRouter()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('all')
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false)
  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>([])
  const [leaderboardLoading, setLeaderboardLoading] = useState(false)
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null)
  const [leaderboardStats, setLeaderboardStats] = useState({
    totalQuizzes: 0,
    totalParticipants: 0,
    averageScore: 0,
    completionRate: 0
  })
  
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/quizzes')
        
        if (!response.ok) {
          throw new Error('Failed to fetch quizzes')
        }
        
        const data = await response.json()
        setQuizzes(data)
      } catch (err: any) {
        console.error('Error fetching quizzes:', err)
        setError(err.message || 'Failed to load quizzes')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchQuizzes()
  }, [])
  
  // Filter quizzes based on active tab
  const filteredQuizzes = quizzes.filter(quiz => {
    if (activeTab === 'all') return true
    return quiz.subject.toLowerCase() === activeTab
  })
  
  const getSubjectIcon = (subject: string) => {
    const lowerSubject = subject.toLowerCase()
    
    if (lowerSubject.includes('physics')) return <Atom className="h-5 w-5" />
    if (lowerSubject.includes('chemistry')) return <Beaker className="h-5 w-5" />
    if (lowerSubject.includes('biology')) return <Leaf className="h-5 w-5" />
    return <Brain className="h-5 w-5" />
  }
  
  const fetchLeaderboardData = async () => {
    try {
      setLeaderboardLoading(true)
      setLeaderboardError(null)
      
      // Normally you'd fetch this from an API endpoint
      // For now, we'll simulate the data
      
      // Mock fetch delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Mock leaderboard data
      const mockUsers: LeaderboardUser[] = [
        {
          id: '1',
          name: 'Abir Rahman',
          avatar: '',
          score: 200,
          quizzesCompleted: 6,
          avgScore: 87,
          bestSubject: 'Physics',
          rank: 1
        },
        {
          id: '2',
          name: 'Sakibur Rahman',
          avatar: '',
          score: 140,
          quizzesCompleted: 3,
          avgScore: 77,
          bestSubject: 'Chemistry',
          rank: 2
        }
      ]
      
      setLeaderboardUsers(mockUsers)
      
      // Mock stats
      setLeaderboardStats({
        totalQuizzes: 145,
        totalParticipants: 53,
        averageScore: 76,
        completionRate: 88
      })
      
    } catch (err: any) {
      console.error('Error fetching leaderboard data:', err)
      setLeaderboardError(err.message || 'Failed to load leaderboard data')
    } finally {
      setLeaderboardLoading(false)
    }
  }
  
  // Fetch leaderboard data when modal opens
  useEffect(() => {
    if (isLeaderboardOpen) {
      fetchLeaderboardData()
    }
  }, [isLeaderboardOpen])
  
  return (
    <div className="space-y-8">
      {/* Hero section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-purple-900 z-0">
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
      </motion.section>
      
      {/* Main content */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <QuizForm />
          
          {/* "How It Works" Card */}
          <Card className="bg-black border-gray-800 shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/5 via-transparent to-purple-950/5 pointer-events-none" />
            <CardContent className="p-6 relative">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Filter className="h-4 w-4 text-indigo-400" />
                How It Works
              </h3>
              <ul className="space-y-4">
                {[
                  {
                    icon: <Brain className="h-4 w-4" />,
                    text: "Select your preferred subject, topic, and difficulty level"
                  },
                  {
                    icon: <BookOpen className="h-4 w-4" />,
                    text: "Our AI generates personalized questions tailored to your choices"
                  },
                  {
                    icon: <Clock className="h-4 w-4" />,
                    text: "Answer the questions within the time limit and get instant feedback"
                  },
                  {
                    icon: <CheckCircle className="h-4 w-4" />,
                    text: "Review your answers with detailed explanations to improve your knowledge"
                  }
                ].map((item, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-0.5 bg-indigo-950/70 p-1.5 rounded-full text-indigo-400 border border-indigo-800/30">
                      {item.icon}
                    </div>
                    <p className="text-gray-400 text-sm">{item.text}</p>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Available Quizzes</h3>
            <Badge variant="outline" className="bg-indigo-950/30 text-indigo-300 border-indigo-800/30">
              {filteredQuizzes.length} quizzes
            </Badge>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="bg-gray-900 p-1 border border-gray-800">
              <TabsTrigger value="all" className="data-[state=active]:bg-indigo-900/50 data-[state=active]:text-indigo-50">
                All
              </TabsTrigger>
              <TabsTrigger value="physics" className="data-[state=active]:bg-indigo-900/50 data-[state=active]:text-indigo-50">
                Physics
              </TabsTrigger>
              <TabsTrigger value="chemistry" className="data-[state=active]:bg-indigo-900/50 data-[state=active]:text-indigo-50">
                Chemistry
              </TabsTrigger>
              <TabsTrigger value="biology" className="data-[state=active]:bg-indigo-900/50 data-[state=active]:text-indigo-50">
                Biology
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              {/* ScrollArea for quizzes */}
              <Card className="border-gray-800 bg-transparent">
                <ScrollArea className="h-[450px] pr-4">
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <div className="space-y-4 p-1">
                        {[1, 2, 3, 4].map((i) => (
                          <Card key={i} className="bg-gray-950 border-gray-800">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div className="flex gap-3 items-center">
                                  <Skeleton className="h-10 w-10 rounded-md bg-gray-800" />
                                  <div className="space-y-2">
                                    <Skeleton className="h-5 w-40 bg-gray-800" />
                                    <Skeleton className="h-3 w-20 bg-gray-800" />
                                  </div>
                                </div>
                                <Skeleton className="h-6 w-16 rounded-full bg-gray-800" />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : error ? (
                      <Card className="bg-red-950/20 border-red-800/30">
                        <CardContent className="p-6 flex flex-col items-center">
                          <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
                          <p className="text-red-300 text-center">{error}</p>
                          <Button 
                            onClick={() => window.location.reload()} 
                            variant="outline"
                            className="mt-4 border-red-800/30 text-red-300 hover:bg-red-950/30"
                          >
                            Try Again
                          </Button>
                        </CardContent>
                      </Card>
                    ) : filteredQuizzes.length === 0 ? (
                      <Card className="bg-gray-950 border-gray-800">
                        <CardContent className="p-8 flex flex-col items-center">
                          <div className="bg-gray-900 p-3 rounded-full mb-3">
                            <Brain className="h-8 w-8 text-gray-600" />
                          </div>
                          <p className="text-gray-400 text-center mb-2">No quizzes available</p>
                          <p className="text-gray-500 text-sm text-center">
                            {activeTab === 'all' 
                              ? 'Generate your first quiz using the form on the left' 
                              : `No ${activeTab} quizzes available yet`}
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      <motion.div 
                        className="grid gap-4 p-1"
                        initial="hidden"
                        animate="visible"
                        variants={{
                          hidden: { opacity: 0 },
                          visible: { 
                            opacity: 1,
                            transition: { staggerChildren: 0.1 }
                          }
                        }}
                      >
                        {filteredQuizzes.map((quiz, idx) => (
                          <StoredQuizCard 
                            key={quiz.id} 
                            quiz={quiz}
                            onClick={() => router.push(`/quiz/${quiz.id}`)}
                            index={idx}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </ScrollArea>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-2">
            <Card className="bg-black border-gray-800 shadow-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-950/5 via-transparent to-amber-950/5 pointer-events-none" />
              <CardContent className="p-6 text-center relative">
                <div className="flex justify-center mb-3">
                  <Medal className="h-12 w-12 text-yellow-500 opacity-70" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">Quiz Leaderboard</h3>
                <p className="text-gray-400 mb-4">
                  Complete quizzes to appear on the leaderboard and compete with other science enthusiasts!
                </p>
                <Button 
                  variant="outline" 
                  className="border-gray-700 hover:bg-gray-800 bg-black/50"
                  onClick={() => setIsLeaderboardOpen(true)}
                >
                  View Leaderboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Leaderboard Modal Dialog */}
      <Dialog open={isLeaderboardOpen} onOpenChange={setIsLeaderboardOpen}>
        <DialogContent className="bg-black border border-gray-800 text-white md:max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="px-6 pt-6 pb-2">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl text-white flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Quiz Leaderboard
              </DialogTitle>
              
            </div>
            <DialogDescription className="text-gray-400">
              See how you rank against other science enthusiasts!
            </DialogDescription>
          </DialogHeader>
          
          <div className="border-t border-gray-800 my-2" />
          
          {leaderboardLoading ? (
            <div className="p-6 flex justify-center">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-yellow-500"></div>
                <p className="mt-4 text-gray-400">Loading leaderboard...</p>
              </div>
            </div>
          ) : leaderboardError ? (
            <div className="p-6 text-center">
              <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
              <p className="text-red-400 mb-4">{leaderboardError}</p>
              <Button 
                onClick={fetchLeaderboardData} 
                variant="outline" 
                className="border-red-800/30 hover:bg-red-900/20 text-red-400"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div className="p-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-4 flex flex-col items-center">
                    <BookOpen className="h-6 w-6 text-indigo-400 mb-2" />
                    <span className="text-2xl font-bold text-white">{leaderboardStats.totalQuizzes}</span>
                    <span className="text-xs text-gray-400">Total Quizzes</span>
                  </CardContent>
                </Card>
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-4 flex flex-col items-center">
                    <Users className="h-6 w-6 text-blue-400 mb-2" />
                    <span className="text-2xl font-bold text-white">{leaderboardStats.totalParticipants}</span>
                    <span className="text-xs text-gray-400">Participants</span>
                  </CardContent>
                </Card>
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-4 flex flex-col items-center">
                    <BarChart className="h-6 w-6 text-green-400 mb-2" />
                    <span className="text-2xl font-bold text-white">{leaderboardStats.averageScore}%</span>
                    <span className="text-xs text-gray-400">Average Score</span>
                  </CardContent>
                </Card>
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-4 flex flex-col items-center">
                    <BarChart4 className="h-6 w-6 text-purple-400 mb-2" />
                    <span className="text-2xl font-bold text-white">{leaderboardStats.completionRate}%</span>
                    <span className="text-xs text-gray-400">Completion Rate</span>
                  </CardContent>
                </Card>
              </div>
              
              {/* Leaderboard Table */}
              <div className="rounded-lg border border-gray-800 overflow-hidden">
                <div className="bg-gray-900 p-3 border-b border-gray-800">
                  <h3 className="font-medium text-white">Top Quiz Performers</h3>
                </div>
                <div className="bg-black">
                  <div className="grid grid-cols-12 text-xs uppercase text-gray-500 border-b border-gray-800 py-3 px-4">
                    <div className="col-span-1">Rank</div>
                    <div className="col-span-5">User</div>
                    <div className="col-span-2 text-center">Quizzes</div>
                    <div className="col-span-2 text-center">Avg. Score</div>
                    <div className="col-span-2 text-center">Best Subject</div>
                  </div>
                  
                  {leaderboardUsers.map((user, index) => (
                    <div 
                      key={user.id}
                      className={`grid grid-cols-12 items-center py-3 px-4 hover:bg-gray-900/30 transition-colors ${
                        index !== leaderboardUsers.length - 1 ? 'border-b border-gray-800' : ''
                      }`}
                    >
                      <div className="col-span-1">
                        {user.rank === 1 ? (
                          <div className="h-6 w-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
                            <Trophy className="h-3 w-3 text-yellow-500" />
                          </div>
                        ) : user.rank === 2 ? (
                          <div className="h-6 w-6 rounded-full bg-gray-400/20 flex items-center justify-center">
                            <Trophy className="h-3 w-3 text-gray-400" />
                          </div>
                        ) : user.rank === 3 ? (
                          <div className="h-6 w-6 rounded-full bg-amber-700/20 flex items-center justify-center">
                            <Trophy className="h-3 w-3 text-amber-700" />
                          </div>
                        ) : (
                          <span className="text-gray-500 font-medium">{user.rank}</span>
                        )}
                      </div>
                      <div className="col-span-5 flex items-center gap-3">
                        <Avatar className="h-8 w-8 bg-gray-800 border border-gray-700">
                          <AvatarFallback className="bg-indigo-950 text-indigo-300">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                          {user.avatar && (
                            <AvatarImage src={user.avatar} />
                          )}
                        </Avatar>
                        <span className="text-gray-200 font-medium">{user.name}</span>
                      </div>
                      <div className="col-span-2 text-center text-gray-400">
                        {user.quizzesCompleted}
                      </div>
                      <div className="col-span-2 text-center">
                        <div className="flex items-center justify-center">
                          <span className={`font-medium ${
                            user.avgScore >= 85 ? 'text-green-400' : 
                            user.avgScore >= 70 ? 'text-blue-400' : 
                            user.avgScore >= 50 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {user.avgScore}%
                          </span>
                        </div>
                      </div>
                      <div className="col-span-2 text-center">
                        <Badge 
                          variant="outline" 
                          className={
                            user.bestSubject === 'Physics' ? 'bg-indigo-950/20 text-indigo-300 border-indigo-700/30' :
                            user.bestSubject === 'Chemistry' ? 'bg-purple-950/20 text-purple-300 border-purple-700/30' :
                            'bg-green-950/20 text-green-300 border-green-700/30'
                          }
                        >
                          {user.bestSubject}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
             
              
              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  Complete more quizzes to improve your ranking and stats!
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function StoredQuizCard({ 
  quiz, 
  onClick,
  index
}: { 
  quiz: Quiz
  onClick: () => void
  index: number
}) {
  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
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
  
  // Get subject icon
  const getSubjectIcon = (subject: string) => {
    const lowerSubject = subject.toLowerCase()
    
    if (lowerSubject.includes('physics')) return <Atom className="h-5 w-5" />
    if (lowerSubject.includes('chemistry')) return <Beaker className="h-5 w-5" />
    if (lowerSubject.includes('biology')) return <Leaf className="h-5 w-5" />
    return <Brain className="h-5 w-5" />
  }
  
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className="bg-black border-gray-800 shadow-md hover:shadow-xl transition-all overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/30 via-transparent to-gray-900/10 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity" />
        <CardContent className="p-0">
          <Button 
            variant="ghost" 
            className="w-full h-auto p-0 block rounded-none hover:bg-transparent"
            onClick={onClick}
          >
            <div className="p-5 flex items-start justify-between w-full">
              <div className="flex gap-3 items-start">
                <div className="p-2 rounded-md bg-gray-900 text-indigo-400 flex-shrink-0 border border-gray-800 group-hover:border-indigo-800/50 transition-colors">
                  {getSubjectIcon(quiz.subject)}
                </div>
                <div className="text-left">
                  <h3 className="text-white text-lg font-medium group-hover:text-indigo-300 transition-colors">{quiz.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-2 items-center">
                    <Badge variant="outline" className="bg-indigo-950/30 text-indigo-300 border-indigo-800/30">
                      {quiz.subject}
                    </Badge>
                    {quiz.topic && (
                      <Badge variant="outline" className="bg-purple-950/30 text-purple-300 border-purple-800/30">
                        {quiz.topic}
                      </Badge>
                    )}
                    <Badge variant="outline" className={getDifficultyColor(quiz.difficulty)}>
                      {quiz.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm">
                    <div className="flex items-center gap-1 text-gray-500">
                      <BookOpen className="h-4 w-4 opacity-70" />
                      <span>{quiz.questions.length} questions</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock className="h-4 w-4 opacity-70" />
                      <span>{quiz.durationMinutes} min</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                size="sm" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Start Quiz
              </Button>
            </div>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}