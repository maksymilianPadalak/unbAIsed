"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
      <div className="max-w-4xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white font-mono tracking-wider mb-4">
            COMPANY SCORES
          </h1>
          <p className="text-white font-mono text-lg font-bold mb-6">
            {companies.length} COMPANIES ANALYZED
          </p>
          
          {/* Sorting Options */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
            <span className="text-white font-mono font-bold text-lg sm:text-xl">SORT BY:</span>
            
            <button 
              onClick={() => handleSort(sortBy === "highest" ? null : "highest")} 
              className={`brutalist-button text-base sm:text-lg px-4 py-2 ${
                sortBy === "highest" ? "brutalist-active" : ""
              }`}
            >
              HIGHEST ETHICS
            </button>
            
            <button 
              onClick={() => handleSort(sortBy === "lowest" ? null : "lowest")} 
              className={`brutalist-button text-base sm:text-lg px-4 py-2 ${
                sortBy === "lowest" ? "brutalist-active" : ""
              }`}
            >
              LOWEST ETHICS
            </button>
          </div>
        </div>

        {/* Company Cards Grid */}
        <div className="grid gap-6 grid-cols-1">
          {companies.map((company, index) => {
            const companySlug = company.name
              .toLowerCase()
              .replace(/[^a-z0-9]/g, '-')
              .replace(/-+/g, '-')
              .replace(/^-|-$/g, '');

            return (
              <Link key={index} href={`/company/${companySlug}`} className="block hover:scale-[1.01] transition-transform duration-100">
                <CompanyScoreCard company={company} showLinks={false} />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
