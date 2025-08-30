/**
 * OpenAI Controller
 * Functional programming approach for handling OpenAI requests
 */

import { Request, Response } from 'express';
import { openAiService } from '../services/open-ai';

export const handleOpenAiRequest = (req: Request, res: Response): void => {
  const message = openAiService.getHelloMessage();
  res.json({ message });
};

export const openAiController = {
  handleOpenAiRequest,
} as const;
