"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  Beaker, 
  BookOpen, 
  Brain, 
  Lightbulb, 
  Star,
  HelpCircle, 
  LogOut, 
  Settings,
  Sparkles,
  Users,
  Laptop,
  Gamepad2,
  Zap,
  ChevronDown,
  Code,
  FoldVertical,
  MagnetIcon,
  Microscope,
  CircuitBoard,
  RadioTower,
  Newspaper
} from 'lucide-react'
import Image from 'next/image'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useLanguage } from "@/context/language-context"

interface GlobalSidebarProps {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const GlobalSidebar = ({ isSidebarCollapsed, toggleSidebar }: GlobalSidebarProps) => {
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>("");
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<{[key: string]: boolean}>({});
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user');
        const data = await response.json();
        setUser(data.user ? data : null);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUser();
  }, []);

  useEffect(() => {
    // Set active section based on current path
    const path = pathname?.split('/')?.[1] || 'dashboard';
    setActiveSection(path);
    
    // Check if current path is under a submenu
    if (pathname?.startsWith('/virtual-lab/')) {
      setExpandedMenus(prev => ({ ...prev, 'virtual-lab': true }));
    }
    if (pathname?.startsWith('/storytelling/')) {
      setExpandedMenus(prev => ({ ...prev, 'storytelling': true }));
    }
  }, [pathname]);
  
  const isUserAuth = !!user?.user;
  const isAdmin = user?.role === 'admin';
  const isTeacher = user?.role === 'teacher';

  const toggleDropdown = (id: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Menu sections
  const mainLinks = [
    {
      href: "/dashboard",
      icon: <Home size={20} />,
      label: "ড্যাশবোর্ড",
      id: "dashboard",
    },
    {
      href: "/profile",
      icon: <Users size={20} />,
      label: "প্রোফাইল",
      id: "profile",
    },
  ];

  // Virtual Lab submenu items
  const virtualLabItems = [
        {
      href: "/virtual-lab/snell-law",
      icon: <Zap size={16} />,
      label: "স্নেলের সূত্র",
      id: "snell-law",
    },
    {
      href: "/virtual-lab/electric-ckt",
      icon: <CircuitBoard size={16} />,
      label: "বৈদ্যুতিক সার্কিট",
      id: "electric-ckt",
    },
    {
      href: "/virtual-lab/projectile",
      icon: <FoldVertical size={16} />,
      label: "প্রক্ষেপণ গতি",
      id: "projectile",
    },
    {
      href: "/virtual-lab/lenz-law",
      icon: <MagnetIcon size={16} />,
      label: "লেঞ্জের সূত্র",
      id: "lenz-law",
    },
    {
      href: "/virtual-lab/simple-pendulum",
      icon: <FoldVertical size={16} />,
      label: "সরল দোলক",
      id: "simple-pendulum",
    },
    {
      href: "/virtual-lab/double-slit",
      icon: <RadioTower size={16} />,
      label: "দ্বি-চিড় পরীক্ষণ",
      id: "double-slit",
    },
    {
      href: "/virtual-lab/lens",
      icon: <Microscope size={16} />,
      label: "লেন্স সিমুলেশন",
      id: "lens",
    },
    
    {
      href: "/virtual-lab/conservation-of-momentum",
      icon: <FoldVertical size={16} />,
      label: "ভরবেগ সংরক্ষণ",
      id: "conservation-of-momentum",
    },
    {
      href: "/virtual-lab/spring-and-mass",
      icon: <FoldVertical size={16} />,
      label: "হুকের সূত্র",
      id: "spring-and-mass",
    },
    {
      href: "/virtual-lab/bubble-sort",
      icon: <Code size={16} />,
      label: "বাবল সর্ট",
      id: "bubble-sort",
    },
    {
      href: "/virtual-lab/quick-sort",
      icon: <Code size={16} />,
      label: "কুইক সর্ট",
      id: "quick-sort",
    },
    {
      href: "/virtual-lab/merge-sort",
      icon: <Code size={16} />,
      label: "মার্জ সর্ট",
      id: "merge-sort",
    },
    {
      href: "/virtual-lab/bfs",
      icon: <Code size={16} />,
      label: "ব্রেথ ফার্স্ট সার্চ",
      id: "bfs",
    },
    {
      href: "/virtual-lab/dfs",
      icon: <Code size={16} />,
      label: "ডেপথ ফার্স্ট সার্চ",
      id: "dfs",
    },
    {
      href: "/virtual-lab/dijkstra",
      icon: <Code size={16} />,
      label: "ডায়াস্ট্রার অ্যালগরিদম",
      id: "dijkstra",
    },
    {
      href: "/virtual-lab/ph-scale",
      icon: <Beaker size={16} />,
      label: "পিএইচ স্কেল",
      id: "ph-scale",
    },
    {
      href: "/virtual-lab/diffusion",
      icon: <Beaker size={16} />,
      label: "ব্যাপন",
      id: "diffusion",
    },
    {
      href: "/virtual-lab/prism",
      icon: <Zap size={16} />,
      label: "প্রিজম আলোর বিচ্ছুরণ",
      id: "prism",
    }
  ];

  // Storytelling submenu items
  const storytellingItems = [
    {
      href: "/storytelling/water-cycle",
      icon: <Gamepad2 size={16} />,
      label: "পানি চক্র",
      id: "water-cycle",
    },
    {
      href: "/storytelling/matter-of-state",
      icon: <Gamepad2 size={16} />,
      label: "পদার্থের অবস্থা",
      id: "matter-of-state",
    },
    {
      href: "/storytelling/fire-extinguisher",
      icon: <Gamepad2 size={16} />,
      label: "অগ্নি নির্বাপক",
      id: "fire-extinguisher",
    },
  ];

  const learnLinks = [
    {
      href: "/virtual-lab",
      icon: <Zap size={20} />,
      label: "ভার্চুয়াল ল্যাব",
      id: "virtual-lab",
      pulse: true,
      hasDropdown: true,
      dropdownItems: virtualLabItems,
    },
    {
      href: "/storytelling",
      icon: <BookOpen size={20} />,
      label: "গল্পে গল্পে বিজ্ঞান",
      id: "storytelling",
      hasDropdown: true,
      dropdownItems: storytellingItems,
    },
    {
      href: "/quiz",
      icon: <Brain size={20} />,
      label: "AI-সাইন্স কুইজ",
      id: "quiz",
    },
    {
      href: "/career-guidance",
      icon: <Star size={20} />,
      label: "ক্যারিয়ার গাইডেন্স",
      id: "career-guidance",
      isNew: true,
    },
    {
      href: "/science-news",
      icon: <Newspaper size={20} />,
      label: "বিজ্ঞানের খবর",
      id: "science-news",
      isNew: false,
    },
    {
      href: "/image-explanation",
      icon: <Zap size={20} />,
      label: "ছবি শনাক্তকরণ",
      id: "image-explanation",
      isNew: true,
    },
    {
      href: "/submit",
      icon: <Lightbulb size={20} />,
      label: "প্রশ্ন",
      id: "scientific-method",
    },
  ];

  const adminLinks = [
    {
      href: "/admin-dashboard",
      icon: <Settings size={20} />,
      label: "Admin Panel",
      id: "admin-dashboard",
    }
  ];

  const teacherLinks = [
    {
      href: "/teacher-dashboard",
      icon: <Star size={20} />,
      label: "Teacher Panel",
      id: "teacher-dashboard",
    }
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/logout');
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <motion.div 
      initial={{ x: isSidebarCollapsed ? -50 : 0, opacity: 0.8 }}
      animate={{ 
        width: isSidebarCollapsed ? '80px' : '260px',
        x: 0,
        opacity: 1
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed h-full bg-gradient-to-b from-background via-background to-background/95 border-r border-border/40 z-50 backdrop-blur-sm shadow-xl overflow-hidden"
    >
      {/* Neural Network Animation Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="neural-network-bg"></div>
      </div>
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Logo and collapse button */}
        <div className="flex items-center justify-between p-4 border-b border-border/60 bg-background/50 backdrop-blur-sm">
          <Link href="/" className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
            <motion.div 
              className="relative overflow-hidden rounded-full"
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 3, -3, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full blur-sm opacity-30 animate-pulse"></div>
              <div className="relative p-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full">
                <div className="flex items-center justify-center h-9 w-9 rounded-full bg-background">
                  <span className="text-base font-bold text-purple-500">বি</span>
                </div>
              </div>
            </motion.div>
            {!isSidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="flex-1"
              > 
                <h2 className="text-lg font-bold tracking-wide select-none">
                  <span className="text-purple-500">বিজ্ঞান</span>
                  <span className="text-foreground">মেলা</span>
                </h2>
              </motion.div>
            )}
          </Link>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSidebar}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </motion.button>
        </div>
        
        {/* Navigation Links */}
        <div className="flex-1 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          <nav className="px-2 space-y-1.5">
            {/* Main section */}
            {mainLinks.map((link) => (
              <SidebarLink 
                key={link.id}
                href={link.href} 
                icon={link.icon} 
                label={link.label}
                collapsed={isSidebarCollapsed}
                active={link.id === activeSection || pathname?.includes(link.href)}
              />
            ))}

            {/* Learning Section */}
            <div className={`mt-6 mb-2 ${isSidebarCollapsed ? 'mx-2' : 'mx-3'}`}>
              <div className="border-t border-border/40 pt-4"></div>
              {!isSidebarCollapsed && (
                <div className="flex items-center px-2 py-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Learning</span>
                </div>
              )}
            </div>

            {/* Learning Links with Dropdowns */}
            {learnLinks.map((link) => (
              <div key={link.id}>
                {link.hasDropdown ? (
                  <div>
                    <button
                      onClick={() => toggleDropdown(link.id)}
                      className={`flex items-center w-full ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} p-2.5 rounded-lg transition-all duration-200 group relative
                        ${(link.id === activeSection || pathname?.includes(link.href)) && !expandedMenus[link.id]
                          ? 'bg-gradient-to-r from-purple-600/20 to-transparent text-foreground' 
                          : expandedMenus[link.id]
                            ? 'bg-muted/40 text-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'}`}
                    >
                      {(link.id === activeSection || pathname?.includes(link.href)) && !expandedMenus[link.id] && (
                        <motion.div 
                          layoutId={`sidebar-active-indicator`}
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-purple-600 rounded-r-full"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      
                      <div className="flex items-center">
                        <div className={`relative ${link.id === activeSection ? 'text-purple-500' : 'text-muted-foreground group-hover:text-purple-500'} transition-colors`}>
                          {link.icon}
                          {link.pulse && (
                            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-purple-500 rounded-full animate-ping opacity-75"></span>
                          )}
                        </div>
                        
                        {!isSidebarCollapsed && (
                          <span className={`ml-3 ${link.id === activeSection ? 'font-medium text-foreground' : 'text-muted-foreground'} text-sm`}>{link.label}</span>
                        )}
                      </div>
                      
                      {!isSidebarCollapsed && link.hasDropdown && (
                        <ChevronDown 
                          size={16} 
                          className={`transition-transform duration-300 ${expandedMenus[link.id] ? 'rotate-180' : ''}`}
                        />
                      )}
                      
                      {!isSidebarCollapsed && link.isNew && (
                        <span className="px-1.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-indigo-600/30 text-indigo-200 rounded-sm">
                          New
                        </span>
                      )}
                    </button>
                    
                    {/* Dropdown Links */}
                    {!isSidebarCollapsed && (
                      <AnimatePresence>
                        {expandedMenus[link.id] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="ml-6 mt-1 overflow-hidden"
                          >
                            <div className="pl-4 border-l border-border/40 space-y-1 py-1">
                              {link.dropdownItems?.map((subItem) => (
                                <SidebarLink 
                                  key={subItem.id}
                                  href={subItem.href} 
                                  icon={subItem.icon} 
                                  label={subItem.label}
                                  collapsed={false}
                                  active={pathname === subItem.href}
                                  isCompact={true}
                                />
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                    
                    {/* For collapsed state - show items in tooltip */}
                    {isSidebarCollapsed && link.hasDropdown && expandedMenus[link.id] && (
                      <div className="absolute left-full top-0 ml-2 bg-background/95 backdrop-blur-sm border border-border/40 rounded-lg shadow-lg w-52 z-50 overflow-hidden">
                        <div className="py-1">
                          <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border/40">
                            {link.label}
                          </div>
                          <div className="max-h-[60vh] overflow-y-auto">
                            {link.dropdownItems?.map((subItem) => (
                              <Link
                                key={subItem.id}
                                href={subItem.href}
                                className={`flex items-center px-3 py-1.5 text-sm hover:bg-muted/60 transition-colors
                                  ${pathname === subItem.href ? 'bg-purple-500/10 text-purple-500' : 'text-muted-foreground'}`}
                              >
                                <span className="mr-2">{subItem.icon}</span>
                                <span>{subItem.label}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <SidebarLink 
                    href={link.href} 
                    icon={link.icon} 
                    label={link.label}
                    collapsed={isSidebarCollapsed}
                    active={link.id === activeSection || pathname?.includes(link.href)}
                    pulse={link?.pulse}
                    isNew={link?.isNew}
                  />
                )}
              </div>
            ))}

            {/* Admin section */}
            {isAdmin && (
              <>
                <div className={`mt-6 mb-2 ${isSidebarCollapsed ? 'mx-2' : 'mx-3'}`}>
                  <div className="border-t border-border/40 pt-4"></div>
                  {!isSidebarCollapsed && (
                    <div className="flex items-center px-2 py-2">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Admin</span>
                    </div>
                  )}
                </div>

                {adminLinks.map((link) => (
                  <SidebarLink 
                    key={link.id}
                    href={link.href} 
                    icon={link.icon} 
                    label={link.label}
                    collapsed={isSidebarCollapsed}
                    active={link.id === activeSection || pathname?.includes(link.href)}
                  />
                ))}
              </>
            )}

            {/* Teacher section */}
            {isTeacher && (
              <>
                <div className={`mt-6 mb-2 ${isSidebarCollapsed ? 'mx-2' : 'mx-3'}`}>
                  <div className="border-t border-border/40 pt-4"></div>
                  {!isSidebarCollapsed && (
                    <div className="flex items-center px-2 py-2">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Teacher</span>
                    </div>
                  )}
                </div>

                {teacherLinks.map((link) => (
                  <SidebarLink 
                    key={link.id}
                    href={link.href} 
                    icon={link.icon} 
                    label={link.label}
                    collapsed={isSidebarCollapsed}
                    active={link.id === activeSection || pathname?.includes(link.href)}
                  />
                ))}
              </>
            )}
            
            {/* Help section */}
            <div className={`mt-6 mb-2 ${isSidebarCollapsed ? 'mx-2' : 'mx-3'}`}>
              <div className="border-t border-border/40 pt-4"></div>
            </div>

            <SidebarLink 
              href="/help-center"
              icon={<HelpCircle size={20} />}
              label="Help & Support"
              collapsed={isSidebarCollapsed}
              active={activeSection === "help-center" || pathname?.includes('/help-center')}
            />
          </nav>
        </div>
        
        {/* User Profile */}
        <div className="p-4 border-t border-border/50 bg-background/50 backdrop-blur-sm">
          {isLoading ? (
            <div className="h-9 w-full animate-pulse bg-muted rounded-lg"></div>
          ) : isUserAuth ? (
            <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-30 blur-sm rounded-full"></div>
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-gradient-to-br from-purple-700 to-indigo-700 text-white">
                      {user?.user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() || 
                       user?.user?.email?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>
                {!isSidebarCollapsed && (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col">
                      <span className="text-foreground font-medium text-sm truncate max-w-[120px]">
                        {user?.user?.user_metadata?.full_name || 
                         user?.user?.email?.split('@')[0] || 'User'}
                      </span>
                      <span className="text-muted-foreground text-xs truncate max-w-[120px]">
                        {user?.role || 'Student'}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <button 
                        className="p-2 rounded-md text-muted-foreground hover:text-red-400 hover:bg-red-900/20 transition-colors"
                        title="Sign out"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link 
              href="/login" 
              className={`bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-2 ${isSidebarCollapsed ? 'px-2' : 'px-4'} rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity`}
            >
              {isSidebarCollapsed ? 'In' : 'Login'}
            </Link>
          )}
        </div>
      </div>
      
      <style jsx global>{`
        .neural-network-bg {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
    </motion.div>
  );
};

// Enhanced Sidebar link component
const SidebarLink = ({ 
  href, 
  icon, 
  label, 
  collapsed,
  active,
  pulse,
  badge,
  isNew,
  isCompact = false
}: { 
  href: string; 
  icon: React.ReactNode; 
  label: string; 
  collapsed: boolean;
  active: boolean;
  pulse?: boolean;
  badge?: string;
  isNew?: boolean;
  isCompact?: boolean;
}) => (
  <Link 
    href={href} 
    className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} ${isCompact ? 'py-1.5 px-2 ml-2' : 'p-2.5'} rounded-lg transition-all duration-200 group relative
      ${active 
        ? 'bg-gradient-to-r from-purple-600/20 to-transparent text-foreground' 
        : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'}`}
  >
    {active && (
      <motion.div 
        layoutId={`sidebar-active-indicator${isCompact ? '-compact' : ''}`}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-purple-600 rounded-r-full"
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    )}
    
    <div className="flex items-center">
      <div className={`relative ${active ? 'text-purple-500' : 'text-muted-foreground group-hover:text-purple-500'} transition-colors`}>
        {icon}
        {pulse && (
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-purple-500 rounded-full animate-ping opacity-75"></span>
        )}
      </div>
      
      {!collapsed && (
        <span className={`ml-3 ${active ? 'font-medium text-foreground' : 'text-muted-foreground'} ${isCompact ? 'text-xs' : 'text-sm'}`}>{label}</span>
      )}
    </div>
    
    {!collapsed && badge && (
      <span className="px-2 py-0.5 text-xs bg-purple-500/20 text-purple-500 rounded-full">
        {badge}
      </span>
    )}
    
    {!collapsed && isNew && (
      <span className="px-1.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-indigo-600/30 text-indigo-200 rounded-sm">
        New
      </span>
    )}
  </Link>
);

export default GlobalSidebar;