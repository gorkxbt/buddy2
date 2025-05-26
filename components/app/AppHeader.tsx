'use client'

import { useState, useEffect } from 'react'
import { Wallet, Settings, LogOut, Activity, Zap } from 'lucide-react'
import { walletManager, WalletInfo } from '../../lib/wallet'
import Link from 'next/link'

export default function AppHeader() {
  const [wallet, setWallet] = useState<WalletInfo | null>(null)

  useEffect(() => {
    // Set up wallet listener
    walletManager.onWalletChange((walletInfo: WalletInfo | null) => {
      setWallet(walletInfo)
    })

    // Check initial wallet state
    const currentWallet = walletManager.getWalletInfo()
    if (currentWallet) {
      setWallet(currentWallet)
    }
  }, [])

  const disconnectWallet = async () => {
    await walletManager.disconnect()
  }

  return (
    <header className="bg-gradient-to-r from-purple-900/90 via-blue-900/90 to-indigo-900/90 backdrop-blur-xl border-b border-purple-500/30 sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Trenches Buddy
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {wallet ? (
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 px-4 py-2 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                    <span className="text-sm text-white font-mono font-bold">
                      {wallet.publicKey.slice(0, 6)}...{wallet.publicKey.slice(-4)}
                    </span>
                    <span className="text-xs text-green-300 font-bold">
                      💰 {wallet.balance.toFixed(2)} SOL
                    </span>
                  </div>
                </div>
                
                <button className="p-2 text-blue-300 hover:text-white transition-colors hover:bg-blue-500/20 rounded-lg">
                  <Settings className="h-5 w-5" />
                </button>
                
                <button
                  onClick={disconnectWallet}
                  className="p-2 text-purple-300 hover:text-red-400 transition-colors hover:bg-red-500/20 rounded-lg"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-400/30 px-4 py-2 rounded-xl backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-red-300 font-bold">⚠️ Wallet not connected</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 