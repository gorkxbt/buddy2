'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Activity, Target, Clock, Zap, Bot } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatPercentage } from '@/lib/utils'

const mockPerformanceData = {
  totalPnL: 1247.83,
  totalPnLPercentage: 24.7,
  todayPnL: 89.45,
  todayPnLPercentage: 1.8,
  totalTrades: 47,
  winRate: 68.1,
  avgTradeSize: 0.5,
  bestTrade: 234.56,
  worstTrade: -45.23,
  activeTrades: 3,
  learningProgress: 78
}

const recentTrades = [
  { symbol: 'SOL', type: 'buy', pnl: 23.45, percentage: 4.2, time: '2m ago', status: 'closed' },
  { symbol: 'BONK', type: 'sell', pnl: -12.34, percentage: -2.1, time: '5m ago', status: 'closed' },
  { symbol: 'WIF', type: 'buy', pnl: 45.67, percentage: 8.9, time: '12m ago', status: 'open' },
  { symbol: 'POPCAT', type: 'sell', pnl: 67.89, percentage: 12.3, time: '18m ago', status: 'closed' },
]

const aiInsights = [
  "Buddy is performing 23% better than average in high-volatility conditions",
  "Recent strategy adjustments improved win rate by 8.5%",
  "Optimal trading window identified: 2-4 PM UTC",
  "Risk management rules prevented 3 potential losses today"
]

export default function PerformancePanel() {
  const [timeframe, setTimeframe] = useState<'1D' | '7D' | '30D' | 'ALL'>('1D')

  return (
    <div className="space-y-6">
      {/* Buddy Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-neon-purple" />
            <span>Buddy Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Status</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-semibold">Active</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Learning Progress</span>
              <span className="text-neon-cyan font-semibold">{mockPerformanceData.learningProgress}%</span>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${mockPerformanceData.learningProgress}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Active Trades</span>
              <span className="text-white font-semibold">{mockPerformanceData.activeTrades}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PnL Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-neon-green" />
              <span>Performance</span>
            </div>
            <div className="flex space-x-1">
              {(['1D', '7D', '30D', 'ALL'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeframe(period)}
                  className={`px-2 py-1 text-xs rounded ${
                    timeframe === period
                      ? 'bg-purple-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                mockPerformanceData.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {formatCurrency(mockPerformanceData.totalPnL)}
              </div>
              <div className="text-sm text-gray-400">Total PnL</div>
              <div className={`text-sm ${
                mockPerformanceData.totalPnLPercentage >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {formatPercentage(mockPerformanceData.totalPnLPercentage)}
              </div>
            </div>
            
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                mockPerformanceData.todayPnL >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {formatCurrency(mockPerformanceData.todayPnL)}
              </div>
              <div className="text-sm text-gray-400">Today</div>
              <div className={`text-sm ${
                mockPerformanceData.todayPnLPercentage >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {formatPercentage(mockPerformanceData.todayPnLPercentage)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trading Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-neon-cyan" />
            <span>Trading Stats</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Total Trades</span>
              <span className="text-white font-semibold">{mockPerformanceData.totalTrades}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Win Rate</span>
              <span className="text-green-400 font-semibold">{mockPerformanceData.winRate}%</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Avg Trade Size</span>
              <span className="text-white font-semibold">{mockPerformanceData.avgTradeSize} SOL</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Best Trade</span>
              <span className="text-green-400 font-semibold">{formatCurrency(mockPerformanceData.bestTrade)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Worst Trade</span>
              <span className="text-red-400 font-semibold">{formatCurrency(mockPerformanceData.worstTrade)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-neon-pink" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTrades.map((trade, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    trade.type === 'buy' ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}>
                    {trade.type === 'buy' ? (
                      <TrendingUp className="h-3 w-3 text-green-400" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-400" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{trade.symbol}</div>
                    <div className="text-xs text-gray-400">{trade.time}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-sm font-semibold ${
                    trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {formatCurrency(trade.pnl)}
                  </div>
                  <div className={`text-xs ${
                    trade.status === 'open' ? 'text-yellow-400' : 'text-gray-400'
                  }`}>
                    {trade.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-neon-yellow" />
            <span>AI Insights</span>
          </CardTitle>
          <CardDescription>
            What your buddy has learned recently
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {aiInsights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-2 p-2 bg-gray-800 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-300">{insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 