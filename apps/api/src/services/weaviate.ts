import WeaviateClient from '../clients/weaviateClient';
import { CompanyEthics } from '../types/company-ethics';

const weaviate = async () => {
  await WeaviateClient.schema
    .classCreator()
    .withClass({
      class: 'CompanyEthics',
      description:
        'Morality audits of companies with short description, an ethical score, and supporting research links.',
      vectorizer: 'text2vec-openai',
      moduleConfig: {
        'text2vec-openai': {
          model: 'text-embedding-ada-002',
          type: 'text'
        }
      },
      properties: [
        { 
          name: 'name', 
          dataType: ['text'],
          moduleConfig: {
            'text2vec-openai': {
              skip: false,
              vectorizePropertyName: true
            }
          }
        },
        { 
          name: 'description', 
          dataType: ['text'],
          moduleConfig: {
            'text2vec-openai': {
              skip: false,
              vectorizePropertyName: false
            }
          }
        },
        { name: 'ethicalScore', dataType: ['number'] },
        {
          name: 'usefulLinks',
          dataType: ['object[]'],
          nestedProperties: [
            { name: 'description', dataType: ['text'] },
            { name: 'url', dataType: ['text'] },
          ],
        },
      ],
    })
    .do();
};

const getMockCompanies = (): any[] => [
  {
    name: "Apple Inc.",
    description: "Technology company known for iPhone, Mac, iPad, and services. Strong privacy stance but faces labor and environmental challenges in supply chain.",
    ethicalScore: 7.2,
    usefulLinks: [
      { description: "Apple's 2030 Carbon Neutral Plan", url: "https://www.apple.com/carbon-neutral/" },
      { description: "Supplier Responsibility Report", url: "https://www.apple.com/supplier-responsibility/" }
    ]
  },
  {
    name: "Microsoft Corporation",
    description: "Cloud computing and software giant with strong sustainability commitments and ethical AI initiatives.",
    ethicalScore: 8.1,
    usefulLinks: [
      { description: "Microsoft Sustainability Report", url: "https://www.microsoft.com/sustainability/" },
      { description: "Responsible AI Principles", url: "https://www.microsoft.com/ai/responsible-ai" }
    ]
  },
  {
    name: "Amazon.com Inc.",
    description: "E-commerce and cloud services leader with mixed record on worker rights and environmental impact.",
    ethicalScore: 4.8,
    usefulLinks: [
      { description: "Climate Pledge Commitment", url: "https://www.aboutamazon.com/planet" },
      { description: "Worker Safety Reports", url: "https://www.aboutamazon.com/workplace-safety" }
    ]
  },
  {
    name: "Google (Alphabet Inc.)",
    description: "Search and advertising giant with strong AI ethics focus but privacy and market dominance concerns.",
    ethicalScore: 6.5,
    usefulLinks: [
      { description: "AI Ethics Principles", url: "https://ai.google/principles/" },
      { description: "Sustainability Goals", url: "https://sustainability.google/" }
    ]
  },
  {
    name: "Tesla Inc.",
    description: "Electric vehicle and clean energy company driving sustainable transportation revolution.",
    ethicalScore: 8.7,
    usefulLinks: [
      { description: "Impact Report", url: "https://www.tesla.com/impact" },
      { description: "Safety & Quality Standards", url: "https://www.tesla.com/safety" }
    ]
  },
  {
    name: "Meta Platforms Inc.",
    description: "Social media conglomerate facing ongoing challenges with content moderation and user privacy.",
    ethicalScore: 3.2,
    usefulLinks: [
      { description: "Privacy Center", url: "https://www.facebook.com/privacy/center" },
      { description: "Community Standards", url: "https://transparency.fb.com/policies/community-standards/" }
    ]
  },
  {
    name: "Netflix Inc.",
    description: "Streaming entertainment leader with strong content diversity and environmental initiatives.",
    ethicalScore: 7.8,
    usefulLinks: [
      { description: "Inclusion & Diversity Report", url: "https://about.netflix.com/inclusion" },
      { description: "Environmental Responsibility", url: "https://about.netflix.com/environment" }
    ]
  },
  {
    name: "Spotify Technology S.A.",
    description: "Music streaming platform with focus on artist compensation and content accessibility.",
    ethicalScore: 6.9,
    usefulLinks: [
      { description: "Loud & Clear Artist Economics", url: "https://loudandclear.byspotify.com/" },
      { description: "Sustainability Report", url: "https://investors.spotify.com/sustainability/" }
    ]
  },
  {
    name: "McDonald's Corporation",
    description: "Global fast food chain making progress on sustainable sourcing and animal welfare.",
    ethicalScore: 5.4,
    usefulLinks: [
      { description: "Better M Report", url: "https://corporate.mcdonalds.com/corpmcd/our-purpose-and-impact.html" },
      { description: "Animal Health & Welfare", url: "https://corporate.mcdonalds.com/corpmcd/our-purpose-and-impact/food/animal-health-and-welfare.html" }
    ]
  },
  {
    name: "Starbucks Corporation",
    description: "Coffee company with strong ethical sourcing programs and environmental commitments.",
    ethicalScore: 8.3,
    usefulLinks: [
      { description: "Ethical Sourcing Coffee", url: "https://www.starbucks.com/responsibility/sourcing/coffee" },
      { description: "Planet Positive Goals", url: "https://www.starbucks.com/responsibility/planet/" }
    ]
  },
  {
    name: "Nike Inc.",
    description: "Athletic apparel giant with improving labor practices and sustainability initiatives.",
    ethicalScore: 6.7,
    usefulLinks: [
      { description: "Impact Report", url: "https://www.nike.com/sustainability" },
      { description: "Manufacturing Map", url: "https://manufacturingmap.nikeinc.com/" }
    ]
  },
  {
    name: "Coca-Cola Company",
    description: "Beverage company addressing water stewardship and plastic waste challenges.",
    ethicalScore: 5.1,
    usefulLinks: [
      { description: "Sustainability Report", url: "https://www.coca-colacompany.com/sustainability" },
      { description: "Water Stewardship", url: "https://www.coca-colacompany.com/sustainability/water" }
    ]
  },
  {
    name: "Unilever PLC",
    description: "Consumer goods company with comprehensive sustainable living plan and social impact focus.",
    ethicalScore: 8.9,
    usefulLinks: [
      { description: "Sustainable Living Plan", url: "https://www.unilever.com/sustainability/" },
      { description: "Human Rights Report", url: "https://www.unilever.com/sustainability/fairness-in-the-workplace/human-rights/" }
    ]
  },
  {
    name: "Johnson & Johnson",
    description: "Healthcare company with strong medical access programs and environmental goals.",
    ethicalScore: 7.6,
    usefulLinks: [
      { description: "Health for Humanity Report", url: "https://healthforhumanityreport.jnj.com/" },
      { description: "Our Credo Values", url: "https://www.jnj.com/credo" }
    ]
  },
  {
    name: "Walmart Inc.",
    description: "Retail giant making progress on sustainability and supplier responsibility.",
    ethicalScore: 6.0,
    usefulLinks: [
      { description: "ESG Report", url: "https://corporate.walmart.com/esgreport" },
      { description: "Responsible Sourcing", url: "https://corporate.walmart.com/responsible-sourcing" }
    ]
  },
  {
    name: "Patagonia Inc.",
    description: "Outdoor clothing company leading on environmental activism and supply chain transparency.",
    ethicalScore: 9.4,
    usefulLinks: [
      { description: "Environmental & Social Initiatives", url: "https://www.patagonia.com/activism/" },
      { description: "Fair Trade Certified", url: "https://www.patagonia.com/fair-trade/" }
    ]
  },
  {
    name: "Ben & Jerry's",
    description: "Ice cream company known for social activism and progressive values.",
    ethicalScore: 8.8,
    usefulLinks: [
      { description: "Social Mission", url: "https://www.benjerry.com/values" },
      { description: "Caring Dairy Program", url: "https://www.benjerry.com/values/issues-we-care-about/caring-dairy" }
    ]
  },
  {
    name: "IKEA",
    description: "Furniture retailer with circular business model and renewable energy investments.",
    ethicalScore: 7.9,
    usefulLinks: [
      { description: "People & Planet Positive", url: "https://www.ikea.com/us/en/this-is-ikea/people-and-planet/" },
      { description: "Circular Business Report", url: "https://www.ikea.com/us/en/this-is-ikea/people-and-planet/circular-business/" }
    ]
  },
  {
    name: "Salesforce Inc.",
    description: "Cloud software company with strong equality initiatives and carbon neutrality goals.",
    ethicalScore: 8.5,
    usefulLinks: [
      { description: "Sustainability Report", url: "https://www.salesforce.com/resources/research-reports/sustainability/" },
      { description: "Equality at Salesforce", url: "https://www.salesforce.com/company/equality/" }
    ]
  },
  {
    name: "OpenAI Inc.",
    description: "AI research company focused on developing safe artificial general intelligence.",
    ethicalScore: 6.8,
    usefulLinks: [
      { description: "Charter & Mission", url: "https://openai.com/charter/" },
      { description: "Safety Standards", url: "https://openai.com/safety/" }
    ]
  }
];

