import { CompanyEthics } from '../../../../types';
import CompanyScoreCard from './CompanyScoreCard';
import StarryLoader from './StarryLoader';

interface SearchResultsProps {
  results: CompanyEthics[];
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
  currentSearchTerm: string;
}

export default function SearchResults({ 
  results,
  loading, 
  error, 
  hasSearched,
  currentSearchTerm
}: SearchResultsProps) {

  // Error state - PRIORITY 2
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

  // Loading state
  if (loading) {
    return (
      <StarryLoader 
        title="SEARCHING DATABASE"
        subtitle="Looking for company in our records"
        size="medium"
      />
    );
  }

  // No results state
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
      <div className="w-full max-w-4xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[100rem] mx-auto">
        <div className="mb-6">
          <h3 className="text-xl font-black font-mono text-white uppercase tracking-wider">
            FOUND {results.length} RESULT{results.length !== 1 ? 'S' : ''}
          </h3>
        </div>
        <div className="space-y-0">
          {results.map((company, index) => (
            <CompanyScoreCard key={`${company.name}-${index}`} company={company} disableHover={true} />
          ))}
        </div>
      </div>
    );
  }

  // Default state (no search yet)
  return null;
}
