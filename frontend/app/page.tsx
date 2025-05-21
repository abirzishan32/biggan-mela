import { HeroSection } from "@/components/hero-section"
import { FeatureSection } from "@/components/feature-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { SiteHeader } from "@/components/site-header"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <SiteHeader />
      <HeroSection />
      <FeatureSection />
      <CTASection />
      <Footer />
    </main>
  )
}