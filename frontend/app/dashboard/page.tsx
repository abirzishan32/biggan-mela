"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { 
  ArrowRight, 
  BookOpen, 
  Beaker, 
  Brain, 
  Microscope,
  Zap,
  CircuitBoard,
  Atom,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'

export default function Dashboard() {
  const router = useRouter()
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

  return (
    <div className="space-y-10">
      {/* Welcome section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-950 p-8 rounded-xl border border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-3">
              {isLoading ? (
                <Skeleton className="h-9 w-64" />
              ) : username ? (
                <span>Welcome back, <span className="text-purple-400">{username}</span>!</span>
              ) : (
                <span>Welcome to <span className="text-purple-400">বিজ্ঞানযজ্ঞ</span></span>
              )}
            </h1>
            <p className="text-gray-400 text-lg max-w-md">
              {isLoading ? (
                <Skeleton className="h-5 w-96" />
              ) : (
                "What would you like to explore today?"
              )}
            </p>
          </div>
          
          {!isLoading && !user && (
            <div>
              <Button
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-lg px-6 py-6 h-auto"
                onClick={() => router.push('/signup')}
              >
                Get Started
              </Button>
            </div>
          )}
        </div>
      </section>
      
      {/* Main learning paths - big clear buttons */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6">Choose Your Learning Path</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <LearningButtonCard 
            icon={<Beaker className="h-10 w-10 text-purple-400" />}
            title="Virtual Labs"
            description="Interactive simulations and experiments to explore scientific concepts"
            href="/virtual-lab"
            color="purple"
          />
          
          <LearningButtonCard 
            icon={<BookOpen className="h-10 w-10 text-indigo-400" />}
            title="Science for Kids"
            description="Story-based adventures that make science fun for young learners"
            href="/storytelling"
            color="indigo"
          />
          
          <LearningButtonCard 
            icon={<Brain className="h-10 w-10 text-pink-400" />}
            title="AI Problem Solver"
            description="Get personalized help solving scientific problems and questions"
            href="/ai-helper"
            color="pink"
          />
          
          <LearningButtonCard 
            icon={<Microscope className="h-10 w-10 text-blue-400" />}
            title="Citizen Science"
            description="Contribute to real scientific research projects"
            href="/citizen-science"
            color="blue"
            isNew={true}
          />
        </div>
      </section>
      
      {/* Featured content - curated selection */}
      <section className="bg-gray-900/50 p-8 rounded-xl border border-gray-800">
        <h2 className="text-2xl font-bold text-white mb-6">Featured Content</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <FeaturedCard
            icon={<Atom className="h-8 w-8 text-purple-400" />}
            title="States of Matter Adventure"
            description="A fun story-based experience for kids to learn about solids, liquids and gases"
            href="/storytelling/matter-of-state"
            type="Story"
            badge="Popular"
          />
          
          <FeaturedCard
            icon={<Zap className="h-8 w-8 text-indigo-400" />}
            title="Double Slit Experiment"
            description="Explore the fascinating wave-particle duality in this interactive simulation"
            href="/virtual-lab/double-slit"
            type="Virtual Lab"
            badge="Featured"
          />
          
          <FeaturedCard
            icon={<CircuitBoard className="h-8 w-8 text-blue-400" />}
            title="Electric Circuits"
            description="Build and test electric circuits in this beginner-friendly virtual lab"
            href="/virtual-lab/electric-ckt"
            type="Virtual Lab"
          />
          
          <FeaturedCard
            icon={<Sparkles className="h-8 w-8 text-pink-400" />}
            title="The Water Cycle Journey"
            description="Follow a water droplet's adventure through the water cycle"
            href="/storytelling/water-cycle"
            type="Story"
          />
        </div>
        
        <div className="mt-6 flex justify-center">
          <Button variant="outline" size="lg" className="text-white border-gray-700 hover:bg-gray-800">
            Explore All Content
          </Button>
        </div>
      </section>
    </div>
  )
}

// Simplified learning path button card
function LearningButtonCard({ 
  icon, 
  title, 
  description, 
  href, 
  color,
  isNew = false
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  color: "purple" | "indigo" | "blue" | "pink";
  isNew?: boolean;
}) {
  const colorStyles = {
    purple: "from-purple-500/20 to-purple-500/5 hover:from-purple-500/30 hover:to-purple-500/10 border-purple-500/20",
    indigo: "from-indigo-500/20 to-indigo-500/5 hover:from-indigo-500/30 hover:to-indigo-500/10 border-indigo-500/20",
    pink: "from-pink-500/20 to-pink-500/5 hover:from-pink-500/30 hover:to-pink-500/10 border-pink-500/20",
    blue: "from-blue-500/20 to-blue-500/5 hover:from-blue-500/30 hover:to-blue-500/10 border-blue-500/20"
  };

  return (
    <Link href={href} className="block">
      <div className={`bg-gradient-to-br ${colorStyles[color]} p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-all duration-300 h-full relative group`}>
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-gray-900 rounded-lg">
            {icon}
          </div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
          
          {isNew && (
            <span className="absolute top-4 right-4 px-2 py-0.5 text-xs font-medium bg-indigo-500/30 text-indigo-300 rounded-full border border-indigo-500/30">
              New
            </span>
          )}
        </div>
        
        <p className="text-gray-400 mb-4">{description}</p>
        
        <div className="flex items-center text-sm font-medium mt-auto">
          <span className="text-white group-hover:text-purple-300 transition-colors flex items-center">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  )
}

// Simplified featured content card
function FeaturedCard({
  icon,
  title,
  description,
  href,
  type,
  badge
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  type: "Virtual Lab" | "Story";
  badge?: string;
}) {
  return (
    <Link href={href}>
      <Card className="bg-gray-950 border-gray-800 hover:border-gray-700 transition-all duration-300">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-900 rounded-lg text-white">
                {icon}
              </div>
              <span className="text-sm text-gray-400">{type}</span>
            </div>
            
            {badge && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-900/50 text-purple-300 border border-purple-700/30">
                {badge}
              </span>
            )}
          </div>
          
          <h3 className="font-bold text-lg text-white mb-2">{title}</h3>
          <p className="text-gray-400 text-sm">{description}</p>
          
          <div className="mt-4 flex items-center text-sm font-medium text-purple-400 group-hover:text-purple-300 transition-colors">
            <span>Explore</span>
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}