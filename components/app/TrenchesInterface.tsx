'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, TrendingDown, MessageCircle, Zap, Target, DollarSign, 
  Activity, Star, Wallet, Settings, BarChart3, Clock, Users, 
  Flame, Eye, ArrowUpRight, ArrowDownRight, Play, Pause, 
  RefreshCw, Bell, Filter, Search, Home, Bot, Shield
} from 'lucide-react'
import { getPumpFunNewTokens, getTrendingPumpFunTokens, PumpFunToken, PumpFunMonitor } from '@/lib/pumpfun'
import { sendMessage, ChatMessage as LLMChatMessage } from '@/lib/llm'
import { walletManager, WalletInfo, BuddyDeployment } from '../../lib/wallet'
import Link from 'next/link'
import BuddyConfiguration from './BuddyConfiguration'
import TokenAnalysis from './TokenAnalysis'
import PortfolioTracker from './PortfolioTracker'
import Image from 'next/image'

interface Trade {
  id: string
  symbol: string
  type: 'buy' | 'sell'
  amount: number
  price: number
  timestamp: number
  profit?: number
  status: 'pending' | 'completed' | 'failed'
}

interface ChatMessage {
  id: string
  text: string
  isUser: boolean
  timestamp: number
}

interface BuddyConfig {
  riskLevel: number
  strategy: 'momentum' | 'conservative' | 'aggressive' | 'scalping'
  maxTradeSize: number
  stopLoss: number
  takeProfit: number
  isActive: boolean
  mode: 'demo' | 'live'
  autoTrade: boolean
  slippageTolerance: number
  maxDailyTrades: number
  tradingHours: {
    enabled: boolean
    start: string
    end: string
  }
  riskManagement: {
    maxDrawdown: number
    dailyLossLimit: number
    consecutiveLossLimit: number
  }
  notifications: {
    trades: boolean
    profits: boolean
    losses: boolean
    newTokens: boolean
  }
}

