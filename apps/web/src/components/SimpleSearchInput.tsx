'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SimpleSearchInputProps {
  onSearchChange: (query: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function SimpleSearchInput({
  onSearchChange,
  placeholder = 'SEARCH...',
  disabled = false,
}: SimpleSearchInputProps) {
  const [query, setQuery] = useState('');

  const handleClear = () => {
    setQuery('');
    onSearchChange('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onSearchChange(newQuery);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="brutalist-border bg-black p-3 sm:p-4 flex items-center">
        <Search className="w-5 h-5 sm:w-6 sm:h-6 text-white mr-3 sm:mr-4 flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-transparent text-white font-mono text-sm sm:text-lg font-bold placeholder-gray-400 outline-none uppercase tracking-wider disabled:opacity-50"
        />
        {query && (
          <button
            onClick={handleClear}
            disabled={disabled}
            className="ml-3 sm:ml-4 p-1 hover:bg-white hover:text-black transition-colors duration-100 disabled:opacity-50"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}
      </div>
    </div>
  );
}
