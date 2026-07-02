import React from 'react';

interface TermsAndConditionsProps {
  onBack: () => void;
  isModal?: boolean;
}

export const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({ onBack, isModal }) => {
  const content = (
    <>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-6 mb-10">
          <div>
            <h1 className="font-outfit text-3xl font-bold tracking-tight text-[#F1F5F9] mb-2">
              Terms and Conditions for youngwhale.io
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
          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-4">1. Introduction</h2>
            <p className="mb-3">
              1.1 youngwhale.io is an independent cryptocurrency directory and data aggregator platform on which automated metrics, project trackers, and new cryptocurrency token listings are aggregated and viewed via a 24-hour Time-To-Live (TTL) static snapshot.
            </p>
            <p className="mb-3">
              1.2 youngwhale.io provides the following Services:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-3">
              <li>1.2.1 An automated Platform where cryptocurrency token data is collected daily from public blockchains and various external web sources by our proprietary systems and displayed on our interface (the "Website").</li>
              <li>1.2.2 Algorithmic traction tracking, featuring point-in-time metrics known as "Sonar Scores" to evaluate automated token activity metrics.</li>
              <li>1.2.3 Optional user registration features, allowing natural persons to create an Account to manage personalized tracking metrics or watchlists (a "User").</li>
              <li>1.2.4 Advertising services through explicitly marked banners on the Website and dedicated promoted or sponsored spots for third-party crypto projects.</li>
            </ul>
            <p className="mb-3">
              1.3 youngwhale.io does not vet, audit, verify, or monitor any of the listed tokens or third-party external data sources. Token listings on the Website are for general informational and educational purposes only. youngwhale.io does not provide any financial advice, act as a financial services provider or broker, or in any other way facilitate or aid in the execution of any transactions in cryptocurrency or otherwise.
            </p>
            <p className="mb-3">
              1.4 The market for digital assets, including cryptocurrency as tracked on the Website, is highly volatile, unpredictable, unregulated, and speculative. Digital assets rely entirely on technology and market trust, and may experience rapid price collapses or become completely worthless. Furthermore, tokens listed on the platform could potentially be fraudulent or malicious projects ("Scams") designed to induce market participants to invest financial resources that will be irretrievably lost. Each User assumes sole responsibility for conducting their own research (Do Your Own Research / DYOR) before interacting with any digital asset.
            </p>
            <p>
              1.5 These Terms and Conditions ("Terms"), along with our Privacy Policy, constitute a legally binding agreement made between the User (whether personally or on behalf of a legal entity) and youngwhale.io concerning your access to and use of the Website, platform, or associated tools.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-4">2. Eligibility</h2>
            <p>
              2.1 To access or use the Services, the User must be at least 18 years old. A User may not use the Services if youngwhale.io has previously terminated the User’s account or banned the User from accessing the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-4">3. Platform Data and Intellectual Property</h2>
            <p className="mb-3">
              3.1 All data displayed on the platform is gathered automatically from public ledgers and third-party web indexes. youngwhale.io does not host, permit, or accept user-generated project listings or crowd-sourced content submissions.
            </p>
            <p className="mb-3">
              3.2 youngwhale.io is the exclusive owner of all intellectual property rights vesting in and relating to the Services, including but not limited to the visual layout, design, text, proprietary analytics, Sonar Score algorithms, compilation methods, database structures, graphics, and trademarks ("Platform Content").
            </p>
            <p>
              3.3 Users are granted a non-transferable, non-sublicensable, non-exclusive, and revocable license for fair personal use of the platform. Any unauthorized copying, commercial extraction, data mining, web scraping, automated redistribution, or mirroring of the Website's content is strictly prohibited without prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-4">4. User Representations and Restrictions</h2>
            <p className="mb-3">
              4.1 When using the Services of youngwhale.io, the User represents, warrants, and agrees to refrain from:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>4.1.1 Using the Website or Services in any way that damages, disables, or overburdens the platform's infrastructure.</li>
              <li>4.1.2 Engaging in any automated use of the system, including but not limited to deploying data mining tools, robots, scrapers, or automated script queries.</li>
              <li>4.1.3 Attempting to bypass, reverse-engineer, or manipulate the predefined maximum rating caps built into the Sonar Score algorithm.</li>
              <li>4.1.4 Using any information obtained from the platform to perpetrate, facilitate, or promote financial fraud, market manipulation, or illegal activities.</li>
              <li>4.1.5 Attempting to impersonate another User or accessing an Account belonging to a third party without authorization.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-4">5. Third-Party Websites and External Content</h2>
            <p className="mb-3">
              5.1 The Website contains automated links to public blockchain explorers, smart contract addresses, project websites, and third-party resources on the internet. The User accesses all third-party links entirely at their own risk.
            </p>
            <p>
              5.2 These external platforms are not under the control of youngwhale.io. The User acknowledges and agrees that youngwhale.io is not responsible or liable for the content, functions, accuracy, safety, legality, or appropriateness of any external platforms, smart contracts, or decentralized protocols.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-4">6. Advertisements and Paid Promotions</h2>
            <p className="mb-3">
              6.1 youngwhale.io offers banner advertisement spots and promoted token positions ("Paid Content"). We maintain a strict operational boundary between objective aggregated data and advertising. We never mix organic data or listings with promoted content.
            </p>
            <p>
              6.2 Any paid or sponsored listing will always be clearly and explicitly marked as such. Paid listings are subject to the same strict disclaimers as organic listings; they are unverified by youngwhale.io, do not constitute endorsements, and may be removed or blocked immediately if flagged for security or legal compliance violations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-4">7. Accounts and Security</h2>
            <p className="mb-3">
              7.1 If a User registers an Account to access enhanced features (such as watchlists), the User is fully responsible for maintaining the confidentiality of their login credentials.
            </p>
            <p className="mb-3">
              7.2 The User guarantees that all registration data provided is accurate and complete. If a breach of security or unauthorized access to an Account is suspected, the User must notify youngwhale.io immediately via the official contact interfaces on the Website.
            </p>
            <p>
              7.3 youngwhale.io reserves the right, at its sole discretion, to suspend, block, or delete a User Account at any time, without prior notice or liability, if a violation of these Terms is detected.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-4">8. Disclaimers</h2>
            <p className="mb-3">
              8.1 youngwhale.io provides all services and content on an "as is" and "as available" basis without warranties of any kind, express or implied.
            </p>
            <p className="mb-3">
              8.2 We make no representations or warranties regarding the accuracy, timeliness, reliability, completeness, security, or continuous availability of any blockchain tracking data, contract addresses, or Sonar Scores displayed on the platform.
            </p>
            <p>
              8.3 Sonar Scores are purely automated activity metrics and are valid exclusively for the initial 24-hour snapshot period; they do not reflect project legitimacy, financial stability, investment suitability, or safety.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-4">9. Limitation of Liability</h2>
            <p className="mb-3">
              9.1 To the fullest extent permitted by applicable law, youngwhale.io, its founders, affiliates, officers, directors, and employees exclude all liability for any direct, indirect, incidental, or consequential damages, expenses, or losses (including total loss of funds, asset volatility, smart contract failures, or rug pulls) resulting from your reliance on platform data.
            </p>
            <p className="mb-3">
              9.2 In the event that youngwhale.io is found liable for any damage under applicable law, total liability shall be strictly limited to a maximum aggregate amount of EUR 100.
            </p>
            <p>
              9.3 Any legal claim arising out of or in connection with these Services must be filed in writing within one (1) year from the date the event giving rise to the liability occurred, failing which the claim shall permanently lapse.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-4">10. Indemnification</h2>
            <p>
              10.1 The User agrees to indemnify, defend, and hold harmless youngwhale.io and its personnel from any third-party claims, liabilities, losses, damages, or costs (including legal fees) arising from the User's violation of these Terms, misutilization of platform services, or infringement of any intellectual property or regulatory law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-4">11. Miscellaneous</h2>
            <p className="mb-3">
              11.1 youngwhale.io reserves the right to unilaterally modify, update, or replace these Terms at any time to reflect operational, technical, or regulatory shifts. Continued use of the platform following an update constitutes absolute acceptance of the revised Terms.
            </p>
            <p>
              11.2 If any provision of these Terms is determined to be invalid or unenforceable by a competent legal authority, that provision shall be limited or severed to the minimum extent necessary, and the remaining provisions shall continue in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-4">12. Applicable Law and Jurisdiction</h2>
            <p className="mb-3">
              12.1 These Terms, your use of the platform, and any dispute or claim arising out of or in connection with them (including non-contractual disputes) shall be governed by, and construed in accordance with, the laws of England and Wales.
            </p>
            <p>
              12.2 All disputes resulting from or arising in connection with these Terms that cannot be settled amicably shall be submitted exclusively to the jurisdiction of the courts of London, United Kingdom.
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
