import { useState, useCallback } from 'react';
import { CompanyEthics } from '../../../../types';

interface SearchResponse {
  found: boolean;
  data?: CompanyEthics;
  message?: string;
  searchTerm: string;
}

export const useWeaviateSearch = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CompanyEthics[]>([]);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (companyName: string) => {
    if (!companyName.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/api/weaviate/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: companyName.trim() }),
      });

      const data: SearchResponse = await response.json();
      
      if (response.ok && data.found && data.data) {
        setResults([data.data]);
      } else if (response.status === 404) {
        // No company found - this is not an error, just empty results
        setResults([]);
      } else {
        throw new Error(data.message || `Search failed: ${response.statusText}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    search,
    loading,
    results,
    error,
    clearResults,
  };
};
