"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GlobalSidebar from '@/components/GlobalSidebar'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    
    // Check for saved preference
    const savedPref = localStorage.getItem("sidebar-collapsed")
    if (savedPref) {
      setIsSidebarCollapsed(savedPref === "true")
    } else {
      // Default to collapsed on mobile
      setIsSidebarCollapsed(window.innerWidth < 1024)
    }
    
    // Handle resize
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true)
      }
    }
    
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed
    setIsSidebarCollapsed(newState)
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar-collapsed", String(newState))
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <GlobalSidebar 
          isSidebarCollapsed={isSidebarCollapsed} 
          toggleSidebar={toggleSidebar} 
        />
      </div>
      
      {/* Mobile sidebar - conditionally rendered as overlay */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-gray-950 border-b border-gray-800 flex items-center px-4">
        <button 
          onClick={() => setIsSidebarCollapsed(false)}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
            <line x1="4" x2="20" y1="12" y2="12"></line>
            <line x1="4" x2="20" y1="6" y2="6"></line>
            <line x1="4" x2="20" y1="18" y2="18"></line>
          </svg>
        </button>
        
        <div className="mx-auto">
          <h1 className="text-lg font-bold">
            <span className="text-purple-400">বিজ্ঞান</span>
            <span className="text-white">যজ্ঞ</span>
          </h1>
        </div>
      </div>
      
      <AnimatePresence>
        {!isSidebarCollapsed && (
          <motion.div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ x: -250 }}
              animate={{ x: 0 }}
              exit={{ x: -250 }}
              transition={{ duration: 0.3 }}
              className="h-full w-[250px]"
            >
              <GlobalSidebar 
                isSidebarCollapsed={false} 
                toggleSidebar={() => setIsSidebarCollapsed(true)} 
              />
            </motion.div>
            <div 
              className="absolute inset-0 z-[-1]"
              onClick={() => setIsSidebarCollapsed(true)}
            ></div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main content */}
      <motion.main 
        className="flex-1 overflow-auto"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          marginLeft: isSidebarCollapsed ? '80px' : '260px',
          marginTop: '0px',
        }}
        transition={{ duration: 0.3 }}
        style={{ 
          marginLeft: mounted ? (isSidebarCollapsed ? '80px' : '260px') : '0px',
          marginTop: mounted ? '0px' : '64px'
        }}
      >
        <div className="md:container px-4 pt-20 md:pt-6 pb-6 mx-auto max-w-7xl min-h-screen">
          {children}
        </div>
      </motion.main>
    </div>
  )
}