import { useState, useCallback } from 'react';
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
  const [researching, setResearching] = useState(false);
  const [results, setResults] = useState<CompanyEthics[]>([]);
  const [researchResults, setResearchResults] = useState<CompanyEthics[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentSearchTerm, setCurrentSearchTerm] = useState<string>('');

  const performResearch = useCallback(async (companyName: string) => {
    setResearching(true);
    
    try {
      const response = await fetch(apiEndpoints.openai, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: `Research and analyze the ethical practices of ${companyName}. Provide detailed information about their business practices, controversies, and overall ethical score.` 
        }),
      });

      if (!response.ok) {
        throw new Error(`Research failed: ${response.statusText}`);
      }

      const researchData: CompanyEthics = await response.json();
      setResearchResults([researchData]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Research failed';
      setError(errorMessage);
    } finally {
      setResearching(false);
    }
  }, []);

  const search = useCallback(async (companyName: string) => {
    if (!companyName.trim()) {
      setResults([]);
      setResearchResults([]);
      return;
    }

    const trimmedName = companyName.trim();
    setCurrentSearchTerm(trimmedName);
    setLoading(true);
    setError(null);
    setResearchResults([]); // Clear previous research results

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
        // No company found in database - trigger OpenAI research
        setResults([]);
        await performResearch(trimmedName);
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
  }, [performResearch]);

  const clearResults = useCallback(() => {
    setResults([]);
    setResearchResults([]);
    setError(null);
    setCurrentSearchTerm('');
  }, []);

  return {
    search,
    loading,
    researching,
    results,
    researchResults,
    error,
    currentSearchTerm,
    clearResults,
  };
};
