import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/Providers'

export const metadata: Metadata = {
  title: 'TradeX - Global B2B Wholesale Marketplace',
  description: 'Connect with verified Indian exporters.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
