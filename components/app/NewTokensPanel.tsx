'use client'

import { useState, useEffect } from 'react'
import { Rocket, TrendingUp, Clock, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getPumpFunNewTokens, PumpFunToken } from '@/lib/pumpfun'
import Image from 'next/image'

export default function NewTokensPanel() {
  const [newTokens, setNewTokens] = useState<PumpFunToken[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNewTokens()
    // Refresh every 30 seconds
    const interval = setInterval(loadNewTokens, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadNewTokens = async () => {
    try {
      const tokens = await getPumpFunNewTokens(10)
      setNewTokens(tokens)
    } catch (error) {
      console.error('Failed to load new tokens:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1000000) return `$${(marketCap / 1000000).toFixed(1)}M`
    if (marketCap >= 1000) return `$${(marketCap / 1000).toFixed(1)}K`
    return `$${marketCap.toFixed(0)}`
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Rocket className="h-5 w-5 text-neon-pink" />
          <span>New Token Launches</span>
        </CardTitle>
        <CardDescription>
          Fresh tokens from PumpFun and other platforms
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading new tokens...</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {newTokens.length === 0 ? (
              <div className="text-center py-8">
                <Rocket className="h-12 w-12 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400">No new tokens found</p>
                <p className="text-sm text-gray-500">Check back later for fresh launches</p>
              </div>
            ) : (
              newTokens.map((token, index) => (
                <div key={token.mint} className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
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
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-white text-sm">{token.symbol}</h3>
                          <span className="text-xs text-gray-400">#{index + 1}</span>
                        </div>
                        <p className="text-xs text-gray-400 truncate">{token.name}</p>
                        {token.description && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{token.description}</p>
                        )}
                        
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-400">
                              {formatTimeAgo(token.createdTimestamp)}
                            </span>
                          </div>
                          
                          {token.marketCap > 0 && (
                            <div className="flex items-center space-x-1">
                              <TrendingUp className="h-3 w-3 text-green-400" />
                              <span className="text-xs text-green-400">
                                {formatMarketCap(token.marketCap)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => window.open(`https://solscan.io/token/${token.mint}`, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                      
                      {token.price > 0 && (
                        <div className="text-right">
                          <div className="text-xs font-semibold text-white">
                            ${token.price.toFixed(token.price < 0.01 ? 6 : 4)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={loadNewTokens}
              disabled={loading}
            >
              Refresh
            </Button>
            <p className="text-xs text-gray-500">
              Updates every 30s
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 