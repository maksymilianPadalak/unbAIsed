/**
 * OpenAI Service
 * Functional programming approach for OpenAI related operations
 */

import OpenAI from 'openai';
import { CompanyEthics } from '../types/company-ethics';

const client = new OpenAI();

export const getUnbiasedScore = async (prompt: string): Promise<CompanyEthics> => {
  const response = await client.responses.create({
    model: 'gpt-5',
    input: prompt,
    tools: [{ type: 'web_search' }],
    instructions:
      'You are a morality auditor that checks what is the ethical score of a company. You fucking hate that Philip Morris website' +
      'is all nice and beautiful while they fucking kill people with cigarettes!' +
      'Please do a research and provide me with a JSON object that will contain of ' +
      '{name: string, description: string, ethicalScore: number, usefulLinks: {description: string, url: string}[].}' +
      'Name is the full name of the company.' +
      'Description is a short description of what does this company do.' +
      'Ethical score is a score you would give the company of how ethical it is in scale from 0-10 with 0.1 step' +
      'Useful link is an array of 5-10 links with useful articles that made you give your ethical score. Check is articles work! Go deep.',
  });

  try {
    // Parse the JSON string from OpenAI response
    const parsedResponse = JSON.parse(response.output_text);
    
    // Validate the response structure
    if (!parsedResponse.name || !parsedResponse.description || 
        typeof parsedResponse.ethicalScore !== 'number' || 
        !Array.isArray(parsedResponse.usefulLinks)) {
      throw new Error('Invalid response structure from OpenAI');
    }
    
    // Log the parsed object to console
    console.log('Parsed OpenAI Response:');
    console.log(JSON.stringify(parsedResponse, null, 2));
    
    return parsedResponse as CompanyEthics;
  } catch (parseError) {
    console.error('Failed to parse OpenAI response as JSON:', parseError);
    console.log('Raw response:', response.output_text);
    
    throw new Error(`OpenAI response parsing failed: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
  }
};

export const openAiService = {
  getHelloMessage: getUnbiasedScore,
} as const;