const getAllCompanies = async (): Promise<any[]> => {
  try {
    console.log(`📋 Getting ALL companies from Weaviate database...`);
    
    // Fetch all companies from Weaviate - no fallback to mock data
    const result = await WeaviateClient.graphql
      .get()
      .withClassName('CompanyEthics')
      .withFields('name description ethicalScore usefulLinks { description url }')
      .withLimit(100) // Set a reasonable limit
      .do();
    
    const companies = result?.data?.Get?.CompanyEthics;
    
    if (companies && companies.length > 0) {
      console.log(`✅ Found ${companies.length} companies in Weaviate database`);
      return companies;
    } else {
      console.log(`⚠️  No companies found in Weaviate database`);
      return [];
    }
  } catch (error) {
    console.error('Error getting companies from Weaviate:', error);
    console.log(`❌ Weaviate query failed`);
    return [];
  }
};

const normalizeCompanyName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/['’`]/g, '') // Remove apostrophes and smart quotes
    .replace(/[^a-z0-9]/g, '') // Remove all non-alphanumeric characters
    .trim();
};

const generateNameVariations = (companyName: string): string[] => {
  const variations = new Set<string>();
  
  // Original
  variations.add(companyName);
  
  // Case variations
  variations.add(companyName.toLowerCase());
  variations.add(companyName.toUpperCase());
  variations.add(companyName.charAt(0).toUpperCase() + companyName.slice(1).toLowerCase());
  
  // With and without apostrophes
  variations.add(companyName.replace(/'/g, ''));
  variations.add(companyName.replace(/'/g, "'"));
  
  // With and without common suffixes
  const withoutSuffixes = companyName.replace(/\s+(Inc\.?|LLC|Ltd\.?|Corporation|Corp\.?|Company|Co\.?)$/i, '');
  if (withoutSuffixes !== companyName) {
    variations.add(withoutSuffixes);
    variations.add(withoutSuffixes.toLowerCase());
    variations.add(withoutSuffixes.charAt(0).toUpperCase() + withoutSuffixes.slice(1).toLowerCase());
  }
  
  return Array.from(variations);
};

const findCompanyByNameFuzzy = async (companyName: string): Promise<CompanyEthics | null> => {
  try {
    console.log(`🧠 AI vector search for company: ${companyName}`);
    
    // Try hybrid search first (combines vector similarity + BM25 keyword search)
    try {
      console.log('Trying hybrid search (vector + keyword)...');
      const hybridResult = await WeaviateClient.graphql
        .get()
        .withClassName('CompanyEthics')
        .withHybrid({
          query: companyName,
          alpha: 0.5, // 50/50 balance between vector and keyword search
        })
        .withFields('name description ethicalScore usefulLinks { description url }')
        .withLimit(5)
        .do();
      
      const hybridCompanies = hybridResult?.data?.Get?.CompanyEthics;
      if (hybridCompanies && hybridCompanies.length > 0) {
        console.log(`✅ Found ${hybridCompanies.length} matches with hybrid search`);
        return hybridCompanies[0] as CompanyEthics;
      }
    } catch (hybridError) {
      console.error('Hybrid search failed:', hybridError);
    }
    
    // Try pure vector search (semantic similarity)
    try {
      console.log('Trying pure vector search...');
      const vectorResult = await WeaviateClient.graphql
        .get()
        .withClassName('CompanyEthics')
        .withNearText({ concepts: [companyName] })
        .withFields('name description ethicalScore usefulLinks { description url }')
        .withLimit(5)
        .do();
      
      const vectorCompanies = vectorResult?.data?.Get?.CompanyEthics;
      if (vectorCompanies && vectorCompanies.length > 0) {
        console.log(`✅ Found ${vectorCompanies.length} matches with vector search`);
        return vectorCompanies[0] as CompanyEthics;
      }
    } catch (vectorError) {
      console.error('Vector search failed:', vectorError);
    }
    
    // Try BM25 keyword search as fallback
    try {
      console.log('Trying BM25 keyword search...');
      const bm25Result = await WeaviateClient.graphql
        .get()
        .withClassName('CompanyEthics')
        .withBm25({ query: companyName })
        .withFields('name description ethicalScore usefulLinks { description url }')
        .withLimit(5)
        .do();
      
      const bm25Companies = bm25Result?.data?.Get?.CompanyEthics;
      if (bm25Companies && bm25Companies.length > 0) {
        console.log(`✅ Found ${bm25Companies.length} matches with BM25 search`);
        return bm25Companies[0] as CompanyEthics;
      }
    } catch (bm25Error) {
      console.error('BM25 search failed:', bm25Error);
    }
    
    // Fallback to string variations for edge cases
    const nameVariations = generateNameVariations(companyName);
    for (const variation of nameVariations.slice(0, 3)) { // Limit to avoid too many requests
      try {
        const likeResult = await WeaviateClient.graphql
          .get()
          .withClassName('CompanyEthics')
          .withWhere({
            path: ['name'],
            operator: 'Like',
            valueText: `*${variation}*`,
          })
          .withFields('name description ethicalScore usefulLinks { description url }')
          .withLimit(1)
          .do();
        
        const likeCompanies = likeResult?.data?.Get?.CompanyEthics;
        if (likeCompanies && likeCompanies.length > 0) {
          console.log(`✅ Found match with Like search for "${variation}"`);
          return likeCompanies[0] as CompanyEthics;
        }
      } catch (likeError) {
        console.error(`Like search failed for "${variation}":`, likeError);
      }
    }
    
    console.log(`❌ No companies found for AI search: ${companyName}`);
    return null;
  } catch (error) {
    console.error('Error in AI search for company:', error);
    return null;
  }
};

const findCompanyByName = async (companyName: string): Promise<{ id: string; data: any } | null> => {
  try {
    console.log(`🔍 Searching for existing company: ${companyName}`);
    
    const result = await WeaviateClient.graphql
      .get()
      .withClassName('CompanyEthics')
      .withWhere({
        path: ['name'],
        operator: 'Equal',
        valueText: companyName,
      })
      .withFields('name description ethicalScore usefulLinks { description url }')
      .withLimit(1)
      .do();
    
    const companies = result?.data?.Get?.CompanyEthics;
    if (companies && companies.length > 0) {
      // Get the ID using a separate query since GraphQL doesn't return _additional by default
      const idResult = await WeaviateClient.graphql
        .get()
        .withClassName('CompanyEthics')
        .withWhere({
          path: ['name'],
          operator: 'Equal',
          valueText: companyName,
        })
        .withFields('_additional { id }')
        .withLimit(1)
        .do();
      
      const id = idResult?.data?.Get?.CompanyEthics?.[0]?._additional?.id;
      if (id) {
        console.log(`✅ Found existing company with ID: ${id}`);
        return { id, data: companies[0] };
      }
    }
    
    console.log(`❌ No existing company found for: ${companyName}`);
    return null;
  } catch (error) {
    console.error('Error searching for company:', error);
    return null;
  }
};

const updateCompanyEthics = async (id: string, companyData: CompanyEthics): Promise<{ id: string; success: boolean; updated: boolean }> => {
  try {
    console.log(`📝 Updating existing company with ID: ${id}`);
    
    await WeaviateClient.data
      .updater()
      .withId(id)
      .withClassName('CompanyEthics')
      .withProperties({
        name: companyData.name,
        description: companyData.description,
        ethicalScore: companyData.ethicalScore,
        usefulLinks: companyData.usefulLinks,
      })
      .do();
    
    console.log(`✅ Successfully updated company: ${companyData.name}`);
    
    return {
      id,
      success: true,
      updated: true,
    };
  } catch (error) {
    console.error('Failed to update company ethics in Weaviate:', error);
    throw new Error(`Weaviate update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const createCompanyEthics = async (companyData: CompanyEthics): Promise<{ id: string; success: boolean; updated: boolean }> => {
  try {
    console.log(`➕ Creating new company: ${companyData.name}`);
    
    const result = await WeaviateClient.data
      .creator()
      .withClassName('CompanyEthics')
      .withProperties({
        name: companyData.name,
        description: companyData.description,
        ethicalScore: companyData.ethicalScore,
        usefulLinks: companyData.usefulLinks,
      })
      .do();
    
    if (!result.id) {
      throw new Error('Weaviate did not return an ID for the created object');
    }
    
    console.log(`✅ Successfully created new company with ID: ${result.id}`);
    
    return {
      id: result.id,
      success: true,
      updated: false,
    };
  } catch (error) {
    console.error('Failed to create company ethics in Weaviate:', error);
    throw new Error(`Weaviate creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const upsertCompanyEthics = async (companyData: CompanyEthics): Promise<{ id: string; success: boolean; updated: boolean }> => {
  try {
    console.log(`🔄 Upserting company ethics data: ${companyData.name}`);
    console.log(JSON.stringify(companyData, null, 2));
    
    // First, check if company already exists
    const existingCompany = await findCompanyByName(companyData.name);
    
    if (existingCompany) {
      // Update existing company
      return await updateCompanyEthics(existingCompany.id, companyData);
    } else {
      // Create new company
      return await createCompanyEthics(companyData);
    }
  } catch (error) {
    console.error('Failed to upsert company ethics in Weaviate:', error);
    throw new Error(`Weaviate upsert failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Keep the old function for backward compatibility, but redirect to upsert
const storeCompanyEthics = async (companyData: CompanyEthics): Promise<{ id: string; success: boolean }> => {
  const result = await upsertCompanyEthics(companyData);
  return {
    id: result.id,
    success: result.success,
  };
};

// Backward compatibility function for frontend  
const searchCompanyByName = async (companyName: string): Promise<CompanyEthics | null> => {
  try {
    // For now, fallback to mock data search
    console.log(`🔍 Searching mock data for: ${companyName}`);
    
    const mockCompanies = getMockCompanies();
    const query = companyName.toLowerCase();
    
    // Simple fuzzy search through mock data
    const found = mockCompanies.find(company => 
      company.name.toLowerCase().includes(query) ||
      company.name.toLowerCase().replace(/[^a-z0-9]/g, '').includes(query.replace(/[^a-z0-9]/g, '')) ||
      company.description.toLowerCase().includes(query)
    );
    
    if (found) {
      console.log(`✅ Found mock company: ${found.name}`);
      return found as CompanyEthics;
    }
    
    // If not found in mock, try the original Weaviate search as fallback
    console.log('Not found in mock data, trying Weaviate...');
    return await findCompanyByNameFuzzy(companyName);
  } catch (error) {
    console.error('Search error:', error);
    return null;
  }
};

export const weaviateService = {
  weaviate,
  storeCompanyEthics,
  upsertCompanyEthics,
  findCompanyByName,
  findCompanyByNameFuzzy,
  searchCompanyByName,
  getAllCompanies,
} as const;
