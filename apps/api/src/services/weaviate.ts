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

const storeCompanyEthics = async (companyData: CompanyEthics): Promise<{ id: string; success: boolean }> => {
  try {
    console.log('Storing company ethics data in Weaviate:');
    console.log(JSON.stringify(companyData, null, 2));
    
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
    
    console.log('Successfully stored in Weaviate with ID:', result.id);
    
    return {
      id: result.id,
      success: true,
    };
  } catch (error) {
    console.error('Failed to store company ethics in Weaviate:', error);
    throw new Error(`Weaviate storage failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const weaviateService = {
  weaviate,
  storeCompanyEthics,
} as const;
