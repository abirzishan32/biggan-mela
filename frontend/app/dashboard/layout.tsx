"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GlobalSidebar from '@/components/GlobalSidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <GlobalSidebar 
        isSidebarCollapsed={isSidebarCollapsed} 
        toggleSidebar={toggleSidebar} 
      />
      
      <motion.main 
        className="flex-1"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          marginLeft: isSidebarCollapsed ? '80px' : '260px',
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="container px-4 py-6 mx-auto max-w-7xl">
          {children}
        </div>
      </motion.main>
    </div>
  )
}