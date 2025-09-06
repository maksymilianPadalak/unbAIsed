'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CompanyEthics } from '../../../../../types';
import CompanyScoreCard from '../../components/CompanyScoreCard';
import Pagination from '../../components/Pagination';
import SimpleSearchInput from '../../components/SimpleSearchInput';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCompanies, setFilteredCompanies] =
    useState<CompanyEthics[]>(initialCompanies);

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

  // Handle real-time search logic
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching

    if (!query.trim()) {
      setFilteredCompanies(companies);
      return;
    }

    const filtered = companies.filter(
      (company) =>
        company.name.toLowerCase().includes(query.toLowerCase()) ||
        company.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCompanies(filtered);
  };

  // Handle sorting logic
  const handleSort = (option: SortOption) => {
    setSortBy(option);
    setCurrentPage(1); // Reset to first page when sorting

    if (option === null) {
      // Reset to original order
      setCompanies([...initialCompanies]);
      if (searchQuery) {
        handleSearchChange(searchQuery); // Reapply search filter
      } else {
        setFilteredCompanies([...initialCompanies]);
      }
      return;
    }

    const companiesToSort = searchQuery ? filteredCompanies : initialCompanies;
    const sortedCompanies = [...companiesToSort].sort((a, b) => {
      if (option === 'highest') {
        return b.ethicalScore - a.ethicalScore;
      } else {
        return a.ethicalScore - b.ethicalScore;
      }
    });

    setCompanies(sortedCompanies);
    setFilteredCompanies(sortedCompanies);
  };

  // Pagination calculations
  const displayCompanies = searchQuery ? filteredCompanies : companies;
  const totalPages = Math.ceil(displayCompanies.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCompanies = displayCompanies.slice(startIndex, endIndex);

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
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white font-mono tracking-wider">
            COMPANY SCORES
          </h1>
        </div>

        {/* Search Section */}
        <div className="mb-8 sm:mb-10">
          <SimpleSearchInput
            onSearchChange={handleSearchChange}
            placeholder="SEARCH BY NAME/DESCRIPTION"
          />
        </div>

        {/* Controls Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 sm:mb-10 space-y-4 lg:space-y-0">
          {/* Sort Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4">
            <span className="text-white font-mono font-bold text-lg sm:text-xl">
              SORT BY:
            </span>
            <div className="flex space-x-3">
              <button
                onClick={() =>
                  handleSort(sortBy === 'highest' ? null : 'highest')
                }
                className={`brutalist-button text-sm sm:text-base px-4 py-2 ${
                  sortBy === 'highest' ? 'brutalist-active' : ''
                }`}
              >
                HIGHEST ETHICS
              </button>
              <button
                onClick={() =>
                  handleSort(sortBy === 'lowest' ? null : 'lowest')
                }
                className={`brutalist-button text-sm sm:text-base px-4 py-2 ${
                  sortBy === 'lowest' ? 'brutalist-active' : ''
                }`}
              >
                LOWEST ETHICS
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="text-center lg:text-right">
            <p className="text-white font-mono text-sm font-bold">
              {searchQuery ? (
                <>
                  SHOWING {startIndex + 1}-
                  {Math.min(endIndex, displayCompanies.length)} OF{' '}
                  {displayCompanies.length} FILTERED ({initialCompanies.length}{' '}
                  TOTAL)
                </>
              ) : (
                <>
                  SHOWING {startIndex + 1}-
                  {Math.min(endIndex, displayCompanies.length)} OF{' '}
                  {displayCompanies.length} COMPANIES
                </>
              )}
            </p>
            <p className="text-white/70 font-mono text-xs mt-1">
              PAGE {currentPage} OF {totalPages}
            </p>
          </div>
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

        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
