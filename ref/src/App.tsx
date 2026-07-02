import React, { useState, useEffect, useRef } from 'react';
import { INITIAL_TOKENS } from './data';
import { PROMOTED_TOKENS } from './promotedData';
import { TokenItem, SonarScoreType } from './types';
import { TokenRowComponent } from './components/TokenRowComponent';
import { SkeletonTokenRow } from './components/SkeletonTokenRow';
import { CategoryBlock } from './components/CategoryBlock';
import { 
  Sparkles, 
  Terminal, 
  Filter, 
  Orbit, 
  Compass, 
  CheckCircle,
  TrendingUp,
  Cpu,
  Coins,
  Shield,
  Layers,
  HelpCircle,
  Info,
  Search
} from 'lucide-react';
import { CustomTooltip } from './components/CustomTooltip';

// Branding removed

import { CtoSpecs } from './components/CtoSpecs';
import { SubscriptionTerminal } from './components/SubscriptionTerminal';
import { ContactModal } from './components/ContactModal';
import { SubmitTokenModal } from './components/SubmitTokenModal';
import { LegalModal, LegalTab } from './components/LegalModal';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'cto'>('home');
  const [legalModalTab, setLegalModalTab] = useState<LegalTab | null>(null);
  const [tokens, setTokens] = useState<TokenItem[]>(INITIAL_TOKENS);
  const [selectedToken, setSelectedToken] = useState<TokenItem | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [promoteTokenName, setPromoteTokenName] = useState<string | null>(null);

  const openSubmitModal = (tokenName?: string) => {
    setPromoteTokenName(tokenName || null);
    setIsSubmitModalOpen(true);
  };

  // Pagination limits for "View more" sectors (initially showing 5, clicking view more appends 5)
  const [techLimit, setTechLimit] = useState(5);
  const [memeLimit, setMemeLimit] = useState(5);
  const [rwaLimit, setRwaLimit] = useState(5);
  const [presaleLimit, setPresaleLimit] = useState(5);
  
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'yesterday'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'score' | 'hashtag'>('default');
  const [isLoading, setIsLoading] = useState(true);

  const [secondsLeft, setSecondsLeft] = useState(7200); // 2 hours in seconds

  useEffect(() => {
    if (selectedToken) {
      const symbol = (selectedToken as any).symbol || selectedToken.name.slice(0, 4).toUpperCase();
      document.title = `${selectedToken.name} ($${symbol}) Sonar Score | YoungWhale.io`;
    } else {
      if (currentView === 'cto') {
        document.title = `CTO Specs | YoungWhale.io`;
      } else {
        document.title = `YoungWhale.io | Discover New Crypto Tokens Daily.`;
      }
    }
  }, [selectedToken, currentView]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [activeFilter, searchQuery]);

  useEffect(() => {
    const handleDocumentClick = () => {
      setSelectedToken(null);
    };
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 7200 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatCountdown = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    const paddedHrs = String(hrs).padStart(2, '0');
    const paddedMins = String(mins).padStart(2, '0');
    const paddedSecs = String(secs).padStart(2, '0');
    
    return `${paddedHrs}:${paddedMins}:${paddedSecs}`;
  };

  const filterContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (activeFilter && filterContainerRef.current && !filterContainerRef.current.contains(event.target as Node)) {
        setActiveFilter(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeFilter]);

  const handleTagClick = (tag: string) => {
    playAudioFeedback('select');
    setActiveFilter(prev => prev === tag ? null : tag);
  };

  // Function placeholder (audio removed)
  const playAudioFeedback = (type: 'hover' | 'select' | 'error' = 'hover') => {
    // No-op
  };

  // Filtering engine logic
  const filteredTokens = tokens.filter((t) => {
    // Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!t.name.toLowerCase().includes(q) && 
          !t.description.toLowerCase().includes(q) && 
          !t.tags.some(tag => tag.toLowerCase().includes(q))) {
        return false;
      }
    }

    // Time filter
    if (timeFilter !== 'all' && t.time !== timeFilter) return false;
    
    return true;
  });

  let sortedTokens = [...filteredTokens];
  
  // Sort global: "today" elements before "yesterday"
  sortedTokens.sort((a, b) => {
    if (a.time === 'today' && b.time === 'yesterday') return -1;
    if (a.time === 'yesterday' && b.time === 'today') return 1;
    return 0;
  });

  if (sortBy === 'hashtag') {
    sortedTokens.sort((a, b) => {
      if (a.time !== b.time) {
        if (a.time === 'today') return -1;
        if (a.time === 'yesterday') return 1;
        return 0;
      }
      const tagA = a.tags[0] || '';
      const tagB = b.tags[0] || '';
      return tagA.localeCompare(tagB);
    });
  }

  // Split standard listings into the four newly requested categories
  const techProjectsList = sortedTokens.filter((t) => t.category === 'new-tech-projects');
  const memeCoinsList = sortedTokens.filter((t) => t.category === 'new-meme-coins');
  const rwaTokensList = sortedTokens.filter((t) => t.category === 'latest-rwa-tokens');
  const upcomingPresaleList = sortedTokens.filter((t) => t.category === 'upcoming-presale');

  // Filter promoted tokens
  const promotedTechList = PROMOTED_TOKENS.filter((t) => t.category === 'new-tech-projects');
  const promotedMemeList = PROMOTED_TOKENS.filter((t) => t.category === 'new-meme-coins');
  const promotedRwaList = PROMOTED_TOKENS.filter((t) => t.category === 'latest-rwa-tokens');
  const promotedPresaleList = PROMOTED_TOKENS.filter((t) => t.category === 'upcoming-presale');

  // Interactive Live Injector to verify other token structures under four sectors
  const handleAddNewSignal = (
    category: 'new-tech-projects' | 'new-meme-coins' | 'latest-rwa-tokens' | 'upcoming-presale', 
    scoreType: SonarScoreType
  ) => {
    playAudioFeedback('select');
    const randomId = Math.random().toString(36).substr(2, 9);
    
    // Categorized structural templates (each brief restricted to max 6 words)
    const templates: Record<typeof category, { name: string; desc: string; chain: string; icon: string; tags: string[] }> = {
      'new-tech-projects': {
        name: 'NeuralHedge',
        desc: 'Sovereign mathematical core neural computation', // 5 words
        chain: 'Ethereum',
        icon: 'Zap',
        tags: ['AI', 'Computing']
      },
      'new-meme-coins': {
        name: 'HuskyVibe',
        desc: 'Stylish dog avatar wearing sunglasses', // 5 words
        chain: 'Solana',
        icon: 'Flame',
        tags: ['Meme', 'Organic']
      },
      'latest-rwa-tokens': {
        name: 'SwissVault',
        desc: 'Sovereign physical precious metal backing', // 5 words
        chain: 'Base',
        icon: 'Layers',
        tags: ['Gold', 'Audit']
      },
      'upcoming-presale': {
        name: 'ApexPortal',
        desc: 'Hyper scale transaction bridge protocol', // 5 words
        chain: 'Arbitrum',
        icon: 'Cpu',
        tags: ['DeFi', 'Bridge']
      }
    };

    const block = templates[category];

    const injectedRow: TokenItem = {
      id: `${category}-${randomId}`,
      name: `${block.name} #${Math.floor(Math.random() * 80 + 10)}`,
      description: block.desc,
      scoreType,
      scoreValue: scoreType === 'expired' ? undefined : (scoreType === 'perfect' ? 9 : 8),
      chain: block.chain,
      chainIconName: block.icon,
      time: 'today',
      tags: block.tags,
      category,
      volume24h: scoreType === 'expired' ? 'Expired' : '$2.5M',
      backing: 'Direct autonomous validator pool',
      riskScore: scoreType === 'perfect' ? 'LOW' : 'MEDIUM',
      curatorInsight: `An exceptional high-velocity project newly injected into the system directory. Confirmed responsive on OLED indicators.`,
      socials: {
        twitter: 'https://twitter.com',
        website: 'https://youngwhale.io'
      }
    };

    setTokens((prev) => [injectedRow, ...prev]);
  };

  const handleResetSignals = () => {
    playAudioFeedback('select');
    setTokens(INITIAL_TOKENS);
  };

  if (currentView === 'cto') {
    return <CtoSpecs onBack={() => setCurrentView('home')} />;
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-deep text-slate-50 font-outfit pb-10 selection:bg-cyan-400/30 selection:text-cyan-400 relative overflow-x-hidden">
      
      {/* Legal Modal */}
      <LegalModal 
        isOpen={legalModalTab !== null} 
        onClose={() => setLegalModalTab(null)} 
        initialTab={legalModalTab || 'tc'} 
      />

      {/* Contact Modal */}
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />

      {/* Submit Token Modal */}
      <SubmitTokenModal isOpen={isSubmitModalOpen} onClose={() => setIsSubmitModalOpen(false)} promoteTokenName={promoteTokenName} />

      {/* Removed ambient radar scanline */}

      {/* 24-Hour Timer at the very top of the site (keep tiny space from top screen border) with Branding in top-left */}
      <header className="pt-2 pb-1.5 w-full border-b border-[#1E293B]/25 bg-[#070A10]/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto w-full px-4 flex items-center justify-between gap-4 relative h-10 md:h-12">
          
          {/* Top Left: Logo removed */}
          <div className="flex-shrink-0 flex items-center">
            <a 
              href="/" 
              className="font-oxanium font-bold text-xl tracking-wide text-slate-50 hover:text-cyan-400 hover:drop-shadow-[0_0_12px_#22d3ee80] transition-all duration-300"
            >
              YoungWhale.io
            </a>
          </div>

          {/* Center Column: Clock (timer) - Hidden on mobile, absolute centered on desktop/tablet */}
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 hidden md:block">
            <div className="relative py-1 px-4.5 bg-[#0A0F1D]/85 min-w-[240px] select-none text-center rounded-sm">
              {/* Custom Corner Brackets */}
              <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-[#51c9e2]/60" />
              <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-[#51c9e2]/60" />
              <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-[#51c9e2]/60" />
              <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-[#51c9e2]/60" />
              
              <div className="flex items-center justify-center gap-2.5">
                <div className="flex items-center gap-1.5 text-left">
                  <span className="font-oxanium text-[11px] leading-none text-[#FFFFFF] tracking-[0.05em] font-bold flex items-center">
                    CRYPTO WHALES START HERE <div className="w-1.5 h-1.5 rounded-full bg-[#94A3B8] animate-[sonar-pulse_3.5s_ease-in-out_infinite] mx-2 shrink-0" /> <span className="text-slate-400 font-semibold">INCOMING TOKENS & DAILY SCORES</span>
                  </span>
                  <CustomTooltip content={<>New tokens filtered and receive a Sonar Score daily.<br/>Live Sonar Scores auto-expire after 24 hours.</>} position="bottom">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center bg-[#1E293B] hover:border-[#00F0FF] hover:text-[#00F0FF] border border-transparent box-border text-[#94A3B8] font-bold font-serif text-[10px] cursor-default transition-all leading-none italic pb-[1px]">
                      i
                    </div>
                  </CustomTooltip>
                </div>
                <div className="w-[1px] h-4 bg-[#1E293B]/80" />
                <span 
                  className="font-oxanium text-xs font-semibold text-[#F8FAFC] tracking-[2px] block transition-all leading-none"
                  style={{ textShadow: '0 0 8px rgba(81, 201, 226, 0.25)' }}
                >
                  {formatCountdown(secondsLeft)}
                </span>
              </div>
            </div>
          </div>

          {/* Top Right: Global Search & Mobile Timer */}
          <div className="flex items-center gap-4 justify-end flex-1 md:flex-none">
            <div className={`flex items-center border-b ${isSearchOpen ? 'border-[#334155]' : 'border-transparent'} transition-all`}>
              <button 
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-1 focus:outline-none flex-shrink-0"
              >
                <Search className="w-3.5 h-3.5 text-[#94A3B8] hover:text-slate-300 transition-colors" />
              </button>
              {isSearchOpen && (
                <div className="flex items-center gap-2 md:gap-3 pl-1">
                  <input 
                    autoFocus
                    type="text"
                    placeholder="SEARCH..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none focus:outline-none text-[10px] uppercase font-mono text-[#F8FAFC] w-16 md:w-28 placeholder-[#475569] pb-[1px]"
                  />
                  <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value as any)}
                    className="bg-[#0B0F19] text-[#94A3B8] border-none focus:outline-none text-[9px] uppercase font-mono cursor-pointer outline-none p-0 w-auto"
                  >
                    <option value="all">TIME: ALL</option>
                    <option value="today">TODAY</option>
                    <option value="yesterday">1D AGO</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-[#0B0F19] text-[#94A3B8] border-none focus:outline-none text-[9px] uppercase font-mono cursor-pointer outline-none p-0 w-auto"
                  >
                    <option value="default">SORT: DFLT</option>
                    <option value="hashtag">HASHTAG</option>
                  </select>
                </div>
              )}
            </div>

            {/* Show simple compact timer badge on mobile to preserve layout space */}
            <div className="md:hidden py-1 px-2.5 bg-[#0A0F1D]/85 rounded-sm border border-[#1E293B]/60 flex items-center gap-1.5">
              <span className="font-oxanium text-[7px] font-bold text-[#FFFFFF] uppercase">NEXT WAVE:</span>
              <span className="font-oxanium text-xs font-semibold text-[#F8FAFC] tracking-[2px] leading-none">
                {formatCountdown(secondsLeft)}
              </span>
              <div className="w-1 h-1 rounded-full bg-[#94A3B8] animate-[sonar-pulse_3.5s_ease-in-out_infinite]" />
            </div>
          </div>

        </div>
      </header>

      {/* Main Container workspace */}
      <main className="max-w-7xl mx-auto w-full px-4 pt-2 flex flex-col gap-4">
 
        {/* 
          Main Grid Layout of Categories.
          Requirements:
          1) 4 categories grouped in exact matching order:
             - Top Left: new tech projects (Electric Violet Color #B026FF)
             - Top Right: new meme coins (Neon Mint Color #00FA9A)
             - Bottom Left: Latest RWA tokens (Sonar Cyan Color #00E5D2)
             - Bottom Right: upcoming Presale (Amber Color #F5A623)
          2) Category Container backgrounds are set strictly to the site background color (#0B0F19).
        */}
        <div className="relative w-full">
          {/* Main Desktop View */}
          <div className={`hidden lg:flex gap-x-6 items-start w-full transition-opacity duration-300 ${activeFilter ? 'opacity-0 pointer-events-none absolute inset-x-0 top-0' : 'opacity-100 relative'}`}>
            <div className="flex-1 flex flex-col gap-y-3 min-w-0">
              <CategoryBlock
                title="New Tech Projects"
                tooltipText="Crypto tech project tokens hitting the market."
                headerColor="#22D3EE"
                tokensList={techProjectsList}
                promotedList={promotedTechList}
                limit={techLimit}
                setLimit={setTechLimit}
                skeletonPrefix="tech-skel"
                isLoading={isLoading}
                selectedToken={selectedToken}
                setSelectedToken={setSelectedToken}
                playAudioFeedback={playAudioFeedback}
                handleTagClick={handleTagClick} onPromote={openSubmitModal}
              />
              <CategoryBlock
                title="Latest RWA Tokens"
                tooltipText="Real-world assets (gold, real estate, etc.) tokenized on-chain."
                headerColor="#4ADE80"
                tokensList={rwaTokensList}
                promotedList={promotedRwaList}
                limit={rwaLimit}
                setLimit={setRwaLimit}
                skeletonPrefix="rwa-skel"
                isLoading={isLoading}
                selectedToken={selectedToken}
                setSelectedToken={setSelectedToken}
                playAudioFeedback={playAudioFeedback}
                handleTagClick={handleTagClick} onPromote={openSubmitModal}
              />
            </div>
            <div className="flex-1 flex flex-col gap-y-3 min-w-0">
              <CategoryBlock
                title="New Meme Coins"
                tooltipText="Recently traded fun and culture coins."
                headerColor="#F97316"
                tokensList={memeCoinsList}
                promotedList={promotedMemeList}
                limit={memeLimit}
                setLimit={setMemeLimit}
                skeletonPrefix="meme-skel"
                isLoading={isLoading}
                selectedToken={selectedToken}
                setSelectedToken={setSelectedToken}
                playAudioFeedback={playAudioFeedback}
                handleTagClick={handleTagClick} onPromote={openSubmitModal}
              />
              <CategoryBlock
                title="Upcoming Presales & Airdrops"
                tooltipText="Early-access tokens before public trading opens."
                headerColor="#A855F7"
                tokensList={upcomingPresaleList}
                promotedList={promotedPresaleList}
                limit={presaleLimit}
                setLimit={setPresaleLimit}
                skeletonPrefix="presale-skel"
                isLoading={isLoading}
                selectedToken={selectedToken}
                setSelectedToken={setSelectedToken}
                playAudioFeedback={playAudioFeedback}
                handleTagClick={handleTagClick} onPromote={openSubmitModal}
              />
            </div>
          </div>

          {/* Main Mobile View */}
          <div className={`flex lg:hidden flex-col gap-y-4 w-full transition-opacity duration-300 ${activeFilter ? 'opacity-0 pointer-events-none absolute inset-x-0 top-0' : 'opacity-100 relative'}`}>
            <CategoryBlock
              title="New Tech Projects"
              tooltipText="Crypto tech project tokens hitting the market."
              headerColor="#00AACC"
              tokensList={techProjectsList}
              promotedList={promotedTechList}
              limit={techLimit}
              setLimit={setTechLimit}
              skeletonPrefix="tech-skel-mob"
              isLoading={isLoading}
              selectedToken={selectedToken}
              setSelectedToken={setSelectedToken}
              playAudioFeedback={playAudioFeedback}
              handleTagClick={handleTagClick} onPromote={openSubmitModal}
            />
            <CategoryBlock
              title="New Meme Coins"
              tooltipText="Recently traded fun and culture coins."
              headerColor="#CC5500"
              tokensList={memeCoinsList}
              promotedList={promotedMemeList}
              limit={memeLimit}
              setLimit={setMemeLimit}
              skeletonPrefix="meme-skel-mob"
              isLoading={isLoading}
              selectedToken={selectedToken}
              setSelectedToken={setSelectedToken}
              playAudioFeedback={playAudioFeedback}
              handleTagClick={handleTagClick} onPromote={openSubmitModal}
            />
            <CategoryBlock
              title="Latest RWA Tokens"
              tooltipText="Real-world assets (gold, real estate, etc.) tokenized on-chain."
              headerColor="#2EBA0E"
              tokensList={rwaTokensList}
              promotedList={promotedRwaList}
              limit={rwaLimit}
              setLimit={setRwaLimit}
              skeletonPrefix="rwa-skel-mob"
              isLoading={isLoading}
              selectedToken={selectedToken}
              setSelectedToken={setSelectedToken}
              playAudioFeedback={playAudioFeedback}
              handleTagClick={handleTagClick} onPromote={openSubmitModal}
            />
            <CategoryBlock
              title="Upcoming Presales & Airdrops"
              tooltipText="Early-access tokens before public trading opens."
              headerColor="#8A00E6"
              tokensList={upcomingPresaleList}
              promotedList={promotedPresaleList}
              limit={presaleLimit}
              setLimit={setPresaleLimit}
              skeletonPrefix="presale-skel-mob"
              isLoading={isLoading}
              selectedToken={selectedToken}
              setSelectedToken={setSelectedToken}
              playAudioFeedback={playAudioFeedback}
              handleTagClick={handleTagClick} onPromote={openSubmitModal}
            />
          </div>

          {/* Filtered Container View */}
          <div className={`transition-opacity duration-300 w-full ${activeFilter ? 'opacity-100 relative' : 'opacity-0 pointer-events-none absolute inset-x-0 top-0'}`}>
            <div ref={filterContainerRef} className="flex flex-col bg-[#0B0F19] rounded-xl overflow-hidden border border-[#1E293B]/40 shadow-lg">
              <div className="px-5 py-2.5 bg-[#0B0F19] flex items-center justify-between border-b border-[#1E293B]">
                <h2 className="font-oxanium text-[13px] font-extrabold tracking-[2px] text-white flex items-center gap-2">
                  Filtered Tokens: 
                  <button
                    onClick={() => {
                      playAudioFeedback('select');
                      setActiveFilter(null);
                    }}
                    type="button"
                    className="hover:text-[#51c9e2] transition-colors focus:outline-none"
                  >
                    #{activeFilter}
                  </button>
                </h2>
              </div>
              <div className="flex flex-col bg-[#0B0F19]">
                {isLoading ? (
                  <>
                    {[...Array(5)].map((_, i) => <SkeletonTokenRow key={`filter-skel-${i}`} />)}
                  </>
                ) : (
                  <>
                    {filteredTokens.filter(t => t.tags.includes(activeFilter || '')).map((token, index, arr) => (
                      <React.Fragment key={`${token.id}-filtered`}>
                        <TokenRowComponent 
                          token={token} 
                          onSelect={(t) => setSelectedToken(selectedToken?.id === t.id ? null : t)}
                          isExpanded={selectedToken?.id === token.id}
                          playAudioFeedback={() => playAudioFeedback('hover')}
                          hideBorder={index === arr.length - 1}
                          onTagClick={handleTagClick}
                          onPromote={openSubmitModal}
                        />
                      </React.Fragment>
                    ))}
                    {filteredTokens.filter(t => t.tags.includes(activeFilter || '')).length === 0 && (
                      <div className="p-8 text-center font-mono text-xs text-slate-500 bg-[#070A10]/10">
                        NO SIGNALS FOUND FOR THIS TAG
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

      </main>

      {currentView === 'home' && <SubscriptionTerminal />}

      <footer className="w-full bg-[#0B0F19] font-mono mt-16 pb-12 pt-16 border-t border-cyan-400/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col items-center">
          
          {/* Brand Sign-off */}
          <div className="flex flex-col items-center mb-8 w-full">
            <div className="border border-dashed border-slate-600 px-6 h-12 md:h-16 flex items-center justify-center mb-3 text-slate-500 tracking-widest text-xs md:text-sm text-center w-full max-w-sm">
              [ LOGO IMAGE GOES HERE (64–72px) ]
            </div>
            <div className="text-slate-500 text-xs tracking-widest text-center mt-2">
              [ YOUNGWHALE.IO <span className="text-green-400 animate-pulse">●</span> SONAR RADAR ACTIVE ]
            </div>
          </div>

          {/* System Routing / Links */}
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mb-8 text-xs md:text-sm tracking-widest">
            <a href="#" aria-label="X (Twitter)" className="text-slate-500 hover:text-cyan-400 transition-all duration-[120ms] hover:drop-shadow-[0_0_12px_#22d3ee80] cursor-pointer">[ 𝕏 ]</a>
            <button onClick={(e) => { e.preventDefault(); playAudioFeedback('select'); openSubmitModal(); }} className="text-slate-500 hover:text-cyan-400 transition-all duration-[120ms] hover:drop-shadow-[0_0_12px_#22d3ee80] cursor-pointer tracking-widest">[ SUBMIT TOKEN ]</button>
            <button onClick={(e) => { e.preventDefault(); playAudioFeedback('select'); setIsContactModalOpen(true); }} className="text-slate-500 hover:text-cyan-400 transition-all duration-[120ms] hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] cursor-pointer tracking-widest">[ CONTACT ]</button>
            <button onClick={(e) => { e.preventDefault(); playAudioFeedback('select'); setLegalModalTab('tc'); }} className="text-slate-500 hover:text-cyan-400 transition-all duration-[120ms] hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] cursor-pointer tracking-widest">[ T&C ]</button>
            <button onClick={(e) => { e.preventDefault(); playAudioFeedback('select'); setLegalModalTab('legal'); }} className="text-slate-500 hover:text-cyan-400 transition-all duration-[120ms] hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] cursor-pointer tracking-widest">[ LEGAL DISCLAIMER ]</button>
            <button onClick={(e) => { e.preventDefault(); playAudioFeedback('select'); setLegalModalTab('privacy'); }} className="text-slate-500 hover:text-cyan-400 transition-all duration-[120ms] hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] cursor-pointer tracking-widest">[ PRIVACY ]</button>
          </div>

          {/* Compliance & Disclaimers */}
          <div className="max-w-4xl text-left text-xs leading-relaxed text-slate-500/40 mb-10 px-4 md:px-0">
            All data provided on youngwhale.io is for informational purposes only and does not constitute financial or investment advice. Users acknowledge that youngwhale.io is an independent data aggregator; we are not affiliated or associated, directly or indirectly, with any token, cryptocurrency project, or exchange. Token data is displayed via a 24-hour TTL static snapshot; youngwhale.io does not track live prices, nor do we operate as an exchange. To prevent artificial hype, Sonar Scores are strictly capped at a maximum rating and remain valid exclusively for the initial 24-hour period. Please note: Sonar Scores reflect automated activity metrics, not project legitimacy, safety, or endorsement.
          </div>

          {/* CTO Mode Toggle */}
          <button 
            onClick={() => {
              playAudioFeedback('select');
              setCurrentView('cto');
            }} 
            className="text-[10px] uppercase tracking-widest text-[#94A3B8]/30 hover:text-[#51c9e2] transition-colors"
          >
            FOR CTO →
          </button>
        </div>
      </footer>

    </div>
  );
}
