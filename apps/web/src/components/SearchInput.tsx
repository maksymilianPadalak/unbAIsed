'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  onSearch: (query: string) => void;
  loading?: boolean;
  placeholder?: string;
}

export default function SearchInput({
  onSearch,
  loading = false,
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

    </div>
  );
}
