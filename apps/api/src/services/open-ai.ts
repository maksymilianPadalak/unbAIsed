/**
 * OpenAI Service
 * Functional programming approach for OpenAI related operations
 */

import OpenAI from 'openai';

const client = new OpenAI();

export const getHelloMessage = async (): Promise<string> => {
  const response = await client.responses.create({
    model: 'gpt-5',
    input: 'Write a one-sentence bedtime story about Paris.',
  });

  return response.output_text;
};

export const openAiService = {
  getHelloMessage,
} as const;
