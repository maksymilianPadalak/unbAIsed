import { CompanyEthics } from '../../../../types';
import CompanyCarousel from './CompanyCarousel';

// Fetch companies on the server for ISR
async function getCompanies(): Promise<CompanyEthics[]> {
  try {
    console.log('🎠 [ISR] Fetching selected companies for carousel...');
    
    // Use the full URL for server-side fetching
    const apiUrl = process.env.NEXT_PUBLIC_API_ADDRESS || 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/api/weaviate/companies/selected`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes (ISR)
    });

    if (!response.ok) {
      console.error(`[ISR] Failed to fetch companies for carousel: ${response.status}`);
      return [];
    }

    const data = await response.json();
    
    if (data.success && data.companies) {
      console.log(`✅ [ISR] Successfully fetched ${data.companies.length} companies for carousel`);
      return data.companies;
    }
    
    console.warn('[ISR] Invalid response format from API for carousel');
    return [];
  } catch (error) {
    console.error('[ISR] Error fetching companies for carousel:', error);
    return [];
  }
}

export default async function CompanyCarouselServer() {
  const companies = await getCompanies();
  
  if (companies.length === 0) {
    return (
      <div className="w-full overflow-hidden mb-16">
        <div className="border-4 border-white p-8 bg-black text-center">
          <div className="text-white font-mono text-xl font-bold tracking-wider">
            NO COMPANIES AVAILABLE
          </div>
        </div>
      </div>
    );
  }

  return <CompanyCarousel companies={companies} />;
}
