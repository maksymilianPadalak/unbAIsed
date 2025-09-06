/**
 * API Configuration
 * Handles API base URL from environment variables
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_ADDRESS || 'http://localhost:3001';

export const apiEndpoints = {
  weaviate: {
    companies: `${API_BASE_URL}/api/weaviate/companies`,
    selectedCompanies: `${API_BASE_URL}/api/weaviate/companies/selected`,
    search: `${API_BASE_URL}/api/weaviate/search`,
    researchRequests: `${API_BASE_URL}/api/weaviate/research-requests`,
  },
  openai: `${API_BASE_URL}/api/open-ai`,
  companyAnalysis: `${API_BASE_URL}/api/company-analysis`,
} as const;
