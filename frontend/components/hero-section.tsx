"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Beaker, Sparkles, Book, Brain, Zap, Microscope } from "lucide-react"
import { useLanguage } from "@/context/language-context"

export function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    setMounted(true)
  }, [])

  // an empty component with the height of the screen to prevent the page from jumping when the hero section is loaded
  if (!mounted) return (
    <div className="h-screen w-full" />
  )

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-40">
      <div className="container px-4 md:px-6 relative">
        {/* Modern floating elements for visual flair */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-200 dark:bg-purple-900/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-200 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        
        <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-5">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center rounded-full bg-muted px-4 py-1.5 text-sm font-medium border border-border/50 shadow-sm"
              >
                <Sparkles className="mr-1 h-3.5 w-3.5 text-purple-500" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-500">{t('subtitle')}</span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
              >
                <span className="inline bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-500">{t('title_part1')}</span>{' '}
                {t('title_part2')}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-[600px] text-lg text-muted-foreground md:text-xl/relaxed"
              >
                {t('description')}
              </motion.p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 cursor-pointer"
            >
              <Button size="lg" className="group bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md shadow-purple-500/20 text-white group h-12 px-6"
              onClick={() => window.location.href = "/login"}
              >
                {t('button_start')}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" className="group border-border/60 h-12 px-6">
                {t('button_demo')}
                <Zap className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
              </Button>
            </motion.div>
            
            {/* Social proof */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="pt-5 mt-4 border-t border-border/40"
            >
              
            </motion.div>
          </div>
          
          {/* 3D rotating visual element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex items-center justify-center relative"
          >
            <div className="relative h-[350px] w-[350px] md:h-[400px] md:w-[400px] lg:h-[500px] lg:w-[500px] perspective-1000">
              {/* Background glow */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-64 w-64 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 blur-3xl" />
              </div>
              
              {/* 3D rotating grid */}
              <motion.div 
                className="relative z-10 flex h-full w-full items-center justify-center"
                animate={{ 
                  rotateY: [0, 10, 0, -10, 0],
                  rotateX: [0, -10, 0, 10, 0]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 10,
                  ease: "easeInOut"
                }}
              >
                <div className="grid grid-cols-2 gap-6 rotate-6">
                  {[
                    { icon: <Beaker className="h-10 w-10 text-purple-500" />, label: "Virtual Labs" },
                    { icon: <Brain className="h-10 w-10 text-indigo-500" />, label: "AI Helper" },
                    { icon: <Book className="h-10 w-10 text-pink-500" />, label: "Story Games" },
                    { icon: <Microscope className="h-10 w-10 text-blue-500" />, label: "Experiments" }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                      className="flex flex-col items-center justify-center rounded-xl bg-background/80 backdrop-blur-sm border border-border/60 shadow-lg h-36 w-36 transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:border-purple-500/30 group"
                      style={{ transformStyle: "preserve-3d", transform: "translateZ(20px)" }}
                    >
                      <div className="p-2 bg-gradient-to-br from-background to-muted rounded-lg mb-3 group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </div>
                      <span className="font-medium text-sm">{item.label}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              {/* Animated pulse */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-full w-full animate-pulse rounded-full bg-gradient-to-r from-purple-500/5 to-indigo-500/5 blur-3xl" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}