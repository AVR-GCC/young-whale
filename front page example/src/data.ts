import { TokenItem } from './types';

export const INITIAL_TOKENS: TokenItem[] = [
  // 1. NEW TECH PROJECTS (Top Left)
  {
    id: 'solar-ai',
    name: 'SolarAI',
    symbol: 'SLR',
    description: 'AI-powered renewable energy grid', // 5 words
    scoreType: 'active',
    scoreValue: 8,
    chain: 'Ethereum',
    chainIconName: 'Zap',
    time: 'today',
    tags: ['DeFi', 'AI', 'GreenTech'],
    category: 'new-tech-projects',
    volume24h: '$3.2M',
    backing: 'Coinbase Ventures, Paradigm',
    riskScore: 'LOW',
    curatorInsight: 'A breakthrough decentralized network that optimizes clean energy distribution across grids. Uses smart contract routers to allocate solar energy directly.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://solarai.io',
      telegram: 'https://t.me'
    }
  },
  {
    id: 'zora-net',
    name: 'ZoraNet',
    symbol: 'ZORA',
    description: 'Decentralized optical compute layout network', // 5 words
    scoreType: 'active',
    scoreValue: 7,
    chain: 'Base',
    chainIconName: 'Layers',
    time: 'today',
    tags: ['Compute', 'L2'],
    category: 'new-tech-projects',
    volume24h: '$1.4M',
    backing: 'Base Ecosystem Fund',
    riskScore: 'MEDIUM',
    curatorInsight: 'Optical-based computing networks processing sub-millisecond AI intelligence tasks natively on-chain.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://zoranet.io'
    }
  },
  {
    id: 'hyper-state',
    name: 'HyperState',
    symbol: 'HSTATE',
    description: 'Peta-scale state storage storage engine', // 5 words
    scoreType: 'perfect', // PERFECT 9
    scoreValue: 9,
    chain: 'Solana',
    chainIconName: 'Flame',
    time: 'today',
    tags: ['Database', 'Solana'],
    category: 'new-tech-projects',
    volume24h: '$8.9M',
    backing: 'Solana Ventures, Multicoin',
    riskScore: 'LOW',
    curatorInsight: 'A high-efficiency storage system running at raw memory speed. Standard hardware nodes scale easily to sustain maximum transactions.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://hyperstate.db'
    }
  },
  {
    id: 'vectra-db',
    name: 'VectraDB',
    symbol: 'VECT',
    description: 'On-chain high velocity vector network', // 5 words
    scoreType: 'active',
    scoreValue: 6,
    chain: 'Arbitrum',
    chainIconName: 'Cpu',
    time: 'today',
    tags: ['Database', 'Neural'],
    category: 'new-tech-projects',
    volume24h: '$2.1M',
    backing: 'Pantera Capital',
    riskScore: 'HIGH',
    curatorInsight: 'Provides specialized mathematical storage vectors designed specifically for decentralized search engines and models on Arbitrum.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://vectradb.ai'
    }
  },
  {
    id: 'omni-chain',
    name: 'OmniChain',
    symbol: 'OMNI',
    description: 'Zero latency secure network router', // 5 words
    scoreType: 'expired', // EXPIRED SCORE
    chain: 'Optimism',
    chainIconName: 'ShieldAlert',
    time: 'yesterday',
    tags: ['L2', 'Bridge'],
    category: 'new-tech-projects',
    volume24h: 'Expired',
    backing: 'Optimism Foundation',
    riskScore: 'MEDIUM',
    curatorInsight: 'Highly integrated zero-latency bridging tunnels. The initial bootstrapping pool is now fully utilized and closed.',
    socials: {
      twitter: 'https://twitter.com'
    }
  },

  // 2. NEW MEME COINS (Top Right)
  {
    id: 'turbo-frog',
    name: 'TurboFrog',
    symbol: 'TFROG',
    description: 'Fastest meme on Solana speedway', // 5 words
    scoreType: 'active',
    scoreValue: 8,
    chain: 'Solana',
    chainIconName: 'Flame',
    time: 'today',
    tags: ['Meme', 'Solana'],
    category: 'new-meme-coins',
    volume24h: '$14.2M',
    backing: 'Organic community, Raydium syndicates',
    riskScore: 'HIGH',
    curatorInsight: 'Extremely high-momentum meme representing a stylized mechanical frog racing on futuristic vaporwave tracks.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://turbofrog.io'
    }
  },
  {
    id: 'doge-vibe',
    name: 'DogeVibe',
    symbol: 'DVIBE',
    description: 'Retro internet dog culture symbol', // 5 words
    scoreType: 'active',
    scoreValue: 7,
    chain: 'Base',
    chainIconName: 'Layers',
    time: 'today',
    tags: ['Meme', 'Base'],
    category: 'new-meme-coins',
    volume24h: '$5.6M',
    backing: 'Base community supporters',
    riskScore: 'HIGH',
    curatorInsight: 'A stylish 8-bit rendition of doge culture, highly optimized for custom frames on base-native platforms.',
    socials: {
      twitter: 'https://twitter.com',
      telegram: 'https://t.me'
    }
  },
  {
    id: 'pepe-x',
    name: 'PepeX',
    symbol: 'PEPE',
    description: 'Next evolution hyper-deflationary cartoon coin', // 5 words
    scoreType: 'perfect', // THE PERFECT 9 (AMBER)
    scoreValue: 9,
    chain: 'Ethereum',
    chainIconName: 'Zap',
    time: 'today',
    tags: ['Comic', 'Meme'],
    category: 'new-meme-coins',
    volume24h: '$25.1M',
    backing: 'Whale group consensus',
    riskScore: 'MEDIUM',
    curatorInsight: 'PepeX merges retro cartoon artwork with a modern hyper-burn mechanics system where 2.5% of random transactions are automatically returned to stakers.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://pepex.io'
    }
  },
  {
    id: 'wif-cap',
    name: 'WIFCap',
    symbol: 'WIF',
    description: 'Knitted visual pink hat protocol', // 5 words
    scoreType: 'active',
    scoreValue: 5,
    chain: 'Base',
    chainIconName: 'Layers',
    time: 'today',
    tags: ['Meme', 'Base'],
    category: 'new-meme-coins',
    volume24h: '$900K',
    backing: 'Decentralized collective',
    riskScore: 'HIGH',
    curatorInsight: 'Representing a virtual knitted winter cap on retro avatars. Absolute community-led momentum.',
    socials: {
      twitter: 'https://twitter.com'
    }
  },
  {
    id: 'giga-cat',
    name: 'GigaCat',
    symbol: 'GCAT',
    description: 'Hypermasculine stray feline community coin', // 5 words
    scoreType: 'expired', // EXPIRED SCORE
    chain: 'Solana',
    chainIconName: 'Flame',
    time: 'yesterday',
    tags: ['Cat', 'Solana'],
    category: 'new-meme-coins',
    volume24h: 'Expired',
    backing: 'Solana meme collective',
    riskScore: 'HIGH',
    curatorInsight: 'The viral cyber-cat model signal was turned off after 500x capital saturation, but secondary DEX pools remain incredibly liquid.',
    socials: {
      twitter: 'https://twitter.com'
    }
  },

  // 3. LATEST RWA TOKENS (Bottom Left)
  {
    id: 'aero-dex',
    name: 'AeroDEX',
    symbol: 'AERO',
    description: 'Institutional fractionated private credit pool', // 5 words
    scoreType: 'perfect', // THE PERFECT 9 (AMBER)
    scoreValue: 9,
    chain: 'Solana',
    chainIconName: 'Flame',
    time: 'today',
    tags: ['DeFi', 'Solana', 'RWA'],
    category: 'latest-rwa-tokens',
    volume24h: '$12.4M',
    backing: 'Solana Ventures, Multicoin',
    riskScore: 'LOW',
    curatorInsight: 'The absolute prime token on today\'s sonar dashboard. AeroDEX delivers high-velocity fractional trade matching for institutional RWAs with instant settled pools.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://aerodex.io',
      telegram: 'https://t.me'
    }
  },
  {
    id: 'prime-gold',
    name: 'PrimeGold',
    symbol: 'GOLD',
    description: 'Sovereign vaulted gold bullion standard', // 5 words
    scoreType: 'active',
    scoreValue: 8,
    chain: 'Ethereum',
    chainIconName: 'Zap',
    time: 'today',
    tags: ['Gold', 'RWA'],
    category: 'latest-rwa-tokens',
    volume24h: '$6.5M',
    backing: 'London Bullion Syndicates, PaxosPartner',
    riskScore: 'LOW',
    curatorInsight: 'Direct representation of audited physical gold bars stored in Zurich military-grade mountain vaults. Each token corresponds to exactly 1 gram of physical fine gold.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://primegold.io'
    }
  },
  {
    id: 'metroz-estate',
    name: 'MetrozEstate',
    symbol: 'METR',
    description: 'Tokenized premium metropolitan rental yields', // 5 words
    scoreType: 'active',
    scoreValue: 7,
    chain: 'Base',
    chainIconName: 'Layers',
    time: 'today',
    tags: ['RealEstate', 'Base'],
    category: 'latest-rwa-tokens',
    volume24h: '$1.1M',
    backing: 'Veloce Real Estate Trust',
    riskScore: 'MEDIUM',
    curatorInsight: 'Rent revenue streams generated from prime office towers in Singapore are aggregated and distributed daily to token addresses via stablecoin.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://metrozestate.co'
    }
  },
  {
    id: 'treasury-on',
    name: 'TreasuryOn',
    symbol: 'TRES',
    description: 'Yield-bearing short term treasury vaults', // 5 words
    scoreType: 'active',
    scoreValue: 8,
    chain: 'Ethereum',
    chainIconName: 'Zap',
    time: 'today',
    tags: ['Treasury', 'yield'],
    category: 'latest-rwa-tokens',
    volume24h: '$45.0M',
    backing: 'Blackstone Seed & Apex partners',
    riskScore: 'LOW',
    curatorInsight: 'Provides liquid on-chain exposure to actual short-term US Treasury bonds, offering structural compliance and regular yields directly to smart contract portfolios.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://treasuryon.capital'
    }
  },
  {
    id: 'boreal-wood',
    name: 'BorealWood',
    symbol: 'WOOD',
    description: 'Tokenized carbon offsets from boreal forest', // 6 words
    scoreType: 'expired', // EXPIRED SCORE
    chain: 'Arbitrum',
    chainIconName: 'Cpu',
    time: 'yesterday',
    tags: ['ESG', 'Carbon'],
    category: 'latest-rwa-tokens',
    volume24h: 'Expired',
    backing: 'Verra Carbon Registries',
    riskScore: 'MEDIUM',
    curatorInsight: 'Direct offset tracking linked to actual protected acres in British Columbia. Season claims have finalized successfully.',
    socials: {
      twitter: 'https://twitter.com'
    }
  },

  // 4. UPCOMING PRESALES (Bottom Right)
  {
    id: 'nova-pad',
    name: 'NovaPad',
    symbol: 'NOVAP',
    description: 'Multi-chain high tier dynamic launchpad', // 5 words
    scoreType: 'active',
    scoreValue: 7,
    chain: 'Base',
    chainIconName: 'Layers',
    time: 'today',
    tags: ['Launchpad', 'Base'],
    category: 'upcoming-presale',
    volume24h: '$1.8M',
    backing: 'Base Ecosystem Fund',
    riskScore: 'MEDIUM',
    curatorInsight: 'A streamlined, friction-free launchpad on Base that guarantees fair-weight tier allocation. Designed for rapid-fire token deployments.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://novapad.io',
      telegram: 'https://t.me'
    }
  },
  {
    id: 'zero-gas',
    name: 'ZeroGas',
    symbol: 'ZEGAS',
    description: 'Gasless multi-chain smart routing engine', // 5 words
    scoreType: 'active',
    scoreValue: 8,
    chain: 'Optimism',
    chainIconName: 'ShieldAlert',
    time: 'today',
    tags: ['L2', 'Bridge'],
    category: 'upcoming-presale',
    volume24h: '$5.5M',
    backing: 'Optimism Foundation',
    riskScore: 'LOW',
    curatorInsight: 'Provides robust automated multi-chain network relays where the platform subsidizes the base gas natively to eliminate user friction.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://zerogas.network'
    }
  },
  {
    id: 'elysium',
    name: 'Elysium',
    symbol: 'ELY',
    description: 'Sovereign modular transaction layer rollups', // 5 words
    scoreType: 'perfect', // PERFECT 9
    scoreValue: 9,
    chain: 'Ethereum',
    chainIconName: 'Zap',
    time: 'today',
    tags: ['Rollups', 'Modular'],
    category: 'upcoming-presale',
    volume24h: '$9.2M',
    backing: 'Celestia Network Labs',
    riskScore: 'LOW',
    curatorInsight: 'A highly optimized execution environment decoupling security layers from consensus. Offers up to 450,000 throughput processing efficiency.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://elysiumlabs.net'
    }
  },
  {
    id: 'volt-staker',
    name: 'VoltStaker',
    symbol: 'VOLT',
    description: 'High efficiency automated yield optimizer', // 5 words
    scoreType: 'active',
    scoreValue: 6,
    chain: 'Base',
    chainIconName: 'Layers',
    time: 'yesterday',
    tags: ['APY', 'Base'],
    category: 'upcoming-presale',
    volume24h: '$1.2M',
    backing: 'Base Alpha Guilds',
    riskScore: 'MEDIUM',
    curatorInsight: 'Automates yield rebalancing loops on liquidity pools with intelligent neural routers to maximize APY yield without risk of impermanent loss.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://voltstaker.xyz'
    }
  },
  {
    id: 'sentry-node',
    name: 'SentryNode',
    symbol: 'SENTRY',
    description: 'Decentralized automated threat surveillance network', // 5 words
    scoreType: 'expired', // EXPIRED
    chain: 'Arbitrum',
    chainIconName: 'Cpu',
    time: 'yesterday',
    tags: ['DePIN', 'Security'],
    category: 'upcoming-presale',
    volume24h: 'Expired',
    backing: 'Consensys Labs Seed',
    riskScore: 'MEDIUM',
    curatorInsight: 'A massive consensus-guided physical node shield mapping malicious smart contract targets. The seed pool is officially offline.',
    socials: {
      twitter: 'https://twitter.com'
    }
  },

  // ADDED 5 MORE TOKENS FOR: NEW TECH PROJECTS
  {
    id: 'matrix-ai',
    name: 'MatrixAI',
    symbol: 'MTX',
    description: 'Autonomous neural node intelligence client', // 5 words
    scoreType: 'active',
    scoreValue: 8,
    chain: 'Ethereum',
    chainIconName: 'Zap',
    time: 'today',
    tags: ['DeFi', 'AI', 'Computing'],
    category: 'new-tech-projects',
    volume24h: '$4.1M',
    backing: 'Digital Currency Group, NGC',
    riskScore: 'LOW',
    curatorInsight: 'A brilliant multi-agent neural layout engine executing predictive financial liquidity strategies directly on-chain helper targets.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://matrixai.net'
    }
  },
  {
    id: 'quantum-key',
    name: 'QuantumKey',
    symbol: 'QKEY',
    description: 'Post-quantum key structural shield cryptography', // 5 words
    scoreType: 'active',
    scoreValue: 7,
    chain: 'Base',
    chainIconName: 'Layers',
    time: 'today',
    tags: ['Security', 'L2', 'Base'],
    category: 'new-tech-projects',
    volume24h: '$1.9M',
    backing: 'Base Builders Fund',
    riskScore: 'MEDIUM',
    curatorInsight: 'Integrates next-gen cryptographic vectors directly into smart contract validation pipelines, neutralizing quantum computing threats.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://quantumkey.io'
    }
  },
  {
    id: 'helix-mesh',
    name: 'HelixMesh',
    symbol: 'HLX',
    description: 'Decentralized hyper-density high communication nodes', // 5 words
    scoreType: 'active',
    scoreValue: 8,
    chain: 'Solana',
    chainIconName: 'Flame',
    time: 'today',
    tags: ['Mesh', 'DePIN', 'Solana'],
    category: 'new-tech-projects',
    volume24h: '$3.5M',
    backing: 'Solana Mobile Consortium',
    riskScore: 'LOW',
    curatorInsight: 'Holographic hardware relay client aggregating ultra-fast mobile broadband bandwidth across physical hotspot sectors natively.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://helixmesh.net'
    }
  },
  {
    id: 'plasma-node',
    name: 'PlasmaNode',
    symbol: 'PLSM',
    description: 'High pressure transactional state compressor', // 5 words
    scoreType: 'active',
    scoreValue: 6,
    chain: 'Arbitrum',
    chainIconName: 'Cpu',
    time: 'today',
    tags: ['Scaling', 'L2', 'DeFi'],
    category: 'new-tech-projects',
    volume24h: '$1.2M',
    backing: 'Offchain Labs Alpha',
    riskScore: 'HIGH',
    curatorInsight: 'Generates recursive compressed proof clusters, enabling extremely dense gas optimizations for multi-signature transaction chains.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://plasmanode.ai'
    }
  },
  {
    id: 'ether-shutter',
    name: 'EtherShutter',
    symbol: 'SHUT',
    description: 'Modular transaction dark pool protocol', // 5 words
    scoreType: 'expired',
    chain: 'Optimism',
    chainIconName: 'ShieldAlert',
    time: 'yesterday',
    tags: ['Privacy', 'L2', 'DeFi'],
    category: 'new-tech-projects',
    volume24h: 'Expired',
    backing: 'Consensys Grants',
    riskScore: 'MEDIUM',
    curatorInsight: 'Shielded transaction memory pool designed to block frontrunning extractors. Signal offline now that deployment period is finalized.',
    socials: {
      twitter: 'https://twitter.com'
    }
  },

  // ADDED 5 MORE TOKENS FOR: NEW MEME COINS
  {
    id: 'shiba-tron',
    name: 'ShibaTron',
    symbol: 'SHIBT',
    description: 'Futuristic digital dog race mascot', // 5 words
    scoreType: 'active',
    scoreValue: 8,
    chain: 'Solana',
    chainIconName: 'Flame',
    time: 'today',
    tags: ['Meme', 'Solana', 'Tron'],
    category: 'new-meme-coins',
    volume24h: '$10.4M',
    backing: 'Tron Doge Community Syndicate',
    riskScore: 'HIGH',
    curatorInsight: 'Cyberpunk cybernetically enhanced Shiba breeding game. Extreme high socials engagement with explosive transaction activity today.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://shibatron.io'
    }
  },
  {
    id: 'pepe-cloud',
    name: 'PepeCloud',
    symbol: 'PCLOUD',
    description: 'Decentralized meme hosting server client', // 5 words
    scoreType: 'active',
    scoreValue: 7,
    chain: 'Base',
    chainIconName: 'Layers',
    time: 'today',
    tags: ['Meme', 'Cloud', 'Base'],
    category: 'new-meme-coins',
    volume24h: '$4.2M',
    backing: 'Base Viral Incubator',
    riskScore: 'HIGH',
    curatorInsight: 'Combines decentralized cloud storage protocols with meme hosting. Users get paid back in PCLOUD to store frog images.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://pepecloud.net'
    }
  },
  {
    id: 'floki-gpt',
    name: 'FlokiGPT',
    symbol: 'FGPT',
    description: 'AI model trained on dogs', // 5 words
    scoreType: 'active',
    scoreValue: 8,
    chain: 'Ethereum',
    chainIconName: 'Zap',
    time: 'today',
    tags: ['Meme', 'AI', 'Defi'],
    category: 'new-meme-coins',
    volume24h: '$8.3M',
    backing: 'AI Meme Consensus Capital',
    riskScore: 'MEDIUM',
    curatorInsight: 'Generates custom AI cartoon mockups based on classic Floki dog themes. Integrated chat bot responds only in woofs.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://flokigpt.db'
    }
  },
  {
    id: 'bonk-roll',
    name: 'BonkRoll',
    symbol: 'BROLL',
    description: 'Solana retro casino dog coin', // 5 words
    scoreType: 'active',
    scoreValue: 6,
    chain: 'Solana',
    chainIconName: 'Flame',
    time: 'today',
    tags: ['Meme', 'Solana', 'Casino'],
    category: 'new-meme-coins',
    volume24h: '$4.9M',
    backing: 'Solana Casino Collective',
    riskScore: 'HIGH',
    curatorInsight: 'A localized micro-casino layout. The community stakes BROLL to become the house, distributing 80% house edge payout weekly.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://bonkroll.xyz'
    }
  },
  {
    id: 'doge-force',
    name: 'DogeForce',
    symbol: 'DFORCE',
    description: 'Hyper gravity futuristic space mascot', // 5 words
    scoreType: 'expired',
    chain: 'Base',
    chainIconName: 'Layers',
    time: 'yesterday',
    tags: ['Meme', 'Base', 'Space'],
    category: 'new-meme-coins',
    volume24h: 'Expired',
    backing: 'Standard meme communities',
    riskScore: 'HIGH',
    curatorInsight: 'Sci-fi space flight companion simulator. Signal offline after standard flight duration has successfully elapsed.',
    socials: {
      twitter: 'https://twitter.com'
    }
  },

  // ADDED 5 MORE TOKENS FOR: LATEST RWA TOKENS
  {
    id: 'euro-yield',
    name: 'EuroYield',
    symbol: 'EURY',
    description: 'Fractionalized sovereign commercial euro notes', // 5 words
    scoreType: 'active',
    scoreValue: 8,
    chain: 'Ethereum',
    chainIconName: 'Zap',
    time: 'today',
    tags: ['DeFi', 'RWA', 'Yield'],
    category: 'latest-rwa-tokens',
    volume24h: '$8.1M',
    backing: 'Frankfurt Liquidity Group',
    riskScore: 'LOW',
    curatorInsight: 'On-chain access to premium short term German treasury commercial papers. Highly integrated into structural vault strategies.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://euroyield.de'
    }
  },
  {
    id: 'token-slate',
    name: 'TokenSlate',
    symbol: 'SLATE',
    description: 'Fractional luxury London apartment trust', // 5 words
    scoreType: 'active',
    scoreValue: 7,
    chain: 'Base',
    chainIconName: 'Layers',
    time: 'today',
    tags: ['RWA', 'RealEstate', 'Base'],
    category: 'latest-rwa-tokens',
    volume24h: '$1.4M',
    backing: 'Mayfair Properties Trust',
    riskScore: 'MEDIUM',
    curatorInsight: 'Direct title deeds tokenized on-chain. Token holders receive structural rent payouts from selected luxury apartments.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://tokenslate.co'
    }
  },
  {
    id: 'oil-reserve',
    name: 'OilReserve',
    symbol: 'OIL',
    description: 'Direct Brent crude oil token', // 5 words
    scoreType: 'active',
    scoreValue: 8,
    chain: 'Solana',
    chainIconName: 'Flame',
    time: 'today',
    tags: ['RWA', 'Commodities', 'Solana'],
    category: 'latest-rwa-tokens',
    volume24h: '$9.2M',
    backing: 'Audited Houston Crude Trust',
    riskScore: 'LOW',
    curatorInsight: 'Each token is backed 1-to-1 by a registered bar of Brent Oil held in audited Houston reserves. Clean tracking system.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://oilreserve.io'
    }
  },
  {
    id: 'carbon-vault',
    name: 'CarbonVault',
    symbol: 'CARB',
    description: 'Audited verified rainforest offset token', // 5 words
    scoreType: 'active',
    scoreValue: 6,
    chain: 'Arbitrum',
    chainIconName: 'Cpu',
    time: 'today',
    tags: ['RWA', 'ESG', 'Arbitrum'],
    category: 'latest-rwa-tokens',
    volume24h: '$1.0M',
    backing: 'Verra Registries Consortium',
    riskScore: 'MEDIUM',
    curatorInsight: 'Offsets generated from verified conservation in the Amazon. Smart contracts burn tokens automatically to offset emissions.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://carbonvault.co'
    }
  },
  {
    id: 'silver-trace',
    name: 'SilverTrace',
    symbol: 'AGTR',
    description: 'Vaulted physical fine silver bullion', // 5 words
    scoreType: 'expired',
    chain: 'Ethereum',
    chainIconName: 'Zap',
    time: 'yesterday',
    tags: ['RWA', 'Metals'],
    category: 'latest-rwa-tokens',
    volume24h: 'Expired',
    backing: 'Brinks Vault Hamburg',
    riskScore: 'LOW',
    curatorInsight: 'Physical silver bar exposure verified on Hamburg mountain reserves. Sector signal now successfully closed.',
    socials: {
      twitter: 'https://twitter.com'
    }
  },

  // ADDED 5 MORE TOKENS FOR: UPCOMING PRESALES
  {
    id: 'alpha-launch',
    name: 'AlphaLaunch',
    symbol: 'ALPHA',
    description: 'Decentralized modular AI crowdfunding platform', // 5 words
    scoreType: 'active',
    scoreValue: 8,
    chain: 'Base',
    chainIconName: 'Layers',
    time: 'today',
    tags: ['Launchpad', 'Base', 'AI'],
    category: 'upcoming-presale',
    volume24h: '$2.8M',
    backing: 'Base Dev Ecosystem Accelerator',
    riskScore: 'MEDIUM',
    curatorInsight: 'The leading presale launch hub for modular AI applications, providing secure, automated smart pools for bootstrapping.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://alphalaunch.net'
    }
  },
  {
    id: 'gasx-bridge',
    name: 'GasXBridge',
    symbol: 'GASX',
    description: 'Ultra fast zero fee bridge', // 5 words
    scoreType: 'active',
    scoreValue: 7,
    chain: 'Optimism',
    chainIconName: 'ShieldAlert',
    time: 'today',
    tags: ['Bridge', 'L2', 'Optimism'],
    category: 'upcoming-presale',
    volume24h: '$4.2M',
    backing: 'Optimism Labs Venture Group',
    riskScore: 'LOW',
    curatorInsight: 'Uses state-of-the-art predictive routing models to transition stablecoins across networks in sub-second timelines. Highly optimized.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://gasxbridge.ai'
    }
  },
  {
    id: 'nexus-roll',
    name: 'NexusRoll',
    symbol: 'NEXUS',
    description: 'Recursive modular state zero proof', // 5 words
    scoreType: 'active',
    scoreValue: 8,
    chain: 'Ethereum',
    chainIconName: 'Zap',
    time: 'today',
    tags: ['Rollups', 'Modular', 'Ethereum'],
    category: 'upcoming-presale',
    volume24h: '$7.5M',
    backing: 'Stark Capital, Paradigm Partners',
    riskScore: 'LOW',
    curatorInsight: 'A premium rollup framework processing high throughput transactions outside the Ethereum mainnet for fraction cost.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://nexusroll.io'
    }
  },
  {
    id: 'theta-stake',
    name: 'ThetaStake',
    symbol: 'THETA',
    description: 'Delegated liquid staking validation client', // 5 words
    scoreType: 'active',
    scoreValue: 6,
    chain: 'Solana',
    chainIconName: 'Flame',
    time: 'today',
    tags: ['Staking', 'Solana', 'DeFi'],
    category: 'upcoming-presale',
    volume24h: '$1.0M',
    backing: 'Solana Stake Foundation',
    riskScore: 'MEDIUM',
    curatorInsight: 'Automates liquid staking distribution to secure maximum compounding rewards for users without lockup limitations.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://thetastake.id'
    }
  },
  {
    id: 'omega-net',
    name: 'OmegaNet',
    symbol: 'OMEGA',
    description: 'High pressure decentralized GPU relay', // 5 words
    scoreType: 'expired',
    chain: 'Arbitrum',
    chainIconName: 'Cpu',
    time: 'yesterday',
    tags: ['Infrastructure', 'L2'],
    category: 'upcoming-presale',
    volume24h: 'Expired',
    backing: 'Arbitrum Foundation',
    riskScore: 'HIGH',
    curatorInsight: 'Renders localized proof jobs on physical hardware. Initial testing pool capacity has officially ended.',
    socials: {
      twitter: 'https://twitter.com'
    }
  },
  // ADDED 5 FINAL TOKENS FOR: NEW TECH PROJECTS
  {
    id: 'bio-net',
    name: 'BioNet',
    symbol: 'BION',
    description: 'Decentralized biological data computing sequence', // 5 words
    scoreType: 'active',
    scoreValue: 7,
    chain: 'Ethereum',
    chainIconName: 'Zap',
    time: 'today',
    tags: ['DeSci', 'Computing'],
    category: 'new-tech-projects',
    volume24h: '$2.3M',
    backing: 'VitaDAO, DeSci Venture Fund',
    riskScore: 'HIGH',
    curatorInsight: 'A synthetic genome modeling platform running on decentralized nodes. Reduces computing costs for genetic sequence analysis by 95%.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://bionet.science'
    }
  },
  {
    id: 'aero-mesh',
    name: 'AeroMesh',
    symbol: 'AEROX',
    description: 'Aerial drone physical network infrastructure', // 5 words
    scoreType: 'active',
    scoreValue: 8,
    chain: 'Solana',
    chainIconName: 'Flame',
    time: 'today',
    tags: ['DePIN', 'Solana', 'IoT'],
    category: 'new-tech-projects',
    volume24h: '$5.5M',
    backing: 'Helium Ecosystem Capital',
    riskScore: 'MEDIUM',
    curatorInsight: 'Decentralized drone logistics network using sub-GHZ radio waves to orchestrate urban aerial corridors.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://aeromesh.network',
      telegram: 'https://t.me/aeromesh'
    }
  },
  {
    id: 'zero-vault',
    name: 'ZeroVault',
    symbol: 'ZKV',
    description: 'Zero knowledge distributed data locker', // 5 words
    scoreType: 'active',
    scoreValue: 9,
    chain: 'Arbitrum',
    chainIconName: 'Cpu',
    time: 'today',
    tags: ['Privacy', 'ZK', 'Arbitrum'],
    category: 'new-tech-projects',
    volume24h: '$11.2M',
    backing: 'Sequoia Capital Seed',
    riskScore: 'LOW',
    curatorInsight: 'The most secure personal data indexing protocol. All sensitive variables are encrypted into ZK proofs before on-chain submission.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://zerovault.io'
    }
  },
  {
    id: 'synthetix-ai',
    name: 'SynthetixAI',
    symbol: 'SYNAI',
    description: 'Federated deep learning language models', // 5 words
    scoreType: 'active',
    scoreValue: 6,
    chain: 'Base',
    chainIconName: 'Layers',
    time: 'yesterday',
    tags: ['AI', 'Base', 'Compute'],
    category: 'new-tech-projects',
    volume24h: '$1.8M',
    backing: 'Base ML Grants',
    riskScore: 'HIGH',
    curatorInsight: 'Community owned LLMs where token holders dictate model alignment policies and receive native yields from API usage.',
    socials: {
      twitter: 'https://twitter.com'
    }
  },
  {
    id: 'orb-router',
    name: 'OrbRouter',
    symbol: 'ORB',
    description: 'Hyper responsive liquid restaking pool', // 5 words
    scoreType: 'perfect',
    scoreValue: 9,
    chain: 'Ethereum',
    chainIconName: 'Zap',
    time: 'today',
    tags: ['Restaking', 'DeFi'],
    category: 'new-tech-projects',
    volume24h: '$18.4M',
    backing: 'EigenLayer Foundation',
    riskScore: 'LOW',
    curatorInsight: 'Optimizes shared security architectures by algorithmically routing restaked assets across the highest yielding active validated services.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://orbrouter.eth'
    }
  },

  // ADDED 5 FINAL TOKENS FOR: NEW MEME COINS
  {
    id: 'pepe-ceo',
    name: 'PepeCEO',
    symbol: 'PCEO',
    description: 'Executive frog corporate culture meme', // 5 words
    scoreType: 'active',
    scoreValue: 8,
    chain: 'Ethereum',
    chainIconName: 'Zap',
    time: 'today',
    tags: ['Meme', 'Comic'],
    category: 'new-meme-coins',
    volume24h: '$12.1M',
    backing: 'Frog Collective Capital',
    riskScore: 'HIGH',
    curatorInsight: 'A corporate suit variant of the classic Pepe meme. The contract automatically burns LP fees and pays out quarterly "dividends".',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://pepeceo.io'
    }
  },
  {
    id: 'turbo-shib',
    name: 'TurboShib',
    symbol: 'TSHIB',
    description: 'Speed running dog coin protocol', // 5 words
    scoreType: 'active',
    scoreValue: 6,
    chain: 'Solana',
    chainIconName: 'Flame',
    time: 'today',
    tags: ['Meme', 'Dog', 'Solana'],
    category: 'new-meme-coins',
    volume24h: '$3.5M',
    backing: 'Solana Doge DAOs',
    riskScore: 'HIGH',
    curatorInsight: 'Hyper deflationary token where the transaction tax scales linearly with network congestion, encouraging rapid trading sequences.',
    socials: {
      twitter: 'https://twitter.com'
    }
  },
  {
    id: 'based-cat',
    name: 'BasedCat',
    symbol: 'BCAT',
    description: 'Minimalist feline drawing culture club', // 5 words
    scoreType: 'active',
    scoreValue: 9,
    chain: 'Base',
    chainIconName: 'Layers',
    time: 'today',
    tags: ['Meme', 'Cat', 'Base'],
    category: 'new-meme-coins',
    volume24h: '$28.4M',
    backing: 'Jesse Pollak Retweets',
    riskScore: 'MEDIUM',
    curatorInsight: 'The leading cat mascot on the Base network, entirely driven by primitive MS Paint drawings and aggressive meme propagation.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://basedcat.base'
    }
  },
  {
    id: 'wassie-coin',
    name: 'WassieCoin',
    symbol: 'WAS',
    description: 'Pessimistic cartoon creature liquidity token', // 5 words
    scoreType: 'expired',
    chain: 'Ethereum',
    chainIconName: 'Zap',
    time: 'yesterday',
    tags: ['Meme', 'Culture'],
    category: 'new-meme-coins',
    volume24h: 'Expired',
    backing: 'Twitter CT Cartels',
    riskScore: 'HIGH',
    curatorInsight: 'Doomed cartoon characters whose singular destiny is infinite liquidation. Score expired but cult-like following remains.',
    socials: {
      twitter: 'https://twitter.com'
    }
  },
  {
    id: 'ninja-doge',
    name: 'NinjaDoge',
    symbol: 'NDOGE',
    description: 'Stealth combat dog utility coin', // 5 words
    scoreType: 'active',
    scoreValue: 7,
    chain: 'Arbitrum',
    chainIconName: 'Cpu',
    time: 'today',
    tags: ['Meme', 'Arbitrum'],
    category: 'new-meme-coins',
    volume24h: '$1.1M',
    backing: 'Arb Community DAO',
    riskScore: 'HIGH',
    curatorInsight: 'Combines internet dog culture with stealth transaction protocols. Transactions are routed anonymously through native mixers.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://ninjadoge.xyz'
    }
  },

  // ADDED 5 FINAL TOKENS FOR: LATEST RWA TOKENS
  {
    id: 'blue-vineyard',
    name: 'BlueVineyard',
    symbol: 'WINE',
    description: 'Tokenized fine wine cellar assets', // 5 words
    scoreType: 'active',
    scoreValue: 8,
    chain: 'Ethereum',
    chainIconName: 'Zap',
    time: 'today',
    tags: ['RWA', 'Luxury'],
    category: 'latest-rwa-tokens',
    volume24h: '$4.5M',
    backing: 'Bordeaux Vintners Consortium',
    riskScore: 'LOW',
    curatorInsight: 'Fractional ownership of physically vaulted investment-grade wine from France. Each token represents a registered crate of vintage bottles.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://bluevineyard.io'
    }
  },
  {
    id: 'agri-yield',
    name: 'AgriYield',
    symbol: 'CROP',
    description: 'Farmland production revenue share token', // 5 words
    scoreType: 'active',
    scoreValue: 7,
    chain: 'Base',
    chainIconName: 'Layers',
    time: 'today',
    tags: ['RWA', 'Agriculture'],
    category: 'latest-rwa-tokens',
    volume24h: '$2.1M',
    backing: 'Midwest Agri Syndicate',
    riskScore: 'MEDIUM',
    curatorInsight: 'Holders receive quarterly stablecoin dividends derived from actual corn and soybean harvest yields across 5,000 acres of prime US farmland.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://agriyield.net'
    }
  },
  {
    id: 'sovereign-art',
    name: 'SovereignArt',
    symbol: 'ART',
    description: 'Fractionalized blue chip gallery paintings', // 5 words
    scoreType: 'active',
    scoreValue: 6,
    chain: 'Solana',
    chainIconName: 'Flame',
    time: 'yesterday',
    tags: ['RWA', 'Art', 'Solana'],
    category: 'latest-rwa-tokens',
    volume24h: '$1.4M',
    backing: 'Christies & Sotheby Partners',
    riskScore: 'LOW',
    curatorInsight: 'Allows instantaneous on-chain trading of shares in renowned contemporary art pieces stored securely in Geneva freeports.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://sovereignart.co'
    }
  },
  {
    id: 'aero-fleet',
    name: 'AeroFleet',
    symbol: 'JET',
    description: 'Private aviation leasing revenue pool', // 5 words
    scoreType: 'active',
    scoreValue: 9,
    chain: 'Ethereum',
    chainIconName: 'Zap',
    time: 'today',
    tags: ['RWA', 'Aviation', 'Yield'],
    category: 'latest-rwa-tokens',
    volume24h: '$16.8M',
    backing: 'Global Jet Lease Fund',
    riskScore: 'LOW',
    curatorInsight: 'Tokens represent fractional debt notes secured against a fleet of private Gulfstream jets, yielding consistent leasing revenue.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://aerofleet.io'
    }
  },
  {
    id: 'solar-bond',
    name: 'SolarBond',
    symbol: 'SBOND',
    description: 'Green energy infrastructure debt token', // 5 words
    scoreType: 'expired',
    chain: 'Arbitrum',
    chainIconName: 'Cpu',
    time: 'yesterday',
    tags: ['RWA', 'ESG', 'Debt'],
    category: 'latest-rwa-tokens',
    volume24h: 'Expired',
    backing: 'Climate Action Fund',
    riskScore: 'LOW',
    curatorInsight: 'Debt certificates financing large scale solar farms in North Africa. The bond issuance period has successfully closed.',
    socials: {
      twitter: 'https://twitter.com'
    }
  },

  // ADDED 5 FINAL TOKENS FOR: UPCOMING PRESALES
  {
    id: 'omni-dex',
    name: 'OmniDex',
    symbol: 'ODEX',
    description: 'Unified cross chain liquidity aggregator', // 5 words
    scoreType: 'active',
    scoreValue: 8,
    chain: 'LayerZero',
    chainIconName: 'Settings',
    time: 'today',
    tags: ['DEX', 'Omnichain'],
    category: 'upcoming-presale',
    volume24h: '$5.6M',
    backing: 'LayerZero Labs, a16z crypto',
    riskScore: 'MEDIUM',
    curatorInsight: 'A revolutionary DEX capable of sourcing liquidity natively across 40+ chains simultaneously without wrapping tokens.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://omnidex.fi'
    }
  },
  {
    id: 'nexus-ai',
    name: 'NexusAI',
    symbol: 'NXI',
    description: 'Intelligent decentralized prediction market engine', // 5 words
    scoreType: 'active',
    scoreValue: 9,
    chain: 'Base',
    chainIconName: 'Layers',
    time: 'today',
    tags: ['AI', 'Prediction', 'Base'],
    category: 'upcoming-presale',
    volume24h: '$12.3M',
    backing: 'Polychain Capital',
    riskScore: 'LOW',
    curatorInsight: 'Employs federated LLMs to automatically resolve complex outcome markets in real-time without centralized human oracles.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://nexusai.io'
    }
  },
  {
    id: 'zk-social',
    name: 'ZKSocial',
    symbol: 'ZKS',
    description: 'Privacy preserving decentralized social graph', // 5 words
    scoreType: 'active',
    scoreValue: 7,
    chain: 'Arbitrum',
    chainIconName: 'Cpu',
    time: 'today',
    tags: ['SocialFi', 'ZK', 'Privacy'],
    category: 'upcoming-presale',
    volume24h: '$3.4M',
    backing: 'Lens Ecosystem Fund',
    riskScore: 'HIGH',
    curatorInsight: 'A fully anonymous social network where identity and reputation are verified through Zero-Knowledge proofs rather than public addresses.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://zksocial.net'
    }
  },
  {
    id: 'chronos-yield',
    name: 'ChronosYield',
    symbol: 'CHRO',
    description: 'Time weighted auto compounding vaults', // 5 words
    scoreType: 'active',
    scoreValue: 6,
    chain: 'Optimism',
    chainIconName: 'ShieldAlert',
    time: 'yesterday',
    tags: ['Yield', 'Optimism'],
    category: 'upcoming-presale',
    volume24h: '$1.0M',
    backing: 'Op DeFi Syndicate',
    riskScore: 'MEDIUM',
    curatorInsight: 'Smart vaults that dynamically increase APY multipliers based on the duration of deposit latency. Highly sticky liquidity.',
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://chronosyield.finance'
    }
  },
  {
    id: 'quantum-fi',
    name: 'QuantumFi',
    symbol: 'QFI',
    description: 'Next generation algorithmic stablecoin protocol', // 5 words
    scoreType: 'expired',
    chain: 'Ethereum',
    chainIconName: 'Zap',
    time: 'yesterday',
    tags: ['Stablecoin', 'DeFi'],
    category: 'upcoming-presale',
    volume24h: 'Expired',
    backing: 'Frax Ecosystem Angels',
    riskScore: 'HIGH',
    curatorInsight: 'A highly experimental fractional-algorithmic stablecoin utilizing deep liquidity curves. Presale phase has ended and is live on mainnet.',
    socials: {
      twitter: 'https://twitter.com'
    }
  }
];
