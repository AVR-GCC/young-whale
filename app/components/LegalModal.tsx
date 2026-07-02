import React, { useState } from 'react';
import { LegalDisclaimer } from './LegalDisclaimer';
import { TermsAndConditions } from './TermsAndConditions';
import { PrivacyNotice } from './PrivacyNotice';
import { X } from 'lucide-react';

export type LegalTab = 'tc' | 'legal' | 'privacy';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTab;
}

interface LegalModalContentProps {
  onClose: () => void;
  initialTab: LegalTab;
}

const LegalModalContent: React.FC<LegalModalContentProps> = ({ onClose, initialTab }) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-deep/90 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl bg-[#0B0F19] border border-slate-800 rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header / Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-800 p-4 gap-4">
          <div className="flex gap-2 sm:gap-4 overflow-x-auto w-full sm:w-auto scrollbar-hide py-1">
            <button
              onClick={() => setActiveTab('tc')}
              className={`px-4 py-2 rounded font-mono text-xs font-bold transition-colors whitespace-nowrap ${activeTab === 'tc' ? 'bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              [ T&C ]
            </button>
            <button
              onClick={() => setActiveTab('legal')}
              className={`px-4 py-2 rounded font-mono text-xs font-bold transition-colors whitespace-nowrap ${activeTab === 'legal' ? 'bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              [ LEGAL DISCLAIMER ]
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-4 py-2 rounded font-mono text-xs font-bold transition-colors whitespace-nowrap ${activeTab === 'privacy' ? 'bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              [ PRIVACY ]
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white transition-colors rounded hover:bg-white/10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
          {activeTab === 'tc' && <TermsAndConditions onBack={onClose} isModal />}
          {activeTab === 'legal' && <LegalDisclaimer onBack={onClose} isModal />}
          {activeTab === 'privacy' && <PrivacyNotice onBack={onClose} isModal />}
        </div>
      </div>
    </div>
  );
};

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, initialTab = 'tc' }) => {
  if (!isOpen) return null;

  return <LegalModalContent initialTab={initialTab} onClose={onClose} />;
};
