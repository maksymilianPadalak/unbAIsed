import { CompanyEthics } from '../../../../types';
import CompanyScoreCard from './CompanyScoreCard';
import StarryLoader from './StarryLoader';
import { useState } from 'react';
import { apiEndpoints } from '../lib/api-config';

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
  const [companyName, setCompanyName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!companyName.trim()) {
      setSubmitError('Please enter a company name');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch(apiEndpoints.weaviate.researchRequests, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companyName: companyName.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitSuccess(true);
        setCompanyName('');
        setTimeout(() => setSubmitSuccess(false), 5000); // Hide success message after 5 seconds
      } else {
        setSubmitError(data.error || 'Failed to submit research request');
      }
    } catch (error) {
      console.error('Error submitting research request:', error);
      setSubmitError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

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
        <div className="brutalist-border bg-black p-8">
          <h3 className="text-2xl font-black font-mono text-gray-400 uppercase tracking-wider mb-6 text-center">
            NO RESULTS FOUND
          </h3>
          
          <div className="mb-8">
            <div className="brutalist-border bg-gradient-to-br from-gray-900 via-black to-purple-900/30 p-6 relative overflow-hidden">
              {/* Animated space background */}
              <div className="absolute inset-0 opacity-30">
                {/* Stars */}
                {[...Array(30)].map((_, i) => (
                  <div
                    key={`star-${i}`}
                    className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 3}s`,
                      animationDuration: `${2 + Math.random() * 2}s`
                    }}
                  />
                ))}
                
                {/* Shooting stars */}
                {[...Array(2)].map((_, i) => (
                  <div
                    key={`shooting-${i}`}
                    className="absolute w-16 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse"
                    style={{
                      left: `${Math.random() * 80}%`,
                      top: `${20 + Math.random() * 60}%`,
                      transform: `rotate(${-30 + Math.random() * 60}deg)`,
                      animationDelay: `${i * 3}s`,
                      animationDuration: '5s'
                    }}
                  />
                ))}
                
                {/* Purple nebula effect */}
                <div className="absolute inset-0 bg-gradient-radial from-purple-600/10 via-transparent to-transparent animate-pulse" />
              </div>
              
              {/* Content with relative positioning */}
              <div className="relative z-10">
                <h4 className="text-lg font-black font-mono text-purple-300 uppercase tracking-wider mb-4">
                  REQUEST ANALYSIS
                </h4>
                <p className="text-white font-mono text-sm leading-relaxed mb-6">
                  We use <strong>expensive GPT-5 high reasoning analysis</strong> based on web search 
                  to analyze companies. We don&apos;t have the budget to run it for every company yet, 
                  but you can request a specific company for analysis.
                </p>
              
              {submitSuccess && (
                <div className="brutalist-border bg-green-900/20 border-green-500 p-4 mb-6">
                  <p className="text-green-400 font-mono font-bold text-center">
                    ✅ REQUEST SUBMITTED SUCCESSFULLY!
                  </p>
                  <p className="text-green-300 font-mono text-sm text-center mt-2">
                    We&apos;ll analyze this company and add it to our database.
                  </p>
                </div>
              )}
              
              {submitError && (
                <div className="brutalist-border bg-red-900/20 border-red-500 p-4 mb-6">
                  <p className="text-red-400 font-mono font-bold text-center">
                    ❌ {submitError}
                  </p>
                </div>
              )}
              
              <form onSubmit={handleSubmitRequest} className="space-y-4">
                <div>
                  <label className="block text-white font-mono font-bold text-sm mb-2 uppercase tracking-wide">
                    Company Name:
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="ENTER COMPANY NAME..."
                    className="w-full brutalist-border bg-black text-white font-mono px-4 py-3 text-lg focus:outline-none focus:border-white placeholder-gray-500"
                    disabled={submitting}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={submitting || !companyName.trim()}
                  className={`w-full brutalist-button px-6 py-4 text-lg font-bold ${
                    submitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <span className="font-mono tracking-wider">
                    {submitting ? 'SUBMITTING...' : 'REQUEST ANALYSIS'}
                  </span>
                </button>
              </form>
              </div>
            </div>
          </div>
          
          <p className="text-gray-400 font-mono text-sm text-center">
            Or try adjusting your search terms above
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
