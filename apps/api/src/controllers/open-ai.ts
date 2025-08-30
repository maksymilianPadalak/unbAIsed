/**
 * OpenAI Controller
 * Functional programming approach for handling OpenAI requests
 */

import { Request, Response } from 'express';
import { openAiService } from '../services/open-ai';

export const handleOpenAiRequest = async (req: Request, res: Response) => {
  try {
    // Validate request body
    if (!req.body || typeof req.body !== 'object') {
      return res
        .status(400)
        .json({ error: 'Request body must be a valid JSON object' });
    }

    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res
        .status(400)
        .json({ error: 'Prompt is required and must be a string' });
    }

    const result = await openAiService.getHelloMessage(prompt);
    
    // Log the result to console as well
    console.log('Controller received parsed result:');
    console.log(result);
    
    res.json(result);
  } catch (error) {
    console.error('Controller Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const openAiController = {
  handleOpenAiRequest,
} as const;
