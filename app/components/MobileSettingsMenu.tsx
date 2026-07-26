'use client'

import { ChevronLeft } from "lucide-react";
import { PrivacyNotice } from "./PrivacyNotice";
import { LegalDisclaimer } from "./LegalDisclaimer";
import { TermsAndConditions } from "./TermsAndConditions";
import MobileSettingsDirectory from "./MobileSettingsDirectory";
import { RequestInvite } from "./RequestInvite";
import { SubmitToken } from "./SubmitToken";
import { ContactForm } from "./ContactForm";

interface MobileSettingsMenuProps {
  view: string;
  setView: (view: string) => void
}

const titles: Record<string, string> = {
  contact: 'Contact Us',
  invite: 'Community Invite',
  promote: 'Promote Token',
  tc: 'Terms & Conditions',
  privacy: 'Privacy Policy',
  legal: 'Legal Disclaimer'
}

export default function MobileSettingsMenu({
  view,
  setView
}: MobileSettingsMenuProps) {
  const setToDirectory = () => setView('directory');

  const content: Record<string, React.ReactNode> = {
    directory: <MobileSettingsDirectory setView={setView} />,
    invite: <RequestInvite onClose={setToDirectory} hideHeader />,
    promote: <SubmitToken onClose={setToDirectory} />, // promoteTokenName={promoteTokenName} />,
    contact: <ContactForm onClose={setToDirectory} hideHeader />,
    tc: <TermsAndConditions onBack={setToDirectory} isModal={true} />,
    legal: <LegalDisclaimer onBack={setToDirectory} isModal={true} />,
    privacy: <PrivacyNotice onBack={setToDirectory} isModal={true} />
  }

  return (
    <div id="system-directory" className="flex-1 flex flex-col font-mono text-left pt-0 pb-0 px-4 bg-[#0B0F19] overflow-hidden">
      {view !== 'directory' && (
        <button onClick={setToDirectory} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors pb-4 w-full text-left uppercase font-bold text-sm tracking-widest font-outfit">
          <ChevronLeft className="w-5 h-5" />
          {titles[view]}
        </button>
      )}
      <div className="flex-1 w-full text-sm flex flex-col">
        {content[view]}
      </div>
    </div>
  );
}
