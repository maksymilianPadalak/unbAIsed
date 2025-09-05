'use client';

import { useState } from 'react';
import Link from 'next/link';
import ReactPaginate from 'react-paginate';
import { CompanyEthics } from '../../../../../types';
import CompanyScoreCard from '../../components/CompanyScoreCard';

type SortOption = 'highest' | 'lowest' | null;

interface CompanyScoresPageClientProps {
  initialCompanies: CompanyEthics[];
}

const ITEMS_PER_PAGE = 10;

export default function CompanyScoresPageClient({
  initialCompanies,
}: CompanyScoresPageClientProps) {
  const [companies, setCompanies] = useState<CompanyEthics[]>(initialCompanies);
  const [sortBy, setSortBy] = useState<SortOption>(null);
  const [currentPage, setCurrentPage] = useState(1);

  if (companies.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="border-4 border-white p-12 bg-black text-center">
          <h2 className="text-4xl font-black text-white font-mono tracking-wider mb-4">
            NO COMPANIES FOUND
          </h2>
          <p className="text-white font-mono text-lg">
            No company ethics data available yet.
          </p>
        </div>
      </div>
    );
  }

  // Handle sorting logic
  const handleSort = (option: SortOption) => {
    setSortBy(option);
    setCurrentPage(1); // Reset to first page when sorting

    if (option === null) {
      // Reset to original order
      setCompanies([...initialCompanies]);
      return;
    }

    const sortedCompanies = [...companies].sort((a, b) => {
      if (option === 'highest') {
        return b.ethicalScore - a.ethicalScore;
      } else {
        return a.ethicalScore - b.ethicalScore;
      }
    });

    setCompanies(sortedCompanies);
  };

  // Pagination calculations
  const totalPages = Math.ceil(companies.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCompanies = companies.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-4xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white font-mono tracking-wider mb-8">
            COMPANY SCORES
          </h1>

          {/* Sorting Options */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
            <span className="text-white font-mono font-bold text-lg sm:text-xl">
              SORT BY:
            </span>

            <button
              onClick={() =>
                handleSort(sortBy === 'highest' ? null : 'highest')
              }
              className={`brutalist-button text-base sm:text-lg px-4 py-2 ${
                sortBy === 'highest' ? 'brutalist-active' : ''
              }`}
            >
              HIGHEST ETHICS
            </button>

            <button
              onClick={() => handleSort(sortBy === 'lowest' ? null : 'lowest')}
              className={`brutalist-button text-base sm:text-lg px-4 py-2 ${
                sortBy === 'lowest' ? 'brutalist-active' : ''
              }`}
            >
              LOWEST ETHICS
            </button>
          </div>
        </div>

        {/* Pagination Info */}
        <div className="text-center mb-6">
          <p className="text-white font-mono text-sm font-bold">
            SHOWING {startIndex + 1}-{Math.min(endIndex, companies.length)} OF{' '}
            {companies.length} COMPANIES
          </p>
          <p className="text-white font-mono text-sm">
            PAGE {currentPage} OF {totalPages}
          </p>
        </div>

        {/* Company Cards Grid */}
        <div className="grid gap-6 grid-cols-1">
          {currentCompanies.map((company, index) => {
            const companySlug = company.name
              .toLowerCase()
              .replace(/[^a-z0-9]/g, '-')
              .replace(/-+/g, '-')
              .replace(/^-|-$/g, '');

            return (
              <Link
                key={startIndex + index}
                href={`/company/${companySlug}`}
                className="block hover:scale-[1.01] transition-transform duration-100"
              >
                <CompanyScoreCard
                  company={company}
                  showLinks={false}
                  showReasoning={false}
                />
              </Link>
            );
          })}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12">
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={3}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => handlePageChange(selected + 1)}
              forcePage={currentPage - 1}
              containerClassName="flex flex-wrap justify-center items-center gap-2"
              pageClassName=""
              pageLinkClassName="brutalist-button px-3 py-2 text-base block"
              previousClassName=""
              previousLinkClassName="brutalist-button px-4 py-2 text-base block"
              nextClassName=""
              nextLinkClassName="brutalist-button px-4 py-2 text-base block"
              activeClassName=""
              activeLinkClassName="brutalist-button brutalist-active px-3 py-2 text-base block"
              disabledClassName="opacity-50 cursor-not-allowed"
              disabledLinkClassName="brutalist-button px-4 py-2 text-base block opacity-50 cursor-not-allowed"
              breakClassName=""
              breakLinkClassName="text-white font-mono px-2 py-2"
              previousLabel="PREV"
              nextLabel="NEXT"
              breakLabel="..."
            />
          </div>
        )}
      </div>
    </div>
  );
}
