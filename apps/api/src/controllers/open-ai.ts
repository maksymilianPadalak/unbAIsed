/**
 * OpenAI Controller
 * Functional programming approach for handling OpenAI requests
 */

import { Request, Response } from 'express';
import { openAiService } from '../services/open-ai';

export const handleOpenAiRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const message = await openAiService.getHelloMessage();
    res.json({ message });
  } catch (error) {
    console.error('Controller Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const openAiController = {
  handleOpenAiRequest,
} as const;
