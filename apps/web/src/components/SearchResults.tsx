import { CompanyEthics } from '../../../../types';
import CompanyScoreCard from './CompanyScoreCard';

interface SearchResultsProps {
  results: CompanyEthics[];
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
}

export default function SearchResults({ 
  results, 
  loading, 
  error, 
  hasSearched 
}: SearchResultsProps) {
  // Loading state
  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="brutalist-border bg-black p-8 text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-2xl font-black font-mono text-white uppercase tracking-wider">
              SEARCHING...
            </h3>
            <p className="text-white font-mono mt-2">
              Analyzing company data
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="brutalist-border bg-black p-8 text-center border-red-500">
          <h3 className="text-2xl font-black font-mono text-red-400 uppercase tracking-wider mb-4">
            SEARCH ERROR
          </h3>
          <p className="text-white font-mono">
            {error}
          </p>
        </div>
      </div>
    );
  }

  // No results state (only show if user has searched)
  if (hasSearched && results.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="brutalist-border bg-black p-8 text-center">
          <h3 className="text-2xl font-black font-mono text-gray-400 uppercase tracking-wider mb-4">
            NO RESULTS FOUND
          </h3>
          <p className="text-white font-mono">
            Try adjusting your search terms
          </p>
        </div>
      </div>
    );
  }

  // Results state
  if (results.length > 0) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-6">
          <h3 className="text-xl font-black font-mono text-white uppercase tracking-wider">
            FOUND {results.length} RESULT{results.length !== 1 ? 'S' : ''}
          </h3>
        </div>
        <div className="space-y-0">
          {results.map((company, index) => (
            <CompanyScoreCard key={`${company.name}-${index}`} company={company} />
          ))}
        </div>
      </div>
    );
  }

  // Default state (no search yet)
  return null;
}
