'use client'

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react'

type Language = 'en' | 'bn'

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
  isLoaded: boolean
}

const translations: Record<Language, Record<string, string>> = {
  en: {},
  bn: {}
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
  isLoaded: false
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')
  const [isLoaded, setIsLoaded] = useState(false)

  // Load translations on the client side
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        // Import the dictionaries dynamically
        const enDict = await import('@/dictionaries/en.json')
        const bnDict = await import('@/dictionaries/bn.json')
        
        translations.en = enDict
        translations.bn = bnDict
        
        setIsLoaded(true)
      } catch (error) {
        console.error("Failed to load translations:", error)
      }
    }
    
    loadTranslations()
  }, [])

  const t = (key: string): string => {
    if (!isLoaded) return key
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLoaded }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}