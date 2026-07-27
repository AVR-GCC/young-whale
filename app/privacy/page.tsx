import { PrivacyNotice } from '../components/PrivacyNotice'

export const metadata = {
  title: 'Privacy Policy | YoungWhale.io',
  description: 'Read the Privacy Policy for YoungWhale.io. Learn how we collect, use, and protect your personal data.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh w-full bg-[#0B0F19] text-[#F8FAFC] font-outfit py-12 px-4">
      <PrivacyNotice />
    </div>
  )
}
