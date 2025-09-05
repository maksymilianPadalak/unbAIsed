export type UsefulLink = {
  description: string;
  url: string;
  date?: string;
};

export type CompanyEthics = {
  name: string;
  description: string;
  ethicalScore: number;
  reasoning?: string;
  goodImpactArticles?: UsefulLink[];
  badImpactArticles?: UsefulLink[];
};
