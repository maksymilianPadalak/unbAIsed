'use client';

import { useState } from 'react';
import { useWeaviateSearch } from '../../hooks/useWeaviateSearch';
import SearchInput from '../../components/SearchInput';
import SearchResults from '../../components/SearchResults';

export default function SearchPage() {
  const { 
    search, 
    loading, 
    researching, 
    results, 
    researchResults, 
    error, 
    currentSearchTerm 
  } = useWeaviateSearch();
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (query: string) => {
    setHasSearched(true);
    search(query);
  };

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-4xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white font-mono tracking-wider mb-4">
            SEARCH
          </h1>
          <p className="text-white font-mono text-lg font-bold">
            Find companies and their ethical scores
          </p>
        </div>

        {/* Search Input */}
        <SearchInput 
          onSearch={handleSearch}
          loading={loading || researching}
          placeholder="SEARCH COMPANIES..."
        />

        {/* Search Results */}
        <SearchResults 
          results={results}
          researchResults={researchResults}
          loading={loading}
          researching={researching}
          error={error}
          hasSearched={hasSearched}
          currentSearchTerm={currentSearchTerm}
        />
      </div>
    </div>
  );
}
