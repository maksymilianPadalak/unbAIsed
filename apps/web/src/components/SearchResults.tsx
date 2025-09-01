import { CompanyEthics } from '../../../../types';
import CompanyScoreCard from './CompanyScoreCard';
import ResearchAnimation from './ResearchAnimation';

interface SearchResultsProps {
  results: CompanyEthics[];
  researchResults: CompanyEthics[];
  loading: boolean;
  researching: boolean;
  error: string | null;
  hasSearched: boolean;
  currentSearchTerm: string;
}

export default function SearchResults({ 
  results,
  researchResults,
  loading, 
  researching,
  error, 
  hasSearched,
  currentSearchTerm
}: SearchResultsProps) {
  // Research animation state (when doing OpenAI research) - PRIORITY 1
  if (researching) {
    return <ResearchAnimation companyName={currentSearchTerm} />;
  }

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

  // Loading state (database search only) - PRIORITY 3
  if (loading && !researching) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="brutalist-border bg-black p-8 text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-2xl font-black font-mono text-white uppercase tracking-wider">
              SEARCHING DATABASE...
            </h3>
            <p className="text-white font-mono mt-2">
              Looking for company in our records
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Research results state (show results from OpenAI)
  if (researchResults.length > 0) {
    return (
      <div className="w-full max-w-4xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[100rem] mx-auto">
        <div className="mb-6">
          <h3 className="text-xl font-black font-mono text-white uppercase tracking-wider">
            RESEARCH COMPLETE - {researchResults.length} RESULT{researchResults.length !== 1 ? 'S' : ''}
          </h3>
          <p className="text-white font-mono text-sm opacity-80">
            Generated using AI research • Data freshly gathered from multiple sources
          </p>
        </div>
        <div className="space-y-0">
          {researchResults.map((company, index) => (
            <CompanyScoreCard key={`research-${company.name}-${index}`} company={company} />
          ))}
        </div>
      </div>
    );
  }

  // No results state (only show if user has searched and no research was triggered)
  if (hasSearched && results.length === 0 && researchResults.length === 0 && !researching) {
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
            <CompanyScoreCard key={`${company.name}-${index}`} company={company} />
          ))}
        </div>
      </div>
    );
  }

  // Default state (no search yet)
  return null;
}
