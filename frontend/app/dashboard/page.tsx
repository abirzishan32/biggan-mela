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
                <span>স্বাগতম, <span className="text-purple-400">{username}</span>!</span>
              ) : (
                <span><span className="text-purple-400">বিজ্ঞানমেলায়</span> স্বাগতম</span>
              )}
            </h1>
            <p className="text-gray-400 text-lg max-w-md">
              {isLoading ? (
                <Skeleton className="h-5 w-96" />
              ) : (
                "আজ আপনি কোন বিষয় অন্বেষণ করতে চান?"
              )}
            </p>
          </div>
          
          {!isLoading && !user && (
            <div>
              <Button
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-lg px-6 py-6 h-auto"
                onClick={() => router.push('/signup')}
              >
                শুরু করুন
              </Button>
            </div>
          )}
        </div>
      </section>
      
      {/* Main learning paths - big clear buttons */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6">আপনার শিক্ষণ পথ বেছে নিন</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <LearningButtonCard 
            icon={<Beaker className="h-10 w-10 text-purple-400" />}
            title="ভার্চুয়াল ল্যাব"
            description="বিজ্ঞানের ধারণা অন্বেষণ করতে ইন্টারেক্টিভ সিমুলেশন এবং পরীক্ষা-নিরীক্ষা"
            href="/virtual-lab"
            color="purple"
          />
          
          <LearningButtonCard 
            icon={<BookOpen className="h-10 w-10 text-indigo-400" />}
            title="গল্পে গল্পে বিজ্ঞান"
            description="ছোট শিক্ষার্থীদের জন্য আকর্ষণীয় গল্পভিত্তিক বিজ্ঞান শিক্ষা"
            href="/storytelling"
            color="indigo"
          />
          
          <LearningButtonCard 
            icon={<Brain className="h-10 w-10 text-pink-400" />}
            title="এআই সমস্যা সমাধান"
            description="বিজ্ঞান সম্পর্কিত প্রশ্ন ও সমস্যার ব্যক্তিগত সমাধান পান"
            href="/ai-helper"
            color="pink"
          />
          
          <LearningButtonCard 
            icon={<Microscope className="h-10 w-10 text-blue-400" />}
            title="সিটিজেন সায়েন্স"
            description="আসল বিজ্ঞান গবেষণা প্রকল্পে অবদান রাখুন"
            href="/citizen-science"
            color="blue"
            isNew={true}
          />
        </div>
      </section>
      
      {/* Featured content - curated selection */}
      <section className="bg-gray-900/50 p-8 rounded-xl border border-gray-800">
        <h2 className="text-2xl font-bold text-white mb-6">বিশেষ বিষয়বস্তু</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <FeaturedCard
            icon={<Atom className="h-8 w-8 text-purple-400" />}
            title="পদার্থের অবস্থা অ্যাডভেঞ্চার"
            description="শিশুদের কঠিন, তরল এবং গ্যাস সম্পর্কে শিখতে আকর্ষণীয় গল্পভিত্তিক অভিজ্ঞতা"
            href="/storytelling/matter-of-state"
            type="গল্প"
            badge="জনপ্রিয়"
          />
          
          <FeaturedCard
            icon={<Zap className="h-8 w-8 text-indigo-400" />}
            title="দ্বি-চিড় পরীক্ষা"
            description="এই ইন্টারেক্টিভ সিমুলেশনে আকর্ষণীয় তরঙ্গ-কণা দ্বৈততা অন্বেষণ করুন"
            href="/virtual-lab/double-slit"
            type="ভার্চুয়াল ল্যাব"
            badge="বিশেষ"
          />
          
          <FeaturedCard
            icon={<CircuitBoard className="h-8 w-8 text-blue-400" />}
            title="বৈদ্যুতিক সার্কিট"
            description="এই নতুনদের অনুকূল ভার্চুয়াল ল্যাবে বৈদ্যুতিক সার্কিট তৈরি করুন এবং পরীক্ষা করুন"
            href="/virtual-lab/electric-ckt"
            type="ভার্চুয়াল ল্যাব"
          />
          
          <FeaturedCard
            icon={<Sparkles className="h-8 w-8 text-pink-400" />}
            title="পানি চক্রের যাত্রা"
            description="পানি চক্রের মধ্য দিয়ে একটি পানির ফোঁটার অ্যাডভেঞ্চার অনুসরণ করুন"
            href="/storytelling/water-cycle"
            type="গল্প"
          />
        </div>
        
        <div className="mt-6 flex justify-center">
          <Button variant="outline" size="lg" className="text-white border-gray-700 hover:bg-gray-800">
            সমস্ত বিষয়বস্তু দেখুন
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
              নতুন
            </span>
          )}
        </div>
        
        <p className="text-gray-400 mb-4">{description}</p>
        
        <div className="flex items-center text-sm font-medium mt-auto">
          <span className="text-white group-hover:text-purple-300 transition-colors flex items-center">
            শুরু করুন
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
  type: "ভার্চুয়াল ল্যাব" | "গল্প";
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
            <span>অন্বেষণ করুন</span>
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}