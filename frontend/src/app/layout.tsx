import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BlockChain Identity | Secure Decentralized Credentials',
  description: 'A blockchain-powered digital identity and credential management system enabling instant verification of academic & professional records.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-dark-900 text-white antialiased">
        {children}
      </body>
    </html>
  )
}
