/**
 * OpenAI Service
 * Functional programming approach for OpenAI related operations
 */

export const getHelloMessage = (): string => {
  return "Hello!";
};

export const openAiService = {
  getHelloMessage,
} as const;
