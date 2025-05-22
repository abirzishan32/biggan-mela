"use client"

import { Suspense } from 'react';
import ScienceNews from '@/components/science-news';
import { Newspaper } from 'lucide-react';

export default function ScienceNewsPage() {
  return (
    <div className="space-y-8">
      {/* Hero section */}
      <section className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 z-0">
          <div className="absolute inset-0 opacity-20 mix-blend-overlay">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
              <defs>
                <pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="1" fill="white" opacity="0.5" />
                  <circle cx="30" cy="30" r="1" fill="white" opacity="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>
          </div>
        </div>
        
        
  
      </section>
      
      {/* News Content */}
      <Suspense fallback={<div className="text-center py-12">সংবাদ লোড হচ্ছে...</div>}>
        <ScienceNews />
      </Suspense>
    </div>
  );
}