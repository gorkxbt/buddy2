'use client'

import { useState, useEffect } from 'react'
import { Wallet, CheckCircle2, AlertTriangle, Loader2, Bot, Rocket } from 'lucide-react'
import { walletManager, WalletInfo, type BuddyDeployment } from '../../lib/wallet'

interface BuddyDeploymentProps {
  onDeploymentComplete: (deployment: BuddyDeployment) => void
}

export default function BuddyDeployment({ onDeploymentComplete }: BuddyDeploymentProps) {
  const [wallet, setWallet] = useState<WalletInfo | null>(null)
  const [buddyName, setBuddyName] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'connect' | 'name'>('connect')

  // Check for existing wallet connection on mount
  useEffect(() => {
    const checkExistingWallet = async () => {
      const existingWallet = walletManager.getWalletInfo()
      if (existingWallet) {
        setWallet(existingWallet)
        setStep('name')
        
        // Check for existing deployment
        const existingDeployment = walletManager.getBuddyDeployment(existingWallet.publicKey)
        if (existingDeployment) {
          onDeploymentComplete(existingDeployment)
        }
      }
    }
    
    checkExistingWallet()
    
    // Listen for wallet changes
    const handleWalletChange = (walletInfo: WalletInfo | null) => {
      setWallet(walletInfo)
      if (!walletInfo) {
        setStep('connect')
        setError('')
      }
    }
    
    walletManager.onWalletChange(handleWalletChange)
    
    // Listen for Phantom wallet events
    if (typeof window !== 'undefined' && window.solana) {
      const handleAccountChange = (publicKey: any) => {
        if (!publicKey) {
          // Wallet disconnected
          setWallet(null)
          setStep('connect')
          setError('')
        }
      }
      
      const handleDisconnect = () => {
        setWallet(null)
        setStep('connect')
        setError('')
      }
      
      if (window.solana.on) {
        window.solana.on('accountChanged', handleAccountChange)
        window.solana.on('disconnect', handleDisconnect)
      }
      
      return () => {
        if (window.solana?.off) {
          window.solana.off('accountChanged', handleAccountChange)
          window.solana.off('disconnect', handleDisconnect)
        }
      }
    }
  }, [onDeploymentComplete])

  const connectWallet = async () => {
    setIsConnecting(true)
    setError('')
    
    try {
      if (!walletManager.isPhantomInstalled()) {
        setError('Phantom wallet not found. Please install Phantom wallet extension.')
        window.open('https://phantom.app/', '_blank')
        return
      }

      const walletInfo = await walletManager.connectPhantom()
      setWallet(walletInfo)
      setStep('name')
      
      // Check if there's already a buddy deployed
      const existingDeployment = walletManager.getBuddyDeployment(walletInfo.publicKey)
      if (existingDeployment) {
        onDeploymentComplete(existingDeployment)
        return
      }
    } catch (error: any) {
      console.error('Wallet connection error:', error)
      // Use the specific error message from the wallet manager
      setError(error.message || 'Failed to connect wallet. Please try again.')
    } finally {
      setIsConnecting(false)
    }
  }

  const deployBuddy = async () => {
    if (!buddyName.trim()) {
      setError('Please enter a name for your Buddy')
      return
    }

    setIsDeploying(true)
    setError('')

    try {
      // Simulate deployment delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const deployment = walletManager.deployBuddy(buddyName.trim(), {
        riskLevel: 50,
        maxTradeSize: 0.1,
        strategy: 'momentum',
        mode: 'demo'
      })

      onDeploymentComplete(deployment)
    } catch (error: any) {
      console.error('Deployment error:', error)
      setError(error.message || 'Failed to deploy Buddy. Please try again.')
    } finally {
      setIsDeploying(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-400/50 rounded-2xl flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-300 mt-0.5 flex-shrink-0" />
              <p className="text-red-200 font-medium">{error}</p>
            </div>
          )}

          {step === 'connect' && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Wallet className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
                <p className="text-gray-400 text-lg">
                  Connect your wallet to start trading with AI
                </p>
              </div>

              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 shadow-xl"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="w-6 h-6" />
                    Connect Wallet
                  </>
                )}
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-400 text-center">
                  Don&apos;t have a wallet? {' '}
                  <a 
                    href="https://phantom.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 underline"
                  >
                    Download Phantom
                  </a>
                </p>
              </div>
            </div>
          )}

          {step === 'name' && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Wallet Connected!</h2>
                <p className="text-green-400 font-mono text-sm mb-4">
                  {wallet?.publicKey.slice(0, 8)}...{wallet?.publicKey.slice(-8)}
                </p>
                <p className="text-gray-400 text-lg">
                  Name your AI trading buddy
                </p>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  value={buddyName}
                  onChange={(e) => setBuddyName(e.target.value)}
                  placeholder="Enter buddy name (e.g., Alpha Trader)"
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  maxLength={30}
                />
                
                <button
                  onClick={deployBuddy}
                  disabled={isDeploying || !buddyName.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 shadow-xl"
                >
                  {isDeploying ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Deploying Buddy...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-6 h-6" />
                      Deploy {buddyName || 'Buddy'}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 