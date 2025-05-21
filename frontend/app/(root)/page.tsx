"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { 
  ArrowRight, 
  BookOpen, 
  Beaker, 
  Brain, 
  BookMarked,
  Sparkles, 
  Microscope, 
  Award,
  Star,
  Gamepad2,
  Zap,
  CircuitBoard,
  Atom
} from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/context/language-context'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'

export default function Dashboard() {
  const router = useRouter()
  const { t } = useLanguage()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user')
        const data = await response.json()
        setUser(data.user ? data : null)
      } catch (error) {
        console.error('Failed to fetch user:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchUser()
  }, [])

  const username = user?.user?.user_metadata?.full_name || 
                  (user?.user?.email ? user.user.email.split('@')[0] : null)

  // Staggered card animation
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };

  return (
    <div className="space-y-8">
      {/* Hero section */}
      <section>
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isLoading ? (
                <Skeleton className="h-9 w-64" />
              ) : username ? (
                <span>Welcome back, <span className="text-purple-500">{username}</span>!</span>
              ) : (
                <span>Welcome to <span className="text-purple-500">বিজ্ঞানযজ্ঞ</span></span>
              )}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isLoading ? (
                <Skeleton className="h-5 w-96" />
              ) : (
                "Continue your interactive science learning journey"
              )}
            </p>
          </div>
          
          {!isLoading && !user && (
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="hidden md:flex"
                onClick={() => router.push('/login')}
              >
                Sign In
              </Button>
              <Button
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                onClick={() => router.push('/signup')}
              >
                Create Account
              </Button>
            </div>
          )}
        </motion.div>
      </section>
      
      {/* Main learning paths */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
          <LearningCard 
            icon={<Beaker className="h-8 w-8 text-purple-500" />}
            title="Virtual Labs"
            description="Interactive simulations and experiments"
            href="/virtual-lab"
            bgClass="from-purple-500/20 to-indigo-500/5"
            iconBg="from-purple-500 to-indigo-500"
          />
        </motion.div>
        
        <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
          <LearningCard 
            icon={<BookOpen className="h-8 w-8 text-indigo-500" />}
            title="Science for Kids"
            description="Story-based learning adventures"
            href="/storytelling"
            bgClass="from-indigo-500/20 to-sky-500/5"
            iconBg="from-indigo-500 to-sky-500"
          />
        </motion.div>
        
        <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
          <LearningCard 
            icon={<Brain className="h-8 w-8 text-pink-500" />}
            title="AI Helper"
            description="Get personalized problem solving"
            href="/ai-helper"
            bgClass="from-pink-500/20 to-rose-500/5"
            iconBg="from-pink-500 to-rose-500"
          />
        </motion.div>
        
        <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible">
          <LearningCard 
            icon={<Microscope className="h-8 w-8 text-blue-500" />}
            title="Citizen Science"
            description="Contribute to real scientific research"
            href="/citizen-science"
            bgClass="from-blue-500/20 to-cyan-500/5"
            iconBg="from-blue-500 to-cyan-500"
            isNew={true}
          />
        </motion.div>
      </section>
      
      {/* Featured virtual labs */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Virtual Labs</h2>
          <Link href="/virtual-lab">
            <Button variant="outline" size="sm" className="group">
              View All
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
            <VirtualLabCard
              title="Double Slit Experiment"
              description="Explore wave-particle duality and quantum mechanics"
              icon={<Zap className="h-10 w-10" />}
              href="/virtual-lab/double-slit"
              bgImage="/images/double-slit-bg.jpg"
              difficulty="Medium"
              category="Physics"
            />
          </motion.div>
          
          <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
            <VirtualLabCard
              title="Electric Circuits"
              description="Build and test electric circuits with virtual components"
              icon={<CircuitBoard className="h-10 w-10" />}
              href="/virtual-lab/electric-ckt"
              bgImage="/images/electric-circuit-bg.jpg"
              difficulty="Beginner"
              category="Physics"
            />
          </motion.div>
          
          <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
            <VirtualLabCard
              title="Bubble Sort Visualization"
              description="See the algorithm at work with dynamic visualization"
              icon={<Zap className="h-10 w-10" />}
              href="/virtual-lab/bubble-sort"
              bgImage="/images/bubble-sort-bg.jpg"
              difficulty="Beginner"
              category="Computer Science"
            />
          </motion.div>
        </div>
      </section>
      
      {/* Kids stories */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Science Stories for Kids</h2>
          <Link href="/storytelling">
            <Button variant="outline" size="sm" className="group">
              View All
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
            <KidsStoryCard
              title="States of Matter Adventure"
              description="Join Alex and Maya as they discover solids, liquids, and gases"
              icon={<Atom className="h-10 w-10" />}
              href="/storytelling/matter-of-state"
              bgImage="/images/states-matter-bg.jpg"
              ageRange="6-9 years"
            />
          </motion.div>
          
          <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
            <KidsStoryCard
              title="The Water Cycle Journey"
              description="Follow a water droplet's adventure through the water cycle"
              icon={<Sparkles className="h-10 w-10" />}
              href="/storytelling/water-cycle" 
              bgImage="/images/water-cycle-bg.jpg"
              ageRange="5-8 years"
            />
          </motion.div>
        </div>
      </section>
    </div>
  )
}

// Re-using your card components from the dashboard
function LearningCard({ 
  icon, 
  title, 
  description, 
  href, 
  bgClass, 
  iconBg,
  isNew = false
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  bgClass: string;
  iconBg: string;
  isNew?: boolean;
}) {
  return (
    <Link href={href}>
      <Card className="group overflow-hidden transition-all duration-300 border-0 hover:shadow-[0_0_25px_rgba(139,92,246,0.15)] bg-gradient-to-br from-gray-900 to-gray-950 h-full">
        <div className={`h-1 w-full bg-gradient-to-r ${iconBg}`}></div>
        <CardContent className="p-6 relative">
          {/* Glow effect on hover */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${iconBg} shadow-[0_0_15px_rgba(139,92,246,0.3)] text-white`}>
                {icon}
              </div>
              
              {isNew && (
                <span className="px-2 py-1 text-[10px] uppercase tracking-wider font-semibold bg-indigo-600/30 text-white border border-indigo-500/30 rounded backdrop-blur-sm">
                  New
                </span>
              )}
            </div>
            
            <div className="mt-5 space-y-2">
              <h3 className="font-bold text-lg text-white">{title}</h3>
              <p className="text-gray-400 text-sm">{description}</p>
            </div>
            
            <div className="mt-6 pt-2 text-sm font-medium flex items-center text-purple-400 mt-auto group-hover:text-purple-300 transition-colors">
              <span className="group-hover:translate-x-1 transition-transform duration-300">Explore</span>
              <ArrowRight className="ml-1.5 h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function VirtualLabCard({
  title,
  description,
  icon,
  href,
  bgImage,
  difficulty,
  category
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  bgImage: string;
  difficulty: string;
  category: string;
}) {
  return (
    <Link href={href}>
      <Card className="group overflow-hidden transition-all duration-300 border-0 hover:shadow-[0_0_25px_rgba(139,92,246,0.15)] bg-gray-950 h-full">
        <div className="h-48 relative overflow-hidden">
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-gray-950/40 z-10 opacity-90"></div>
          
          {/* Glowing accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 z-20 shadow-[0_0_10px_rgba(139,92,246,0.5)]"></div>
          
          {/* Content */}
          <div className="absolute bottom-5 left-5 z-20">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gray-900/80 backdrop-blur-md rounded-lg text-white border border-purple-500/20 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                {icon}
              </div>
              <div>
                <h4 className="font-semibold text-white">{category}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400 font-medium bg-gray-800/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-gray-700/50">
                    {difficulty}
                  </span>
                  <div className="flex">
                    {difficulty === "Beginner" && (
                      <div className="flex space-x-0.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
                        <div className="h-1.5 w-1.5 rounded-full bg-gray-700"></div>
                        <div className="h-1.5 w-1.5 rounded-full bg-gray-700"></div>
                        <div className="h-1.5 w-1.5 rounded-full bg-gray-700"></div>
                      </div>
                    )}
                    {difficulty === "Medium" && (
                      <div className="flex space-x-0.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
                        <div className="h-1.5 w-1.5 rounded-full bg-gray-700"></div>
                        <div className="h-1.5 w-1.5 rounded-full bg-gray-700"></div>
                      </div>
                    )}
                    {difficulty === "Advanced" && (
                      <div className="flex space-x-0.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute inset-0">
            {/* Futuristic tech background */}
            <div className={`h-full w-full bg-gradient-to-br from-gray-900 to-gray-950 relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-40">
                <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                      <path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(108, 43, 217, 0.3)" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-950 to-transparent"></div>
            </div>
          </div>
        </div>
        <CardContent className="p-5 bg-gradient-to-br from-gray-900 to-gray-950">
          <h3 className="font-bold text-lg text-white">{title}</h3>
          <p className="text-gray-400 text-sm mt-2">{description}</p>
          <div className="mt-4 flex items-center text-sm font-medium text-purple-400 group-hover:text-purple-300 transition-colors">
            <span className="group-hover:translate-x-1 transition-transform duration-300">Start Experiment</span>
            <ArrowRight className="ml-1.5 h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function KidsStoryCard({
  title,
  description,
  icon,
  href,
  bgImage,
  ageRange
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  bgImage: string;
  ageRange: string;
}) {
  return (
    <Link href={href}>
      <Card className="group overflow-hidden transition-all duration-300 border-0 hover:shadow-[0_0_25px_rgba(139,92,246,0.15)] bg-gradient-to-br from-gray-900 to-gray-950 h-full">
        <div className="relative flex flex-col lg:flex-row">
          {/* Side accent bar for desktop */}
          <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-600 to-indigo-600"></div>
          
          {/* Image section */}
          <div className="w-full lg:w-2/5 h-36 lg:h-auto relative overflow-hidden">
            <div className="absolute inset-0 opacity-75">
              <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="circles" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="10" cy="10" r="1.5" fill="rgba(139, 92, 246, 0.5)" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#circles)" />
              </svg>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-transparent to-gray-950/90"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent"></div>
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="p-3 bg-gray-900/90 backdrop-blur-md rounded-xl border border-purple-500/30 shadow-[0_0_15px_rgba(139,92,246,0.2)] text-white">
                {icon}
              </div>
            </div>
            
            {/* Top-right corner accent */}
            <div className="absolute top-0 right-0 border-t-2 border-r-2 border-purple-600/30 w-8 h-8 rounded-bl-xl"></div>
            
            {/* Bottom-left corner accent */}
            <div className="absolute bottom-0 left-0 border-b-2 border-l-2 border-purple-600/30 w-8 h-8 rounded-tr-xl"></div>
          </div>
          
          {/* Content */}
          <CardContent className="p-5 lg:p-6 flex-1 relative lg:pl-8">
            {/* Glow effect on hover */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/10 to-indigo-600/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="inline-block px-3 py-1 mb-3 text-xs font-medium rounded-full bg-purple-900/50 text-purple-300 border border-purple-700/30">
                {ageRange}
              </div>
              <h3 className="font-bold text-lg text-white">{title}</h3>
              <p className="text-gray-400 text-sm mt-2">{description}</p>
              <div className="mt-4 flex items-center text-sm font-medium text-purple-400 group-hover:text-purple-300 transition-colors">
                <span className="group-hover:translate-x-1 transition-transform duration-300">Start Story</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  )
}