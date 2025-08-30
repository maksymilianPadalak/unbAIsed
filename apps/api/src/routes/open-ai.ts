/**
 * OpenAI Routes
 * Functional programming approach for OpenAI route definitions
 */

import { Router } from 'express';
import { openAiController } from '../controllers/open-ai';

export const createOpenAiRouter = (): Router => {
  const router = Router();

  router.post('/', openAiController.handleOpenAiRequest);

  return router;
};

export const openAiRouter = createOpenAiRouter();
