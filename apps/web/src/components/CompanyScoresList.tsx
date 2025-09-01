"use client";

import { useEffect, useState } from "react";
import { CompanyEthics } from "../../../../types";
import CompanyScoreCard from "./CompanyScoreCard";
import { apiEndpoints } from "../lib/api-config";

type SortOption = "highest" | "lowest" | null;

export default function CompanyScoresList() {
  const [companies, setCompanies] = useState<CompanyEthics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>(null);
  const [originalCompanies, setOriginalCompanies] = useState<CompanyEthics[]>([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch from the API server
        const response = await fetch(apiEndpoints.weaviate.companies);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch companies: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.companies) {
          setOriginalCompanies(data.companies);
          setCompanies(data.companies);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching companies:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="border-4 border-white p-8 bg-black">
          <div className="text-white font-mono text-2xl font-bold tracking-wider animate-pulse">
            LOADING COMPANIES...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="border-4 border-red-500 p-8 bg-black max-w-md">
          <h2 className="text-2xl font-black text-red-500 font-mono tracking-wider mb-4">
            ERROR
          </h2>
          <p className="text-white font-mono text-sm">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="brutalist-button mt-4"
          >
            RETRY
          </button>
        </div>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="border-4 border-white p-12 bg-black text-center">
          <h2 className="text-4xl font-black text-white font-mono tracking-wider mb-4">
            NO COMPANIES FOUND
          </h2>
          <p className="text-white font-mono text-lg">
            No company ethics data available yet.
          </p>
        </div>
      </div>
    );
  }

  // Handle sorting logic
  const handleSort = (option: SortOption) => {
    setSortBy(option);
    
    if (option === null) {
      // Reset to original order
      setCompanies([...originalCompanies]);
      return;
    }
    
    const sortedCompanies = [...companies].sort((a, b) => {
      if (option === "highest") {
        return b.ethicalScore - a.ethicalScore;
      } else {
        return a.ethicalScore - b.ethicalScore;
      }
    });
    
    setCompanies(sortedCompanies);
  };
  
  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-6xl mx-auto px-8">
        {/* Header */}
        <div className="border-4 border-white p-8 bg-black mb-8">
          <h1 className="text-6xl font-black text-white font-mono tracking-wider text-center mb-4">
            COMPANY SCORES
          </h1>
          <div className="border-t-4 border-white pt-4 text-center">
            <p className="text-white font-mono text-lg font-bold mb-6">
              {companies.length} COMPANIES ANALYZED
            </p>
            
            {/* Sorting Options */}
            <div className="flex items-center justify-center space-x-4 pt-2">
              <span className="text-white font-mono font-bold">SORT BY:</span>
              
              <button 
                onClick={() => handleSort(sortBy === "highest" ? null : "highest")} 
                className={`brutalist-button text-sm px-3 py-1 ${
                  sortBy === "highest" ? "brutalist-active" : ""
                }`}
              >
                HIGHEST ETHICS
              </button>
              
              <button 
                onClick={() => handleSort(sortBy === "lowest" ? null : "lowest")} 
                className={`brutalist-button text-sm px-3 py-1 ${
                  sortBy === "lowest" ? "brutalist-active" : ""
                }`}
              >
                LOWEST ETHICS
              </button>
            </div>
          </div>
        </div>

        {/* Company Cards Grid */}
        <div className="grid gap-6 grid-cols-1">
          {companies.map((company, index) => (
            <CompanyScoreCard key={index} company={company} />
          ))}
        </div>
      </div>
    </div>
  );
}
