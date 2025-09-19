import weaviate from 'weaviate-ts-client';

const client = weaviate.client({
  scheme: 'https',
  host: 'xyxahx3qiojl1twyhpiuq.c0.europe-west3.gcp.weaviate.cloud',
  apiKey: new weaviate.ApiKey(process.env?.WEAVIATE_API_KEY || ''),
  headers: {
    'X-OpenAI-Api-Key': process.env.OPENAI_API_KEY || '',
  },
});

export default client;
