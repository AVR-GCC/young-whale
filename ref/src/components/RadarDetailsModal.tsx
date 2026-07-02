import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TokenItem } from '../types';
import { ChainIcon } from './ChainIcon';
import { 
  X, 
  Volume2, 
  VolumeX, 
  ExternalLink, 
  Globe, 
  Radio, 
  Copy, 
  Check, 
  TrendingUp, 
  ShieldAlert, 
  AlertTriangle,
  Zap
} from 'lucide-react';

interface RadarDetailsModalProps {
  token: TokenItem | null;
  onClose: () => void;
  playAudioFeedback: () => void;
}

export const RadarDetailsModal: React.FC<RadarDetailsModalProps> = ({ 
  token, 
  onClose, 
  playAudioFeedback 
}) => {
  const [copied, setCopied] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  useEffect(() => {
    // Stop voice if token changes or modal closes
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [token]);

  if (!token) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(`sonar:${token.id}:${token.scoreValue || '-'}`);
    setCopied(true);
    playAudioFeedback();
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleToggleVoice = () => {
    if (!window.speechSynthesis) return;

    if (isPlayingVoice) {
      window.speechSynthesis.cancel();
      setIsPlayingVoice(false);
    } else {
      window.speechSynthesis.cancel();
      try {
        const text = `Signal locked on. Project ${token.name} operates on ${token.chain}. Current whale rating scores ${token.scoreValue || 'undefined'}. Radar brief: ${token.curatorInsight || token.description}`;
        const utterance = new window.SpeechSynthesisUtterance(text);
        utterance.rate = 1.05;
        utterance.pitch = 0.95; // slightly lower deep computerized voice
        
        utterance.onend = () => {
          setIsPlayingVoice(false);
        };
        
        utterance.onerror = () => {
          setIsPlayingVoice(false);
        };

        setIsPlayingVoice(true);
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.error("SpeechSynthesisUtterance is not supported in this environment.", e);
        setIsPlayingVoice(false);
      }
    }
    playAudioFeedback();
  };

  const getRiskBadgeColor = (risk?: string) => {
    switch (risk) {
      case 'LOW':
        return 'text-[#00FA9A] bg-[#00FA9A]/10 border-[#00FA9A]/20';
      case 'MEDIUM':
        return 'text-[#F5A623] bg-[#F5A623]/10 border-[#F5A623]/20';
      case 'HIGH':
        return 'text-[#FF4A4A] bg-[#FF4A4A]/10 border-[#FF4A4A]/20';
      default:
        return 'text-slate-400 bg-[#94A3B8]/10 border-[#1E293B]';
    }
  };

  // Radar score styles
  const isPerfect = token.scoreType === 'perfect';
  const isExpired = token.scoreType === 'expired';

  const getCategoryColor = (category: string) => {
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

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'new-tech-projects':
        return 'NEW TECH PROJECTS';
      case 'new-meme-coins':
        return 'NEW MEME COINS';
      case 'latest-rwa-tokens':
        return 'LATEST RWA TOKENS';
      case 'upcoming-presale':
        return 'UPCOMING PRESALES';
      default:
        return category.toUpperCase().replace(/-/g, ' ');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Underlay Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#070A10]/80 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-[#1E293B] bg-terminal p-6 shadow-2xl md:p-8"
        >
          {/* Futuristic Background Accents */}
          <div className="absolute top-0 right-0 h-48 w-48 bg-gradient-to-bl from-cyan-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 h-48 w-48 bg-gradient-to-tr from-violet-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

          {/* Close trigger top-right */}
          <button 
            type="button"
            id="modal-close-btn"
            onClick={() => {
              onClose();
              playAudioFeedback();
            }}
            className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#1E293B] bg-[#070A10]/60 text-[#94A3B8] hover:bg-[#1E293B] hover:text-slate-50 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Modal Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 border-b border-[#1E293B] pb-6 mb-6">
            
            {/* Visual Circular Radar Indicator */}
            <div className="relative flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-[#070A10] border border-[#1E293B]">
              {/* Spinning sweep arm */}
              {!isExpired && (
                <div className="absolute inset-0 rounded-full border border-dashed border-cyan-500/10 animate-[spin_5s_linear_infinite]" />
              )}
              {isPerfect && (
                <div className="absolute inset-2 rounded-full border border-[#F5A623]/20 animate-pulse" />
              )}
              {/* Score circle */}
              {!token.isPromoted && (
                <div 
                  className={`w-11 h-11 rounded-full flex items-center justify-center border-2 bg-slate-950/50 font-oxanium text-2xl font-bold select-none ${isExpired ? 'border-dashed' : 'border-solid'}`}
                  style={{
                    borderColor: isExpired ? '#475569' : (token.scoreValue === undefined ? '#FFD700' : '#FFFFFF'),
                    color: isExpired ? '#475569' : (token.scoreValue === undefined ? '#FFD700' : '#FFFFFF')
                  }}
                >
                  {isExpired ? '-' : (token.scoreValue !== undefined ? token.scoreValue : '★')}
                </div>
              )}
            </div>

            {/* Title & Metadata */}
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-outfit text-2xl font-bold text-[#F8FAFC] tracking-tight flex items-center gap-2">
                  {token.name}
                  <span className="font-mono text-xs text-[#A7F3D0] bg-[#10B981]/15 border border-[#10B981]/25 px-1.5 py-0.5 rounded font-bold shrink-0">
                    ${token.symbol || token.name.slice(0, 4).toUpperCase()}
                  </span>
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase border ${getRiskBadgeColor(token.riskScore)}`}>
                  {token.riskScore} RISK
                </span>
                {isPerfect && (
                  <span className="text-[10px] bg-[#F5A623]/10 text-[#F5A623] border border-[#F5A623]/25 px-2 py-0.5 rounded font-mono font-bold tracking-wider uppercase">
                    💥 EXTREME CONVICTION
                  </span>
                )}
              </div>
              <p className="font-outfit text-[#94A3B8] text-sm mt-1">
                Category: <span className="font-semibold uppercase tracking-[2px] font-oxanium text-[11px] text-opacity-90" style={{ color: getCategoryColor(token.category) }}>
                  {getCategoryDisplayName(token.category)}
                </span>
              </p>
            </div>
          </div>

          {/* Grid Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left side: Animated Radar Scanning Console */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-[#070A10] border border-[#1E293B] rounded-xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:16px_16px]" />
              
              {/* Outer radar grid ring */}
              <div className="relative w-32 h-32 rounded-full border border-cyan-500/10 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-cyan-500/5" />
                <div className="absolute w-24 h-24 rounded-full border border-cyan-500/15" />
                <div className="absolute w-12 h-12 rounded-full border border-cyan-500/20" />
                
                {/* Horizontal crosshair */}
                <div className="absolute w-full h-[1px] bg-cyan-500/5" />
                {/* Vertical crosshair */}
                <div className="absolute h-full w-[1px] bg-cyan-500/5" />
                
                {/* Rotating holographic scanner line */}
                {!isExpired && (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    className="absolute inset-0 rounded-full origin-center"
                    style={{
                      background: 'conic-gradient(from 0deg, transparent 50%, rgba(0, 229, 210, 0.15) 100%)'
                    }}
                  />
                )}

                {/* Pulsing signal intercept dot */}
                {!isExpired ? (
                  <div className={`absolute top-1/4 right-1/3 w-3 h-3 rounded-full mr-1 mr-1.5 animate-ping
                    ${isPerfect ? 'bg-[#F5A623]' : 'bg-cyan-400'}`} />
                ) : (
                  <div className="absolute text-[#334155] font-mono text-xs font-bold">MUTED</div>
                )}
                {!isExpired && (
                  <div className={`absolute top-1/4 right-1/3 w-2 h-2 rounded-full ${isPerfect ? 'bg-[#F5A623]' : 'bg-[#00E5D2]'}`} />
                )}
              </div>

              {/* Status and Sound Triggers */}
              <div className="mt-4 text-center z-10">
                <div className="text-[10px] font-mono text-[#94A3B8] tracking-widest uppercase">
                  {isExpired ? 'SIGNAL DEAD' : 'RECEIVING INTERCEPT'}
                </div>
                <div className="flex justify-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={handleToggleVoice}
                    className={`flex items-center gap-1.5 text-[11px] font-mono px-2 py-1 rounded transition-all cursor-pointer border
                      ${isPlayingVoice 
                        ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 font-bold' 
                        : 'bg-[#131A26]/80 text-[#94A3B8] border-[#1E293B] hover:text-[#F8FAFC]'}`}
                  >
                    {isPlayingVoice ? <Volume2 className="h-3.5 w-3.5 animate-bounce" /> : <VolumeX className="h-3.5 w-3.5" />}
                    TACK-VOICE
                  </button>
                </div>
              </div>
            </div>

            {/* Right side: Detailed Metrics & Readout report */}
            <div className="md:col-span-8 flex flex-col justify-between">
              
              {/* Numerical Metrics Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-[#1E293B]/60 bg-[#070A10]/40 rounded-lg p-3">
                  <div className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-wider">CHAIN / VERIFICATION</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[#F8FAFC]"><ChainIcon chainName={token.chain} className="w-4 h-4 text-cyan-400" /></span>
                    <span className="font-outfit text-sm text-[#F8FAFC] font-medium">{token.chain} Node</span>
                  </div>
                </div>

                <div className="border border-[#1E293B]/60 bg-[#070A10]/40 rounded-lg p-3">
                  <div className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-wider">24H SONOR VOLUME</div>
                  <p className="font-mono text-sm text-[#F8FAFC] mt-1 font-semibold">{token.volume24h || 'N/A'}</p>
                </div>

                <div className="border border-[#1E293B]/60 bg-[#070A10]/40 rounded-lg p-3 col-span-2">
                  <div className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-wider">BACKING PARTNERS</div>
                  <p className="font-outfit text-sm text-[#F8FAFC] mt-1 line-clamp-1">{token.backing || 'Undisclosed institutional pool'}</p>
                </div>
              </div>

              {/* Curator Qualitative Analysis Paragraph */}
              <div className="mt-4 p-4 border border-[#1E293B] bg-[#070A10]/30 rounded-lg">
                <div className="flex items-center gap-1.5 text-xs text-amber-500 font-mono tracking-widest uppercase mb-1.5">
                  <Radio className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                  Whale Intelligence Analysis
                </div>
                <p className="font-outfit text-slate-300 text-sm leading-relaxed font-light">
                  {token.curatorInsight}
                </p>
              </div>

            </div>
          </div>

          {/* Socials & Action Button Tray */}
          <div className="mt-6 pt-5 border-t border-[#1E293B] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            
            {/* Quick action buttons */}
            <div className="flex items-center gap-3">
              {token.socials?.website && (
                <a 
                  href={token.socials.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-1.5 text-xs font-mono text-[#94A3B8] hover:text-cyan-400 transition-colors border border-[#1E293B] px-3 py-2 rounded-lg bg-[#070A10]"
                >
                  <Globe className="h-3.5 w-3.5" />
                  LAUNCH SITE
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
              
              <button
                type="button"
                id="copy-radar-btn"
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 text-xs font-mono text-[#94A3B8] hover:text-cyan-400 transition-colors border border-[#1E293B] px-3 py-2 rounded-lg bg-[#070A10]"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'COPIED ID' : 'COPY RADAR ID'}
              </button>
            </div>

            {/* Heavy locked-on tactical subscription */}
            <button
              type="button"
              id="simulate-node-trigger"
              onClick={() => {
                playAudioFeedback();
                alert(`Tactical simulated signal trigger broadcast for: ${token.name}. Standard mock lock-on initialized.`);
              }}
              disabled={isExpired}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-mono font-semibold tracking-wider transition-all shadow-lg cursor-pointer
                ${isExpired 
                  ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-40' 
                  : isPerfect
                    ? 'bg-gradient-to-r from-[#F5A623] to-[#FF8C00] text-[#070A10] hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-gradient-to-r from-cyan-400 to-cyan-600 text-[#070A10] hover:scale-[1.02] active:scale-[0.98]'}`}
            >
              <Zap className="h-4 w-4" />
              {isExpired ? 'SIGNAL OFFLINE' : 'TRIGGER LOCK-ON NODE'}
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
