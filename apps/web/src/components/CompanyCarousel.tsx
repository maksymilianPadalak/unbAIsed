'use client';

import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import { CompanyEthics } from '../../../../types';

type CompanyCarouselProps = {
  companies: CompanyEthics[];
};

export default function CompanyCarousel({ companies }: CompanyCarouselProps) {
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      containScroll: 'trimSnaps',
      dragFree: true,
      duration: 6000,
    },
    [Autoplay({ delay: 0, stopOnInteraction: true })]
  );

  // Shuffle function to randomize company order
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Randomize the order of companies each time
  const shuffledCompanies = shuffleArray(companies);

  const getScoreColor = (score: number): string => {
    if (score >= 8) return 'text-green-400 score-green';
    if (score >= 6) return 'text-yellow-400 score-yellow';
    if (score >= 4) return 'text-orange-400 score-orange';
    return 'text-red-400 score-red';
  };

  return (
    <div className="w-full mb-16 overflow-hidden">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {shuffledCompanies.map((company, index) => {
            const companySlug = company.name
              .toLowerCase()
              .replace(/[^a-z0-9]/g, '-')
              .replace(/-+/g, '-')
              .replace(/^-|-$/g, '');

            return (
              <div key={`${company.name}-${index}`} className="embla__slide">
                <Link href={`/company/${companySlug}`}>
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
              </div>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        .embla {
          position: relative;
          overflow: hidden;
          mask-image: linear-gradient(
            to right,
            transparent,
            black 2%,
            black 98%,
            transparent
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent,
            black 2%,
            black 98%,
            transparent
          );
        }

        .embla__container {
          backface-visibility: hidden;
          display: flex;
          touch-action: manipulation;
          margin-left: -1.5rem;
        }

        .embla__slide {
          flex: 0 0 auto;
          min-width: 0;
          padding-left: 1.5rem;
          pointer-events: auto;
        }

        /* Mobile-specific fixes */
        @media (max-width: 768px) {
          .embla__container {
            touch-action: manipulation;
          }
          
          .carousel-card {
            pointer-events: auto;
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            user-select: none;
          }
          
          .carousel-card:active {
            background: #fff !important;
            box-shadow: 4px 4px 0px #666 !important;
          }
          
          .carousel-card:active * {
            color: #000 !important;
          }
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
