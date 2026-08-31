import type { Metadata } from 'next'
import { Outfit, Oxanium, JetBrains_Mono, Space_Mono } from 'next/font/google'
import Script from 'next/script'
import './index.css'
import { YMYLTrustSignals } from './components/YMYLTrustSignals'

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

const oxanium = Oxanium({
  variable: '--font-oxanium',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

const spaceMono = Space_Mono({
  variable: '--font-space-mono',
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: 'Young Whale - New Token Listings',
  description: 'Explore latest cryptocurrency tokens across Tech, Meme, Real world assets and Presale',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${oxanium.variable} ${jetbrainsMono.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-Q624V34H8T"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-Q624V34H8T');
        `}
      </Script>
      <body className="min-h-full flex flex-col">
        <Script
          id="clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "y8ix3k6t75");
            `,
          }}
        />
        <div className="order-1 sm:order-2 flex-1 flex flex-col">
          {children}
        </div>
        <div className="order-2 sm:order-1">
          <YMYLTrustSignals />
        </div>
      </body>
    </html>
  )
}
