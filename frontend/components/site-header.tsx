"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

type UserData = {
  user: {
    email: string;
    id: string;
    user_metadata?: {
      full_name?: string;
    }
  } | null;
  role: string | null;
}

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    // Fetch user data
    const fetchUserData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/user')
        const data = await response.json()
        setUserData(data)
      } catch (error) {
        console.error('Failed to fetch user data:', error)
        setUserData(null)
      } finally {
        setIsLoading(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    fetchUserData()
    
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/logout')
      setUserData(null)
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  // Extract display name from user data
  const displayName = userData?.user?.user_metadata?.full_name || 
                     (userData?.user?.email ? userData.user.email.split('@')[0] : null)

  // Get initials for avatar
  const getInitials = () => {
    if (!displayName) return "U"
    return displayName.charAt(0).toUpperCase()
  }

  if (!mounted) return null
  
  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border/40 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-7 w-7">
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600">
              <span className="text-base font-bold text-white">বি</span>
            </div>
          </div>
          <span className="text-lg font-bold">বিজ্ঞানযজ্ঞ</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400">
            {t('nav_features')}
          </Link>
          <Link href="#pricing" className="text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400">
            {t('nav_pricing')}
          </Link>
          <Link href="#contact" className="text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400">
            {t('nav_contact')}
          </Link>
          <Link href="/blog" className="text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400">
            {t('nav_blog')}
          </Link>
        </nav>
        
        <div className="flex items-center gap-3">
          {/* Language switcher */}
          <LanguageSwitcher className="hidden md:flex" />
          
          {/* Theme toggle */}
          <ModeToggle className="hidden md:flex" />
          
          {/* User section - conditionally render based on auth state */}
          <div className="hidden md:flex items-center gap-4">
            {isLoading ? (
              <div className="h-9 w-20 animate-pulse bg-muted rounded-md"></div>
            ) : userData?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-9 pl-3 pr-2 gap-1">
                    <Avatar className="h-5 w-5 mr-1">
                      <AvatarFallback className="bg-indigo-600 text-white text-xs">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="max-w-[100px] truncate">{displayName}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="cursor-default opacity-60 font-medium">
                    {userData.role || 'User'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <Link href="/dashboard">
                    <DropdownMenuItem className="cursor-pointer">
                      Dashboard
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/profile">
                    <DropdownMenuItem className="cursor-pointer">
                      Profile
                    </DropdownMenuItem>
                  </Link>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="h-9">
                    {t('nav_login')}
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="h-9 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
                    {t('nav_signup')}
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(true)} className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
      
      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm md:hidden">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-7 w-7">
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600">
                  <span className="text-base font-bold text-white">বি</span>
                </div>
              </div>
              <span className="text-lg font-bold">বিজ্ঞানযজ্ঞ</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <nav className="container grid gap-6 px-4 py-6 md:px-6">
            <Link href="#features" className="text-lg font-medium hover:text-indigo-600" onClick={() => setIsMenuOpen(false)}>
              {t('nav_features')}
            </Link>
            <Link href="#pricing" className="text-lg font-medium hover:text-indigo-600" onClick={() => setIsMenuOpen(false)}>
              {t('nav_pricing')}
            </Link>
            <Link href="#contact" className="text-lg font-medium hover:text-indigo-600" onClick={() => setIsMenuOpen(false)}>
              {t('nav_contact')}
            </Link>
            <Link href="/blog" className="text-lg font-medium hover:text-indigo-600" onClick={() => setIsMenuOpen(false)}>
              {t('nav_blog')}
            </Link>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <ModeToggle />
            </div>
            
            {/* Mobile user section */}
            {isLoading ? (
              <div className="h-10 w-full animate-pulse bg-muted rounded-md"></div>
            ) : userData?.user ? (
              <div className="space-y-3 mt-2 pt-4 border-t border-border/30">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-indigo-600 text-white">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{displayName}</div>
                    <div className="text-xs text-muted-foreground">{userData.role || 'User'}</div>
                  </div>
                </div>
                <div className="grid gap-1 pt-2">
                  <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-left">
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-left">
                      Profile
                    </Button>
                  </Link>
                  
                  <Button 
                    variant="destructive" 
                    className="w-full mt-2 justify-start" 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border/30">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full">
                    {t('nav_login')}
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
                    {t('nav_signup')}
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}