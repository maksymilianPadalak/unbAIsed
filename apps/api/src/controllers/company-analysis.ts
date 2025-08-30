/**
 * Company Analysis Controller
 * Handles requests to analyze companies using OpenAI and store results in Weaviate
 */

import { Request, Response } from 'express';
import { openAiService } from '../services/open-ai';
import { weaviateService } from '../services/weaviate';
import { CompanyEthics } from '../types/company-ethics';

export const analyzeAndStoreCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Validate request body
    if (!req.body || typeof req.body !== 'object') {
      res
        .status(400)
        .json({ error: 'Request body must be a valid JSON object' });
      return;
    }

    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      res
        .status(400)
        .json({ error: 'Prompt is required and must be a string' });
      return;
    }

    console.log(`🔍 Starting analysis for company: "${prompt}"`);

    // Step 1: Get analysis from OpenAI
    let companyEthics: CompanyEthics;
    try {
      companyEthics = await openAiService.getHelloMessage(prompt);
      console.log('✅ OpenAI analysis completed');
    } catch (openAiError) {
      console.error('❌ OpenAI analysis failed:', openAiError);
      res.status(500).json({
        error: 'Failed to analyze company',
        details:
          openAiError instanceof Error
            ? openAiError.message
            : 'Unknown OpenAI error',
      });
      return;
    }

    // Step 2: Store results in Weaviate
    let weaviateResult;
    try {
      weaviateResult = await weaviateService.storeCompanyEthics(companyEthics);
      console.log('✅ Data stored in Weaviate successfully');
    } catch (weaviateError) {
      console.error('❌ Weaviate storage failed:', weaviateError);
      // Still return the OpenAI result even if Weaviate fails
      res.status(207).json({
        warning: 'Analysis completed but storage failed',
        analysis: companyEthics,
        storageError:
          weaviateError instanceof Error
            ? weaviateError.message
            : 'Unknown Weaviate error',
      });
      return;
    }

    // Success: Both OpenAI analysis and Weaviate storage completed
    console.log(
      `🎉 Company analysis pipeline completed for: ${companyEthics.name}`
    );

    res.json({
      success: true,
      analysis: companyEthics,
      storage: weaviateResult,
      message: `Successfully analyzed and stored ethics data for ${companyEthics.name}`,
    });
  } catch (error) {
    console.error('💥 Unexpected error in company analysis pipeline:', error);
    res.status(500).json({
      error: 'Internal server error in analysis pipeline',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};


export const upsertCompanyAnalysis = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Validate request body
    if (!req.body || typeof req.body !== 'object') {
      res
        .status(400)
        .json({ error: 'Request body must be a valid JSON object' });
      return;
    }

    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      res
        .status(400)
        .json({ error: 'Prompt is required and must be a string' });
      return;
    }

    console.log(`🔄 Starting upsert analysis for company: "${prompt}"`);

    // Step 1: Check if company already exists
    const existingCompany = await weaviateService.findCompanyByName(prompt);
    const isUpdate = !!existingCompany;

    console.log(
      isUpdate
        ? `📝 Company exists, will update: ${prompt}`
        : `➕ New company, will create: ${prompt}`
    );

    // Step 2: Get analysis from OpenAI
    let companyEthics: CompanyEthics;
    try {
      companyEthics = await openAiService.getHelloMessage(prompt);
      console.log('✅ OpenAI analysis completed');
    } catch (openAiError) {
      console.error('❌ OpenAI analysis failed:', openAiError);
      res.status(500).json({
        error: 'Failed to analyze company',
        details:
          openAiError instanceof Error
            ? openAiError.message
            : 'Unknown OpenAI error',
      });
      return;
    }

    // Step 3: Upsert in Weaviate
    let weaviateResult;
    try {
      weaviateResult = await weaviateService.upsertCompanyEthics(companyEthics);
      console.log(
        `✅ Data ${weaviateResult.updated ? 'updated' : 'created'} in Weaviate successfully`
      );
    } catch (weaviateError) {
      console.error('❌ Weaviate upsert failed:', weaviateError);
      res.status(207).json({
        warning: 'Analysis completed but storage failed',
        analysis: companyEthics,
        storageError:
          weaviateError instanceof Error
            ? weaviateError.message
            : 'Unknown Weaviate error',
      });
      return;
    }

    // Success: Both OpenAI analysis and Weaviate upsert completed
    const action = weaviateResult.updated ? 'updated' : 'created';
    console.log(
      `🎉 Company analysis pipeline completed for: ${companyEthics.name} (${action})`
    );

    res.json({
      success: true,
      action, // 'created' or 'updated'
      wasExisting: isUpdate,
      analysis: companyEthics,
      storage: weaviateResult,
      message: `Successfully analyzed and ${action} ethics data for ${companyEthics.name}`,
    });
  } catch (error) {
    console.error('💥 Unexpected error in upsert analysis pipeline:', error);
    res.status(500).json({
      error: 'Internal server error in upsert analysis pipeline',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const upsertBatchCompanies = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Validate request body
    if (!req.body || typeof req.body !== 'object') {
      res
        .status(400)
        .json({ error: 'Request body must be a valid JSON object' });
      return;
    }

    const { companies } = req.body;

    if (!companies || !Array.isArray(companies)) {
      res.status(400).json({ error: 'Companies must be an array of strings' });
      return;
    }

    if (companies.length === 0) {
      res.status(400).json({ error: 'Companies array cannot be empty' });
      return;
    }

    // Validate each company is a string
    const invalidCompanies = companies.filter(
      (company) => typeof company !== 'string'
    );
    if (invalidCompanies.length > 0) {
      res.status(400).json({ error: 'All companies must be strings' });
      return;
    }

    console.log(
      `🚀 Starting batch upsert analysis for ${companies.length} companies:`,
      companies
    );

    // Create analysis promises for all companies
    const analysisPromises = companies.map(async (company: string) => {
      try {
        console.log(`🔄 Processing: ${company}`);

        // Check if company exists
        const existingCompany =
          await weaviateService.findCompanyByName(company);
        const wasExisting = !!existingCompany;

        // Get analysis from OpenAI
        const companyEthics = await openAiService.getHelloMessage(company);
        console.log(`✅ OpenAI analysis completed for: ${company}`);

        // Upsert in Weaviate
        const weaviateResult =
          await weaviateService.upsertCompanyEthics(companyEthics);
        const action = weaviateResult.updated ? 'updated' : 'created';
        console.log(`✅ ${action} in Weaviate: ${company}`);

        return {
          company,
          status: 'success',
          action,
          wasExisting,
          analysis: companyEthics,
          storage: weaviateResult,
        };
      } catch (error) {
        console.error(`❌ Failed to process ${company}:`, error);
        return {
          company,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    });

    // Execute all analyses concurrently
    console.log('⚡ Running concurrent upsert analysis using Promise.all...');
    const startTime = Date.now();

    const results = await Promise.all(analysisPromises);

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    // Separate and count results
    const successful = results.filter((result) => result.status === 'success');
    const failed = results.filter((result) => result.status === 'error');
    const created = successful.filter((result) => result.action === 'created');
    const updated = successful.filter((result) => result.action === 'updated');

    console.log(
      `🎉 Batch upsert analysis completed in ${duration}s - Created: ${created.length}, Updated: ${updated.length}, Failed: ${failed.length}`
    );

    // Return comprehensive results
    res.json({
      success: true,
      totalProcessed: companies.length,
      createdCount: created.length,
      updatedCount: updated.length,
      failureCount: failed.length,
      duration: `${duration}s`,
      summary: {
        created: created.map((r) => r.company),
        updated: updated.map((r) => r.company),
        failed: failed.map((r) => r.company),
      },
      results: {
        successful,
        failed,
      },
      message: `Processed ${companies.length} companies in ${duration}s - ${created.length} created, ${updated.length} updated, ${failed.length} failed`,
    });
  } catch (error) {
    console.error(
      '💥 Unexpected error in batch upsert analysis pipeline:',
      error
    );
    res.status(500).json({
      error: 'Internal server error in batch upsert analysis pipeline',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const companyAnalysisController = {
  analyzeAndStoreCompany,
  upsertCompanyAnalysis,
  upsertBatchCompanies,
} as const;
