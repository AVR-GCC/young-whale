export type SonarScoreType = 'active' | 'perfect' | 'expired';

export interface ChainInfo {
  name: string;
  icon: string; // we can use lucide icon string or custom path
  color: string;
}

export interface TokenItem {
  id: string;
  name: string;
  symbol?: string;
  description: string;
  scoreType: SonarScoreType;
  scoreValue?: number; // 9 for perfect, any number for active, undefined for expired
  chain: string;
  chainIconName: string; // e.g. "coins", "shield" or specific logo representations
  time: string;
  tags: string[];
  category: 'new-tech-projects' | 'new-meme-coins' | 'latest-rwa-tokens' | 'upcoming-presale';
  isPromoted?: boolean;
  volume24h?: string;
  backing?: string;
  riskScore?: 'LOW' | 'MEDIUM' | 'HIGH';
  curatorInsight?: string;
  socials?: {
    twitter?: string;
    website?: string;
    telegram?: string;
    github?: string;
  };
}

export interface StatsInfo {
  totalSecured: string;
  signalsActive: number;
  oceanStatus: string;
}
