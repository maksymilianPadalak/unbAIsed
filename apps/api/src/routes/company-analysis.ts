/**
 * Company Analysis Routes
 * Routes for analyzing companies and storing results in Weaviate
 */

import { Router } from 'express';
import { companyAnalysisController } from '../controllers/company-analysis';

export const createCompanyAnalysisRouter = (): Router => {
  const router = Router();

  // POST /api/company-analysis/analyze - Analyze single company and store in Weaviate (may create duplicates)
  router.post('/analyze', companyAnalysisController.analyzeAndStoreCompany);
  
  // POST /api/company-analysis/upsert - Analyze single company and upsert (update if exists, create if not)
  router.post('/upsert', companyAnalysisController.upsertCompanyAnalysis);
  
  // POST /api/company-analysis/batch - Analyze multiple companies with upsert (no duplicates)
  router.post('/batch', companyAnalysisController.upsertBatchCompanies);

  return router;
};

export const companyAnalysisRouter = createCompanyAnalysisRouter();
