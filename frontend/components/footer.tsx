"use client"
import Link from "next/link"
import { Github, Twitter, Linkedin } from "lucide-react"
import { useLanguage } from "@/context/language-context"

export function Footer() {
  const { t } = useLanguage()
  
  return (
    <footer id="contact" className="w-full border-t bg-background py-12">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8">
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600">
                  <span className="text-lg font-bold text-white">বি</span>
                </div>
              </div>
              <span className="text-xl font-bold">বিজ্ঞানমেলা</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('footer_description')}
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('footer_product')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#features" className="text-muted-foreground hover:text-foreground">
                  Virtual Labs
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Story Games
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  AI Helper
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Citizen Science
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('footer_company')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('footer_legal')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Data Processing
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} বিজ্ঞানমেলা. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}