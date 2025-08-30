import weaviate from 'weaviate-ts-client';

const client = weaviate.client({
  scheme: 'https', // always https for sandbox
  host: 'sxxexhf1t0gged4nutoktw.c0.europe-west3.gcp.weaviate.cloud',
  apiKey: new weaviate.ApiKey(process.env?.WEAVIATE_API_KEY || ''),
});

export default client;
