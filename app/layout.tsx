import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

// Get the base URL for metadata
const getBaseUrl = () => {
  // In production (Vercel)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Custom base URL from environment
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  
  // Development fallback
  return 'http://localhost:3000';
};

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: 'Trenches Buddy - AI Trading Companion for Solana DeFi',
  description: 'Your AI-powered trading companion designed to learn, adapt, and thrive in the trenches of Solana\'s DeFi ecosystem.',
  keywords: 'AI trading, Solana, DeFi, trading bot, cryptocurrency, BUDDY token',
  authors: [{ name: 'Trenches Buddy Team' }],
  openGraph: {
    title: 'Trenches Buddy - AI Trading Companion',
    description: 'Deploy, customize, and teach your AI trading buddy through an intuitive chat interface.',
    type: 'website',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trenches Buddy - AI Trading Companion',
    description: 'Your AI partner in the trenches of Solana\'s DeFi battlefield.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
          {children}
        </div>
      </body>
    </html>
  )
} 