import { TermsAndConditions } from '../components/TermsAndConditions'

export const metadata = {
  title: 'Terms and Conditions | YoungWhale.io',
  description: 'Read the Terms and Conditions for using YoungWhale.io cryptocurrency directory and data aggregator platform.',
}

export default function TermsPage() {
  return (
    <div className="min-h-dvh w-full bg-[#0B0F19] text-[#F8FAFC] font-outfit py-12 px-4">
      <TermsAndConditions />
    </div>
  )
}
