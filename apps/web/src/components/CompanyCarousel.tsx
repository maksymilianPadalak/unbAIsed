'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CompanyEthics } from '../../../../types';
import { apiEndpoints } from '../lib/api-config';

export default function CompanyCarousel() {
  const [companies, setCompanies] = useState<CompanyEthics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(apiEndpoints.weaviate.companies);

        if (!response.ok) {
          throw new Error(`Failed to fetch companies: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.companies) {
          // Store base list; we'll render two tracks for seamless infinite scroll
          setCompanies(data.companies);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching companies:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const getScoreColor = (score: number): string => {
    if (score >= 8) return 'text-green-400 score-green';
    if (score >= 6) return 'text-yellow-400 score-yellow';
    if (score >= 4) return 'text-orange-400 score-orange';
    return 'text-red-400 score-red';
  };

  if (loading) {
    return (
      <div className="w-full overflow-hidden mb-16">
        <div className="border-4 border-white p-8 bg-black text-center">
          <div className="text-white font-mono text-xl font-bold tracking-wider animate-pulse">
            LOADING COMPANIES...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full overflow-hidden mb-16">
        <div className="border-4 border-red-500 p-8 bg-black text-center">
          <div className="text-red-500 font-mono text-xl font-bold tracking-wider">
            ERROR LOADING COMPANIES
          </div>
          <p className="text-white font-mono text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="w-full overflow-hidden mb-16">
        <div className="border-4 border-white p-8 bg-black text-center">
          <div className="text-white font-mono text-xl font-bold tracking-wider">
            NO COMPANIES AVAILABLE
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mb-16">
      {/* Infinite Carousel (two-track marquee) */}
      <div className="marquee w-full overflow-hidden">
        <div className="marquee-track flex flex-nowrap gap-6 w-max">
          {companies.map((company, index) => {
            const companySlug = company.name
              .toLowerCase()
              .replace(/[^a-z0-9]/g, '-')
              .replace(/-+/g, '-')
              .replace(/^-|-$/g, '');

            return (
              <Link
                key={`${company.name}-${index}`}
                href={`/company/${companySlug}`}
              >
                <div className="brutalist-button carousel-card py-1 sm:py-2 px-3 sm:px-6 cursor-pointer w-80 sm:w-96 lg:w-[32rem] h-24 sm:h-28 lg:h-32 flex-shrink-0 flex items-center justify-center hover:scale-105 transition-all duration-100">
                  <div className="flex flex-col items-center justify-center w-full space-y-1">
                    <h3 className="text-lg sm:text-2xl lg:text-3xl font-black font-mono text-white uppercase tracking-wider leading-tight text-center whitespace-nowrap overflow-hidden">
                      {company.name.length > 16
                        ? `${company.name.substring(0, 16)}...`
                        : company.name}
                    </h3>
                    <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                      <span className="text-white font-mono font-bold text-sm sm:text-xl">
                        ETHICS SCORE:
                      </span>
                      <span
                        className={`text-2xl sm:text-4xl lg:text-5xl font-black font-mono ${getScoreColor(company.ethicalScore)}`}
                      >
                        {company.ethicalScore}/10
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <div
          className="marquee-track marquee-track--2 flex flex-nowrap gap-6 w-max"
          aria-hidden="true"
        >
          {companies.map((company, index) => {
            const companySlug = company.name
              .toLowerCase()
              .replace(/[^a-z0-9]/g, '-')
              .replace(/-+/g, '-')
              .replace(/^-|-$/g, '');

            return (
              <Link
                key={`${company.name}-${index}-dup`}
                href={`/company/${companySlug}`}
              >
                <div className="brutalist-button carousel-card py-1 sm:py-2 px-3 sm:px-6 cursor-pointer w-80 sm:w-96 lg:w-[32rem] h-24 sm:h-28 lg:h-32 flex-shrink-0 flex items-center justify-center hover:scale-105 transition-all duration-100">
                  <div className="flex flex-col items-center justify-center w-full space-y-1">
                    <h3 className="text-lg sm:text-2xl lg:text-3xl font-black font-mono text-white uppercase tracking-wider leading-tight text-center whitespace-nowrap overflow-hidden">
                      {company.name.length > 16
                        ? `${company.name.substring(0, 16)}...`
                        : company.name}
                    </h3>
                    <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                      <span className="text-white font-mono font-bold text-sm sm:text-xl">
                        ETHICS SCORE:
                      </span>
                      <span
                        className={`text-2xl sm:text-4xl lg:text-5xl font-black font-mono ${getScoreColor(company.ethicalScore)}`}
                      >
                        {company.ethicalScore}/10
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        /* Marquee base */
        .marquee {
          --duration: 120s;
          position: relative;
          overflow: hidden;
        }

        /* Track animation: move by its own width */
        @keyframes marquee {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-100%, 0, 0);
          }
        }

        .marquee-track {
          animation: marquee var(--duration) linear infinite;
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        /* Offset second track by half duration so it fills the gap */
        .marquee-track--2 {
          position: absolute;
          top: 0;
          left: 0;
          animation: marquee var(--duration) linear infinite;
          animation-delay: calc(var(--duration) / -2);
        }

        /* Pause on hover (desktop) */
        .marquee:hover .marquee-track {
          animation-play-state: paused;
        }

        /* Cards hover style */
        .carousel-card:hover {
          background: #fff !important;
          box-shadow: 4px 4px 0px #666 !important;
        }
        .carousel-card:hover * {
          color: #000 !important;
        }
        .carousel-card:hover .score-red {
          color: #dc2626 !important;
        }
        .carousel-card:hover .score-orange {
          color: #ea580c !important;
        }
        .carousel-card:hover .score-yellow {
          color: #ca8a04 !important;
        }
        .carousel-card:hover .score-green {
          color: #16a34a !important;
        }
      `}</style>
    </div>
  );
}
