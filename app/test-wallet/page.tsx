'use client'

import { useState, useEffect } from 'react'
import { walletManager } from '../../lib/wallet'

export default function TestWallet() {
  const [status, setStatus] = useState<string>('Checking...')
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  useEffect(() => {
    const checkWallet = async () => {
      addLog('Starting wallet check...')
      
      // Check if we're in browser
      if (typeof window === 'undefined') {
        setStatus('Not in browser')
        addLog('Not running in browser environment')
        return
      }
      
      addLog('Browser environment detected')
      
      // Check if Phantom is available
      if (!window.solana) {
        setStatus('Phantom not found')
        addLog('window.solana is not available')
        return
      }
      
      addLog('window.solana is available')
      
      if (!window.solana.isPhantom) {
        setStatus('Not Phantom wallet')
        addLog('Wallet is not Phantom')
        return
      }
      
      addLog('Phantom wallet detected')
      
      // Check if already connected
      if (window.solana.isConnected) {
        setStatus('Already connected')
        addLog(`Already connected to: ${window.solana.publicKey?.toString()}`)
      } else {
        setStatus('Phantom available, not connected')
        addLog('Phantom is available but not connected')
      }
    }
    
    checkWallet()
  }, [])

  const testConnection = async () => {
    addLog('Testing connection...')
    setStatus('Connecting...')
    
    try {
      const walletInfo = await walletManager.connectPhantom()
      setStatus('Connected successfully!')
      addLog(`Connected to: ${walletInfo.publicKey}`)
      addLog(`Balance: ${walletInfo.balance} SOL`)
    } catch (error: any) {
      setStatus('Connection failed')
      addLog(`Error: ${error.message}`)
      console.error('Connection error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Wallet Connection Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Status</h2>
            <p className="text-lg mb-4">{status}</p>
            
            <button
              onClick={testConnection}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Test Connection
            </button>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Quick Checks</h3>
              <ul className="space-y-2 text-sm">
                <li>Browser: {typeof window !== 'undefined' ? '✅' : '❌'}</li>
                <li>window.solana: {typeof window !== 'undefined' && window.solana ? '✅' : '❌'}</li>
                <li>isPhantom: {typeof window !== 'undefined' && window.solana?.isPhantom ? '✅' : '❌'}</li>
                <li>isConnected: {typeof window !== 'undefined' && window.solana?.isConnected ? '✅' : '❌'}</li>
                <li>publicKey: {typeof window !== 'undefined' && window.solana?.publicKey ? '✅' : '❌'}</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Debug Logs</h2>
            <div className="bg-black rounded p-4 h-96 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="text-sm text-gray-300 mb-1">
                  {log}
                </div>
              ))}
            </div>
            
            <button
              onClick={() => setLogs([])}
              className="mt-4 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm"
            >
              Clear Logs
            </button>
          </div>
        </div>
        
        <div className="mt-8 bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Troubleshooting</h2>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• Make sure Phantom wallet extension is installed</li>
            <li>• Ensure Phantom wallet is unlocked</li>
            <li>• Try refreshing the page</li>
            <li>• Check if Phantom is set as the default wallet</li>
            <li>• Disable other wallet extensions temporarily</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 