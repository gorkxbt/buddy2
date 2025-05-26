'use client'

import { motion } from 'framer-motion'
import { Calendar, CheckCircle, Clock, Rocket } from 'lucide-react'
import Link from 'next/link'

const roadmapItems = [
  {
    quarter: 'Q3 2025',
    title: 'MVP Launch',
    status: 'completed',
    items: [
      'Single Buddy deployment system',
      'Demo trading mode',
      'Basic customization tools',
      'Core AI framework'
    ]
  },
  {
    quarter: 'Q4 2025',
    title: 'Live Trading & Chat',
    status: 'in-progress',
    items: [
      'Live trading on PumpFun, BonkFun, BelieveApp',
      'Conversational chat interface',
      'Advanced strategy presets',
      'Performance analytics dashboard'
    ]
  },
  {
    quarter: 'Q1 2026',
    title: 'Integrations & Analytics',
    status: 'upcoming',
    items: [
      'Telegram and Discord API integrations',
      'Real-time analytics dashboard',
      'Mobile app beta',
      'Community features'
    ]
  },
  {
    quarter: 'Q2 2026',
    title: 'Token Launch & Multi-Buddy',
    status: 'upcoming',
    items: [
      'BUDDY token launch',
      'Multiple Buddy deployment support',
      'Staking and governance features',
      'Advanced AI collaboration between Buddies'
    ]
  },
  {
    quarter: 'Q3 2026',
    title: 'Multi-Chain Expansion',
    status: 'upcoming',
    items: [
      'Base chain integration',
      'Ethereum mainnet support',
      'HyperEVM compatibility',
      'Cross-chain Buddy synchronization'
    ]
  }
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-6 w-6 text-green-500" />
    case 'in-progress':
      return <Clock className="h-6 w-6 text-yellow-500" />
    default:
      return <Rocket className="h-6 w-6 text-purple-500" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'from-green-500 to-emerald-500'
    case 'in-progress':
      return 'from-yellow-500 to-orange-500'
    default:
      return 'from-purple-500 to-pink-500'
  }
}

export default function Roadmap() {
  return (
    <section id="roadmap" className="py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Roadmap</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our journey to revolutionize AI trading on Solana
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-500 via-pink-500 to-cyan-500"></div>
          
          <div className="space-y-12">
            {roadmapItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`flex flex-col md:flex-row items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Content Card */}
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                  <div className="glass-effect rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-purple-400" />
                        <span className="text-purple-400 font-semibold">{item.quarter}</span>
                      </div>
                      {getStatusIcon(item.status)}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                    
                    {/* Items */}
                    <ul className="space-y-2">
                      {item.items.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Timeline Node */}
                <div className="hidden md:flex w-2/12 justify-center">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getStatusColor(item.status)} flex items-center justify-center border-4 border-gray-900 z-10`}>
                    {getStatusIcon(item.status)}
                  </div>
                </div>

                {/* Spacer */}
                <div className="hidden md:block w-5/12"></div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="glass-effect rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 gradient-text">
              Join the Journey
            </h3>
            <p className="text-gray-300 mb-6">
              Be part of the future of AI trading. Get early access and help shape the development of Trenches Buddy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/app">
                <button className="neon-button">
                  Get Early Access
                </button>
              </Link>
              <button className="glass-effect px-6 py-3 rounded-lg hover:bg-white/10 transition-colors">
                Join Community
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 