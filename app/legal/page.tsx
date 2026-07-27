import { LegalDisclaimer } from '../components/LegalDisclaimer'

export const metadata = {
  title: 'Legal Disclaimer | YoungWhale.io',
  description: 'Read the Legal Disclaimer for YoungWhale.io. Important information about risks, liabilities, and terms of use.',
}

export default function LegalPage() {
  return (
    <div className="min-h-dvh w-full bg-[#0B0F19] text-[#F8FAFC] font-outfit py-12 px-4">
      <LegalDisclaimer />
    </div>
  )
}
