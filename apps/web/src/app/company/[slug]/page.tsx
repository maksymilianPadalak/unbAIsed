'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { CompanyEthics } from '../../../../../../types';
import { apiEndpoints } from '../../../lib/api-config';
import BrutalistMarkdown from '../../../components/BrutalistMarkdown';
import StarryLoader from '../../../components/StarryLoader';

export default function CompanyPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [company, setCompany] = useState<CompanyEthics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(apiEndpoints.weaviate.companies);

        if (!response.ok) {
          throw new Error(`Failed to fetch companies: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.companies) {
          // Find company by converting name to slug format and matching
          const foundCompany = data.companies.find(
            (comp: CompanyEthics) =>
              comp.name
                .toLowerCase()
                .replace(/[^a-z0-9]/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '') === slug
          );

          if (foundCompany) {
            setCompany(foundCompany);
          } else {
            setError('Company not found');
          }
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching company:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCompany();
    }
  }, [slug]);

  const getScoreColor = (score: number): string => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    if (score >= 4) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 8) return 'EXCELLENT';
    if (score >= 6) return 'GOOD';
    if (score >= 4) return 'POOR';
    return 'TERRIBLE';
  };

  const hasSplitLinks = (c?: CompanyEthics | null) =>
    !!c &&
    ((c.goodImpactArticles && c.goodImpactArticles.length > 0) ||
      (c.badImpactArticles && c.badImpactArticles.length > 0));

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <StarryLoader
          title="LOADING COMPANY"
          subtitle="Fetching company data and ethics analysis"
          size="large"
        />
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="border-4 border-red-500 p-8 bg-black max-w-md text-center">
          <h2 className="text-2xl font-black text-red-500 font-mono tracking-wider mb-4">
            ERROR
          </h2>
          <p className="text-white font-mono text-sm mb-6">
            {error || 'Company not found'}
          </p>
          <Link href="/" className="brutalist-button">
            BACK TO HOME
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-4xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/"
            className="brutalist-button inline-flex items-center space-x-2 px-4 py-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-mono font-bold text-sm sm:text-base">
              BACK TO HOME
            </span>
          </Link>
        </div>

        {/* Company Header */}
        <div className="text-center mb-12">
          <div className="border-4 border-white p-6 sm:p-8 lg:p-12 bg-black mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white font-mono tracking-wider mb-6">
              {company.name}
            </h1>

            {/* Ethics Score Display */}
            <div className="border-t-4 border-white pt-6">
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
                <span className="text-white font-mono font-bold text-xl sm:text-2xl">
                  ETHICS SCORE:
                </span>
                <span
                  className={`text-4xl sm:text-6xl font-black font-mono ${getScoreColor(company.ethicalScore)}`}
                >
                  {company.ethicalScore}/10
                </span>
                <span
                  className={`border-3 border-white text-lg sm:text-xl px-4 py-2 font-mono font-bold uppercase tracking-wider ${getScoreColor(company.ethicalScore)} bg-black`}
                >
                  {getScoreLabel(company.ethicalScore)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Disclaimer */}
        <div className="mb-8">
          <div className="border-4 border-yellow-500 bg-yellow-900/20 p-4 sm:p-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-yellow-400 font-black font-mono text-sm sm:text-base uppercase tracking-wider mb-2">
                  AI-GENERATED CONTENT
                </h3>
                <p className="text-yellow-200 font-mono text-xs sm:text-sm leading-relaxed">
                  All research, analysis, and ethical scores are generated by
                  artificial intelligence based on publicly available
                  information. This content should not be considered as
                  professional advice or definitive assessments.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Company Description */}
        <div className="mb-12">
          <div className="border-4 border-white p-6 sm:p-8 bg-black">
            <h2 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-wider mb-6 uppercase">
              COMPANY ANALYSIS
            </h2>
            <p className="text-white font-mono leading-relaxed text-lg sm:text-xl">
              {company.description}
            </p>
          </div>
        </div>

        {company.reasoning && (
          <div className="mb-12">
            <div className="border-4 border-white p-6 sm:p-8 bg-black">
              <h2 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-wider mb-6 uppercase">
                REASONING
              </h2>
              <BrutalistMarkdown className="text-white text-lg sm:text-xl opacity-90">
                {company.reasoning}
              </BrutalistMarkdown>
            </div>
          </div>
        )}

        {hasSplitLinks(company) && (
          <div className="mb-12 space-y-8">
            {company.goodImpactArticles &&
              company.goodImpactArticles.length > 0 && (
                <div className="border-4 border-white p-6 sm:p-8 bg-black">
                  <h2 className="text-2xl sm:text-3xl font-black text-green-400 font-mono tracking-wider mb-6 uppercase">
                    POSITIVE IMPACT ARTICLES
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {company.goodImpactArticles.map((link, index) => (
                      <a
                        key={`good-${index}`}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="brutalist-button text-left px-4 py-4 flex items-start justify-between group hover:scale-[1.02] hover:shadow-2xl transition-all duration-200"
                      >
                        <span className="font-mono text-sm sm:text-base font-bold mr-3 leading-tight">
                          {link.description}
                        </span>
                        <ExternalLink className="w-5 h-5 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            {company.badImpactArticles &&
              company.badImpactArticles.length > 0 && (
                <div className="border-4 border-white p-6 sm:p-8 bg-black">
                  <h2 className="text-2xl sm:text-3xl font-black text-red-400 font-mono tracking-wider mb-6 uppercase">
                    NEGATIVE IMPACT ARTICLES
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {company.badImpactArticles.map((link, index) => (
                      <a
                        key={`bad-${index}`}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="brutalist-button text-left px-4 py-4 flex items-start justify-between group hover:scale-[1.02] hover:shadow-2xl transition-all duration-200"
                      >
                        <span className="font-mono text-sm sm:text-base font-bold mr-3 leading-tight">
                          {link.description}
                        </span>
                        <ExternalLink className="w-5 h-5 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4 lg:justify-center">
          <Link
            href="/company-scores"
            className="brutalist-button px-6 py-3 w-full lg:w-auto text-center"
          >
            <span className="font-mono font-bold text-base sm:text-lg">
              VIEW ALL COMPANIES
            </span>
          </Link>
          <Link
            href="/search"
            className="brutalist-button px-6 py-3 w-full lg:w-auto text-center"
          >
            <span className="font-mono font-bold text-base sm:text-lg">
              SEARCH MORE
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
