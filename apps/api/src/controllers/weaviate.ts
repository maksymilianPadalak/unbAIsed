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

export const handleCompanySearch = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name: companyName } = req.body;
    
    if (!companyName || typeof companyName !== 'string' || companyName.trim() === '') {
      res.status(400).json({ 
        error: 'Company name is required in request body',
        found: false 
      });
      return;
    }

    console.log(`🔍 Searching for company: ${companyName}`);
    
    const company = await weaviateService.findCompanyByNameFuzzy(companyName.trim());
    
    if (company) {
      res.json({
        found: true,
        data: company,
        searchTerm: companyName
      });
    } else {
      res.status(404).json({
        found: false,
        message: `No company ethics data found for "${companyName}"`,
        searchTerm: companyName
      });
    }
  } catch (error) {
    console.error('Company search error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      found: false
    });
  }
};

export const weaviateController = {
  handleWeaviateRequest,
  handleCompanySearch,
} as const;
