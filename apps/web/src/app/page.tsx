import Link from 'next/link';
import StarryAI from '../components/StarryAI';
import CompanyCarouselServer from '../components/CompanyCarouselServer';

// ISR configuration
export const revalidate = 300; // Revalidate every 5 minutes

export default function Home() {
  return (
    <div className="h-full bg-black">
      {/* Hero Section - Moved higher up */}
      <div className="flex flex-col justify-center px-4 sm:px-8 pt-4 sm:pt-16">
        <div className="text-center w-full max-w-6xl mx-auto mb-4 sm:mb-8">
          <div className="border-4 border-white p-6 sm:p-12 lg:p-16 bg-black">
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-white font-mono tracking-wider mb-6 sm:mb-8">
              UNB
              <StarryAI />
              SED
            </h1>
            <div className="border-t-4 border-white pt-6 sm:pt-8">
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-white font-mono tracking-widest">
                AI based companies ethics scores
              </p>
            </div>
          </div>
        </div>

        <div className="text-center w-full max-w-6xl mx-auto mb-4 sm:mb-8">
          <p className="text-white font-mono text-base sm:text-lg leading-relaxed opacity-90">
            See companies’ Ethics Scores, based on GPT-5 research, with direct
            links to sources
          </p>
        </div>

        {/* CTA: Research Company */}
        <div className="flex justify-center mb-12 sm:mb-16">
          <Link href="/search">
            <div className="brutalist-button text-center py-4 px-6 hover:scale-105 transform transition-all duration-100">
              <span className="text-lg sm:text-xl md:text-2xl font-black">
                Search for company
              </span>
            </div>
          </Link>
        </div>

        {/* Company Carousel (header hidden to save space) */}
        <CompanyCarouselServer />
      </div>
    </div>
  );
}
