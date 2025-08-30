/**
 * OpenAI Routes
 * Functional programming approach for OpenAI route definitions
 */

import { Router } from 'express';
import { weaviateController } from '../controllers/weaviate';

export const createWeaviateRouter = (): Router => {
  const router = Router();

  router.get('/', weaviateController.handleWeaviateRequest);

  return router;
};

export const weaviateRouter = createWeaviateRouter();
