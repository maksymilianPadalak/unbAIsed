import OpenAI from 'openai';
import { CompanyEthics, UsefulLink } from '../types/company-ethics';

const client = new OpenAI();

export const getUnbiasedScore = async (
  prompt: string
): Promise<CompanyEthics> => {
  const instructions = [
    'You are an ethical analysis assistant. The user input contains a company name to analyze.',
    'Research using web_search and examine up to 20 credible, independent sources.',
    'If fewer relevant sources exist, include only what you actually find. Do NOT fabricate facts or sources.',
    'Return ONLY a single JSON object with the exact shape:',
    '{',
    '  "name": string,',
    '  "description": string,',
    '  "ethicalScore": number, // value from 0.0 to 10.0, in 0.1 increments',
    '  "scoreRationale": string, // concise paragraph explaining what raised and lowered the score; reference sources inline if helpful',
    '  "goodImpactArticles": { "description": string, "url": string, "date"?: string }[],',
    '  "badImpactArticles": { "description": string, "url": string, "date"?: string }[],',
    '}',
    'Guidelines:',
    '- Classify sources as goodImpactArticles (evidence of positive/ethical behavior) or badImpactArticles (evidence of negative/unethical behavior).',
    '- For each source, add a short description. If available, include the publication date (ISO or YYYY-MM-DD).',
    '- Include at most 20 total sources across good and bad articles; skip dead or inaccessible links.',
    '- The description should describe what the company does, neutrally. No links!',
    '- The scoreRationale must mention both the positive drivers and the strongest drivers of the score.',
    '- Output strictly valid JSON. Do NOT include markdown, commentary, or extra text.',
  ].join('\n');

  const response = await client.responses.create({
    model: 'gpt-5',
    input: prompt,
    tools: [{ type: 'web_search' }],
    instructions,
  });

  try {
    const parsed = JSON.parse(response.output_text || '{}');

    if (
      !parsed.name ||
      !parsed.description ||
      typeof parsed.ethicalScore !== 'number'
    ) {
      throw new Error(
        'Invalid response structure from OpenAI: missing required fields'
      );
    }

    const good: UsefulLink[] = Array.isArray(parsed.goodImpactArticles)
      ? parsed.goodImpactArticles
      : [];
    const bad: UsefulLink[] = Array.isArray(parsed.badImpactArticles)
      ? parsed.badImpactArticles
      : [];

    const normalizeLink = (l: any): UsefulLink | null => {
      if (!l || typeof l !== 'object') return null;
      if (typeof l.url !== 'string' || typeof l.description !== 'string')
        return null;
      const link: UsefulLink = { description: l.description, url: l.url };
      if (typeof l.date === 'string') link.date = l.date;
      return link;
    };

    const goodNorm = good.map(normalizeLink).filter(Boolean) as UsefulLink[];
    const badNorm = bad.map(normalizeLink).filter(Boolean) as UsefulLink[];


    const cap = 20;
    const seen = new Set<string>();
    const dedup = (arr: UsefulLink[]) => arr.filter((l) => {
      if (seen.has(l.url)) return false;
      seen.add(l.url);
      return true;
    });
    const goodDedup = dedup(goodNorm);
    const spaceLeft = Math.max(0, cap - goodDedup.length);
    const badDedup = dedup(badNorm).slice(0, spaceLeft);

    const result: CompanyEthics = {
      name: parsed.name,
      description: parsed.description,
      ethicalScore: parsed.ethicalScore,
      scoreRationale: typeof parsed.scoreRationale === 'string' ? parsed.scoreRationale : undefined,
      goodImpactArticles: goodDedup.slice(0, cap),
      badImpactArticles: badDedup,
    };
    console.log('Parsed OpenAI Response (normalized):');
    console.log(JSON.stringify(result, null, 2));

    return result;
  } catch (parseError) {
    console.error('Failed to parse OpenAI response as JSON:', parseError);
    console.log('Raw response:', response.output_text);

    throw new Error(
      `OpenAI response parsing failed: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`
    );
  }
};

export const openAiService = {
  getHelloMessage: getUnbiasedScore,
} as const;
