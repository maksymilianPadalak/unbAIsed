import WeaviateClient from '../clients/weaviateClient';
import { CompanyEthics } from '../types/company-ethics';

const weaviate = async () => {
  await WeaviateClient.schema
    .classCreator()
    .withClass({
      class: 'CompanyEthics',
      description:
        'Morality audits of companies with description, ethical score, rationale, and positive/negative impact articles.',
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
          name: 'scoreRationale', 
          dataType: ['text'],
          moduleConfig: {
            'text2vec-openai': {
              skip: false,
              vectorizePropertyName: false
            }
          }
        },
        {
          name: 'goodImpactArticles',
          dataType: ['object[]'],
          nestedProperties: [
            { name: 'description', dataType: ['text'] },
            { name: 'url', dataType: ['text'] },
            { name: 'date', dataType: ['text'] },
          ],
        },
        {
          name: 'badImpactArticles',
          dataType: ['object[]'],
          nestedProperties: [
            { name: 'description', dataType: ['text'] },
            { name: 'url', dataType: ['text'] },
            { name: 'date', dataType: ['text'] },
          ],
        },
      ],
    })
    .do();
};


const getAllCompanies = async (): Promise<any[]> => {
  try {
    console.log(`📋 Getting ALL companies from Weaviate database...`);
    
    // Fetch all companies from Weaviate - no fallback to mock data
    const result = await WeaviateClient.graphql
      .get()
      .withClassName('CompanyEthics')
.withFields('name description ethicalScore scoreRationale goodImpactArticles { description url date } badImpactArticles { description url date }')
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

// Build a safe LIKE pattern to bridge spacing/punctuation differences
// Example: "Open AI" -> "*open*ai*"
const buildLikePattern = (raw: string): string | null => {
  const norm = raw
    .trim()
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '') // strip accents
    .toLowerCase();

  if (!norm) return null;

  // Replace non-alphanumerics with '*', wrap with '*' for contains
  let pattern = `*${norm.replace(/[^a-z0-9]+/gi, '*')}*`;

  // Collapse multiple '*' to reduce pathological patterns
  pattern = pattern.replace(/\*+/g, '*');

  // Guard: require at least a few alphanumerics
  if (pattern.replace(/\*/g, '').length < 3) return null;

  return pattern;
};


const findCompanyByNameFuzzy = async (companyName: string): Promise<CompanyEthics | null> => {
  try {
    console.log(`🧠 AI vector search for company: ${companyName}`);

    // 1) Try LIKE first to bridge spacing/punctuation differences: "open ai" -> "*open*ai*"
    try {
      console.log('Trying LIKE search on name field...');
      const likePattern = buildLikePattern(companyName);
      if (likePattern) {
        const likeRes = await WeaviateClient.graphql
          .get()
          .withClassName('CompanyEthics')
          .withWhere({
            path: ['name'],
            operator: 'Like',
            valueText: likePattern, // if `name` is a string property, switch to valueString
          })
          .withFields('name description ethicalScore scoreRationale goodImpactArticles { description url date } badImpactArticles { description url date }')
          .withLimit(5)
          .do();

        const likeCompanies = likeRes?.data?.Get?.CompanyEthics;
        if (likeCompanies && likeCompanies.length > 0) {
          console.log(`✅ Found ${likeCompanies.length} matches with LIKE search`);
          return likeCompanies[0] as CompanyEthics; // LIKE is a filter; first match
        }
      }
    } catch (e) {
      console.error('LIKE search failed:', e);
    }

    // 2) BM25 keyword search on NAME field for ranking
    try {
      console.log('Trying BM25 keyword search on name field...');
      const bm25Result = await WeaviateClient.graphql
        .get()
        .withClassName('CompanyEthics')
        .withBm25({ 
          query: companyName,
          properties: ['name'] // Search only in the name field
        })
        .withFields('name description ethicalScore scoreRationale goodImpactArticles { description url date } badImpactArticles { description url date }')
        .withLimit(5)
        .do();
      
      const bm25Companies = bm25Result?.data?.Get?.CompanyEthics;
      if (bm25Companies && bm25Companies.length > 0) {
        console.log(`✅ Found ${bm25Companies.length} matches with BM25 name search`);
        return bm25Companies[0] as CompanyEthics;
      }
    } catch (bm25Error) {
      console.error('BM25 name search failed:', bm25Error);
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
      .withFields('name description ethicalScore')
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
        scoreRationale: companyData.scoreRationale,
        goodImpactArticles: companyData.goodImpactArticles || [],
        badImpactArticles: companyData.badImpactArticles || [],
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
        scoreRationale: companyData.scoreRationale,
        goodImpactArticles: companyData.goodImpactArticles || [],
        badImpactArticles: companyData.badImpactArticles || [],
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

// Use only Weaviate fuzzy search
const searchCompanyByName = async (companyName: string): Promise<CompanyEthics | null> => {
  return await findCompanyByNameFuzzy(companyName);
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
