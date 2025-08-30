/**
 * OpenAI Service
 * Functional programming approach for OpenAI related operations
 */

import OpenAI from 'openai';

const client = new OpenAI();

export const getUnbiasedScore = async (prompt: string): Promise<any> => {
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
    
    // Log the parsed object to console
    console.log('Parsed OpenAI Response:');
    console.log(JSON.stringify(parsedResponse, null, 2));
    
    return parsedResponse;
  } catch (parseError) {
    console.error('Failed to parse OpenAI response as JSON:', parseError);
    console.log('Raw response:', response.output_text);
    
    // Return the raw text if parsing fails
    return { error: 'Failed to parse response', rawResponse: response.output_text };
  }
};

export const openAiService = {
  getHelloMessage: getUnbiasedScore,
} as const;
