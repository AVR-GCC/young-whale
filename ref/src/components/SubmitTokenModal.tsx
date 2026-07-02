import React, { useState, useEffect } from 'react';
import { ArrowLeft, Pin } from 'lucide-react';

interface SubmitTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  promoteTokenName?: string | null;
}

export const SubmitTokenModal: React.FC<SubmitTokenModalProps> = ({ isOpen, onClose, promoteTokenName }) => {
  const [step, setStep] = useState(1);
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [tier, setTier] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setUrl('');
      setEmail('');
      setTier(null);
      setCopied(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && (promoteTokenName || url)) {
      setStep(2);
    }
  };

  const handleSelectTier = (amount: number) => {
    setTier(amount);
    setStep(3);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText("0x1A2b3C4d5E6f7A8b9C0d1E2f3A4b5C6d7E8f9A0B");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setCopied(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 relative">
            <h2 className="text-xl text-white font-oxanium font-extrabold tracking-[2px] uppercase mb-8 text-center text-shadow-sm">
              [ {promoteTokenName ? `PROMOTE ${promoteTokenName}` : 'TOKEN SUBMISSION PROTOCOL'} ]
            </h2>
            <form onSubmit={handleNext} className="space-y-4">
              {!promoteTokenName && (
                <input
                  type="text"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Project URL [ newtoken.com ]"
                  className="w-full bg-black text-slate-400 placeholder-slate-600 border border-slate-700 p-3 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono text-sm"
                />
              )}
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email [ operator@... ]"
                className="w-full bg-black text-slate-400 placeholder-slate-600 border border-slate-700 p-3 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono text-sm"
              />
              <button
                type="submit"
                className="w-full py-3 mt-4 text-cyan-400 border border-cyan-400 hover:bg-cyan-400/10 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all font-bold tracking-widest uppercase"
              >
                [ NEXT ]
              </button>
            </form>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 relative">
            <button
              onClick={goBack}
              className="absolute -top-[1.25rem] left-0 text-[#00AACC] hover:text-cyan-300 transition-colors"
            >
              <ArrowLeft className="w-8 h-8" strokeWidth={1.5} />
            </button>
            <h2 className="text-xl text-white font-oxanium font-extrabold tracking-[2px] uppercase mb-8 text-center text-shadow-sm pt-2">
              [ SELECT PROMOTION ]
            </h2>
            <div className="space-y-4">
              <button
                onClick={() => handleSelectTier(2000)}
                className="w-full text-left p-4 border border-white hover:border-cyan-400/50 hover:bg-cyan-900/20 transition-all font-mono flex justify-between items-center text-slate-300 hover:text-cyan-300 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 flex items-center justify-center rounded-full bg-[#1E293B] text-slate-300 group-hover:text-cyan-300 transition-colors">
                    <Pin className="w-3.5 h-3.5" />
                  </div>
                  <span>30-DAY HOMEPAGE FEATURED</span>
                </div>
                <span>$2,000</span>
              </button>
              <button
                onClick={() => handleSelectTier(3000)}
                className="w-full text-left p-4 border border-white hover:border-yellow-400/50 bg-yellow-500/10 hover:bg-yellow-500/20 transition-all font-mono flex justify-between items-center text-slate-300 hover:text-yellow-300 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 flex items-center justify-center rounded-full bg-[#1E293B] text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.6)]">
                    <Pin className="w-3.5 h-3.5" />
                  </div>
                  <span>30-DAY HOMEPAGE FEATURED AND HIGHLIGHTED</span>
                </div>
                <span>$3,000</span>
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 relative">
            <button
              onClick={goBack}
              className="absolute -top-[1.25rem] left-0 text-[#00AACC] hover:text-cyan-300 transition-colors"
            >
              <ArrowLeft className="w-8 h-8" strokeWidth={1.5} />
            </button>
            <h2 className="text-xl text-cyan-400 animate-pulse font-oxanium font-extrabold tracking-[2px] uppercase mb-8 text-center text-shadow-sm pt-2">
              [ AWAITING TRANSACTION ]
            </h2>
            <div className="space-y-4 font-mono text-sm">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">TOKEN:</span>
                <span className="text-white truncate max-w-[200px]" title={promoteTokenName || url}>{promoteTokenName || url}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">PACKAGE:</span>
                <span className="text-white text-right whitespace-nowrap">{tier === 3000 ? '30-Day Homepage Featured + Highlighted' : '30-Day Homepage Featured'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">AMOUNT DUE:</span>
                <span className="text-white">${tier?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">NETWORK:</span>
                <span className="text-white">ERC-20</span>
              </div>
              
              <div className="mt-6 pt-4">
                <div className="text-slate-400 mb-2 uppercase tracking-wider text-xs">Receiving Wallet Address:</div>
                <div className="bg-black border border-slate-700 p-4 break-all text-cyan-300 text-center selection:bg-cyan-900">
                  0x1A2b3C4d5E6f7A8b9C0d1E2f3A4b5C6d7E8f9A0B
                </div>
                <button
                  onClick={copyToClipboard}
                  className="w-full py-3 mt-4 text-slate-300 border border-slate-600 hover:bg-slate-800 hover:border-slate-500 hover:text-white transition-all font-bold tracking-widest uppercase flex items-center justify-center gap-2"
                >
                  {copied ? '[ COPIED ]' : '[ COPY ADDRESS ]'}
                </button>
              </div>

              <div className="text-slate-500 text-xs text-center mt-6 leading-relaxed px-4">
                System will automatically verify transaction via block explorer. Token will be promoted within 24 hours.
              </div>

              <div className="flex items-center justify-center space-x-3 text-cyan-400 mt-6 pt-2 text-xs tracking-[2px] font-mono font-bold animate-pulse">
                <div className="w-3.5 h-3.5 border border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin shrink-0"></div>
                <span>TRANSACTION PENDING ON ERC-20</span>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-lg md:max-w-lg bg-deep border border-cyan-400/20 shadow-[inset_0_0_20px_rgba(34,211,238,0.05)] rounded p-8 font-mono" onClick={(e) => e.stopPropagation()}>
        {renderStep()}
      </div>
    </div>
  );
};
