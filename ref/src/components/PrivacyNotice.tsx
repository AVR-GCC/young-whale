import React from 'react';

interface PrivacyNoticeProps {
  onBack: () => void;
  isModal?: boolean;
}

export const PrivacyNotice: React.FC<PrivacyNoticeProps> = ({ onBack, isModal }) => {
  const content = (
    <>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-6 mb-10">
          <div>
            <h1 className="font-outfit text-3xl font-bold tracking-tight text-[#F1F5F9] mb-2">
              Privacy Notice for youngwhale.io
            </h1>
            <p className="font-outfit text-sm text-slate-400">
              Last Updated: June 2026
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
            This Privacy Notice (“Notice”) describes how youngwhale.io (“we”, “us”, “our”, “ourselves”) collects and processes your Personal Data (“you”, “your”) through our website and services (collectively, our “Services”). By using our Services or engaging with us, you consent to the collection, storage, processing, and transfer of your Personal Data as described in this Privacy Notice.
          </p>
          <p>
            This Privacy Notice applies together with our Terms and Conditions and any other applicable operational documents.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-4">1. Our Relationship with You</h2>
            <p className="mb-3">
              Your right to privacy and the protection of your Personal Data is important to us. youngwhale.io is committed to the best practices in privacy, and we adhere strictly to the principle of data minimization. We only collect data when it is strictly necessary to provide our Services. By visiting our website or submitting your email address via our forms, you acknowledge and accept the procedures outlined in this Privacy Notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-4">2. Collection and Use of Your Personal Data</h2>
            <p className="mb-3">
              “Personal Data” is information that may identify an individual. Following best practices in privacy, we endeavour to collect only the absolute minimum amount of Personal Data necessary.
            </p>
            <p className="mb-3">
              <strong className="text-slate-300">Information You Provide to Us</strong><br />
              We do not require users to create accounts, log in, or provide personal profiles to use our platform. The only Personal Data we actively collect from you is your email address, and only if you voluntarily submit it to us via our email/contact forms (for example, to subscribe to a newsletter or contact customer support).
            </p>
            <p className="mb-3">
              <span className="text-[#CBD5E1]">Purpose of Processing:</span> To send you requested updates, respond to your inquiries, or provide customer assistance.<br />
              <span className="text-[#CBD5E1]">Legal Basis:</span> We rely on your consent. You may withdraw your consent at any time by clicking "unsubscribe" in our emails or by contacting us.
            </p>
            <p className="mb-3">
              <strong className="text-[#CBD5E1]">Personal Data Collected Automatically</strong><br />
              When you use our Services, our servers automatically collect basic service-related, diagnostic, and performance data to keep the website running securely.
            </p>
            <p className="mb-3">
              <span className="text-[#CBD5E1]">Device &amp; Log Data:</span> This may include your IP address, browser type, hardware model, operating system, pages viewed, and timestamps.<br />
              <span className="text-[#CBD5E1]">Purpose of Processing:</span> This data is used strictly for analytical purposes to improve website performance, monitor server health, and prevent fraudulent/malicious bot traffic.<br />
              <span className="text-[#CBD5E1]">Legal Basis:</span> Our legitimate interest in maintaining a secure, functional, and optimized digital environment.
            </p>
            <p>
              <strong className="text-[#CBD5E1]">Aggregated and Anonymized Data</strong><br />
              We use aggregated or anonymized data to improve our Services. This involves analyzing general usage trends without identifying individual users. We will never use your Personal Data for purposes incompatible with those outlined in this Notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-4">3. Use of Cookies</h2>
            <p className="mb-3">
              We use cookies and similar tools to enhance your user experience, ensure our Services function correctly, and understand how users navigate our site. Depending on applicable laws in your region, a cookie banner on your browser will allow you to accept or refuse non-essential cookies. You can adapt your choices in your browser's cookie preference settings at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-4">4. How and Why We Share Your Data</h2>
            <p className="mb-3">
              We are not in the business of selling our users’ Personal Data. We will only share your email address or automatically collected data in the following limited circumstances:
            </p>
            <p className="mb-3">
              <strong className="text-[#CBD5E1]">Service Providers:</strong> We may transfer data to trusted third-party service providers (such as web hosting services, cloud storage, and email delivery platforms) necessary for the operation of youngwhale.io. These providers only process data in accordance with our strict contractual agreements.
            </p>
            <p className="mb-3">
              <strong className="text-[#CBD5E1]">Business Transfers:</strong> In the event that youngwhale.io or substantially all of its assets are acquired by or merged with another company, user information generally is one of the transferred assets.
            </p>
            <p className="mb-3">
              <strong className="text-[#CBD5E1]">Legal Authorities and Protection:</strong> We will disclose Personal Data to legal authorities if we are required to do so by law, court order, or to enforce our Terms and Conditions, prevent fraud, or protect the rights, property, and safety of youngwhale.io and our users.
            </p>
            <p>
              <strong className="text-[#CBD5E1]">Note:</strong> Our website contains automated links to third-party cryptocurrency projects and platforms. These external platforms act as independent data controllers. This Privacy Notice does not cover their practices, and we encourage you to read the privacy policies of any third-party links you visit.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-4">5. International Transfer of Personal Data</h2>
            <p className="mb-3">
              We maintain servers hosted by trusted service providers, and your information may be processed on servers located outside of your country of residence. In instances where we process your Personal Data internationally, we implement appropriate technical, organizational, and contractual safeguards (such as Standard Contractual Clauses) to ensure that your data remains protected in compliance with applicable data protection laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-4">6. Data Security</h2>
            <p className="mb-3">
              We employ commercially reasonable physical, technical, and procedural measures to protect your email address and browsing data from unauthorized access, use, disclosure, alteration, or destruction. However, please note that no data transmission over the Internet can be guaranteed to be 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-4">7. Data Retention</h2>
            <p className="mb-3">
              We keep your Personal Data (such as your email address) only for as long as you remain subscribed to our communications or as long as it is required to fulfill the relevant purposes described in this Privacy Notice. When we have no ongoing legitimate business requirement to retain your Personal Data, we will securely delete or anonymize it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-4">8. What Privacy Rights Do You Have?</h2>
            <p className="mb-3">
              Subject to applicable laws (including GDPR and applicable US State Laws), you have a number of rights in relation to your Personal Data:
            </p>
            <p className="mb-3">
              <strong className="text-[#CBD5E1]">Right to Access &amp; Portability:</strong> You have the right to request a copy of the Personal Data we hold about you.
            </p>
            <p className="mb-3">
              <strong className="text-[#CBD5E1]">Right to Correct:</strong> You can request that we rectify any inaccurate data.
            </p>
            <p className="mb-3">
              <strong className="text-[#CBD5E1]">Right to Erase:</strong> You may request the deletion of your email address from our records at any time.
            </p>
            <p className="mb-3">
              <strong className="text-[#CBD5E1]">Right to Withdraw Consent / Opt-Out:</strong> You can withdraw your consent for email communications at any time by clicking "unsubscribe" or contacting us. We do not "sell" or "share" your personal information for targeted third-party advertising.
            </p>
            <p>
              <strong className="text-[#CBD5E1]">Submit a Privacy Request:</strong><br />
              To exercise any of your rights, please contact us and we will respond as quickly as possible, generally within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-4">9. Children</h2>
            <p className="mb-3">
              We do not knowingly solicit data from or market to any persons under 18 years of age. By using the Services, you represent that you are at least 18 years old. If we learn that Personal Data from users under 18 has been collected, we will take reasonable measures to promptly delete such data from our records.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-4">10. Contact Information</h2>
            <p className="mb-3">
              If you have any questions or concerns about how we collect and process your Personal Data, or if you wish to exercise your privacy rights, please reach out to us via the official contact form provided on the youngwhale.io website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-4">11. Conditions of Use, Notices and Revisions</h2>
            <p>
              Your use of our Services, and any dispute over privacy, is subject to this Privacy Notice and our Terms and Conditions (governed by the laws of England and Wales). We reserve the right to update and revise this Notice at any time to reflect changes in our business or legal requirements. If we make revisions, we will update the “Last Updated” date at the top of this document. Please review this Privacy Notice regularly. Your continued use of our Services constitutes your acceptance of any amended terms.
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
