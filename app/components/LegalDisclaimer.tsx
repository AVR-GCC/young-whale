import React from 'react';

interface LegalDisclaimerProps {
  onBack: () => void;
  isModal?: boolean;
}

export const LegalDisclaimer: React.FC<LegalDisclaimerProps> = ({ onBack, isModal }) => {
  const content = (
    <>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-6 mb-10">
          <div>
            <h1 className="font-outfit text-3xl font-bold tracking-tight text-[#F1F5F9] mb-2">
              Legal Disclaimer and Terms of Use Notice
            </h1>
            <p className="font-outfit text-sm text-slate-400">
              Last updated: June 2026
            </p>
          </div>
          {!isModal && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 py-2 px-4 rounded font-mono text-xs font-bold bg-[#1E293B] hover:bg-[#334155] text-white transition-colors flex-shrink-0 ml-4"
            >
              ← BACK TO APP
            </button>
          )}
        </div>

        {/* Content */}
        <div className="space-y-10 leading-relaxed text-[#94A3B8] text-left">
          <p>
            By accessing and using youngwhale.io (the &quot;Website&quot;), you unconditionally agree to be bound by this Disclaimer, as well as our Terms &amp; Conditions and Privacy Policy. If you do not agree, you must immediately cease using the Website.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-4">1. General Informational Purpose Only (No Professional Advice)</h2>
            <p className="mb-3">
              The information provided on youngwhale.io is for general informational and educational purposes only.
            </p>
            <p className="mb-3">
              <strong className="text-slate-300">No Financial or Investment Advice:</strong> youngwhale.io is neither an investment advisor nor a broker-dealer. No content on the website constitutes—or should be understood as constituting—investment, financial, or trading advice, or a recommendation to buy, sell, or hold any cryptocurrency or digital asset.
            </p>
            <p>
              <strong className="text-[#CBD5E1]">No Legal or Tax Advice:</strong> We are neither lawyers nor accountants. No content on this website constitutes legal, tax, or accounting advice. You should seek independent advice from a licensed professional regarding your specific financial and legal circumstances.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-4">2. Extreme Risk Warning and Potential Scams</h2>
            <p className="mb-3">
              Cryptocurrency tokens and initial listings (including ICOs, IDOs, IEOs, and meme tokens) are inherently highly risky, unregulated, and extremely speculative.
            </p>
            <p className="mb-3">
              <strong className="text-[#CBD5E1]">Risk of Total Loss:</strong> Projects are in early stages of development, utilize experimental software, and carry volatile, unpredictable, and opaque pricing. Engaging with these projects involves the material risk of losing your entire financial contribution.
            </p>
            <p>
              <strong className="text-[#CBD5E1]">Potential for Fraud and Scams:</strong> Tokens listed on this website may be malicious or fraudulent (including honeypots, rug pulls, or exit scams) designed to induce you to invest resources that cannot be recovered. youngwhale.io lists new tokens every 24 hours, but this automation or frequency does not mean the assets are safe.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-4">3. Automated Data Collection and Verification (DYOR)</h2>
            <p className="mb-3">
              All token data and related information displayed on youngwhale.io is collected daily from public blockchains and various external web sources by our automated systems. We do not host user-generated content.
            </p>
            <p className="mb-3">
              <strong className="text-[#CBD5E1]">As-Is Information:</strong> All information is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind, express or implied.
            </p>
            <p>
              <strong className="text-[#CBD5E1]">Do Your Own Research (DYOR):</strong> youngwhale.io does not vet, audit, or guarantee the accuracy, timeliness, reliability, or completeness of any project information, contract addresses, whitepapers, or marketing claims pulled from the blockchain or web. It is of the utmost importance that you conduct your own due diligence and verify all facts independently before interacting with any digital asset.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-4">4. Non-Affiliation and Strict Separation of Content</h2>
            <p className="mb-3">
              youngwhale.io operates as an independent data aggregator.
            </p>
            <p className="mb-3">
              <strong className="text-[#CBD5E1]">No Affiliation:</strong> We are not affiliated, associated, or connected—directly or indirectly—with any token, cryptocurrency project, or development team listed on this platform. The appearance, ranking, or organic listing of a token does not imply an endorsement, guarantee, warranty, or recommendation by us.
            </p>
            <p className="mb-3">
              <strong className="text-[#CBD5E1]">No Mixing of Data:</strong> We maintain a strict boundary between our objective data and advertising. We never mix organic data or listings with promoted content.
            </p>
            <p className="mb-3">
              <strong className="text-[#CBD5E1]">Transparent Advertising:</strong> youngwhale.io, including its owners, officers, and employees, may receive a fixed fee or affiliate compensation for advertising certain token sales or third-party links. Any promoted, sponsored, or paid listing is always explicitly and clearly marked as such.
            </p>
            <p>
              <strong className="text-[#CBD5E1]">Third-Party Hyperlinks:</strong> Clicking on external hyperlinks or advertisements means you are accessing third-party services at your own risk. youngwhale.io is not responsible for the performance, security, or actions of external platforms or decentralized protocols.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-4">5. Limitation of Liability</h2>
            <p className="mb-3">
              To the maximum extent permitted by applicable law, youngwhale.io, its affiliates, owners, officers, directors, and employees shall not be liable for any direct, indirect, incidental, consequential, or punitive damages, expenses, or losses (including loss of funds, data, or profits) arising out of or relating to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-3">
              <li>Your use of or reliance on any information found on the website.</li>
              <li>Any errors, omissions, inaccuracies, or missing data on the platform.</li>
              <li>Exploits, smart contract failures, or malicious actions executed by third-party projects listed on the platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-4">6. User Warranties and Compliance</h2>
            <p className="mb-3">
              By using this website, you warrant and represent that:
            </p>
            <p className="mb-3">
              <strong className="text-[#CBD5E1]">Anti-Money Laundering (AML):</strong> No funds or assets used by you in connection with projects found on youngwhale.io are derived from money laundering or other unlawful activities. You will maintain strict compliance with all applicable anti-money laundering and counter-terrorist financing regulations.
            </p>
            <p className="mb-3">
              <strong className="text-[#CBD5E1]">Anti-Bribery:</strong> You will not transfer anything of value, directly or indirectly, to any government official or private entity to obtain an improper benefit or advantage in connection with your use of the website.
            </p>
            <p>
              <strong className="text-[#CBD5E1]">Regulatory Compliance:</strong> You are solely responsible for ensuring that accessing this website and participating in digital asset offerings is lawful within your specific local jurisdiction. Tokens may constitute securities under various local laws and may be restricted from being offered to residents of certain countries (such as the United States).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-4">7. Copyright Notice and Intellectual Property</h2>
            <p className="mb-3">
              The visual layout, design, text, analytics, compilation, database structures, and graphics on youngwhale.io are protected under copyright and database laws as original intellectual property.
            </p>
            <p>
              <strong className="text-[#CBD5E1]">Unauthorized Extraction:</strong> Any unauthorized copying, commercial extraction, data mining, scraping, or automated redistribution of the website’s content is strictly prohibited, unless explicitly permitted by an authorized, purchased license or mandatory applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-4">8. Governing Language</h2>
            <p>
              This website and its disclosures may be translated into languages other than English for convenience purposes. In the event of any conflict, discrepancy, or inconsistency between the English version and a translated version, the English-language version shall be the official, controlling text.
            </p>
          </section>
        </div>
      </div>
    </>
  );

  return isModal ? (
    <div className="text-slate-50 font-outfit selection:bg-cyan-400/30 selection:text-cyan-400">
      {content}
    </div>
  ) : (
    <div className="min-h-screen bg-deep text-[#F8FAFC] font-outfit p-6 md:p-12 selection:bg-cyan-400/30 selection:text-cyan-400">
      {content}
    </div>
  );
};
