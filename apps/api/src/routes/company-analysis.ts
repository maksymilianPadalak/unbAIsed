/**
 * Company Analysis Routes
 * Routes for analyzing companies and storing results in Weaviate
 */

import { Router } from 'express';
import { companyAnalysisController } from '../controllers/company-analysis';

export const createCompanyAnalysisRouter = (): Router => {
  const router = Router();

  // POST /api/company-analysis/analyze - Analyze single company and store in Weaviate
  router.post('/analyze', companyAnalysisController.analyzeAndStoreCompany);
  
  // POST /api/company-analysis/batch - Analyze multiple companies concurrently
  router.post('/batch', companyAnalysisController.analyzeBatchCompanies);

  return router;
};

export const companyAnalysisRouter = createCompanyAnalysisRouter();
