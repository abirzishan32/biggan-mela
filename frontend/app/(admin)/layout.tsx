"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileQuestion,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: "Users",
    href: "/manage-users",
    icon: <Users size={20} />,
  },
  {
    label: "Quizzes",
    href: "/manage-quizzes",
    icon: <FileQuestion size={20} />,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <Settings size={20} />,
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function getUserProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from("Profile")
          .select("name, role")
          .eq("email", user.email)
          .single();

        if (data) {
          setUsername(data.name);
          
          // Redirect if not admin
          if (data.role !== "admin") {
            router.push("/dashboard");
          }
        }
      }
    }

    getUserProfile();
  }, [supabase, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile nav trigger */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setNavOpen(!navOpen)}
      >
        {navOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out md:translate-x-0",
          navOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h2 className="text-2xl font-bold">বিজ্ঞানযজ্ঞ</h2>
            <p className="text-muted-foreground text-sm">Admin Dashboard</p>
          </div>

          <Separator />

          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors",
                      pathname === item.href && "bg-accent font-medium"
                    )}
                    onClick={() => setNavOpen(false)}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 mt-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                {username?.charAt(0) || "U"}
              </div>
              <div>
                <p className="font-medium">{username || "Admin User"}</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full flex items-center gap-2 justify-start"
              onClick={handleSignOut}
            >
              <LogOut size={16} />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 md:ml-64">
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}