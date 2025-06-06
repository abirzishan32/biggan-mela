"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Search, Sparkles, Atom, CloudRain, BookOpen, Flame } from "lucide-react"
import Link from 'next/link'
import { Badge } from "@/components/ui/badge"
import { ReactNode } from 'react'

interface Story {
  title: string;
  description: string;
  category: string;
  ageRange: string;
  icon: ReactNode;
  href: string;
  badge?: string;
  image?: string;
}

export default function StorytellingPage() {
  const [searchQuery, setSearchQuery] = useState('')
  
  // Define available stories with Bengali content
  const stories: Story[] = [
    {
      title: "পদার্থের অবস্থা অ্যাডভেঞ্চার",
      description: "রাজু এবং মিতার সাথে যোগ দিন যারা দৈনন্দিন উদাহরণের মাধ্যমে কঠিন, তরল এবং গ্যাস আবিষ্কার করে।",
      category: "মৌলিক পদার্থবিদ্যা",
      ageRange: "৬-৯ বছর",
      icon: <Atom className="h-6 w-6" />,
      href: "/storytelling/matter-of-state",
      badge: "জনপ্রিয়",
      image: "/images/stories/matter-states.jpg"
    },
    {
      title: "জলচক্রের যাত্রা",
      description: "একটি জলের ফোঁটার যাত্রা অনুসরণ করুন যখন এটি জলচক্রের মধ্য দিয়ে যায়, বৃষ্টি, তুষার এবং আরও অনেক কিছু হয়ে ওঠে।",
      category: "পৃথিবী বিজ্ঞান",
      ageRange: "৫-৮ বছর",
      icon: <CloudRain className="h-6 w-6" />,
      href: "/storytelling/water-cycle",
      image: "/images/stories/water-cycle.jpg"
    },
    {
      title: "অগ্নি নির্বাপকের রহস্য",
      description: "শিশুরা শিখবে কিভাবে আগুন জ্বলে এবং অগ্নি নির্বাপক কিভাবে আগুন নেভায়, একটি আকর্ষণীয় এবং শিক্ষামূলক গল্পের মাধ্যমে।",
      category: "বিজ্ঞান ও সুরক্ষা",
      ageRange: "৭-১০ বছর",
      icon: <Flame className="h-6 w-6" />,
      href: "/storytelling/fire-extinguisher",
      badge: "নতুন",
      image: "/images/stories/fire-safety.jpg"
    }
  ]

  // Filter stories based on search query
  const filteredStories = searchQuery 
    ? stories.filter(story => 
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        story.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.ageRange.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : stories;

  return (
    <div className="space-y-8">
      {/* Hero section */}
      <section className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 z-0">
          <div className="absolute inset-0 opacity-20 mix-blend-overlay">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
              <defs>
                <pattern id="stars" width="70" height="70" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="1" fill="white" opacity="0.8" />
                  <circle cx="35" cy="20" r="1.5" fill="white" opacity="0.8" />
                  <circle cx="60" cy="50" r="1" fill="white" opacity="0.8" />
                  <circle cx="15" cy="40" r="1.2" fill="white" opacity="0.8" />
                  <circle cx="40" cy="55" r="1" fill="white" opacity="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#stars)" />
            </svg>
          </div>
        </div>
        
        <div className="relative z-10 px-6 py-12 md:py-20 md:px-10 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0 md:mr-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              শিশুদের জন্য বিজ্ঞান গল্প
            </h1>
            <p className="text-white/90 max-w-lg">
              বিজ্ঞানকে সহজ এবং মজার উপায়ে ছোট শিক্ষার্থীদের জন্য উপস্থাপন করা হয়েছে। আকর্ষণীয় গল্প ও অ্যানিমেশনের মাধ্যমে বাচ্চাদের বিজ্ঞান শিখতে সাহায্য করুন।
            </p>
            <div className="mt-6 flex gap-4">
              <Button className="bg-white text-indigo-700 hover:bg-white/90">
                সব গল্প দেখুন
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/20 hover:text-white">
                আরও জানুন
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="p-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600">
              <div className="p-6 md:p-8 bg-gray-950 rounded-full">
                <BookOpen size={80} className="w-16 h-16 md:w-20 md:h-20 text-white/90" />
              </div>
            </div>
            <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-indigo-500 animate-pulse"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-purple-500 animate-pulse delay-300"></div>
          </div>
        </div>
      </section>
      
      {/* Search Section */}
      <section className="relative">
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input 
              className="pl-10 bg-gray-900 border-gray-700 rounded-lg focus-visible:ring-purple-500 placeholder:text-gray-500"
              placeholder="গল্প খুঁজুন..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>
      
      {/* Stories Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {searchQuery ? 'সার্চ ফলাফল' : 'উপলব্ধ গল্প'}
          </h2>
          
          <div className="text-sm text-muted-foreground">
            দেখানো হচ্ছে {filteredStories.length}টি {filteredStories.length === 1 ? 'গল্প' : 'গল্প'}
          </div>
        </div>
        
        {filteredStories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredStories.map((story, index) => (
              <StoryCard key={index} story={story} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-gray-800 rounded-lg bg-gray-900/50">
            <Sparkles className="h-12 w-12 mx-auto text-gray-600 mb-4" />
            <p className="text-lg font-medium text-white">আপনার সার্চের সাথে কোন গল্প মেলেনি</p>
            <p className="text-gray-400 mt-2">সার্চ টার্ম পরিবর্তন করে চেষ্টা করুন</p>
            <Button 
              variant="link" 
              className="mt-4 text-purple-400"
              onClick={() => setSearchQuery('')}
            >
              সার্চ পরিষ্কার করুন
            </Button>
          </div>
        )}
      </section>
      
      {/* Coming Soon Section */}
      <section className="mt-12">
        <div className="border border-purple-500/30 rounded-lg p-6 bg-gradient-to-br from-purple-900/20 to-indigo-900/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-500/20 text-purple-300 mb-4 inline-block">
                আসছে শীঘ্রই
              </span>
              <h3 className="text-xl font-bold text-white mb-2">আরও নতুন গল্প আসছে!</h3>
              <p className="text-gray-400">
                আমরা ছোট শিক্ষার্থীদের জন্য নতুন এবং আকর্ষণীয় বিজ্ঞান অ্যাডভেঞ্চার তৈরি করছি। অপেক্ষায় থাকুন!
              </p>
            </div>
            <div className="flex items-center">
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 border-0 text-white">
                নোটিফিকেশন পান
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function StoryCard({ story }: { story: Story }) {
  return (
    <Link href={story.href}>
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
                {story.icon}
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
              <div className="flex justify-between items-start mb-3">
                <div className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-purple-900/50 text-purple-300 border border-purple-700/30">
                  {story.ageRange}
                </div>
                
                {story.badge && (
                  <Badge className="bg-indigo-600/80 text-white border-0 shadow-lg backdrop-blur-sm">
                    {story.badge}
                  </Badge>
                )}
              </div>
              
              <div>
                <h3 className="font-bold text-lg text-white">{story.title}</h3>
                <div className="px-2 py-1 text-xs inline-block bg-gray-800/50 text-gray-400 rounded-md mt-2 mb-2">
                  {story.category}
                </div>
                <p className="text-gray-400 text-sm mt-2">{story.description}</p>
              </div>
              
              <div className="mt-4 flex items-center text-sm font-medium text-purple-400 group-hover:text-purple-300 transition-colors">
                <span className="group-hover:translate-x-1 transition-transform duration-300">গল্প শুরু করুন</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  )
}