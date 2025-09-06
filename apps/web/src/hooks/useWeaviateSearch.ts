import { useCallback, useState } from 'react';
import { CompanyEthics } from '../../../../types';
import { apiEndpoints } from '../lib/api-config';

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
  const [currentSearchTerm, setCurrentSearchTerm] = useState<string>('');

  const search = useCallback(
    async (companyName: string) => {
      if (!companyName.trim()) {
        setResults([]);
        return;
      }

      const trimmedName = companyName.trim();
      setCurrentSearchTerm(trimmedName);
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(apiEndpoints.weaviate.search, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: trimmedName }),
        });

        const data: SearchResponse = await response.json();

        if (response.ok && data.found && data.data) {
          setResults([data.data]);
        } else if (response.status === 404 || (response.ok && !data.found)) {
          setResults([]);
        } else {
          throw new Error(
            data.message || `Search failed: ${response.statusText}`
          );
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Search failed';
        setError(errorMessage);
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
    setCurrentSearchTerm('');
  }, []);

  return {
    search,
    loading,
    results,
    error,
    currentSearchTerm,
    clearResults,
  };
};
