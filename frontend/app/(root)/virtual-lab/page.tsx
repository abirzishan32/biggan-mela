"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ArrowRight, Search, Atom, RadioTower, MagnetIcon, FoldVertical, Code, Beaker, Zap, Laptop, CircuitBoard, Microscope } from "lucide-react"
import Link from 'next/link'
import { Badge } from "@/components/ui/badge"

export default function VirtualLabs() {
  const [searchQuery, setSearchQuery] = useState('')
  
  // Define categories of labs
  const physicLabs = [
    {
      title: "Double Slit Experiment",
      description: "Explore the fundamental principles of quantum mechanics through this interactive simulation.",
      category: "Quantum Physics",
      difficulty: "Medium",
      icon: <RadioTower className="h-6 w-6" />,
      href: "/virtual-lab/double-slit",
      badge: "Popular"
    },
    {
      title: "Electric Circuits",
      description: "Build and test electric circuits with virtual components.",
      category: "Electronics",
      difficulty: "Beginner",
      icon: <CircuitBoard className="h-6 w-6" />,
      href: "/virtual-lab/electric-ckt"
    },
    {
      title: "Snell's Law",
      description: "Visualize how light refracts when passing through different mediums.",
      category: "Optics",
      difficulty: "Medium",
      icon: <Zap className="h-6 w-6" />,
      href: "/virtual-lab/snell-law"
    },
    {
      title: "Projectile Motion",
      description: "Launch projectiles and observe their motion under gravity.",
      category: "Mechanics",
      difficulty: "Beginner",
      icon: <FoldVertical className="h-6 w-6" />,
      href: "/virtual-lab/projectile"
    },
    {
      title: "Lenz's Law",
      description: "Explore electromagnetic induction and Lenz's law in action.",
      category: "Electromagnetism",
      difficulty: "Advanced",
      icon: <MagnetIcon className="h-6 w-6" />,
      href: "/virtual-lab/lenz-law"
    },
    {
      title: "Simple Pendulum",
      description: "Study the motion of a simple pendulum and the factors affecting its period.",
      category: "Mechanics",
      difficulty: "Beginner",
      icon: <FoldVertical className="h-6 w-6" />,
      href: "/virtual-lab/simple-pendulum"
    },
    {
      title: "Lens Optics",
      description: "Experiment with different lenses and see how they focus light.",
      category: "Optics",
      difficulty: "Medium",
      icon: <Zap className="h-6 w-6" />,
      href: "/virtual-lab/lens"
    },
    {
      title: "Light Diffraction",
      description: "Visualize how light bends around obstacles and through apertures.",
      category: "Optics",
      difficulty: "Medium",
      icon: <Zap className="h-6 w-6" />,
      href: "/virtual-lab/light-game"
    },
    {
      title: "Prism Color Splitting",
      description: "See how white light splits into its component colors through a prism.",
      category: "Optics",
      difficulty: "Beginner",
      icon: <Zap className="h-6 w-6" />,
      href: "/virtual-lab/prism"
    },
    {
      title: "Conservation of Momentum",
      description: "Observe how momentum is conserved in collisions between objects.",
      category: "Mechanics",
      difficulty: "Medium",
      icon: <FoldVertical className="h-6 w-6" />,
      href: "/virtual-lab/conservation-of-momentum"
    },
    {
      title: "Spring and Mass",
      description: "Experiment with springs, masses, and oscillation.",
      category: "Mechanics",
      difficulty: "Beginner",
      icon: <FoldVertical className="h-6 w-6" />,
      href: "/virtual-lab/spring-and-mass"
    }
  ]
  
  const csLabs = [
    {
      title: "Bubble Sort Visualization",
      description: "See the bubble sort algorithm at work with a dynamic visualization.",
      category: "Algorithms",
      difficulty: "Beginner",
      icon: <Code className="h-6 w-6" />,
      href: "/virtual-lab/bubble-sort",
      badge: "Popular"
    },
    {
      title: "Quick Sort Visualization",
      description: "Visualize the divide-and-conquer quick sort algorithm in action.",
      category: "Algorithms",
      difficulty: "Medium",
      icon: <Code className="h-6 w-6" />,
      href: "/virtual-lab/quick-sort"
    },
    {
      title: "Merge Sort Visualization",
      description: "Watch how merge sort divides, sorts, and combines arrays.",
      category: "Algorithms",
      difficulty: "Medium",
      icon: <Code className="h-6 w-6" />,
      href: "/virtual-lab/merge-sort"
    },
    {
      title: "BFS Graph Traversal",
      description: "Explore how Breadth-First Search traverses through a graph.",
      category: "Graph Algorithms",
      difficulty: "Medium",
      icon: <Laptop className="h-6 w-6" />,
      href: "/virtual-lab/bfs"
    },
    {
      title: "DFS Graph Traversal",
      description: "Visualize Depth-First Search algorithm on various graph structures.",
      category: "Graph Algorithms",
      difficulty: "Medium",
      icon: <Laptop className="h-6 w-6" />,
      href: "/virtual-lab/dfs"
    },
    {
      title: "Dijkstra's Algorithm",
      description: "See how Dijkstra's algorithm finds shortest paths in a graph.",
      category: "Graph Algorithms",
      difficulty: "Advanced",
      icon: <Laptop className="h-6 w-6" />,
      href: "/virtual-lab/dijkstra"
    }
  ]
  
  const chemistryLabs = [
    {
      title: "pH Scale Interactive",
      description: "Test different solutions and understand the pH scale.",
      category: "Chemistry",
      difficulty: "Beginner",
      icon: <Beaker className="h-6 w-6" />,
      href: "/virtual-lab/ph-scale"
    },
    {
      title: "Diffusion Simulation",
      description: "Observe how particles move from high to low concentration areas.",
      category: "Chemistry",
      difficulty: "Beginner",
      icon: <Beaker className="h-6 w-6" />,
      href: "/virtual-lab/diffusion"
    }
  ]

  // Filter labs based on search query
  const filterLabs = (labs:any[]) => {
    if (!searchQuery) return labs
    return labs.filter(
      lab => 
        lab.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        lab.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const filteredPhysicLabs = filterLabs(physicLabs)
  const filteredCSLabs = filterLabs(csLabs)
  const filteredChemistryLabs = filterLabs(chemistryLabs)

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
        
        <div className="relative z-10 px-8 py-12 md:py-16">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Virtual Labs
            </h1>
            <p className="text-white/90 mb-6">
              Explore scientific concepts through interactive simulations. Our virtual labs let you conduct experiments safely and see abstract concepts come to life.
            </p>
            
            <div className="relative bg-white/10 backdrop-blur-sm rounded-lg p-1 max-w-lg flex">
              <Input
                type="text"
                placeholder="Search labs by name, description, or category..."
                className="bg-transparent border-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-white/70"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70">
                <Search className="h-5 w-5" />
              </div>
            </div>
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
                <span>Physics</span>
              </TabsTrigger>
              <TabsTrigger value="computer-science" className="flex items-center gap-2">
                <Laptop className="h-4 w-4" />
                <span>Computer Science</span>
              </TabsTrigger>
              <TabsTrigger value="chemistry" className="flex items-center gap-2">
                <Beaker className="h-4 w-4" />
                <span>Chemistry</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="text-sm text-muted-foreground">
              Showing {filteredPhysicLabs.length + filteredCSLabs.length + filteredChemistryLabs.length} labs
            </div>
          </div>
          
          <TabsContent value="physics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPhysicLabs.length > 0 ? (
                filteredPhysicLabs.map((lab, index) => (
                  <LabCard key={index} lab={lab} />
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-muted-foreground">No physics labs match your search.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="computer-science" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCSLabs.length > 0 ? (
                filteredCSLabs.map((lab, index) => (
                  <LabCard key={index} lab={lab} />
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-muted-foreground">No computer science labs match your search.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="chemistry" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChemistryLabs.length > 0 ? (
                filteredChemistryLabs.map((lab, index) => (
                  <LabCard key={index} lab={lab} />
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-muted-foreground">No chemistry labs match your search.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}


interface Lab {
  title: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Medium" | "Advanced";
  href: string;
  badge?: string;
}

// Update the function signature with the correct type
function LabCard({ lab }: { lab: Lab }) {
  const difficultyColor = {
    Beginner: "bg-green-500/20 text-green-500",
    Medium: "bg-amber-500/20 text-amber-500",
    Advanced: "bg-red-500/20 text-red-500"
  }
  
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
          <CardTitle className="mt-3">{lab.title}</CardTitle>
          <div className="flex items-center gap-2 mt-1">
            <div className="px-2 py-1 text-xs font-medium rounded-full bg-muted">
              {lab.category}
            </div>
            <div className={`px-2 py-1 text-xs font-medium rounded-full ${difficultyColor[lab.difficulty]}`}>
              {lab.difficulty}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>{lab.description}</CardDescription>
          <div className="mt-4 text-sm font-medium flex items-center text-purple-500">
            Start Lab
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}