export default function TrenchesInterface() {
  // State management
  const [newTokens, setNewTokens] = useState<PumpFunToken[]>([])
  const [trendingTokens, setTrendingTokens] = useState<PumpFunToken[]>([])
  const [selectedToken, setSelectedToken] = useState<PumpFunToken | null>(null)
  const [trades, setTrades] = useState<Trade[]>([])
  const [wallet, setWallet] = useState<WalletInfo | null>(null)
  const [buddyDeployment, setBuddyDeployment] = useState<BuddyDeployment | null>(null)
  const [buddyConfig, setBuddyConfig] = useState<BuddyConfig>({
    riskLevel: 50,
    strategy: 'momentum',
    maxTradeSize: 100,
    stopLoss: 10,
    takeProfit: 25,
    isActive: false,
    mode: 'demo',
    autoTrade: false,
    slippageTolerance: 0.5,
    maxDailyTrades: 10,
    tradingHours: {
      enabled: false,
      start: '09:00',
      end: '17:00'
    },
    riskManagement: {
      maxDrawdown: 20,
      dailyLossLimit: 500,
      consecutiveLossLimit: 3
    },
    notifications: {
      trades: true,
      profits: true,
      losses: true,
      newTokens: true
    }
  })
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hey! I'm your Trenches Buddy. I'm monitoring PumpFun for new opportunities. What would you like to focus on today?",
      isUser: false,
      timestamp: Date.now()
    }
  ])
  const [chatInput, setChatInput] = useState('')
  const [isChatLoading, setIsChatLoading] = useState(false)
  
  // UI state
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'new' | 'trending' | 'portfolio'>('new')
  const [searchQuery, setSearchQuery] = useState('')
  const [showConfiguration, setShowConfiguration] = useState(false)
  const [showPortfolio, setShowPortfolio] = useState(false)
  const [portfolioTokens, setPortfolioTokens] = useState<any[]>([])
  const [totalPortfolioValue, setTotalPortfolioValue] = useState(0)

  // Initialize data and monitoring
  useEffect(() => {
    loadInitialData()
    setupWalletListener()
    setupPumpFunMonitor()
  }, [])

  const loadInitialData = async () => {
    try {
      const [newTokensData, trendingTokensData] = await Promise.all([
        getPumpFunNewTokens(50),
        getTrendingPumpFunTokens(20)
      ])
      
      setNewTokens(newTokensData)
      setTrendingTokens(trendingTokensData)
      
      if (newTokensData.length > 0) {
        setSelectedToken(newTokensData[0])
      }
    } catch (error) {
      console.error('Error loading initial data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const setupWalletListener = () => {
    walletManager.onWalletChange((walletInfo: WalletInfo | null) => {
      setWallet(walletInfo)
      
      // Check for existing buddy deployment
      if (walletInfo) {
        const existingDeployment = walletManager.getBuddyDeployment(walletInfo.publicKey)
        setBuddyDeployment(existingDeployment)
        
        if (existingDeployment) {
          setBuddyConfig(prev => ({
            ...prev,
            riskLevel: existingDeployment.configuration.riskLevel,
            strategy: existingDeployment.configuration.strategy as 'momentum' | 'conservative' | 'aggressive' | 'scalping',
            maxTradeSize: existingDeployment.configuration.maxTradeSize,
            mode: existingDeployment.configuration.mode,
            isActive: existingDeployment.isActive
          }))
        }
      } else {
        setBuddyDeployment(null)
      }
    })
  }

  const setupPumpFunMonitor = () => {
    const monitor = new PumpFunMonitor()
    monitor.onNewTokens((tokens) => {
      setNewTokens(prev => [...tokens, ...prev].slice(0, 100))
      
      // Notify via chat
      if (tokens.length > 0) {
        const newMessage: ChatMessage = {
          id: `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
          text: `🚨 ${tokens.length} new token${tokens.length > 1 ? 's' : ''} detected on PumpFun! ${tokens.map(t => t.symbol).join(', ')}`,
          isUser: false,
          timestamp: Date.now()
        }
        setChatMessages(prev => [...prev, newMessage])
      }
    })
    monitor.start()
  }

  const handleTrade = async (type: 'buy' | 'sell', amount: number) => {
    if (!selectedToken) return

    const trade: Trade = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
      symbol: selectedToken.symbol,
      type,
      amount,
      price: selectedToken.price,
      timestamp: Date.now(),
      status: 'pending'
    }

    setTrades(prev => [trade, ...prev])

    // Simulate trade execution
    setTimeout(() => {
      setTrades(prev => prev.map(t => 
        t.id === trade.id 
          ? { ...t, status: 'completed', profit: Math.random() * 100 - 50 }
          : t
      ))
    }, 2000)

    // Notify buddy
    const message = `${type.toUpperCase()} ${amount} USD of ${selectedToken.symbol} at $${selectedToken.price.toFixed(6)}`
    await sendChatMessage(`I just executed a trade: ${message}`)
  }

  const sendChatMessage = async (message: string) => {
    if (!message.trim()) return

    const userMessage: ChatMessage = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
      text: message,
      isUser: true,
      timestamp: Date.now()
    }

    setChatMessages(prev => [...prev, userMessage])
    setIsChatLoading(true)

    try {
      const context = {
        selectedToken: selectedToken?.symbol,
        portfolioValue: wallet?.balance || 0,
        recentTrades: trades.slice(0, 3),
        buddyConfig,
        newTokensCount: newTokens.length
      }

      const llmMessages: LLMChatMessage[] = chatMessages
        .filter(msg => msg.text.trim())
        .map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.text
        }))

      llmMessages.push({
        role: 'user',
        content: message
      })

      const response = await sendMessage(llmMessages, context)
      
      const aiMessage: ChatMessage = {
        id: `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
        text: response,
        isUser: false,
        timestamp: Date.now()
      }

      setChatMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: ChatMessage = {
        id: `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
        text: "I'm having trouble connecting right now. Please check your API configuration.",
        isUser: false,
        timestamp: Date.now()
      }
      setChatMessages(prev => [...prev, errorMessage])
    } finally {
      setIsChatLoading(false)
    }
  }

  const handleChatSubmit = () => {
    if (chatInput.trim()) {
      sendChatMessage(chatInput)
      setChatInput('')
    }
  }

  const connectWallet = async () => {
    try {
      if (!walletManager.isPhantomInstalled()) {
        const errorMessage: ChatMessage = {
          id: `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
          text: "❌ Phantom wallet not found. Please install Phantom wallet extension.",
          isUser: false,
          timestamp: Date.now()
        }
        setChatMessages(prev => [...prev, errorMessage])
        return
      }
      
      await walletManager.connectPhantom()
      
      // Show success message in chat
      const successMessage: ChatMessage = {
        id: `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
        text: "🎉 Wallet connected successfully! I can now help you with trading.",
        isUser: false,
        timestamp: Date.now()
      }
      setChatMessages(prev => [...prev, successMessage])
      
    } catch (error) {
      console.error('Error connecting wallet:', error)
      
      // Show error message in chat
      const errorMessage: ChatMessage = {
        id: `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
        text: "❌ Failed to connect wallet. Please make sure Phantom is unlocked and try again.",
        isUser: false,
        timestamp: Date.now()
      }
      setChatMessages(prev => [...prev, errorMessage])
    }
  }

  const filteredTokens = (activeTab === 'new' ? newTokens : trendingTokens)
    .filter(token => 
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

  // Calculate portfolio value when trades change
  useEffect(() => {
    const completedTrades = trades.filter(t => t.status === 'completed')
    const totalProfit = completedTrades.reduce((sum, trade) => sum + (trade.profit || 0), 0)
    const initialValue = wallet?.balance ? wallet.balance * 200 : 1000 // Assume 1 SOL = $200 for demo
    setTotalPortfolioValue(initialValue + totalProfit)
  }, [trades, wallet?.balance])

  const handleConfigurationChange = (newConfig: BuddyConfig) => {
    setBuddyConfig(newConfig)
    
    // Save to buddy deployment if exists
    if (buddyDeployment && wallet) {
      const updatedDeployment: BuddyDeployment = {
        ...buddyDeployment,
        configuration: {
          riskLevel: newConfig.riskLevel,
          strategy: newConfig.strategy,
          maxTradeSize: newConfig.maxTradeSize,
          mode: newConfig.mode
        },
        isActive: newConfig.isActive
      }
      
      walletManager.updateBuddyDeployment(wallet.publicKey, updatedDeployment)
      setBuddyDeployment(updatedDeployment)
    }
    
    // Notify via chat
    const configMessage: ChatMessage = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
      text: `⚙️ Configuration updated! Risk level: ${newConfig.riskLevel}%, Strategy: ${newConfig.strategy}, Mode: ${newConfig.mode}${newConfig.isActive ? ' - Buddy is now active!' : ' - Buddy is paused'}`,
      isUser: false,
      timestamp: Date.now()
    }
    setChatMessages(prev => [...prev, configMessage])
  }

  const handleTradeSignal = (signal: 'buy' | 'sell' | 'hold', confidence: number) => {
    if (!selectedToken) return
    
    const signalMessage: ChatMessage = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
      text: `🤖 Analysis complete for ${selectedToken.symbol}: ${signal.toUpperCase()} signal with ${confidence}% confidence. ${
        signal === 'buy' ? 'Consider entering a position.' : 
        signal === 'sell' ? 'Consider exiting or avoiding this token.' : 
        'Mixed signals, monitor closely.'
      }`,
      isUser: false,
      timestamp: Date.now()
    }
    setChatMessages(prev => [...prev, signalMessage])
  }

  if (isLoading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading PumpFun data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      
      <div className="relative z-10">
        {/* Configuration Modal */}
        <BuddyConfiguration
          config={buddyConfig}
          onConfigChange={handleConfigurationChange}
          onClose={() => setShowConfiguration(false)}
          isVisible={showConfiguration}
        />

        {/* Main Interface */}
        <div className="h-screen grid grid-cols-12 gap-1 p-1">
          
          {/* Left Panel - Token Discovery */}
          <div className="col-span-3 bg-gray-900/30 backdrop-blur-sm rounded-lg border border-gray-800/50 flex flex-col">
            <div className="p-4 border-b border-gray-800/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">PumpFun Tokens</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowConfiguration(!showConfiguration)}
                    className="p-1 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  {wallet ? (
                    <div className="flex items-center space-x-1 bg-gray-800/50 rounded px-2 py-1">
                      <Wallet className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-white">{wallet.balance.toFixed(1)} SOL</span>
                    </div>
                  ) : (
                    <button
                      onClick={connectWallet}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
                    >
                      Connect
                    </button>
                  )}
                  <button 
                    onClick={loadInitialData}
                    className="p-1 hover:bg-gray-800/50 rounded"
                  >
                    <RefreshCw className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tokens..."
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:border-purple-400 focus:outline-none"
                />
              </div>

              {/* Tabs */}
              <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('new')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-colors ${
                    activeTab === 'new' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-1">
                    <Flame className="w-4 h-4" />
                    <span>New</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('trending')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-colors ${
                    activeTab === 'trending' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>Trending</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('portfolio')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-colors ${
                    activeTab === 'portfolio' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-1">
                    <BarChart3 className="w-4 h-4" />
                    <span>Portfolio</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Token List */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'portfolio' ? (
                // Portfolio View
                <div className="p-4">
                  <PortfolioTracker 
                    trades={trades} 
                    walletBalance={wallet?.balance || 0} 
                  />
                </div>
              ) : (
                // Token List View
                filteredTokens.length === 0 ? (
                  <div className="p-4 text-center">
                    <div className="text-gray-400 mb-2">
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
                          <p>Loading real PumpFun data...</p>
                        </>
                      ) : (
                        <>
                          <p className="text-lg mb-2">🔍 No {activeTab} tokens found</p>
                          <p className="text-sm">
                            {activeTab === 'new' 
                              ? 'Waiting for new token launches on PumpFun...' 
                              : 'No trending tokens available right now...'
                            }
                          </p>
                          <button
                            onClick={loadInitialData}
                            className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Refresh Data
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  filteredTokens.map((token) => (
                    <div
                      key={token.mint}
                      onClick={() => setSelectedToken(token)}
                      className={`p-3 border-b border-gray-800/50 cursor-pointer hover:bg-gray-800/50 transition-colors ${
                        selectedToken?.mint === token.mint ? 'bg-gray-800/70 border-l-4 border-l-purple-400' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          {token.image ? (
                            <Image 
                              src={token.image} 
                              alt={token.symbol} 
                              width={32}
                              height={32}
                              className="rounded-full" 
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold">{token.symbol.slice(0, 2)}</span>
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-white">{token.symbol}</div>
                            <div className="text-xs text-gray-400 truncate max-w-[120px]">{token.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {token.price > 0 ? `$${token.price.toFixed(6)}` : 'N/A'}
                          </div>
                          <div className="text-xs text-gray-400">
                            {Math.floor((Date.now() - token.createdTimestamp) / 60000)}m ago
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs">
                        <div className="text-gray-400">
                          MC: {token.marketCap > 0 ? `$${(token.marketCap / 1000).toFixed(1)}K` : 'N/A'}
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span className="text-gray-400">{token.holders || 0}</span>
                        </div>
                      </div>
                      
                      {/* Bonding Curve Progress */}
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Bonding Curve</span>
                          <span>{token.bondingCurveProgress.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${token.bondingCurveProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </div>

          {/* Center Panel - Trading */}
          <div className="col-span-6 space-y-1 flex flex-col">
            
            {/* Token Details */}
            {selectedToken && (
              <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg border border-gray-800/50 p-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    {selectedToken.image ? (
                      <Image 
                        src={selectedToken.image} 
                        alt={selectedToken.symbol} 
                        width={48}
                        height={48}
                        className="rounded-full" 
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold">{selectedToken.symbol.slice(0, 2)}</span>
                      </div>
                    )}
                    <div>
                      <h1 className="text-2xl font-bold text-white">{selectedToken.symbol}</h1>
                      <p className="text-gray-400">{selectedToken.name}</p>
                    </div>
                    {selectedToken.isGraduated && (
                      <div className="bg-green-600/20 text-green-400 px-2 py-1 rounded text-xs font-medium">
                        Graduated
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">${selectedToken.price.toFixed(6)}</div>
                    <div className="text-sm text-gray-400">
                      Created {Math.floor((Date.now() - selectedToken.createdTimestamp) / 60000)} minutes ago
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Market Cap</div>
                    <div className="font-medium">${(selectedToken.marketCap / 1000).toFixed(1)}K</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Volume (24h)</div>
                    <div className="font-medium">${(selectedToken.volume24h / 1000).toFixed(1)}K</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Holders</div>
                    <div className="font-medium">{selectedToken.holders}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Progress</div>
                    <div className="font-medium">{selectedToken.bondingCurveProgress.toFixed(1)}%</div>
                  </div>
                </div>

                {/* Social Links */}
                {(selectedToken.twitter || selectedToken.telegram || selectedToken.website) && (
                  <div className="flex items-center space-x-2 mt-4">
                    {selectedToken.twitter && (
                      <a href={selectedToken.twitter} target="_blank" rel="noopener noreferrer" 
                         className="text-purple-400 hover:text-purple-300 text-sm">Twitter</a>
                    )}
                    {selectedToken.telegram && (
                      <a href={selectedToken.telegram} target="_blank" rel="noopener noreferrer" 
                         className="text-purple-400 hover:text-purple-300 text-sm">Telegram</a>
                    )}
                    {selectedToken.website && (
                      <a href={selectedToken.website} target="_blank" rel="noopener noreferrer" 
                         className="text-purple-400 hover:text-purple-300 text-sm">Website</a>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Token Analysis */}
            {selectedToken && (
              <TokenAnalysis 
                token={selectedToken} 
                onTradeSignal={handleTradeSignal}
              />
            )}

            {/* Trading Panel */}
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg border border-gray-800/50 p-4 flex-1">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-400" />
                  Quick Trade
                </h3>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setBuddyConfig(prev => ({ ...prev, isActive: !prev.isActive }))}
                    className={`flex items-center space-x-2 px-3 py-1 rounded text-sm font-medium transition-colors ${
                      buddyConfig.isActive 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                  >
                    {buddyConfig.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{buddyConfig.isActive ? 'Active' : 'Paused'}</span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => handleTrade('buy', 50)}
                  disabled={!selectedToken || !wallet}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  Buy $50
                </button>
                <button
                  onClick={() => handleTrade('sell', 50)}
                  disabled={!selectedToken || !wallet}
                  className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowDownRight className="w-4 h-4" />
                  Sell $50
                </button>
              </div>

              {/* Recent Trades */}
              {trades.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-3">Recent Trades</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {trades.slice(0, 8).map((trade) => (
                      <div key={trade.id} className="flex justify-between items-center text-sm bg-gray-800/50 rounded px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            trade.status === 'completed' ? (trade.type === 'buy' ? 'bg-green-400' : 'bg-red-400') :
                            trade.status === 'pending' ? 'bg-yellow-400 animate-pulse' : 'bg-gray-400'
                          }`}></div>
                          <span className="text-white">{trade.type.toUpperCase()} {trade.symbol}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-400">${trade.amount.toFixed(2)}</div>
                          {trade.profit !== undefined && (
                            <div className={`text-xs ${trade.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - AI Chat */}
          <div className="col-span-3 bg-gray-900/30 backdrop-blur-sm rounded-lg border border-gray-800/50 flex flex-col">
            <div className="p-4 border-b border-gray-800/50">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-purple-400" />
                Trenches Buddy
              </h3>
              <div className="text-xs text-gray-400 mt-1">
                AI Trading Companion • {buddyConfig.mode} mode
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-lg text-sm ${
                      message.isUser
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-gray-800/50 text-gray-100'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800/50 text-gray-100 p-3 rounded-lg text-sm">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-3 w-3 border-b border-purple-400"></div>
                      Analyzing...
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-800/50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                  placeholder="Ask about tokens, strategies..."
                  className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:border-purple-400 focus:outline-none text-sm"
                />
                <button
                  onClick={handleChatSubmit}
                  disabled={!chatInput.trim() || isChatLoading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:bg-gray-700 text-white p-2 rounded-lg transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 