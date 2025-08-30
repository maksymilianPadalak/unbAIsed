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
    <div className="min-h-screen bg-black py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black text-white font-mono tracking-wider mb-4">
            SEARCH
          </h1>
          <p className="text-white font-mono text-xl uppercase tracking-wide">
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
