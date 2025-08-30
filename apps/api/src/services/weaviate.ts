import WeaviateClient from '../clients/weaviateClient';
import { CompanyEthics } from '../types/company-ethics';

const weaviate = async () => {
  await WeaviateClient.schema
    .classCreator()
    .withClass({
      class: 'CompanyEthics',
      description:
        'Morality audits of companies with short description, an ethical score, and supporting research links.',
      properties: [
        { name: 'name', dataType: ['text'] },
        { name: 'description', dataType: ['text'] },
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
      .withFields('name description ethicalScore usefulLinks { ... on CompanyEthics { description url } }')
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
} as const;
