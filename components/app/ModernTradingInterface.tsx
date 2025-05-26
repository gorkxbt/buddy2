'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, MessageCircle, Zap, Target, DollarSign, Activity, Star } from 'lucide-react'
import { getTokenPrices, getAllTokens, TokenPriceWebSocket } from '@/lib/api'
import { sendMessage, ChatMessage as LLMChatMessage } from '@/lib/llm'

interface Token {
  id: string
  symbol: string
  name: string
  price: number
  change24h: number
  volume24h: number
  marketCap: number
  image?: string
  address: string
}

interface Trade {
  id: string
  symbol: string
  type: 'buy' | 'sell'
  amount: number
  price: number
  timestamp: number
  profit?: number
}

interface ChatMessage {
  id: string
  text: string
  isUser: boolean
  timestamp: number
}

export default function ModernTradingInterface() {
  const [tokens, setTokens] = useState<Token[]>([])
  const [selectedToken, setSelectedToken] = useState<Token | null>(null)
  const [trades, setTrades] = useState<Trade[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hey! I'm your trading buddy. I can help you analyze tokens, spot opportunities, and execute trades. What would you like to explore?",
      isUser: false,
      timestamp: Date.now()
    }
  ])
  const [chatInput, setChatInput] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [portfolioValue] = useState(5000)
  const [tradeAmount, setTradeAmount] = useState('')

  useEffect(() => {
    loadTokens()
    
    // Set up real-time price updates
    const priceWS = new TokenPriceWebSocket()
    priceWS.connect()

    return () => {
      // Cleanup if needed
    }
  }, [])

  const loadTokens = async () => {
    try {
      const tokenData = await getAllTokens()
      
      // Get popular tokens (first 20)
      const popularTokens = tokenData.slice(0, 20)
      const tokenAddresses = popularTokens.map(t => t.address)
      const prices = await getTokenPrices(tokenAddresses)
      
      const tokensWithPrices: Token[] = popularTokens.map(token => ({
        id: token.address,
        symbol: token.symbol,
        name: token.name,
        address: token.address,
        price: prices[token.address] || 0,
        change24h: Math.random() * 20 - 10, // Mock data since Jupiter doesn't provide 24h change
        volume24h: Math.random() * 1000000,
        marketCap: Math.random() * 100000000
      }))
      
      setTokens(tokensWithPrices)
      if (tokensWithPrices.length > 0) {
        setSelectedToken(tokensWithPrices[0])
      }
    } catch (error) {
      console.error('Error loading tokens:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTrade = (type: 'buy' | 'sell') => {
    if (!selectedToken || !tradeAmount) return

    const amount = parseFloat(tradeAmount)
    const trade: Trade = {
      id: Date.now().toString(),
      symbol: selectedToken.symbol,
      type,
      amount,
      price: selectedToken.price,
      timestamp: Date.now()
    }

    setTrades(prev => [trade, ...prev.slice(0, 9)]) // Keep last 10 trades
    setTradeAmount('')
  }

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: chatInput,
      isUser: true,
      timestamp: Date.now()
    }

    setChatMessages(prev => [...prev, userMessage])
    setChatInput('')
    setIsChatLoading(true)

    try {
      const context = {
        selectedToken: selectedToken?.symbol,
        portfolioValue,
        recentTrades: trades.slice(0, 3)
      }

      // Convert to LLM format
      const llmMessages: LLMChatMessage[] = chatMessages
        .filter(msg => !msg.isUser || msg.text.trim())
        .map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.text
        }))

      // Add current message
      llmMessages.push({
        role: 'user',
        content: chatInput
      })

      const response = await sendMessage(llmMessages, context)
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: Date.now()
      }

      setChatMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting right now. Please try again.",
        isUser: false,
        timestamp: Date.now()
      }
      setChatMessages(prev => [...prev, errorMessage])
    } finally {
      setIsChatLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading market data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-black text-white overflow-hidden">
      {/* Main Grid Layout */}
      <div className="h-full grid grid-cols-12 gap-1 p-1">
        
        {/* Left Panel - Token List */}
        <div className="col-span-3 bg-gray-900/50 rounded-lg border border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              Top Tokens
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {tokens.slice(0, 15).map((token) => (
              <div
                key={token.id}
                onClick={() => setSelectedToken(token)}
                className={`p-3 border-b border-gray-800/50 cursor-pointer hover:bg-gray-800/50 transition-colors ${
                  selectedToken?.id === token.id ? 'bg-gray-800/70 border-l-4 border-l-green-400' : ''
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-white">{token.symbol}</div>
                    <div className="text-xs text-gray-400 truncate">{token.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">${token.price.toFixed(4)}</div>
                    <div className={`text-xs flex items-center gap-1 ${
                      token.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {token.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {Math.abs(token.change24h).toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Panel - Trading */}
        <div className="col-span-6 flex flex-col gap-1">
          
          {/* Token Info */}
          {selectedToken && (
            <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-white">{selectedToken.symbol}</h1>
                  <p className="text-gray-400">{selectedToken.name}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">${selectedToken.price.toFixed(4)}</div>
                  <div className={`flex items-center gap-1 justify-end ${
                    selectedToken.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {selectedToken.change24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {Math.abs(selectedToken.change24h).toFixed(2)}% (24h)
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-400">Market Cap</div>
                  <div className="font-medium">${(selectedToken.marketCap / 1000000).toFixed(2)}M</div>
                </div>
                <div>
                  <div className="text-gray-400">Volume (24h)</div>
                  <div className="font-medium">${(selectedToken.volume24h / 1000000).toFixed(2)}M</div>
                </div>
                <div>
                  <div className="text-gray-400">Price</div>
                  <div className="font-medium">${selectedToken.price.toFixed(4)}</div>
                </div>
              </div>
            </div>
          )}

          {/* Trading Panel */}
          <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-4 flex-1">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-400" />
              Quick Trade
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Amount (USD)</label>
                <input
                  type="number"
                  value={tradeAmount}
                  onChange={(e) => setTradeAmount(e.target.value)}
                  placeholder="Enter amount..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleTrade('buy')}
                  disabled={!selectedToken || !tradeAmount}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  Buy {selectedToken?.symbol}
                </button>
                <button
                  onClick={() => handleTrade('sell')}
                  disabled={!selectedToken || !tradeAmount}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <TrendingDown className="w-4 h-4" />
                  Sell {selectedToken?.symbol}
                </button>
              </div>
            </div>

            {/* Recent Trades */}
            {trades.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-400 mb-3">Recent Trades</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {trades.slice(0, 5).map((trade) => (
                    <div key={trade.id} className="flex justify-between items-center text-sm bg-gray-800/50 rounded px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${trade.type === 'buy' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                        <span className="text-white">{trade.type.toUpperCase()} {trade.symbol}</span>
                      </div>
                      <div className="text-gray-400">${trade.amount.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Chat */}
        <div className="col-span-3 bg-gray-900/50 rounded-lg border border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-purple-400" />
              Trading Buddy
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    message.isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-100'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-gray-100 p-3 rounded-lg text-sm">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-b border-purple-400"></div>
                    Thinking...
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about trading..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:border-purple-400 focus:outline-none text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || isChatLoading}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white p-2 rounded-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur border-t border-gray-800 p-2">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="text-gray-400">Portfolio:</span>
              <span className="text-white font-medium">${portfolioValue.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-gray-400">Trades:</span>
              <span className="text-white font-medium">{trades.length}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-gray-400">Live Market Data</span>
          </div>
        </div>
      </div>
    </div>
  )
} 