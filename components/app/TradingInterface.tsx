'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, TrendingUp, TrendingDown, Zap, Target, BarChart3, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getPopularTokens, TokenData, TokenPriceWebSocket } from '@/lib/api'
import Image from 'next/image'

interface TradingInterfaceProps {
  onTokenSelect?: (token: string) => void
}

export default function TradingInterface({ onTokenSelect }: TradingInterfaceProps) {
  const [tokens, setTokens] = useState<TokenData[]>([])
  const [selectedToken, setSelectedToken] = useState<TokenData | null>(null)
  const [tradeAmount, setTradeAmount] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [priceWs] = useState(() => new TokenPriceWebSocket())

  // Load real token data on component mount
  useEffect(() => {
    loadTokenData()
    priceWs.connect()
    
    return () => {
      // Cleanup WebSocket subscriptions
      tokens.forEach(token => {
        priceWs.unsubscribe(token.address)
      })
    }
  }, [tokens, priceWs])

  // Subscribe to real-time price updates for selected token
  useEffect(() => {
    if (selectedToken) {
      priceWs.subscribe(selectedToken.address, (newPrice) => {
        setSelectedToken(prev => prev ? { ...prev, price: newPrice } : null)
        setTokens(prev => prev.map(token => 
          token.address === selectedToken.address 
            ? { ...token, price: newPrice }
            : token
        ))
      })
    }
  }, [selectedToken, priceWs])

  const loadTokenData = async () => {
    try {
      setLoading(true)
      const tokenData = await getPopularTokens()
      setTokens(tokenData)
      if (tokenData.length > 0) {
        setSelectedToken(tokenData[0])
      }
    } catch (error) {
      console.error('Failed to load token data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTokens = tokens.filter(token =>
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const mockTrades = [
    { type: 'buy', token: 'SOL', amount: 0.5, price: selectedToken?.price || 98.45, time: '2 min ago', profit: '+$12.34' },
    { type: 'sell', token: 'BONK', amount: 1000000, price: 0.000023, time: '5 min ago', profit: '+$45.67' },
    { type: 'buy', token: 'WIF', amount: 10, price: 2.87, time: '8 min ago', profit: '+$23.45' },
  ]

  // Update the token selection handler
  const handleTokenSelect = (token: TokenData) => {
    setSelectedToken(token)
    onTokenSelect?.(token.symbol)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading real-time token data...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Token Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-neon-purple" />
              <span>Token Search</span>
            </div>
            <Button variant="ghost" size="sm" onClick={loadTokenData}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tokens..."
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-white"
            />
          </div>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredTokens.map((token) => (
              <div
                key={token.address}
                onClick={() => handleTokenSelect(token)}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedToken?.address === token.address
                    ? 'bg-purple-500/20 border border-purple-500'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {token.logoURI && (
                      <Image 
                        src={token.logoURI} 
                        alt={token.symbol}
                        width={32}
                        height={32}
                        className="rounded-full"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    )}
                    <div>
                      <div className="font-semibold text-white">{token.symbol}</div>
                      <div className="text-sm text-gray-400">{token.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-white">
                      ${token.price.toFixed(token.price < 1 ? 6 : 2)}
                    </div>
                    <div className={`text-sm flex items-center ${
                      token.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {token.change24h >= 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(token.change24h).toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-gray-400 text-sm">
            Don&apos;t see your token? Try searching by contract address.
          </div>
        </CardContent>
      </Card>

      {/* Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-neon-cyan" />
              <span>{selectedToken?.symbol}/USDC</span>
              <span className="text-sm text-gray-400">
                ${selectedToken?.price.toFixed(selectedToken.price < 1 ? 6 : 2)}
              </span>
            </div>
            <Button variant="ghost" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-600 mx-auto mb-2" />
              <p className="text-gray-400">Chart coming soon</p>
              <p className="text-sm text-gray-500">
                Real-time price: ${selectedToken?.price.toFixed(selectedToken?.price < 1 ? 6 : 2)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                For charts, integrate TradingView widget or DexScreener
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trading Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-neon-green" />
            <span>Quick Trade</span>
          </CardTitle>
          <CardDescription>
            Let your buddy execute trades based on AI analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Trade Amount (SOL)
            </label>
            <input
              type="number"
              value={tradeAmount}
              onChange={(e) => setTradeAmount(e.target.value)}
              placeholder="0.0"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-white"
            />
            {tradeAmount && selectedToken && (
              <p className="text-sm text-gray-400 mt-1">
                ≈ ${(parseFloat(tradeAmount) * selectedToken.price).toFixed(2)} USD
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button variant="neon" className="bg-green-600 hover:bg-green-700">
              <TrendingUp className="h-4 w-4 mr-2" />
              Buy {selectedToken?.symbol}
            </Button>
            <Button variant="outline" className="border-red-500 text-red-400 hover:bg-red-500/10">
              <TrendingDown className="h-4 w-4 mr-2" />
              Sell {selectedToken?.symbol}
            </Button>
          </div>
          
          <div className="text-center">
            <Button variant="glass" size="sm">
              <Zap className="h-4 w-4 mr-2" />
              Let Buddy Decide
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Trades */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Trades</CardTitle>
          <CardDescription>Your buddy&apos;s latest trading activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockTrades.map((trade, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    trade.type === 'buy' ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}>
                    {trade.type === 'buy' ? (
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-400" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {trade.type.toUpperCase()} {trade.token}
                    </div>
                    <div className="text-sm text-gray-400">
                      {trade.amount} @ ${trade.price}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-semibold">{trade.profit}</div>
                  <div className="text-sm text-gray-400">{trade.time}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 