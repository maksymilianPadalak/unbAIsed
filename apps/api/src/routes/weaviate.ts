/**
 * OpenAI Routes
 * Functional programming approach for OpenAI route definitions
 */

import { Router } from 'express';
import { weaviateController } from '../controllers/weaviate';

export const createWeaviateRouter = (): Router => {
  const router = Router();

  router.get('/', weaviateController.handleWeaviateRequest);
  router.get('/companies', weaviateController.handleGetAllCompanies);
  router.get('/companies/selected', weaviateController.handleGetSelectedCompanies);
  router.post('/search', weaviateController.handleCompanySearch);
  router.post('/research-requests', weaviateController.handleCreateResearchRequest);

  return router;
};

export const weaviateRouter = createWeaviateRouter();
