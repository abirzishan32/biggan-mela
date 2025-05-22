"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ArrowRight, Search, Atom, RadioTower, MagnetIcon, FoldVertical, Code, Beaker, Zap, Laptop, CircuitBoard, Microscope, Globe } from "lucide-react"
import Link from 'next/link'
import { Badge } from "@/components/ui/badge"

export default function VirtualLabs() {
  const [searchQuery, setSearchQuery] = useState('')
  const [language, setLanguage] = useState<'english' | 'bengali'>('english')

  // Define categories of labs - Physics
 const physicLabs = [
  {
    title: { english: "Double Slit Experiment", bengali: "দ্বি-চিড় পরীক্ষণ" },
    description: {
      english: "Explore the fundamental principles of quantum mechanics through this interactive simulation.",
      bengali: "এই ইন্টারেক্টিভ সিমুলেশনের মাধ্যমে কোয়ান্টাম মেকানিক্সের মৌলিক নীতিগুলি অন্বেষণ করুন।"
    },
    category: { english: "Quantum Physics", bengali: "কোয়ান্টাম পদার্থবিজ্ঞান" },
    difficulty: { english: "Medium", bengali: "মাঝারি" },
    icon: <RadioTower className="h-6 w-6" />,
    href: "/virtual-lab/double-slit",
    badge: "Popular"
  },
  {
    title: { english: "Electric Circuits", bengali: "বৈদ্যুতিক সার্কিট" },
    description: {
      english: "Build and test electric circuits with virtual components.",
      bengali: "ভার্চুয়াল উপাদান দিয়ে বৈদ্যুতিক সার্কিট তৈরি এবং পরীক্ষা করুন।"
    },
    category: { english: "Electronics", bengali: "ইলেকট্রনিক্স" },
    difficulty: { english: "Beginner", bengali: "প্রাথমিক" },
    icon: <CircuitBoard className="h-6 w-6" />,
    href: "/virtual-lab/electric-ckt"
  },
  {
    title: { english: "Projectile Motion", bengali: "প্রক্ষেপণ গতি" },
    description: {
      english: "Launch projectiles and observe their motion under gravity.",
      bengali: "প্রক্ষেপণ করুন এবং মহাকর্ষের অধীনে তাদের গতি পর্যবেক্ষণ করুন।"
    },
    category: { english: "Mechanics", bengali: "বলবিদ্যা" },
    difficulty: { english: "Beginner", bengali: "প্রাথমিক" },
    icon: <FoldVertical className="h-6 w-6" />,
    href: "/virtual-lab/projectile"
  },
  {
    title: { english: "Lenz's Law", bengali: "লেঞ্জের সূত্র" },
    description: {
      english: "Explore electromagnetic induction and Lenz's law in action.",
      bengali: "তড়িৎচুম্বকীয় আবেশ এবং লেঞ্জের সূত্রের প্রয়োগ অন্বেষণ করুন।"
    },
    category: { english: "Electromagnetism", bengali: "তড়িৎচুম্বকত্ব" },
    difficulty: { english: "Advanced", bengali: "উন্নত" },
    icon: <MagnetIcon className="h-6 w-6" />,
    href: "/virtual-lab/lenz-law"
  },
  {
    title: { english: "Simple Pendulum", bengali: "সরল দোলক" },
    description: {
      english: "Study the motion of a simple pendulum and the factors affecting its period.",
      bengali: "সরল দোলকের গতি এবং এর সময়কালকে প্রভাবিত করে এমন কারণগুলি অধ্যয়ন করুন।"
    },
    category: { english: "Mechanics", bengali: "বলবিদ্যা" },
    difficulty: { english: "Beginner", bengali: "প্রাথমিক" },
    icon: <FoldVertical className="h-6 w-6" />,
    href: "/virtual-lab/simple-pendulum"
  },
  {
    title: { english: "Snell's Law", bengali: "স্নেলের সূত্র" },
    description: {
      english: "Visualize how light refracts when passing through different mediums.",
      bengali: "বিভিন্ন মাধ্যমের মধ্য দিয়ে যাওয়ার সময় আলো কিভাবে প্রতিসরিত হয় তা দেখুন।"
    },
    category: { english: "Optics", bengali: "আলোকবিজ্ঞান" },
    difficulty: { english: "Medium", bengali: "মাঝারি" },
    icon: <Zap className="h-6 w-6" />,
    href: "/virtual-lab/snell-law"
  },
  {
    title: { english: "Lens Simulation", bengali: "লেন্স সিমুলেশন" },
    description: {
      english: "Explore how convex and concave lenses form images with interactive ray diagrams.",
      bengali: "ইন্টারেক্টিভ রশ্মি চিত্রের সাহায্যে উত্তল এবং অবতল লেন্সগুলি কীভাবে প্রতিবিম্ব তৈরি করে তা অন্বেষণ করুন।"
    },
    category: { english: "Optics", bengali: "আলোকবিজ্ঞান" },
    difficulty: { english: "Medium", bengali: "মাঝারি" },
    icon: <Microscope className="h-6 w-6" />,
    href: "/virtual-lab/lens"
  },
  {
    title: { english: "Light Refraction Game", bengali: "আলোর প্রতিসরণ গেম" },
    description: {
      english: "Play with light rays and learn about refraction in a fun game environment.",
      bengali: "আলোর রশ্মি নিয়ে খেলুন এবং মজাদার গেম পরিবেশে প্রতিসরণ সম্পর্কে জানুন।"
    },
    category: { english: "Optics", bengali: "আলোকবিজ্ঞান" },
    difficulty: { english: "Beginner", bengali: "প্রাথমিক" },
    icon: <Zap className="h-6 w-6" />,
    href: "/virtual-lab/light-game"
  },
  {
    title: { english: "Prism Light Dispersion", bengali: "প্রিজম আলোর বিচ্ছুরণ" },
    description: {
      english: "See how white light splits into its component colors when passing through a prism.",
      bengali: "দেখুন কীভাবে সাদা আলো প্রিজমের মধ্য দিয়ে যাওয়ার সময় এর উপাদান রঙগুলিতে বিভক্ত হয়।"
    },
    category: { english: "Optics", bengali: "আলোকবিজ্ঞান" },
    difficulty: { english: "Beginner", bengali: "প্রাথমিক" },
    icon: <Zap className="h-6 w-6" />,
    href: "/virtual-lab/prism"
  },
  {
    title: { english: "Conservation of Momentum", bengali: "ভরবেগ সংরক্ষণ" },
    description: {
      english: "Experiment with collisions to learn about the conservation of momentum principle.",
      bengali: "ভরবেগ সংরক্ষণের নীতি সম্পর্কে জানতে সংঘর্ষ নিয়ে পরীক্ষা করুন।"
    },
    category: { english: "Mechanics", bengali: "বলবিদ্যা" },
    difficulty: { english: "Medium", bengali: "মাঝারি" },
    icon: <FoldVertical className="h-6 w-6" />,
    href: "/virtual-lab/conservation-of-momentum"
  },
  {
    title: { english: "Spring and Mass System", bengali: "স্প্রিং এবং ভর সিস্টেম" },
    description: {
      english: "Explore simple harmonic motion with a spring and mass system.",
      bengali: "স্প্রিং এবং ভর সিস্টেমের সাহায্যে সরল দোলন গতি অন্বেষণ করুন।"
    },
    category: { english: "Mechanics", bengali: "বলবিদ্যা" },
    difficulty: { english: "Medium", bengali: "মাঝারি" },
    icon: <FoldVertical className="h-6 w-6" />,
    href: "/virtual-lab/spring-and-mass"
  }
];


  // CS Labs with Bengali translations
  const csLabs = [
    {
      title: {
        english: "Bubble Sort Visualization",
        bengali: "বাবল সর্ট ভিজ্যুয়ালাইজেশন"
      },
      description: {
        english: "See the bubble sort algorithm at work with a dynamic visualization.",
        bengali: "একটি গতিশীল ভিজ্যুয়ালাইজেশনের সাহায্যে বাবল সর্ট অ্যালগরিদম কাজ করতে দেখুন।"
      },
      category: {
        english: "Algorithms",
        bengali: "অ্যালগরিদম"
      },
      difficulty: {
        english: "Beginner",
        bengali: "প্রাথমিক"
      },
      icon: <Code className="h-6 w-6" />,
      href: "/virtual-lab/bubble-sort",
      badge: "Popular"
    },
    {
      title: {
        english: "Quick Sort Visualization",
        bengali: "কুইক সর্ট ভিজ্যুয়ালাইজেশন"
      },
      description: {
        english: "Visualize the divide-and-conquer quick sort algorithm in action.",
        bengali: "বিভাজন-এবং-জয় কুইক সর্ট অ্যালগরিদমকে কাজ করতে দেখুন।"
      },
      category: {
        english: "Algorithms",
        bengali: "অ্যালগরিদম"
      },
      difficulty: {
        english: "Medium",
        bengali: "মাঝারি"
      },
      icon: <Code className="h-6 w-6" />,
      href: "/virtual-lab/quick-sort"
    },
    {
      title: {
        english: "Merge Sort Visualization",
        bengali: "মার্জ সর্ট ভিজ্যুয়ালাইজেশন"
      },
      description: {
        english: "Watch how merge sort divides, sorts, and combines arrays.",
        bengali: "মার্জ সর্ট কিভাবে অ্যারে বিভক্ত করে, সাজায়, এবং একত্রিত করে তা দেখুন।"
      },
      category: {
        english: "Algorithms",
        bengali: "অ্যালগরিদম"
      },
      difficulty: {
        english: "Medium",
        bengali: "মাঝারি"
      },
      icon: <Code className="h-6 w-6" />,
      href: "/virtual-lab/merge-sort"
    },
    {
    title: {
      english: "Breadth-First Search",
      bengali: "ব্রেথ ফার্স্ট সার্চ"
    },
    description: {
      english: "Visualize the BFS graph traversal algorithm and learn how it finds the shortest path.",
      bengali: "বিএফএস গ্রাফ ট্রাভার্সাল অ্যালগরিদম দেখুন এবং এটি কীভাবে সবচেয়ে ছোট পথ খুঁজে পায় তা শিখুন।"
    },
    category: {
      english: "Graph Algorithms",
      bengali: "গ্রাফ অ্যালগরিদম"
    },
    difficulty: {
      english: "Medium",
      bengali: "মাঝারি"
    },
    icon: <Code className="h-6 w-6" />,
    href: "/virtual-lab/bfs"
  },
  {
    title: {
      english: "Depth-First Search",
      bengali: "ডেপথ ফার্স্ট সার্চ"
    },
    description: {
      english: "See how DFS explores as far as possible along each branch before backtracking.",
      bengali: "দেখুন কিভাবে ডিএফএস ব্যাকট্র্যাকিং করার আগে প্রতিটি শাখা ধরে যতদূর সম্ভব অনুসন্ধান করে।"
    },
    category: {
      english: "Graph Algorithms",
      bengali: "গ্রাফ অ্যালগরিদম"
    },
    difficulty: {
      english: "Medium",
      bengali: "মাঝারি"
    },
    icon: <Code className="h-6 w-6" />,
    href: "/virtual-lab/dfs"
  },
  {
    title: {
      english: "Dijkstra's Algorithm",
      bengali: "ডিজকস্ট্রার অ্যালগরিদম"
    },
    description: {
      english: "Visualize how Dijkstra's algorithm finds the shortest path in a weighted graph.",
      bengali: "ডিজকস্ট্রার অ্যালগরিদম কিভাবে ওজনযুক্ত গ্রাফে সবচেয়ে ছোট পথ খুঁজে পায় তা দেখুন।"
    },
    category: {
      english: "Graph Algorithms",
      bengali: "গ্রাফ অ্যালগরিদম"
    },
    difficulty: {
      english: "Advanced",
      bengali: "এডভান্স"
    },
    icon: <Code className="h-6 w-6" />,
    href: "/virtual-lab/dijkstra"
  }

  ]

  // Chemistry Labs with Bengali translations
  const chemistryLabs = [
    {
      title: {
        english: "pH Scale Interactive",
        bengali: "পিএইচ স্কেল ইন্টারেক্টিভ"
      },
      description: {
        english: "Test different solutions and understand the pH scale.",
        bengali: "বিভিন্ন দ্রবণ পরীক্ষা করুন এবং পিএইচ স্কেল বুঝুন।"
      },
      category: {
        english: "Chemistry",
        bengali: "রসায়ন"
      },
      difficulty: {
        english: "Beginner",
        bengali: "প্রাথমিক"
      },
      icon: <Beaker className="h-6 w-6" />,
      href: "/virtual-lab/ph-scale"
    },
    {
      title: {
        english: "Diffusion Simulation",
        bengali: "ব্যাপন সিমুলেশন"
      },
      description: {
        english: "Observe how particles move from high to low concentration areas.",
        bengali: "কণাগুলি কিভাবে উচ্চ থেকে কম ঘনত্বের এলাকায় চলাচল করে তা পর্যবেক্ষণ করুন।"
      },
      category: {
        english: "Chemistry",
        bengali: "রসায়ন"
      },
      difficulty: {
        english: "Beginner",
        bengali: "প্রাথমিক"
      },
      icon: <Beaker className="h-6 w-6" />,
      href: "/virtual-lab/diffusion"
    }
  ]

  // Filter labs based on search query
  const filterLabs = (labs: any[]) => {
    if (!searchQuery) return labs
    const searchLang = language === 'english' ? 'english' : 'bengali'
    return labs.filter(
      lab =>
        lab.title[searchLang].toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.description[searchLang].toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.category[searchLang].toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const filteredPhysicLabs = filterLabs(physicLabs)
  const filteredCSLabs = filterLabs(csLabs)
  const filteredChemistryLabs = filterLabs(chemistryLabs)

  // Mapping for difficulty level colors
  const difficultyColor = {
    "Beginner": "bg-green-500/20 text-green-500",
    "Medium": "bg-amber-500/20 text-amber-500",
    "Advanced": "bg-red-500/20 text-red-500",
    "প্রাথমিক": "bg-green-500/20 text-green-500",
    "মাঝারি": "bg-amber-500/20 text-amber-500",
    "উন্নত": "bg-red-500/20 text-red-500"
  }

  return (
    <div className="space-y-8">
      {/* Hero section */}
      <section className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 z-0">
          <div className="absolute inset-0 opacity-20 mix-blend-overlay">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
              <defs>
                <pattern id="lab-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#lab-grid)" />
            </svg>
          </div>
        </div>
        <div className="relative z-10 p-8 text-white">
          <h1 className="text-4xl font-bold mb-3">
            {language === 'english' ? 'Virtual Laboratory' : 'ভার্চুয়াল ল্যাবরেটরি'}
          </h1>
          <p className="text-white/80 max-w-3xl mb-6">
            {language === 'english'
              ? 'Interactive simulations to explore scientific concepts and conduct virtual experiments.'
              : 'বৈজ্ঞানিক ধারণা অন্বেষণ এবং ভার্চুয়াল পরীক্ষা পরিচালনার জন্য ইন্টারেক্টিভ সিমুলেশন।'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={language === 'english' ? "Search labs..." : "ল্যাব অনুসন্ধান করুন..."}
                className="pl-9 bg-white/10 border-white/20 placeholder:text-white/50 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => setLanguage(language === 'english' ? 'bengali' : 'english')}
              variant="outline"
              className="border-white/20 bg-white/10 text-white hover:bg-white/20">
              <Globe className="mr-2 h-4 w-4" />
              {language === 'english' ? 'বাংলা' : 'English'}
            </Button>
          </div>
        </div>
      </section>

      {/* Labs Sections */}
      <section>
        <Tabs defaultValue="physics" className="space-y-8">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="physics" className="flex items-center gap-2">
                <Atom className="h-4 w-4" />
                <span>{language === 'english' ? 'Physics' : 'পদার্থবিজ্ঞান'}</span>
              </TabsTrigger>
              <TabsTrigger value="computer-science" className="flex items-center gap-2">
                <Laptop className="h-4 w-4" />
                <span>{language === 'english' ? 'Computer Science' : 'কম্পিউটার সায়েন্স'}</span>
              </TabsTrigger>
              <TabsTrigger value="chemistry" className="flex items-center gap-2">
                <Beaker className="h-4 w-4" />
                <span>{language === 'english' ? 'Chemistry' : 'রসায়ন'}</span>
              </TabsTrigger>
            </TabsList>

            <div className="text-sm text-muted-foreground">
              {language === 'english'
                ? `Showing ${filteredPhysicLabs.length + filteredCSLabs.length + filteredChemistryLabs.length} labs`
                : `${filteredPhysicLabs.length + filteredCSLabs.length + filteredChemistryLabs.length}টি ল্যাব দেখাচ্ছে`}
            </div>
          </div>

          <TabsContent value="physics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPhysicLabs.length > 0 ? (
                filteredPhysicLabs.map((lab, index) => (
                  <LabCard key={index} lab={lab} language={language} difficultyColor={difficultyColor} />
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-muted-foreground">
                    {language === 'english'
                      ? 'No physics labs match your search.'
                      : 'আপনার অনুসন্ধানের সাথে কোনও পদার্থবিজ্ঞান ল্যাব মেলে না।'}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="computer-science" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCSLabs.length > 0 ? (
                filteredCSLabs.map((lab, index) => (
                  <LabCard key={index} lab={lab} language={language} difficultyColor={difficultyColor} />
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-muted-foreground">
                    {language === 'english'
                      ? 'No computer science labs match your search.'
                      : 'আপনার অনুসন্ধানের সাথে কোনও কম্পিউটার সায়েন্স ল্যাব মেলে না।'}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="chemistry" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChemistryLabs.length > 0 ? (
                filteredChemistryLabs.map((lab, index) => (
                  <LabCard key={index} lab={lab} language={language} difficultyColor={difficultyColor} />
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-muted-foreground">
                    {language === 'english'
                      ? 'No chemistry labs match your search.'
                      : 'আপনার অনুসন্ধানের সাথে কোনও রসায়ন ল্যাব মেলে না।'}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}

// Updated lab interface to support multilingual content
interface LabContent {
  english: string;
  bengali: string;
}

interface Lab {
  title: LabContent;
  description: LabContent;
  category: LabContent;
  difficulty: LabContent;
  href: string;
  icon?: React.ReactNode;
  badge?: string;
}

// Update the function signature with the correct type
function LabCard({
  lab,
  language,
  difficultyColor
}: {
  lab: Lab;
  language: 'english' | 'bengali';
  difficultyColor: Record<string, string>;
}) {
  const currentLang = language;

  return (
    <Link href={lab.href}>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border-border/80 hover:border-purple-500/50 h-full">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            {lab.badge && (
              <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-500 hover:bg-indigo-500/30">
                {lab.badge}
              </Badge>
            )}
          </div>
          <CardTitle className="mt-3">{lab.title[currentLang]}</CardTitle>
          <div className="flex items-center gap-2 mt-1">
            <div className="px-2 py-1 text-xs font-medium rounded-full bg-muted">
              {lab.category[currentLang]}
            </div>
            <div className={`px-2 py-1 text-xs font-medium rounded-full ${difficultyColor[lab.difficulty[currentLang]]}`}>
              {lab.difficulty[currentLang]}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>{lab.description[currentLang]}</CardDescription>
          <div className="mt-4 text-sm font-medium flex items-center text-purple-500">
            {language === 'english' ? 'Start Lab' : 'ল্যাব শুরু করুন'}
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}