import WeaviateClient from '../clients/weaviateClient';
import { CompanyEthics } from '../types/company-ethics';

const weaviate = async () => {
  await WeaviateClient.schema
    .classCreator()
    .withClass({
      class: 'CompanyEthics',
      description:
        'Morality audits of companies with short description, an ethical score, and supporting research links.',
      vectorizer: 'text2vec-openai', // Enable OpenAI vectorization
      moduleConfig: {
        'text2vec-openai': {
          model: 'text-embedding-ada-002',
          modelVersion: '002',
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

const getAllCompanies = async (): Promise<any[]> => {
  try {
    console.log(`📋 Getting all companies to debug`);
    
    const result = await WeaviateClient.graphql
      .get()
      .withClassName('CompanyEthics')
      .withFields('name description ethicalScore usefulLinks { description url }')
      .withLimit(10)
      .do();
    
    console.log('Raw Weaviate result:', JSON.stringify(result, null, 2));
    const companies = result?.data?.Get?.CompanyEthics || [];
    console.log(`📊 Found ${companies.length} total companies`);
    return companies;
  } catch (error) {
    console.error('Error getting all companies:', error);
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

export const weaviateService = {
  weaviate,
  storeCompanyEthics,
  upsertCompanyEthics,
  findCompanyByName,
  findCompanyByNameFuzzy,
} as const;
