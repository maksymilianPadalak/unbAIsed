/**
 * OpenAI Controller
 * Functional programming approach for handling OpenAI requests
 */

import { Request, Response } from 'express';
import { weaviateService } from '../services/weaviate';

export const handleWeaviateRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const message = await weaviateService.weaviate();
    res.json({ message });
  } catch (error) {
    console.error('Controller Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const weaviateController = {
  handleWeaviateRequest,
} as const;
