'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  onSearch: (query: string) => void;
  onStartResearch?: (query: string) => void;
  loading?: boolean;
  researching?: boolean;
  showResearchCta?: boolean; // show CTA only after search is done
  placeholder?: string;
}

export default function SearchInput({
  onSearch,
  onStartResearch,
  loading = false,
  researching = false,
  showResearchCta = false,
  placeholder = 'SEARCH COMPANIES...',
}: SearchInputProps) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1 relative">
          <div className="brutalist-border bg-black p-3 sm:p-4 flex items-center">
            <Search className="w-5 h-5 sm:w-6 sm:h-6 text-white mr-3 sm:mr-4 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={loading}
              className="flex-1 bg-transparent text-white font-mono text-lg sm:text-xl font-bold placeholder-gray-400 outline-none uppercase tracking-wider disabled:opacity-50"
            />
            {query && (
              <button
                onClick={handleClear}
                disabled={loading}
                className="ml-3 sm:ml-4 p-1 hover:bg-white hover:text-black transition-colors duration-100 disabled:opacity-50"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}
          </div>
        </div>
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="brutalist-button w-full sm:w-auto sm:min-w-[140px] px-6 py-4 sm:py-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
              <span className="text-sm sm:text-base font-black">
                SEARCHING...
              </span>
            </div>
          ) : (
            <span className="text-sm sm:text-base font-black">SEARCH</span>
          )}
        </button>
      </div>

      {/* Manual AI research CTA (only after a search completes) */}
      {showResearchCta && (
        <div className="mt-8 flex flex-col items-center gap-2 text-center">
          <span className="text-sm font-mono text-white/80">
            Not the result you wanted?
          </span>
          <button
            type="button"
            onClick={() =>
              onStartResearch && query.trim() && onStartResearch(query.trim())
            }
            disabled={loading || researching || !query.trim()}
            className="relative overflow-hidden border-2 border-white px-6 sm:px-8 py-4 text-white font-black font-mono uppercase tracking-wider text-base sm:text-lg min-w-[300px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:text-black hover:scale-105 transition-all duration-200 transform hover:cursor-pointer"
            aria-label="Start AI research"
          >
            {/* Starry background layers (same style as research animation) */}
            <span className="absolute inset-0 opacity-30 pointer-events-none">
              {Array.from({ length: 30 }).map((_, i) => (
                <span
                  key={`star-${i}`}
                  className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 2}s`,
                  }}
                />
              ))}
              <span className="absolute inset-0 bg-gradient-radial from-purple-600/10 via-transparent to-transparent animate-pulse" />
            </span>
            <span className="relative z-10">Start AI research</span>
          </button>
        </div>
      )}
    </div>
  );
}
