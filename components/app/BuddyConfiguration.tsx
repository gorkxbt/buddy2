'use client'

import { useState } from 'react'
import { 
  Bot, Settings, Zap, Shield, Target, TrendingUp, 
  DollarSign, Clock, AlertTriangle, CheckCircle2, 
  Play, Pause, RotateCcw, Save, X, Info
} from 'lucide-react'

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

interface BuddyConfigurationProps {
  config: BuddyConfig
  onConfigChange: (config: BuddyConfig) => void
  onClose: () => void
  isVisible: boolean
}

export default function BuddyConfiguration({ 
  config, 
  onConfigChange, 
  onClose, 
  isVisible 
}: BuddyConfigurationProps) {
  const [localConfig, setLocalConfig] = useState<BuddyConfig>(config)
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'risk' | 'notifications'>('basic')
  const [hasChanges, setHasChanges] = useState(false)

  const updateConfig = (updates: Partial<BuddyConfig>) => {
    const newConfig = { ...localConfig, ...updates }
    setLocalConfig(newConfig)
    setHasChanges(true)
  }

  const saveConfig = () => {
    onConfigChange(localConfig)
    setHasChanges(false)
  }

  const resetConfig = () => {
    setLocalConfig(config)
    setHasChanges(false)
  }

  const getRiskColor = (level: number) => {
    if (level <= 30) return 'text-green-400'
    if (level <= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getStrategyDescription = (strategy: string) => {
    const descriptions = {
      momentum: 'Follows price trends and momentum indicators',
      conservative: 'Low-risk approach with smaller position sizes',
      aggressive: 'High-risk, high-reward trading strategy',
      scalping: 'Quick trades for small profits'
    }
    return descriptions[strategy as keyof typeof descriptions]
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      
      <div className="relative z-10 bg-gray-900/95 backdrop-blur-xl border border-gray-800/50 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-6 border-b border-gray-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Buddy Configuration</h2>
                <p className="text-gray-400">Customize your AI trading companion</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {hasChanges && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={resetConfig}
                    className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                  <button
                    onClick={saveConfig}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              )}
              
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Status Bar */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${localConfig.isActive ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                <span className="text-sm text-gray-300">
                  {localConfig.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">{localConfig.mode} mode</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Target className={`w-4 h-4 ${getRiskColor(localConfig.riskLevel)}`} />
                <span className={`text-sm ${getRiskColor(localConfig.riskLevel)}`}>
                  {localConfig.riskLevel}% risk
                </span>
              </div>
            </div>
            
            <button
              onClick={() => updateConfig({ isActive: !localConfig.isActive })}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                localConfig.isActive 
                  ? 'bg-red-600/80 hover:bg-red-700/80 text-white' 
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
              }`}
            >
              {localConfig.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {localConfig.isActive ? 'Pause Buddy' : 'Activate Buddy'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800/50 bg-gray-900/30">
          {[
            { id: 'basic', label: 'Basic', icon: Settings },
            { id: 'advanced', label: 'Advanced', icon: Zap },
            { id: 'risk', label: 'Risk Management', icon: Shield },
            { id: 'notifications', label: 'Notifications', icon: AlertTriangle }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'text-white border-b-2 border-purple-400 bg-gradient-to-r from-purple-900/30 to-pink-900/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh] bg-gray-900/20">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              {/* Strategy Selection */}
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  Trading Strategy
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'momentum', name: 'Momentum', desc: 'Follows price trends and momentum indicators' },
                    { id: 'conservative', name: 'Conservative', desc: 'Low-risk approach with smaller positions' },
                    { id: 'aggressive', name: 'Aggressive', desc: 'High-risk, high-reward strategy' },
                    { id: 'scalping', name: 'Scalping', desc: 'Quick trades for small profits' }
                  ].map(strategy => (
                    <button
                      key={strategy.id}
                      onClick={() => updateConfig({ strategy: strategy.id as any })}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        localConfig.strategy === strategy.id
                          ? 'border-purple-400 bg-gradient-to-r from-purple-900/30 to-pink-900/30'
                          : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                      }`}
                    >
                      <div className="font-medium text-white">{strategy.name}</div>
                      <div className="text-sm text-gray-400 mt-1">{strategy.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Risk Level */}
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  Risk Level
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Risk Tolerance</span>
                    <span className={`font-bold ${getRiskColor(localConfig.riskLevel)}`}>
                      {localConfig.riskLevel}%
                    </span>
                  </div>
                  
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={localConfig.riskLevel}
                    onChange={(e) => updateConfig({ riskLevel: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Conservative</span>
                    <span>Moderate</span>
                    <span>Aggressive</span>
                  </div>
                </div>
              </div>

              {/* Trade Size */}
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-purple-400" />
                  Position Sizing
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Max Trade Size (USD)
                    </label>
                    <input
                      type="number"
                      value={localConfig.maxTradeSize}
                      onChange={(e) => updateConfig({ maxTradeSize: parseFloat(e.target.value) })}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      min="1"
                      max="10000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Mode
                    </label>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateConfig({ mode: 'demo' })}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          localConfig.mode === 'demo' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' : 'bg-gray-700/50 text-gray-300'
                        }`}
                      >
                        Demo
                      </button>
                      <button
                        onClick={() => updateConfig({ mode: 'live' })}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          localConfig.mode === 'live' ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white' : 'bg-gray-700/50 text-gray-300'
                        }`}
                      >
                        Live
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="space-y-6">
              {/* Auto Trading */}
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-400" />
                  Auto Trading
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">Enable Auto Trading</div>
                      <div className="text-sm text-gray-400">Let your buddy trade automatically</div>
                    </div>
                    <button
                      onClick={() => updateConfig({ autoTrade: !localConfig.autoTrade })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        localConfig.autoTrade ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          localConfig.autoTrade ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Slippage Tolerance (%)
                      </label>
                      <input
                        type="number"
                        value={localConfig.slippageTolerance}
                        onChange={(e) => updateConfig({ slippageTolerance: parseFloat(e.target.value) })}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-400 focus:outline-none"
                        min="0.1"
                        max="10"
                        step="0.1"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Max Daily Trades
                      </label>
                      <input
                        type="number"
                        value={localConfig.maxDailyTrades}
                        onChange={(e) => updateConfig({ maxDailyTrades: parseInt(e.target.value) })}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-400 focus:outline-none"
                        min="1"
                        max="100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Trading Hours */}
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-400" />
                  Trading Hours
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">Restrict Trading Hours</div>
                      <div className="text-sm text-gray-400">Only trade during specific hours</div>
                    </div>
                    <button
                      onClick={() => updateConfig({ 
                        tradingHours: { ...localConfig.tradingHours, enabled: !localConfig.tradingHours.enabled }
                      })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        localConfig.tradingHours.enabled ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          localConfig.tradingHours.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  {localConfig.tradingHours.enabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Start Time</label>
                        <input
                          type="time"
                          value={localConfig.tradingHours.start}
                          onChange={(e) => updateConfig({ 
                            tradingHours: { ...localConfig.tradingHours, start: e.target.value }
                          })}
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-400 focus:outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">End Time</label>
                        <input
                          type="time"
                          value={localConfig.tradingHours.end}
                          onChange={(e) => updateConfig({ 
                            tradingHours: { ...localConfig.tradingHours, end: e.target.value }
                          })}
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'risk' && (
            <div className="space-y-6">
              {/* Stop Loss & Take Profit */}
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  Stop Loss & Take Profit
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Stop Loss (%)
                    </label>
                    <input
                      type="number"
                      value={localConfig.stopLoss}
                      onChange={(e) => updateConfig({ stopLoss: parseFloat(e.target.value) })}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-400 focus:outline-none"
                      min="1"
                      max="50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Take Profit (%)
                    </label>
                    <input
                      type="number"
                      value={localConfig.takeProfit}
                      onChange={(e) => updateConfig({ takeProfit: parseFloat(e.target.value) })}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-400 focus:outline-none"
                      min="1"
                      max="200"
                    />
                  </div>
                </div>
              </div>

              {/* Risk Management */}
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-purple-400" />
                  Risk Management
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Max Drawdown (%)
                    </label>
                    <input
                      type="number"
                      value={localConfig.riskManagement.maxDrawdown}
                      onChange={(e) => updateConfig({ 
                        riskManagement: { ...localConfig.riskManagement, maxDrawdown: parseFloat(e.target.value) }
                      })}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-400 focus:outline-none"
                      min="1"
                      max="50"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Daily Loss Limit ($)
                      </label>
                      <input
                        type="number"
                        value={localConfig.riskManagement.dailyLossLimit}
                        onChange={(e) => updateConfig({ 
                          riskManagement: { ...localConfig.riskManagement, dailyLossLimit: parseFloat(e.target.value) }
                        })}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-400 focus:outline-none"
                        min="1"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Consecutive Loss Limit
                      </label>
                      <input
                        type="number"
                        value={localConfig.riskManagement.consecutiveLossLimit}
                        onChange={(e) => updateConfig({ 
                          riskManagement: { ...localConfig.riskManagement, consecutiveLossLimit: parseInt(e.target.value) }
                        })}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-400 focus:outline-none"
                        min="1"
                        max="10"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-purple-400" />
                  Notification Settings
                </h3>
                
                <div className="space-y-4">
                  {[
                    { key: 'trades', label: 'Trade Executions', desc: 'Get notified when trades are executed' },
                    { key: 'profits', label: 'Profitable Trades', desc: 'Notifications for winning trades' },
                    { key: 'losses', label: 'Loss Alerts', desc: 'Alerts for losing trades' },
                    { key: 'newTokens', label: 'New Tokens', desc: 'Notifications for new token discoveries' }
                  ].map(notification => (
                    <div key={notification.key} className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">{notification.label}</div>
                        <div className="text-sm text-gray-400">{notification.desc}</div>
                      </div>
                      <button
                        onClick={() => updateConfig({ 
                          notifications: { 
                            ...localConfig.notifications, 
                            [notification.key]: !localConfig.notifications[notification.key as keyof typeof localConfig.notifications]
                          }
                        })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          localConfig.notifications[notification.key as keyof typeof localConfig.notifications] ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            localConfig.notifications[notification.key as keyof typeof localConfig.notifications] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {hasChanges && (
          <div className="bg-gray-800/50 border-t border-gray-700/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-yellow-400">
                <Info className="w-4 h-4" />
                <span className="text-sm">You have unsaved changes</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={resetConfig}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveConfig}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 