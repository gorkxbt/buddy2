import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'

// Simple Phantom wallet interface
interface PhantomWallet {
  isPhantom: boolean
  publicKey: PublicKey | null
  isConnected: boolean
  connect(): Promise<{ publicKey: PublicKey }>
  disconnect(): Promise<void>
  on?(event: string, callback: (args: any) => void): void
  off?(event: string, callback: (args: any) => void): void
}

declare global {
  interface Window {
    solana?: PhantomWallet
  }
}

export interface WalletInfo {
  publicKey: string
  balance: number
  isConnected: boolean
}

export interface BuddyDeployment {
  id: string
  walletAddress: string
  deployedAt: number
  buddyName: string
  configuration: {
    riskLevel: number
    strategy: string
    maxTradeSize: number
    mode: 'demo' | 'live'
  }
  isActive: boolean
}

class WalletManager {
  private connection: Connection
  private wallet: PhantomWallet | null = null
  private walletInfo: WalletInfo | null = null
  private listeners: ((wallet: WalletInfo | null) => void)[] = []
  private buddyDeployments: BuddyDeployment[] = []

  constructor() {
    this.connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed')
    this.loadBuddyDeployments()
    
    // Check for existing connection on initialization
    if (typeof window !== 'undefined') {
      this.checkExistingConnection()
    }
  }

  private async checkExistingConnection(): Promise<void> {
    try {
      // Wait a bit for Phantom to load
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (window.solana?.isPhantom && window.solana.isConnected && window.solana.publicKey) {
        this.wallet = window.solana
        
        // Get balance
        let balance = 0
        try {
          balance = await this.connection.getBalance(window.solana.publicKey)
        } catch (error) {
          console.warn('Could not fetch balance on initialization:', error)
        }
        
        this.walletInfo = {
          publicKey: window.solana.publicKey.toString(),
          balance: balance / LAMPORTS_PER_SOL,
          isConnected: true
        }

        this.notifyListeners(this.walletInfo)
      }
    } catch (error) {
      console.warn('Error checking existing connection:', error)
    }
  }

  async connectPhantom(): Promise<WalletInfo> {
    if (typeof window === 'undefined') {
      throw new Error('Wallet connection only available in browser')
    }

    // Wait for Phantom to be available (sometimes it takes a moment to load)
    let attempts = 0
    const maxAttempts = 10
    
    while (!window.solana && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 100))
      attempts++
    }

    // Check if Phantom is installed
    if (!window.solana) {
      window.open('https://phantom.app/', '_blank')
      throw new Error('Phantom wallet not found. Please install Phantom wallet extension.')
    }

    if (!window.solana.isPhantom) {
      throw new Error('Please use Phantom wallet.')
    }

    try {
      // Check if already connected
      if (window.solana.isConnected && window.solana.publicKey) {
        this.wallet = window.solana
        
        // Get balance
        const balance = await this.connection.getBalance(window.solana.publicKey)
        
        this.walletInfo = {
          publicKey: window.solana.publicKey.toString(),
          balance: balance / LAMPORTS_PER_SOL,
          isConnected: true
        }

        this.notifyListeners(this.walletInfo)
        return this.walletInfo
      }

      // Request connection with options
      const response = await window.solana.connect()
      this.wallet = window.solana
      
      if (!response || !response.publicKey) {
        throw new Error('Connection was cancelled or no public key received')
      }

      // Get balance with retry logic
      let balance = 0
      try {
        balance = await this.connection.getBalance(response.publicKey)
      } catch (balanceError) {
        console.warn('Could not fetch balance, using 0:', balanceError)
        // Continue without balance - this is not critical for connection
      }
      
      this.walletInfo = {
        publicKey: response.publicKey.toString(),
        balance: balance / LAMPORTS_PER_SOL,
        isConnected: true
      }

      this.notifyListeners(this.walletInfo)
      return this.walletInfo
    } catch (error: any) {
      console.error('Wallet connection error:', error)
      
      // Provide more specific error messages
      if (error.message?.includes('User rejected')) {
        throw new Error('Connection was cancelled. Please try again and approve the connection.')
      }
      
      if (error.message?.includes('already pending')) {
        throw new Error('Connection request already pending. Please check your Phantom wallet.')
      }
      
      if (error.code === 4001) {
        throw new Error('Connection was rejected. Please try again and approve the connection.')
      }
      
      throw new Error('Failed to connect wallet. Please make sure Phantom is unlocked and try again.')
    }
  }

  async disconnect(): Promise<void> {
    if (this.wallet) {
      try {
        await this.wallet.disconnect()
      } catch (error) {
        console.error('Error disconnecting:', error)
      }
    }
    
    this.wallet = null
    this.walletInfo = null
    this.notifyListeners(null)
  }

  deployBuddy(buddyName: string, configuration: BuddyDeployment['configuration']): BuddyDeployment {
    if (!this.walletInfo) {
      throw new Error('Wallet not connected')
    }

    const deployment: BuddyDeployment = {
      id: Date.now().toString(),
      walletAddress: this.walletInfo.publicKey,
      deployedAt: Date.now(),
      buddyName,
      configuration,
      isActive: true
    }

    this.buddyDeployments.push(deployment)
    this.saveBuddyDeployments()
    
    return deployment
  }

  getBuddyDeployment(walletAddress?: string): BuddyDeployment | null {
    const address = walletAddress || this.walletInfo?.publicKey
    if (!address) return null

    return this.buddyDeployments.find(d => d.walletAddress === address && d.isActive) || null
  }

  updateBuddyDeployment(walletAddress: string, updatedDeployment: BuddyDeployment): void {
    const index = this.buddyDeployments.findIndex(d => d.walletAddress === walletAddress && d.isActive)
    if (index !== -1) {
      this.buddyDeployments[index] = updatedDeployment
      this.saveBuddyDeployments()
    }
  }

  private loadBuddyDeployments(): void {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('buddyDeployments')
        if (saved) {
          this.buddyDeployments = JSON.parse(saved)
        }
      } catch (error) {
        console.error('Error loading deployments:', error)
      }
    }
  }

  private saveBuddyDeployments(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('buddyDeployments', JSON.stringify(this.buddyDeployments))
      } catch (error) {
        console.error('Error saving deployments:', error)
      }
    }
  }

  getWalletInfo(): WalletInfo | null {
    return this.walletInfo
  }

  onWalletChange(callback: (wallet: WalletInfo | null) => void): void {
    this.listeners.push(callback)
  }

  private notifyListeners(wallet: WalletInfo | null): void {
    this.listeners.forEach(callback => callback(wallet))
  }

  isPhantomInstalled(): boolean {
    if (typeof window === 'undefined') return false
    
    // Check if Phantom is available
    return !!(window.solana && window.solana.isPhantom)
  }
}

export const walletManager = new WalletManager() 