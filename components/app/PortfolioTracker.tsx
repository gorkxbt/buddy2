'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  TrendingUp, TrendingDown, DollarSign, Percent, 
  BarChart3, PieChart, Target, Clock, ArrowUpRight, 
  ArrowDownRight, Eye, RefreshCw, Filter, Calendar, ArrowUp, ArrowDown
} from 'lucide-react'

interface Position {
  id: string
  symbol: string
  tokenAddress: string
  entryPrice: number
  currentPrice: number
  quantity: number
  value: number
  pnl: number
  pnlPercent: number
  entryTime: number
  lastUpdate: number
}

interface PortfolioStats {
  totalValue: number
  totalPnL: number
  totalPnLPercent: number
  winRate: number
  bestPerformer: Position | null
  worstPerformer: Position | null
  dayChange: number
  weekChange: number
}

interface PortfolioTrackerProps {
  trades: any[]
  walletBalance: number
}

export default function PortfolioTracker({ trades, walletBalance }: PortfolioTrackerProps) {
  const [positions, setPositions] = useState<Position[]>([])
  const [stats, setStats] = useState<PortfolioStats>({
    totalValue: 0,
    totalPnL: 0,
    totalPnLPercent: 0,
    winRate: 0,
    bestPerformer: null,
    worstPerformer: null,
    dayChange: 0,
    weekChange: 0
  })
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | 'ALL'>('1D')
  const [sortBy, setSortBy] = useState<'pnl' | 'value' | 'pnlPercent'>('pnl')
  const [isLoading, setIsLoading] = useState(false)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const updatePortfolio = useCallback(async () => {
    setIsLoading(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Process trades to create positions
    const positionMap = new Map<string, Position>()
    
    trades.forEach(trade => {
      if (trade.status !== 'completed') return
      
      const existing = positionMap.get(trade.symbol)
      
      if (trade.type === 'buy') {
        if (existing) {
          // Average down
          const totalQuantity = existing.quantity + (trade.amount / trade.price)
          const totalCost = (existing.quantity * existing.entryPrice) + trade.amount
          existing.entryPrice = totalCost / totalQuantity
          existing.quantity = totalQuantity
        } else {
          // New position
          positionMap.set(trade.symbol, {
            id: trade.id,
            symbol: trade.symbol,
            tokenAddress: trade.symbol, // Simplified
            entryPrice: trade.price,
            currentPrice: trade.price * (1 + (Math.random() - 0.5) * 0.2), // Simulate price movement
            quantity: trade.amount / trade.price,
            value: 0,
            pnl: 0,
            pnlPercent: 0,
            entryTime: trade.timestamp,
            lastUpdate: Date.now()
          })
        }
      } else if (existing && trade.type === 'sell') {
        // Reduce position
        const sellQuantity = trade.amount / trade.price
        existing.quantity = Math.max(0, existing.quantity - sellQuantity)
      }
    })
    
    // Calculate current values and PnL
    const updatedPositions = Array.from(positionMap.values())
      .filter(pos => pos.quantity > 0)
      .map(pos => {
        pos.value = pos.quantity * pos.currentPrice
        pos.pnl = pos.value - (pos.quantity * pos.entryPrice)
        pos.pnlPercent = ((pos.currentPrice - pos.entryPrice) / pos.entryPrice) * 100
        return pos
      })
    
    // Sort positions
    updatedPositions.sort((a, b) => {
      let aValue: number, bValue: number
      
      switch (sortBy) {
        case 'value':
          aValue = a.value
          bValue = b.value
          break
        case 'pnl':
          aValue = a.pnl
          bValue = b.pnl
          break
        case 'pnlPercent':
          aValue = a.pnlPercent
          bValue = b.pnlPercent
          break
        default:
          aValue = a.value
          bValue = b.value
      }
      
      if (sortOrder === 'asc') {
        return aValue - bValue
      } else {
        return bValue - aValue
      }
    })
    
    setPositions(updatedPositions)
    
    // Calculate portfolio stats
    const totalValue = updatedPositions.reduce((sum, pos) => sum + pos.value, 0) + walletBalance
    const totalPnL = updatedPositions.reduce((sum, pos) => sum + pos.pnl, 0)
    const totalCost = updatedPositions.reduce((sum, pos) => sum + (pos.quantity * pos.entryPrice), 0)
    const totalPnLPercent = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0
    
    const winningPositions = updatedPositions.filter(pos => pos.pnl > 0)
    const winRate = updatedPositions.length > 0 ? (winningPositions.length / updatedPositions.length) * 100 : 0
    
    const bestPerformer = updatedPositions.length > 0 
      ? updatedPositions.reduce((best, pos) => pos.pnlPercent > best.pnlPercent ? pos : best)
      : null
    
    const worstPerformer = updatedPositions.length > 0
      ? updatedPositions.reduce((worst, pos) => pos.pnlPercent < worst.pnlPercent ? pos : worst)
      : null
    
    setStats({
      totalValue,
      totalPnL,
      totalPnLPercent,
      winRate,
      bestPerformer,
      worstPerformer,
      dayChange: Math.random() * 10 - 5, // Simulate daily change
      weekChange: Math.random() * 20 - 10 // Simulate weekly change
    })
    
    setIsLoading(false)
  }, [trades, walletBalance, sortBy, sortOrder])

  useEffect(() => {
    updatePortfolio()
  }, [updatePortfolio])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`
  }

  const getPnLColor = (value: number) => {
    return value >= 0 ? 'text-green-400' : 'text-red-400'
  }

  const sortedPositions = [...positions].sort((a, b) => {
    let aValue: number, bValue: number
    
    switch (sortBy) {
      case 'value':
        aValue = a.value
        bValue = b.value
        break
      case 'pnl':
        aValue = a.pnl
        bValue = b.pnl
        break
      case 'pnlPercent':
        aValue = a.pnlPercent
        bValue = b.pnlPercent
        break
      default:
        aValue = a.value
        bValue = b.value
    }
    
    if (sortOrder === 'asc') {
      return aValue - bValue
    } else {
      return bValue - aValue
    }
  })

  // Generate sample performance data
  const performanceData = Array.from({ length: 30 }, (_, index) => {
    return Math.random() * 20 - 10 // Random values between -10 and 10
  })

  return (
    <div className="space-y-4">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Value</p>
              <p className="text-2xl font-bold text-white">${stats.totalValue.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total P&L</p>
              <p className={`text-2xl font-bold ${stats.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stats.totalPnL >= 0 ? '+' : ''}${stats.totalPnL.toFixed(2)}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              stats.totalPnL >= 0 ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-pink-500'
            }`}>
              {stats.totalPnL >= 0 ? <TrendingUp className="w-6 h-6 text-white" /> : <TrendingDown className="w-6 h-6 text-white" />}
            </div>
          </div>
        </div>

        <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Win Rate</p>
              <p className="text-2xl font-bold text-white">{stats.winRate.toFixed(0)}%</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 mb-6 border border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Performance</h3>
          <div className="flex space-x-2">
            {['1D', '1W', '1M', 'ALL'].map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period as '1D' | '1W' | '1M' | 'ALL')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  timeframe === period 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                    : 'bg-gray-700/50 text-gray-400 hover:text-white'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-32 flex items-end justify-between space-x-1">
          {performanceData.map((value: number, index: number) => (
            <div
              key={index}
              className={`flex-1 rounded-t transition-all duration-300 ${
                value >= 0 ? 'bg-gradient-to-t from-green-500 to-emerald-400' : 'bg-gradient-to-t from-red-500 to-pink-400'
              }`}
              style={{ height: `${Math.abs(value) * 2}px` }}
            ></div>
          ))}
        </div>
      </div>

      {/* Positions */}
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700/50">
        <div className="p-4 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Positions</h3>
            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'pnl' | 'value' | 'pnlPercent')}
                className="bg-gray-700/50 border border-gray-600 rounded px-3 py-1 text-sm text-white focus:border-purple-400 focus:outline-none"
              >
                <option value="value">Sort by Value</option>
                <option value="pnl">Sort by P&L</option>
                <option value="pnlPercent">Sort by P&L %</option>
              </select>
              
              <button
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="p-1 text-gray-400 hover:text-white"
              >
                {sortOrder === 'desc' ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-3"></div>
              <p className="text-gray-400">Loading positions...</p>
            </div>
          ) : sortedPositions.length === 0 ? (
            <div className="p-8 text-center">
              <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No positions yet</p>
              <p className="text-gray-500 text-sm">Start trading to see your portfolio</p>
            </div>
          ) : (
            sortedPositions.map((position) => (
              <div key={position.symbol} className="p-4 border-b border-gray-700/50 last:border-b-0 hover:bg-gray-800/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-white">{position.symbol.slice(0, 2)}</span>
                    </div>
                    <div>
                      <div className="font-medium text-white">{position.symbol}</div>
                      <div className="text-sm text-gray-400">
                        {position.quantity.toFixed(4)} @ ${position.entryPrice.toFixed(6)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium text-white">${position.value.toFixed(2)}</div>
                    <div className={`text-sm ${position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)} ({position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(1)}%)
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
} 