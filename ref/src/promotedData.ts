import { TokenItem } from './types';

export const PROMOTED_TOKENS: TokenItem[] = [
  // 1. NEW TECH PROJECTS
  {
    id: 'aether-net',
    name: 'AetherNet',
    symbol: 'AETH',
    description: 'Sovereign quantum cryptographic network protocol',
    scoreType: 'active',
    // scoreValue is undefined for promoted (no score number)
    chain: 'Ethereum',
    chainIconName: 'Zap',
    time: 'today',
    tags: ['Security', 'Quantum'],
    category: 'new-tech-projects',
    isPromoted: true,
    volume24h: '$4.1M',
    backing: 'a16z Crypto, StarkWare',
    riskScore: 'LOW',
    curatorInsight: 'A leading-edge cryptographic transport network built to protect high-density transactional state against quantum-computational attacks.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://aethernet.io'
    }
  },
  // 2. NEW MEME COINS
  {
    id: 'silly-sloth',
    name: 'SillySloth',
    symbol: 'SLOTH',
    description: 'Super slow chill animal vibes mascot',
    scoreType: 'active',
    chain: 'Solana',
    chainIconName: 'Flame',
    time: 'today',
    tags: ['Meme', 'Sloth'],
    category: 'new-meme-coins',
    isPromoted: true,
    volume24h: '$850K',
    backing: 'Community Launched',
    riskScore: 'MEDIUM',
    curatorInsight: 'The absolute chillest mascot in Solana. Driven completely by decentralized organic distribution channels and fair launched pools.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://sillysloth.club'
    }
  },
  // 3. LATEST RWA TOKENS
  {
    id: 'paris-land',
    name: 'ParisLand',
    symbol: 'PLAND',
    description: 'Tokenized modern real estate prime districts',
    scoreType: 'active',
    chain: 'Base',
    chainIconName: 'Layers',
    time: 'today',
    tags: ['RealEstate', 'Paris'],
    category: 'latest-rwa-tokens',
    isPromoted: true,
    volume24h: '$6.5M',
    backing: 'Blackstone, PropTech Partners',
    riskScore: 'LOW',
    curatorInsight: 'Fully fractionalized premium residential properties situated in central Paris. Handled under legal SPV structures with quarterly dividend payouts.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://parisland.rwa'
    }
  },
  // 4. UPCOMING PRESALE
  {
    id: 'vortex-dex',
    name: 'VortexDEX',
    symbol: 'VORTEX',
    description: 'Multi-chain zero knowledge oracle liquidity engine',
    scoreType: 'active',
    chain: 'Arbitrum',
    chainIconName: 'Cpu',
    time: 'today',
    tags: ['Presale'],
    category: 'upcoming-presale',
    isPromoted: true,
    volume24h: 'Presale',
    backing: 'Binance Labs, Delphi Digital',
    riskScore: 'LOW',
    curatorInsight: 'An advanced zero-knowledge scaling swap platform with sub-second order calculations and unified liquidity aggregation networks.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://vortexdex.io'
    }
  }
];
