export type UsefulLink = {
  description: string;
  url: string;
};

export type CompanyEthics = {
  name: string;
  description: string;
  ethicalScore: number;
  usefulLinks: UsefulLink[];
};
