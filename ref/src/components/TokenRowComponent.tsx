import React, { useState, useEffect, useRef } from 'react';
import { TokenItem } from '../types';
import { ChainIcon } from './ChainIcon';
import { CustomTooltip } from './CustomTooltip';
import { 
  Clock, 
  Rocket, 
  Layers, 
  Flame, 
  Cpu, 
  ShieldAlert, 
  Gift, 
  Shield, 
  Gamepad2, 
  Server, 
  Twitter,
  Globe,
  ExternalLink,
  Lock,
  Compass,
  DollarSign,
  Send,
  Coins,
  Megaphone,
  ChevronDown,
  Share2,
  Copy,
  Clipboard,
  Pin,
  Lightbulb,
  Hourglass,
  ArrowLeftRight
} from 'lucide-react';

const XLogo = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className} 
    style={style}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const ExpiredHourglassIcon = ({ className, opacity }: { className?: string; opacity?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    style={{ opacity }}
  >
    <path d="M5 22h14" />
    <path d="M5 2h14" />
    <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
    <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
    {/* Fill the bottom half */}
    <path d="M7 22v-4.172a2 2 0 0 1 .586-1.414L12 12l4.414 4.414a2 2 0 0 1 .586 1.414V22H7z" fill="currentColor" stroke="none" />
  </svg>
);

const CopyButton = ({ address }: { address: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className={`text-[12px] font-bold tracking-wider uppercase transition-colors cursor-pointer px-1.5 py-0.5 rounded ${copied ? 'text-cyan-400 bg-cyan-400/10' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}>
      [ {copied ? 'COPIED ✓' : 'COPY'} ]
    </button>
  );
};

const CopyReceiptIcon = ({ token, isExpired, symbol, themeColor }: { token: any, isExpired: boolean, symbol: string, themeColor: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Deterministic dates
    const tokenHash = token.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
    const discoveredDate = new Date(Date.now() - (tokenHash % 14) * 86400000 - (tokenHash % 24) * 3600000);
    const discoveredStr = discoveredDate.toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
    
    const scoreText = token.scoreValue !== undefined ? `${token.scoreValue}/10` : (isExpired ? 'EXPIRED' : 'N/A');

    const receipt = `> SCAN COMPLETE: ${symbol.toUpperCase()}
> STATUS: ${token.description}
> SONAR SCORE: ${scoreText}
> TIMESTAMP: ${discoveredStr}
> RADAR SOURCE: YOUNGWHALE.IO`;

    navigator.clipboard.writeText(receipt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <CustomTooltip content={copied ? 'Receipt copied ✓' : 'Copy terminal receipt'} position="bottom" borderColor={themeColor}>
      <button 
        onClick={handleCopy} 
        className="group relative flex items-center justify-center transition-all duration-300 cursor-pointer p-1.5 rounded-md hover:bg-white/10 text-white/50 hover:text-white"
      >
        <Clipboard className="w-3.5 h-3.5" />
      </button>
    </CustomTooltip>
  );
};

const FastFetchText = ({ text, isExpanded, prefix = '' }: { text: string; isExpanded: boolean; prefix?: string }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    if (isExpanded) {
      setDisplayedText('');
      let i = 0;
      const timeout = setTimeout(() => {
        const interval = setInterval(() => {
          setDisplayedText(text.slice(0, i + 1));
          i++;
          if (i >= text.length) {
            clearInterval(interval);
          }
        }, 15);
        return () => clearInterval(interval);
      }, 50); // slight initial delay to simulate fetch
      return () => {
        clearTimeout(timeout);
      };
    } else {
      setDisplayedText('');
    }
  }, [isExpanded, text]);

  if (!isExpanded) return null;
  return <>{prefix}{displayedText}{displayedText.length < text.length && displayedText.length > 0 ? '█' : ''}</>;
};

const LiveStatusCursor = ({ isExpanded, themeColor, symbol, showCursor, tokenName, scoreValue, isExpired }: { isExpanded: boolean, themeColor: string, symbol: string, showCursor: boolean, tokenName: string, scoreValue?: number, isExpired: boolean }) => {
  const keyStyle = { color: `${themeColor}99`, textShadow: `0 0 12px ${themeColor}1a` };
  return (
    <div className="flex items-start px-1 leading-snug transition-colors group relative mt-2 font-mono">
      <div className="flex shrink-0 w-[190px] whitespace-nowrap mr-4 pt-0.5 text-[14px] font-medium text-left" style={keyStyle}>
        <div className="flex items-center">
          <span>${symbol.toUpperCase()}</span>
          <span>@</span>
          <span className="tracking-wide font-bold">Sonar Score</span>
          <span className="mr-1 font-bold">:</span>
        </div>
      </div>
      <div className="flex-1 flex items-center mt-0.5 pl-[14px] border-l border-white/5 content-start">
        {isExpired ? (
          <span className="text-[14px] font-mono tracking-wide text-slate-400 whitespace-nowrap">
            [ SIGNAL EXPIRED ]
          </span>
        ) : (
          <span className="text-[14px] font-mono tracking-wide text-white/90">
             {scoreValue !== undefined ? `${scoreValue}/10` : 'N/A'}
          </span>
        )}
        {showCursor && !isExpired && <span className="inline-block w-[7px] h-[14px] align-[-2px] ml-1.5 animate-[pulse_1.5s_infinite]" style={{ backgroundColor: `${themeColor}99` }}></span>}
      </div>
    </div>
  );
};

const getExplorerLink = (chain: string, id: string) => {
  const norm = chain.toLowerCase();
  // stable dummy contract addresses that correspond elegantly to the token ID
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hexPart = hash.toString(16).padEnd(6, '7') + 'f' + hash.toString(16).padStart(6, '2') + 'da';
  
  if (norm.includes('solana') || norm.includes('sol')) {
    const solAddr = (id.slice(0, 3) + hexPart.toUpperCase() + id.slice(-3)).padEnd(44, 'A');
    return {
      name: 'SOLSCAN',
      url: `https://solscan.io/token/${solAddr}`,
      label: solAddr.slice(0, 6) + '...' + solAddr.slice(-4),
      rawAddress: solAddr
    };
  } else if (norm.includes('base')) {
    const ethAddr = `0x${hexPart.slice(0, 8)}71c${hexPart.slice(-8)}8c21a`.padEnd(42, '0').toLowerCase();
    return {
      name: 'BASESCAN',
      url: `https://basescan.org/token/${ethAddr}`,
      label: ethAddr.slice(0, 6) + '...' + ethAddr.slice(-4),
      rawAddress: ethAddr
    };
  } else if (norm.includes('arbitrum')) {
    const ethAddr = `0x${hexPart.slice(0, 8)}42e${hexPart.slice(-8)}9b12d`.padEnd(42, '0').toLowerCase();
    return {
      name: 'ARBISCAN',
      url: `https://arbiscan.io/token/${ethAddr}`,
      label: ethAddr.slice(0, 6) + '...' + ethAddr.slice(-4),
      rawAddress: ethAddr
    };
  } else if (norm.includes('optimism')) {
    const ethAddr = `0x${hexPart.slice(0, 8)}de9${hexPart.slice(-8)}b21f3`.padEnd(42, '0').toLowerCase();
    return {
      name: 'OPTIMISM',
      url: `https://optimistic.etherscan.io/token/${ethAddr}`,
      label: ethAddr.slice(0, 6) + '...' + ethAddr.slice(-4),
      rawAddress: ethAddr
    };
  } else {
    // Ethereum or default
    const ethAddr = `0x${hexPart.slice(0, 8)}3ef${hexPart.slice(-8)}5c2d3`.padEnd(42, '0').toLowerCase();
    return {
      name: 'ETHERSCAN',
      url: `https://etherscan.io/token/${ethAddr}`,
      label: ethAddr.slice(0, 6) + '...' + ethAddr.slice(-4),
      rawAddress: ethAddr
    };
  }
};

const getExchangeLink = (chain: string, name: string) => {
  const norm = chain.toLowerCase();
  if (norm.includes('solana') || norm.includes('sol')) {
    return {
      name: 'JUPITER',
      url: `https://jup.ag/swap/SOL-${name}`
    };
  } else if (norm.includes('base')) {
    return {
      name: 'AERODROME',
      url: `https://aerodrome.finance/swap`
    };
  } else if (norm.includes('arbitrum')) {
    return {
      name: 'CAMELOT',
      url: `https://app.camelot.exchange/`
    };
  } else if (norm.includes('optimism')) {
    return {
      name: 'VELODROME',
      url: `https://velodrome.finance/swap`
    };
  } else {
    return {
      name: 'UNISWAP',
      url: `https://app.uniswap.org/#/swap`
    };
  }
};

export const getSymbol = (token: TokenItem): string => {
  return token.symbol || token.name.slice(0, 4).toUpperCase();
};

export const getPairsList = (chain: string, symbol: string) => {
  const norm = chain.toLowerCase();
  if (norm.includes('solana') || norm.includes('sol')) {
    return [
      {
        name: `${symbol}/USDT`,
        url: `https://jup.ag/swap/USDT-${symbol}`
      },
      {
        name: `${symbol}/SOL`,
        url: `https://jup.ag/swap/SOL-${symbol}`
      }
    ];
  } else if (norm.includes('base')) {
    return [
      {
        name: `${symbol}/USDC`,
        url: `https://aerodrome.finance/swap`
      },
      {
        name: `${symbol}/WETH`,
        url: `https://aerodrome.finance/swap`
      }
    ];
  } else if (norm.includes('arbitrum')) {
    return [
      {
        name: `${symbol}/USDT`,
        url: `https://app.camelot.exchange/`
      },
      {
        name: `${symbol}/WETH`,
        url: `https://app.camelot.exchange/`
      }
    ];
  } else if (norm.includes('optimism')) {
    return [
      {
        name: `${symbol}/USDC`,
        url: `https://velodrome.finance/swap`
      },
      {
        name: `${symbol}/WETH`,
        url: `https://velodrome.finance/swap`
      }
    ];
  } else {
    return [
      {
        name: `${symbol}/USDT`,
        url: `https://app.uniswap.org/#/swap`
      },
      {
        name: `${symbol}/WETH`,
        url: `https://app.uniswap.org/#/swap`
      }
    ];
  }
};

interface TokenRowComponentProps {
  token: TokenItem;
  onSelect: (token: TokenItem) => void;
  playAudioFeedback: () => void;
  hideBorder?: boolean;
  chainBadgeStyle?: 'white' | 'transparent';
  onTagClick?: (tag: string) => void;
  isExpanded?: boolean;
  accentColor?: string;
  onPromote?: (tokenName: string) => void;
}

// Map category to accurate high-end smartwatch wayfinding hex codes
export const getCategoryColor = (category: string) => {
  switch (category) {
    case 'new-tech-projects':
      return '#00F0FF'; // Neon Blue
    case 'new-meme-coins':
      return '#FF007F'; // Neon Pink
    case 'latest-rwa-tokens':
      return '#39FF14'; // Neon Green
    case 'upcoming-presale':
      return '#00F0FF'; // Neon Blue
    default:
      return '#00F0FF';
  }
};

// Helper to map string to beautiful realistic high-quality token/coin image URLs
const getRealisticLogoUrl = (tokenName: string): string => {
  const norm = tokenName.toLowerCase();
  
  // New Tech Projects
  if (norm.includes('solar')) return 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=120&auto=format&fit=crop&q=80';
  if (norm.includes('zora')) return 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=120&auto=format&fit=crop&q=80';
  if (norm.includes('hyper')) return 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=120&auto=format&fit=crop&q=80';
  if (norm.includes('vectra')) return 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=120&auto=format&fit=crop&q=80';
  if (norm.includes('omni')) return 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=120&auto=format&fit=crop&q=80';
  if (norm.includes('matrix')) return 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=120&auto=format&fit=crop&q=80';
  if (norm.includes('quantum')) return 'https://images.unsplash.com/photo-1634973357973-f2ed255753e1?w=120&auto=format&fit=crop&q=80';
  if (norm.includes('helix')) return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&auto=format&fit=crop&q=80';
  if (norm.includes('plasma')) return 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=120&auto=format&fit=crop&q=80';
  if (norm.includes('shutter')) return 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=120&auto=format&fit=crop&q=80';

  // Meme Coins
  if (norm.includes('turbo') || norm.includes('frog')) return 'https://images.unsplash.com/photo-1540206395-68808572332f?w=120&auto=format&fit=crop&q=80';
  if (norm.includes('doge')) return 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=120&auto=format&fit=crop&q=80';
  if (norm.includes('pepe')) return 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=120&auto=format&fit=crop&q=80';
  if (norm.includes('wif')) return 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=120&auto=format&fit=crop&q=80';
  if (norm.includes('giga')) return 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=120&auto=format&fit=crop&q=80';
  if (norm.includes('shiba')) return 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=120&auto=format&fit=crop&q=80';
  if (norm.includes('cloud')) return 'https://images.unsplash.com/photo-1597839219216-a773cb2473e4?w=120&auto=format&fit=crop&q=80';
  if (norm.includes('floki')) return 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=120&auto=format&fit=crop&q=80';
  if (norm.includes('bonk')) return 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=120&auto=format&fit=crop&q=80';

  // RWA Tokens
  if (norm.includes('gold')) return 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=120&auto=format&fit=crop&q=80';
  if (norm.includes('estate') || norm.includes('metroz')) return 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=120&auto=format&fit=crop&q=80';
  if (norm.includes('treasury')) return 'https://images.unsplash.com/photo-1502920514313-52581002a659?w=120&auto=format&fit=crop&q=80';
  if (norm.includes('wood') || norm.includes('boreal')) return 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=120&auto=format&fit=crop&q=80';
  if (norm.includes('euro')) return 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=120&auto=format&fit=crop&q=80';
  if (norm.includes('slate')) return 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=120&auto=format&fit=crop&q=80';
  if (norm.includes('oil')) return 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=120&auto=format&fit=crop&q=80';
  if (norm.includes('carbon')) return 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=120&auto=format&fit=crop&q=80';
  if (norm.includes('silver')) return 'https://images.unsplash.com/photo-1618042164219-62c820f10723?w=120&auto=format&fit=crop&q=80';

  // Presales
  if (norm.includes('nova')) return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80';
  if (norm.includes('zero') || norm.includes('gas')) return 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=120&auto=format&fit=crop&q=80';
  if (norm.includes('elysium')) return 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=120&auto=format&fit=crop&q=80';
  if (norm.includes('volt')) return 'https://images.unsplash.com/photo-1601597111158-2fceff270190?w=120&auto=format&fit=crop&q=80';
  if (norm.includes('sentry')) return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=120&auto=format&fit=crop&q=80';
  if (norm.includes('alpha')) return 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=120&auto=format&fit=crop&q=80';
  if (norm.includes('bridge') || norm.includes('gasx')) return 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=120&auto=format&fit=crop&q=80';
  if (norm.includes('nexus')) return 'https://images.unsplash.com/photo-1639762681057-40802193114c?w=120&auto=format&fit=crop&q=80';
  if (norm.includes('theta')) return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80';
  if (norm.includes('omega')) return 'https://images.unsplash.com/photo-1601597111158-2fceff270190?w=120&auto=format&fit=crop&q=80';

  // default high quality crypto photo
  return 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=120&auto=format&fit=crop&q=80';
};

// Function to map string to beautiful placeholder logo vector/gradient
export const TokenLogo: React.FC<{ tokenName: string; scoreType: string; className?: string; style?: React.CSSProperties }> = ({ 
  tokenName, 
  scoreType,
  className = "w-8 h-8 rounded-full border-2 border-white",
  style
}) => {
  const imageUrl = getRealisticLogoUrl(tokenName);

  return (
    <div className={`relative flex items-center justify-center overflow-hidden rounded-full shadow-inner bg-slate-900 ${className}`} style={style}>
      <img 
        src={imageUrl} 
        alt={tokenName} 
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover select-none"
      />
      {scoreType === 'expired' && (
        <div className="absolute inset-0 bg-slate-950/60 backdrop-grayscale flex items-center justify-center" />
      )}
    </div>
  );
};

export const TokenRowComponent: React.FC<TokenRowComponentProps> = ({ 
  token, 
  onSelect, 
  playAudioFeedback,
  hideBorder = false,
  chainBadgeStyle = 'white',
  onTagClick,
  isExpanded = false,
  accentColor,
  onPromote
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isExpanded && rowRef.current) {
      const timeoutId = setTimeout(() => {
        if (!rowRef.current) return;
        rowRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 350);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [isExpanded]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    playAudioFeedback(); // play tactical haptic smartwatch sound
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleRowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(token);
    playAudioFeedback();
  };

  const isExpired = token.scoreType === 'expired';
  const isPerfect = token.scoreType === 'perfect';

  // Category specific accent color for left edge guide
  const themeColor = accentColor || getCategoryColor(token.category);

  // Deterministic presale logic
  const presaleLabel = 'CONFIRMED';
  const presaleTerminalText = 'Confirmed';

  return (
    <>
      <div
        ref={rowRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full cursor-pointer select-none flex flex-col rounded mb-1 border border-transparent transition-all duration-300 scroll-mt-[64px]"
        style={{
          backgroundColor: isExpanded || isHovered 
            ? 'rgba(255, 255, 255, 0.06)'
            : 'rgba(255, 255, 255, 0.03)',
          borderColor: (isExpanded || isHovered) ? `${themeColor}20` : 'transparent',
          boxShadow: (isExpanded || isHovered) ? `0 0 15px ${themeColor}10` : 'none'
        }}
      >
        {/* 2px Left vertical laser locked-on guides (on hover) */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-0.5 z-10" 
          style={{ 
            opacity: isHovered ? 1 : 0,
            backgroundColor: themeColor
          }}
        />

      {/* Main Single-line Row (always visible) */}
      <div 
        onClick={handleRowClick}
        className="flex items-center h-[46px] w-full px-3 md:px-4 py-1.5 gap-3 overflow-hidden"
      >
        {/* Unit 1: [Placeholder Logo with Overlapping Chain badge] */}
        <CustomTooltip content={`${token.name} launched on ${token.chain} Network`} position="right" borderColor={themeColor}>
          <a
            href={getExplorerLink(token.chain, token.id)?.url || 'https://etherscan.io'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-shrink-0 relative block"
          >
            <TokenLogo tokenName={token.name} scoreType={token.scoreType} className="w-8 h-8 rounded-full border-2 border-white transition-transform hover:scale-105" />
            
            {/* Chain Icon overlap bottom-right */}
            {chainBadgeStyle === 'transparent' ? (
              <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 flex items-center justify-center text-slate-400 drop-shadow-md z-15 pointer-events-none">
                <ChainIcon chainName={token.chain} className="w-3.5 h-3.5" />
              </div>
            ) : (
              <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 flex items-center justify-center rounded bg-[#070A10] border border-white text-slate-400 p-0.5 shadow-md z-15 pointer-events-none">
                <ChainIcon chainName={token.chain} className="w-3 h-3" />
              </div>
            )}
          </a>
        </CustomTooltip>

        {/* ALL ELEMENTS FLEX ROW */}
        {/* Token Name and Tag */}
        <span className="font-outfit text-[13px] font-semibold tracking-wide text-[#E2E8F0] w-[66px] md:w-[86px] flex-shrink-0 text-left truncate">
          {token.name}
        </span>
        
        {/* Description */}
        <div 
          className="flex-grow min-w-0 overflow-hidden text-[11px] text-[#CBD5E1] font-normal whitespace-nowrap text-left ml-1.5 md:ml-2 mr-1 md:mr-2"
          style={{ 
            WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 97%, rgba(0,0,0,0) 100%)',
            maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 97%, rgba(0,0,0,0) 100%)'
          }}
        >
          {token.description}
        </div>

        {/* Hashtag */}
        <div className="hidden sm:block flex-shrink-0 mr-1 sm:mr-2">
          {token.tags.slice(0, 1).map((tag, tagIndex) => (
            <button 
              key={tagIndex} 
              onClick={(e) => {
                if (onTagClick) {
                  e.stopPropagation();
                  onTagClick(tag);
                }
              }}
              type="button"
              className="text-[9px] font-mono font-semibold tracking-wider uppercase text-slate-400 bg-[#2A3441] rounded-[4px] px-1.5 py-0.5 truncate transition-colors focus:outline-none"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = themeColor;
                e.currentTarget.style.color = '#0B0F19';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2A3441';
                e.currentTarget.style.color = '#94A3B8';
              }}
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Sonar Score */}
        <CustomTooltip content={token.isPromoted ? 'Sponsored ping' : (isExpired ? <>Expired Sonar Score<br/>Sonar ping timed out</> : <>Live Sonar Score<br/>Valid for 24 hours only</>)} position="left" borderColor={themeColor}>
          <div className="flex-shrink-0 flex items-center justify-center w-7 mr-1 sm:mr-2 ml-0 sm:ml-1 h-7">
            {isExpired ? (
              <ExpiredHourglassIcon className="w-4 h-4 text-white hover:text-white/40 transition-colors" opacity={0.4} />
            ) : (
              <div 
                className={`w-7 h-7 rounded-full flex items-center justify-center bg-slate-950/50 font-oxanium text-[14px] font-extrabold select-none border-2 border-solid transition-all duration-300 ${isHovered && !token.isPromoted ? 'scale-105' : ''}`}
                style={{ 
                  borderColor: token.isPromoted ? 'rgba(255, 255, 255, 0.2)' : (token.scoreValue === undefined ? '#FFD700' : '#FFFFFF'),
                  color: token.isPromoted ? 'rgba(255, 255, 255, 0.3)' : (token.scoreValue === undefined ? '#FFD700' : '#FFFFFF'),
                  boxShadow: (!token.isPromoted && token.scoreValue && token.scoreValue >= 85) ? `0 0 12px ${themeColor}40` : (isHovered && !token.isPromoted ? `0 0 10px ${themeColor}60` : 'none'),
                }}
              >
                {token.isPromoted ? <Pin className="w-3.5 h-3.5" /> : (token.scoreValue !== undefined ? token.scoreValue : '★')}
              </div>
            )}
          </div>
        </CustomTooltip>

        {/* Time */}
        <div 
          className={`text-right font-mono text-[10px] uppercase tracking-wider flex-shrink-0 whitespace-nowrap ${token.category === 'upcoming-presale' ? 'w-[75px] md:w-[85px]' : 'w-[42px] md:w-[48px]'}`}
          style={{ 
            color: (!token.isPromoted && token.time === 'today') ? themeColor : '#94A3B8' 
          }}
        >
          {token.isPromoted ? 'FEATURED' : (token.category === 'upcoming-presale' ? presaleLabel : (token.time === 'yesterday' ? '1D AGO' : token.time))}
        </div>
      </div>

      {/* Expandable Panel revealed strictly on click (isExpanded) with transition */}
      <div 
        className={`w-full transition-all duration-300 ease-in-out relative ${isExpanded ? 'max-h-[800px] opacity-100 py-3 pb-6 bg-transparent border-t border-dashed border-[#1E293B]/30' : 'max-h-0 opacity-0 overflow-hidden border-transparent'}`}
      >
        <div className="px-3 sm:px-5 pb-2">
          {(() => {
            const explorer = getExplorerLink(token.chain, token.id);
            const symbol = getSymbol(token);
            const pairs = getPairsList(token.chain, symbol);
            
            return (
              <div 
                className="bg-terminal rounded-xl overflow-hidden font-mono shadow-2xl w-full relative"
                style={{
                  boxShadow: `0 0 0 1px ${themeColor}10, 0 8px 32px -8px ${themeColor}20`
                }}
              >
                {/* Noise overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                />

                {/* Title bar */}
                <div className="py-2.5 px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 gap-2 sm:gap-0 z-10 relative">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-[8px] sm:text-[9px] font-bold tracking-[0.16em] text-white/50 uppercase bg-white/5 border border-white/5 rounded-full px-2 sm:px-3 py-1 text-center truncate">
                      YOUNGWHALE TERMINAL
                    </div>
                    {!isExpired && (
                      <div className="flex items-center gap-1.5 text-[8px] sm:text-[9px] font-bold tracking-[0.12em] uppercase shrink-0" style={{ color: themeColor }}>
                        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: themeColor }}></div>
                        LIVE
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 z-10 self-end sm:self-auto">
                    <CopyReceiptIcon token={token} isExpired={isExpired} symbol={symbol} themeColor={themeColor} />
                    
                    <CustomTooltip content="Share to X" position="bottom" borderColor={themeColor}>
                      <a 
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${token.name} on The Next Wave!\n\n#${token.chain.replace(/\s+/g,'')} #${(token.tags[0] || 'Crypto').replace(/\s+/g,'')}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex items-center justify-center transition-all duration-300 cursor-pointer p-1.5 rounded-md hover:bg-white/10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="w-3.5 h-3.5 fill-white/50 group-hover:fill-white transition-colors"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                      </a>
                    </CustomTooltip>
                    
                    <CustomTooltip content={<>Token creator or early backer?<br/>Promote this project in the homepage featured zone</>} position="bottom-end" borderColor={themeColor}>
                      <div 
                        className="group relative flex items-center justify-center transition-all duration-300 cursor-pointer p-1.5 rounded-md hover:bg-white/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onPromote) onPromote(token.name);
                        }}
                      >
                        <Rocket className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                      </div>
                    </CustomTooltip>
                    
                    <div className="flex flex-col items-end shrink-0 ml-2 sm:ml-3">
                      <div className="relative block">
                        <TokenLogo tokenName={token.name} scoreType={token.scoreType} className="w-16 h-16 rounded-full border-[3px] border-white z-10 box-border bg-black" />
                        {chainBadgeStyle === 'transparent' ? (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-slate-400 drop-shadow-md z-15 pointer-events-none">
                            <ChainIcon chainName={token.chain} className="w-6 h-6 sm:w-7 sm:h-7" />
                          </div>
                        ) : (
                          <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-6 h-6 flex items-center justify-center rounded bg-[#0F1624] border-[1.5px] border-white text-slate-400 p-0.5 shadow-md z-15 pointer-events-none">
                            <ChainIcon chainName={token.chain} className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Token Header */}
                <div className="flex flex-col gap-3 p-4 sm:p-6 font-mono">
                  <div className="text-[20px] sm:text-[22px] font-bold tracking-wide truncate flex items-center gap-2">
                     <span className="text-[#E2E8F0]">{token.name}</span>
                     <span style={{ color: themeColor }} className="text-[17px]">${symbol}</span>
                     <span className="px-1.5 py-0.5 rounded uppercase text-[10px] sm:text-[11px] font-bold tracking-wider bg-white/10 text-white/70 ml-2 flex-shrink-0">
                       {token.chain}
                     </span>
                     {token.category === 'upcoming-presale' && (
                       <span className="text-[10px] sm:text-[11px] tracking-wider text-slate-400 uppercase ml-2 flex items-center mt-[1px] whitespace-nowrap">
                         <FastFetchText text={presaleTerminalText} isExpanded={isExpanded} />
                       </span>
                     )}
                  </div>
                  <div className="mt-2 text-left">
                    <div className="text-[11px] tracking-widest uppercase flex items-center gap-2 mb-3 text-white/50 bg-white/5 inline-flex px-2 py-0.5 rounded">
                      <Compass className="w-3.5 h-3.5" />
                      WHALE INTELLIGENCE BRIEF
                    </div>
                    <div className="text-[14px] sm:text-[15px] text-white/90 tracking-wide leading-[1.7] text-justify">
                      {token.curatorInsight || token.description}
                    </div>
                  </div>
                </div>

                {/* Shell */}
                <div className="p-4 sm:p-6 pt-0 flex flex-col gap-2.5 font-mono">
                  {(() => {
                    const keyStyle = { color: `${themeColor}99`, textShadow: `0 0 12px ${themeColor}1a` };
                    return (
                      <>
                        {/* Socials Section */}
                        <div className="flex items-start px-1 leading-snug transition-colors group relative">
                          <div className="flex shrink-0 w-[190px] whitespace-nowrap mr-4 pt-0.5 text-[14px] font-medium text-left" style={keyStyle}>
                            <div className="flex items-center">
                              <span>${symbol.toUpperCase()}</span>
                              <span>@</span>
                              <span className="tracking-wide font-bold">socials</span>
                              <span className="mr-1 font-bold">:</span>
                            </div>
                          </div>

                          <div className="flex-1 flex flex-col sm:flex-row flex-wrap gap-x-6 gap-y-1.5 mt-0.5 pl-[14px] border-l border-white/5 content-start">
                      {token.socials?.website && (
                        <a href={`https://${token.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-[14px] font-mono text-white/90 hover:text-cyan-400 hover:underline hover:underline-offset-2 transition-colors truncate w-fit">
                          <FastFetchText text={`${token.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`} isExpanded={isExpanded} />
                        </a>
                      )}
                      {token.socials?.twitter && (
                        <a href={`https://x.com/${token.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-[14px] font-mono text-white/90 hover:text-cyan-400 hover:underline hover:underline-offset-2 transition-colors truncate w-fit">
                          <FastFetchText text={`x.com/${token.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`} isExpanded={isExpanded} />
                        </a>
                      )}
                      {token.socials?.telegram && (
                        <a href={`https://t.me/${token.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-[14px] font-mono text-white/90 hover:text-cyan-400 hover:underline hover:underline-offset-2 transition-colors truncate w-fit">
                          <FastFetchText text={`t.me/${token.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`} isExpanded={isExpanded} />
                        </a>
                      )}
                      {(token.socials?.github || true) && (
                        <a href={`https://github.com/${token.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-[14px] font-mono text-white/90 hover:text-cyan-400 hover:underline hover:underline-offset-2 transition-colors truncate w-fit">
                          <FastFetchText text={`github.com/${token.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`} isExpanded={isExpanded} />
                        </a>
                      )}
                    </div>
                  </div>

                        {/* Trade Row */}
                        <div className="flex items-start px-1 leading-snug transition-colors group relative mt-2">
                          <div className="flex shrink-0 w-[190px] whitespace-nowrap mr-4 pt-0.5 text-[14px] font-medium text-left" style={keyStyle}>
                            <div className="flex items-center">
                              <span>${symbol.toUpperCase()}</span>
                              <span>@</span>
                              <span className="tracking-wide font-bold">trade</span>
                              <span className="mr-1 font-bold">:</span>
                            </div>
                          </div>
                          <div className="flex-1 flex flex-wrap gap-x-6 gap-y-1.5 text-white/90 mt-0.5 pl-[14px] border-l border-white/5 content-start">
                            {pairs.length > 0 ? pairs.map((pair, idx) => (
                              <a key={idx} href={pair.url} target="_blank" rel="noopener noreferrer" className="text-[14px] font-mono text-white/90 hover:text-cyan-400 hover:underline hover:underline-offset-2 transition-colors truncate w-fit" onClick={(e) => e.stopPropagation()}>
                                [<FastFetchText text={pair.name || `${symbol}/USDC`} isExpanded={isExpanded} />]
                              </a>
                            )) : (
                               <span className="text-white/40 font-mono text-[14px]">[NO PAIRS FOUND]</span>
                            )}
                          </div>
                        </div>

                        {/* Contract Row */}
                        <div className="flex items-start px-1 leading-snug transition-colors group relative mt-2">
                          <div className="flex shrink-0 w-[190px] whitespace-nowrap mr-4 pt-0.5 text-[14px] font-medium text-left" style={keyStyle}>
                            <div className="flex items-center">
                              <span>${symbol.toUpperCase()}</span>
                              <span>@</span>
                              <span className="tracking-wide font-bold">contract</span>
                              <span className="mr-1 font-bold">:</span>
                            </div>
                          </div>
                          <div className="flex-1 flex flex-wrap items-center gap-x-6 gap-y-1.5 mt-0.5 pl-[14px] border-l border-white/5 content-start">
                            <a href={explorer.url || "#"} target="_blank" rel="noopener noreferrer" className="text-[14px] font-mono text-white/90 hover:text-cyan-400 hover:underline hover:underline-offset-2 transition-colors cursor-pointer" onClick={(e) => e.stopPropagation()}>
                              [ <FastFetchText text={explorer.label} isExpanded={isExpanded} /> ]
                            </a>
                            <CopyButton address={explorer.rawAddress || token.id} />
                          </div>
                        </div>

                        {/* Supply Row */}
                        <div className="flex items-start px-1 leading-snug transition-colors group relative mt-2">
                          <div className="flex shrink-0 w-[190px] whitespace-nowrap mr-4 pt-0.5 text-[14px] font-medium text-left" style={keyStyle}>
                            <div className="flex items-center">
                              <span>${symbol.toUpperCase()}</span>
                              <span>@</span>
                              <span className="tracking-wide font-bold">supply</span>
                              <span className="mr-1 font-bold">:</span>
                            </div>
                          </div>
                          <div className="flex-1 flex items-center gap-x-6 gap-y-1.5 mt-0.5 pl-[14px] border-l border-white/5 content-start">
                            <span className="text-[14px] font-mono text-white/90">
                              <FastFetchText text={`1,000,000,000 ${symbol.toUpperCase()}`} isExpanded={isExpanded} />
                            </span>
                          </div>
                        </div>

                        {/* Cursor */}
                        <div>
                          <LiveStatusCursor isExpanded={isExpanded} themeColor={themeColor} symbol={symbol} showCursor={isExpanded} tokenName={token.name} scoreValue={token.scoreValue} isExpired={isExpired} />
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
    {!hideBorder && <div className="h-px w-full bg-[#1E293B] pointer-events-none flex-shrink-0 my-[2px]" />}
  </>
);
};
