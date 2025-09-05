import { CompanyEthics } from '../../../../../types';
import { apiEndpoints } from '../../lib/api-config';
import CompanyScoresPageClient from './CompanyScoresPageClient';
import { Metadata } from 'next';

// ISR configuration
export const revalidate = 300; // Revalidate every 5 minutes

export const metadata: Metadata = {
  title: 'Company Ethics Scores | Unbiased',
  description: 'Browse all company ethics scores analyzed by AI. Sort by highest or lowest ethical ratings.',
  keywords: 'company ethics, ethical ratings, AI analysis, business ethics scores',
};

// Fetch companies on the server
async function getCompanies(): Promise<CompanyEthics[]> {
  try {
    console.log('🔄 [ISR] Fetching companies from API...');
    
    // Use the full URL for server-side fetching
    const apiUrl = process.env.NEXT_PUBLIC_API_ADDRESS || 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/api/weaviate/companies`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes (ISR)
    });

    if (!response.ok) {
      console.error(`[ISR] Failed to fetch companies: ${response.status}`);
      return [];
    }

    const data = await response.json();
    
    if (data.success && data.companies) {
      console.log(`✅ [ISR] Successfully fetched ${data.companies.length} companies`);
      return data.companies;
    }
    
    console.warn('[ISR] Invalid response format from API');
    return [];
  } catch (error) {
    console.error('[ISR] Error fetching companies:', error);
    return [];
  }
}

export default async function CompanyScoresPage() {
  const companies = await getCompanies();
  
  return <CompanyScoresPageClient initialCompanies={companies} />;
}
