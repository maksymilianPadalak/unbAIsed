'use client';

import Link from 'next/link';
import StarryAI from '../components/StarryAI';
import CompanyCarousel from '../components/CompanyCarousel';

export default function Home() {
  return (
    <div className="h-full bg-black">
      {/* Hero Section - Moved higher up */}
      <div className="flex flex-col justify-center px-4 sm:px-8 pt-8 sm:pt-16">
        <div className="text-center w-full max-w-6xl mx-auto mb-12 sm:mb-16">
          <div className="border-4 border-white p-6 sm:p-12 lg:p-16 mb-8 sm:mb-12 bg-black">
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-white font-mono tracking-wider mb-6 sm:mb-8">
              UNB<StarryAI />SED
            </h1>
            <div className="border-t-4 border-white pt-6 sm:pt-8">
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-white font-mono tracking-widest">
                Make your own fu*king decision
              </p>
            </div>
          </div>

          {/* Navigation Buttons - Restored with bigger fonts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
            <Link href="/search">
              <div className="brutalist-button text-center py-6 sm:py-8 hover:scale-105 transform transition-all duration-100">
                <span className="text-lg sm:text-xl md:text-2xl font-black">SEARCH</span>
              </div>
            </Link>

            <Link href="/company-scores">
              <div className="brutalist-button text-center py-6 sm:py-8 hover:scale-105 transform transition-all duration-100">
                <span className="text-lg sm:text-xl md:text-2xl font-black">COMPANY SCORES</span>
              </div>
            </Link>

            <Link href="/auditor-agent" className="sm:col-span-2 lg:col-span-1">
              <div className="brutalist-button text-center py-6 sm:py-8 hover:scale-105 transform transition-all duration-100">
                <span className="text-lg sm:text-xl md:text-2xl font-black">AUDITOR AGENT</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Company Carousel */}
        <CompanyCarousel />
      </div>
    </div>
  );
}
