'use client'

import { useState, useEffect } from 'react'
import AppHeader from '@/components/app/AppHeader'
import BuddyDeployment from '@/components/app/BuddyDeployment'
import TrenchesInterface from '@/components/app/TrenchesInterface'
import { walletManager, WalletInfo, BuddyDeployment as BuddyDeploymentType } from '../../lib/wallet'

export default function App() {
  const [hasBuddy, setHasBuddy] = useState(false)
  const [buddyDeployment, setBuddyDeployment] = useState<BuddyDeploymentType | null>(null)

  useEffect(() => {
    // Check for existing buddy deployment on load
    walletManager.onWalletChange((walletInfo) => {
      if (walletInfo) {
        const existingDeployment = walletManager.getBuddyDeployment(walletInfo.publicKey)
        if (existingDeployment) {
          setBuddyDeployment(existingDeployment)
          setHasBuddy(true)
        }
      }
    })
  }, [])

  const handleDeploymentComplete = (deployment: BuddyDeploymentType) => {
    setBuddyDeployment(deployment)
    setHasBuddy(true)
  }

  if (!hasBuddy) {
    return <BuddyDeployment onDeploymentComplete={handleDeploymentComplete} />
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      
      <div className="relative z-10">
        <AppHeader />
        <TrenchesInterface />
      </div>
    </div>
  )
} 