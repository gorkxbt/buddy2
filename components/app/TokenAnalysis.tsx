'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, 
  Target, Zap, BarChart3, Activity, Clock, Users,
  DollarSign, Percent, ArrowUp, ArrowDown, Eye, Brain, RefreshCw, ArrowUpRight, ArrowDownRight
} from 'lucide-react'
import { PumpFunToken, getTokenPairs, getTokenSwaps, getTokenPrice, MoralisTokenPair, MoralisSwap } from '@/lib/pumpfun'

interface TokenAnalysisProps {
  token: PumpFunToken
  onTradeSignal: (signal: 'buy' | 'sell' | 'hold', confidence: number) => void
}

interface AnalysisMetrics {
  momentum: number
  volume: number
  community: number
  risk: number
  overall: number
}

interface SwapActivity {
  totalSwaps: number
  buyVolume: number
  sellVolume: number
  netFlow: number
  avgTradeSize: number
  uniqueTraders: number
}

export default function TokenAnalysis({ token, onTradeSignal }: TokenAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [metrics, setMetrics] = useState<AnalysisMetrics>({
    momentum: 0,
    volume: 0,
    community: 0,
    risk: 0,
    overall: 0
  })
  const [signal, setSignal] = useState<'buy' | 'sell' | 'hold'>('hold')
  const [confidence, setConfidence] = useState(0)
  const [lastAnalysis, setLastAnalysis] = useState<number>(0)
  const [tokenPairs, setTokenPairs] = useState<MoralisTokenPair[]>([])
  const [recentSwaps, setRecentSwaps] = useState<MoralisSwap[]>([])
  const [swapActivity, setSwapActivity] = useState<SwapActivity>({
    totalSwaps: 0,
    buyVolume: 0,
    sellVolume: 0,
    netFlow: 0,
    avgTradeSize: 0,
    uniqueTraders: 0
  })
  const [currentPrice, setCurrentPrice] = useState<number>(token.price)

  const analyzeToken = useCallback(async () => {
    if (!token || isAnalyzing) return
    
    setIsAnalyzing(true)
    
    try {
      console.log(`🔍 Starting comprehensive analysis for ${token.symbol}...`)
      
      // Fetch real data from Moralis
      const [pairs, swaps, price] = await Promise.all([
        getTokenPairs(token.mint),
        getTokenSwaps(token.mint, 100),
        getTokenPrice(token.mint)
      ])
      
      setTokenPairs(pairs)
      setRecentSwaps(swaps)
      if (price !== null) {
        setCurrentPrice(price)
      }
      
      // Analyze swap activity
      const swapAnalysis = analyzeSwapActivity(swaps)
      setSwapActivity(swapAnalysis)
      
      // Calculate metrics based on real data
      const calculatedMetrics = calculateMetrics(token, pairs, swaps, swapAnalysis)
      setMetrics(calculatedMetrics)
      
      // Generate trading signal
      const tradingSignal = generateTradingSignal(calculatedMetrics, swapAnalysis)
      setSignal(tradingSignal.signal)
      setConfidence(tradingSignal.confidence)
      
      // Notify parent component
      onTradeSignal(tradingSignal.signal, tradingSignal.confidence)
      
      setLastAnalysis(Date.now())
      
    } catch (error) {
      console.error('Error analyzing token:', error)
      
      // Fallback to basic analysis if API fails
      const fallbackMetrics = generateFallbackMetrics(token)
      setMetrics(fallbackMetrics)
      
      const fallbackSignal = generateTradingSignal(fallbackMetrics, swapActivity)
      setSignal(fallbackSignal.signal)
      setConfidence(fallbackSignal.confidence)
      
    } finally {
      setIsAnalyzing(false)
    }
  }, [token, isAnalyzing, onTradeSignal, swapActivity])

  const analyzeSwapActivity = (swaps: MoralisSwap[]): SwapActivity => {
    if (!swaps.length) {
      return {
        totalSwaps: 0,
        buyVolume: 0,
        sellVolume: 0,
        netFlow: 0,
        avgTradeSize: 0,
        uniqueTraders: 0
      }
    }
    
    let buyVolume = 0
    let sellVolume = 0
    const traders = new Set<string>()
    
    swaps.forEach(swap => {
      const volume = parseFloat(swap.to_amount) || 0
      traders.add(swap.from_address)
      
      // Determine if it's a buy or sell based on token addresses
      if (swap.to_token.address === token.mint) {
        buyVolume += volume
      } else {
        sellVolume += volume
      }
    })
    
    const totalVolume = buyVolume + sellVolume
    const netFlow = buyVolume - sellVolume
    const avgTradeSize = totalVolume / swaps.length
    
    return {
      totalSwaps: swaps.length,
      buyVolume,
      sellVolume,
      netFlow,
      avgTradeSize,
      uniqueTraders: traders.size
    }
  }

  const calculateMetrics = (
    token: PumpFunToken, 
    pairs: MoralisTokenPair[], 
    swaps: MoralisSwap[],
    swapActivity: SwapActivity
  ): AnalysisMetrics => {
    // Momentum analysis
    const momentum = Math.min(100, Math.max(0, 
      (token.bondingCurveProgress * 0.4) + 
      (swapActivity.netFlow > 0 ? 30 : -10) +
      (pairs.length * 10) +
      (Math.min(token.volume24h / 10000, 20))
    ))
    
    // Volume analysis
    const volume = Math.min(100, Math.max(0,
      (token.volume24h / 1000) +
      (swapActivity.totalSwaps * 2) +
      (swapActivity.uniqueTraders * 3)
    ))
    
    // Community analysis
    const community = Math.min(100, Math.max(0,
      (token.holders / 10) +
      (swapActivity.uniqueTraders * 2) +
      (token.isGraduated ? 20 : 0) +
      (pairs.length * 5)
    ))
    
    // Risk analysis (lower is better)
    const risk = Math.min(100, Math.max(0,
      100 - token.bondingCurveProgress * 0.5 -
      (token.holders / 20) -
      (pairs.length * 10) -
      (token.isGraduated ? 30 : 0)
    ))
    
    // Overall score
    const overall = (momentum + volume + community + (100 - risk)) / 4
    
    return { momentum, volume, community, risk, overall }
  }

  const generateFallbackMetrics = (token: PumpFunToken): AnalysisMetrics => {
    const momentum = Math.min(100, token.bondingCurveProgress + Math.random() * 20)
    const volume = Math.min(100, (token.volume24h / 1000) + Math.random() * 30)
    const community = Math.min(100, (token.holders / 10) + Math.random() * 25)
    const risk = Math.max(0, 100 - token.bondingCurveProgress - Math.random() * 30)
    const overall = (momentum + volume + community + (100 - risk)) / 4
    
    return { momentum, volume, community, risk, overall }
  }

  const generateTradingSignal = (metrics: AnalysisMetrics, swapActivity: SwapActivity) => {
    const { overall, momentum, volume, risk } = metrics
    
    // Strong buy conditions
    if (overall > 75 && momentum > 70 && volume > 60 && risk < 40 && swapActivity.netFlow > 0) {
      return { signal: 'buy' as const, confidence: Math.min(95, overall + 10) }
    }
    
    // Buy conditions
    if (overall > 60 && momentum > 50 && risk < 60) {
      return { signal: 'buy' as const, confidence: Math.min(85, overall) }
    }
    
    // Sell conditions
    if (overall < 40 || risk > 80 || (momentum < 30 && volume < 30)) {
      return { signal: 'sell' as const, confidence: Math.min(85, 100 - overall) }
    }
    
    // Hold conditions
    return { signal: 'hold' as const, confidence: Math.min(75, 50 + Math.abs(50 - overall)) }
  }

  // Auto-analyze when token changes
  useEffect(() => {
    if (token && (!lastAnalysis || Date.now() - lastAnalysis > 30000)) {
      analyzeToken()
    }
  }, [token, analyzeToken, lastAnalysis])

  // Real-time price updates
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const price = await getTokenPrice(token.mint)
        if (price !== null && price !== currentPrice) {
          setCurrentPrice(price)
        }
      } catch (error) {
        console.error('Error updating price:', error)
      }
    }, 15000) // Update every 15 seconds

    return () => clearInterval(interval)
  }, [token.mint, currentPrice])

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'buy': return 'text-green-400'
      case 'sell': return 'text-red-400'
      default: return 'text-yellow-400'
    }
  }

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'buy': return <ArrowUpRight className="w-5 h-5" />
      case 'sell': return <ArrowDownRight className="w-5 h-5" />
      default: return <Activity className="w-5 h-5" />
    }
  }

  const getMetricColor = (value: number) => {
    if (value >= 70) return 'from-green-500 to-emerald-500'
    if (value >= 40) return 'from-yellow-500 to-orange-500'
    return 'from-red-500 to-pink-500'
  }

  const getRiskColor = (risk: number) => {
    if (risk <= 30) return 'from-green-500 to-emerald-500'
    if (risk <= 60) return 'from-yellow-500 to-orange-500'
    return 'from-red-500 to-pink-500'
  }

  return (
    <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg border border-gray-800/50 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-400" />
          AI Analysis
        </h3>
        
        <div className="flex items-center space-x-3">
          {/* Real-time price */}
          <div className="text-right">
            <div className="text-sm text-gray-400">Live Price</div>
            <div className="text-lg font-bold text-white">
              ${currentPrice.toFixed(6)}
            </div>
          </div>
          
          <button
            onClick={analyzeToken}
            disabled={isAnalyzing}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:bg-gray-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b border-white"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Analyze
              </>
            )}
          </button>
        </div>
      </div>

      {/* Trading Signal */}
      <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`${getSignalColor(signal)}`}>
              {getSignalIcon(signal)}
            </div>
            <div>
              <div className={`text-lg font-bold ${getSignalColor(signal)}`}>
                {signal.toUpperCase()} SIGNAL
              </div>
              <div className="text-sm text-gray-400">
                Confidence: {confidence.toFixed(1)}%
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-400">Overall Score</div>
            <div className="text-2xl font-bold text-white">
              {metrics.overall.toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Momentum</span>
            <span className="text-white font-medium">{metrics.momentum.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`bg-gradient-to-r ${getMetricColor(metrics.momentum)} h-2 rounded-full transition-all duration-500`}
              style={{ width: `${metrics.momentum}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Volume Activity</span>
            <span className="text-white font-medium">{metrics.volume.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`bg-gradient-to-r ${getMetricColor(metrics.volume)} h-2 rounded-full transition-all duration-500`}
              style={{ width: `${metrics.volume}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Community</span>
            <span className="text-white font-medium">{metrics.community.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`bg-gradient-to-r ${getMetricColor(metrics.community)} h-2 rounded-full transition-all duration-500`}
              style={{ width: `${metrics.community}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Risk Level</span>
            <span className="text-white font-medium">{metrics.risk.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`bg-gradient-to-r ${getRiskColor(metrics.risk)} h-2 rounded-full transition-all duration-500`}
              style={{ width: `${metrics.risk}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Real-time Data */}
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="bg-gray-800/50 rounded p-3">
          <div className="text-gray-400 mb-1">Trading Pairs</div>
          <div className="text-white font-medium">{tokenPairs.length}</div>
        </div>
        
        <div className="bg-gray-800/50 rounded p-3">
          <div className="text-gray-400 mb-1">Recent Swaps</div>
          <div className="text-white font-medium">{swapActivity.totalSwaps}</div>
        </div>
        
        <div className="bg-gray-800/50 rounded p-3">
          <div className="text-gray-400 mb-1">Unique Traders</div>
          <div className="text-white font-medium">{swapActivity.uniqueTraders}</div>
        </div>
      </div>

      {/* Swap Activity Details */}
      {swapActivity.totalSwaps > 0 && (
        <div className="mt-4 p-3 bg-gray-800/30 rounded border border-gray-700/50">
          <div className="text-sm text-gray-400 mb-2">Swap Activity (Last 100 trades)</div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-green-400">Buy Volume: </span>
              <span className="text-white">${swapActivity.buyVolume.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-red-400">Sell Volume: </span>
              <span className="text-white">${swapActivity.sellVolume.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-gray-400">Net Flow: </span>
              <span className={swapActivity.netFlow >= 0 ? 'text-green-400' : 'text-red-400'}>
                ${swapActivity.netFlow.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Avg Trade: </span>
              <span className="text-white">${swapActivity.avgTradeSize.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {lastAnalysis > 0 && (
        <div className="mt-3 text-xs text-gray-500 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Last updated: {Math.floor((Date.now() - lastAnalysis) / 1000)}s ago
        </div>
      )}
    </div>
  )
} 