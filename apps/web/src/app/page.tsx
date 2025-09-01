import Link from 'next/link';
import StarryAI from '../components/StarryAI';

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="flex items-center justify-center min-h-screen px-8">
        <div className="text-center">
          <div className="border-4 border-white p-16 mb-12 bg-black">
            <h1 className="text-8xl md:text-9xl font-black text-white font-mono tracking-wider mb-8">
              UNB<StarryAI />SED
            </h1>
            <div className="border-t-4 border-white pt-8">
              <p className="text-2xl font-bold text-white font-mono tracking-widest">
                Make your own fu*king decision
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/search">
              <div className="brutalist-button text-center py-8 hover:scale-105 transform transition-all duration-100">
                SEARCH
              </div>
            </Link>

            <Link href="/company-scores">
              <div className="brutalist-button text-center py-8 hover:scale-105 transform transition-all duration-100">
                COMPANY SCORES
              </div>
            </Link>

            <Link href="/auditor-agent">
              <div className="brutalist-button text-center py-8 hover:scale-105 transform transition-all duration-100">
                AUDITOR AGENT
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
