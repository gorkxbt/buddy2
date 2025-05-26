'use client'

import { motion } from 'framer-motion'
import { Play, Settings, MessageSquare, TrendingUp, Smartphone } from 'lucide-react'

const steps = [
  {
    icon: Play,
    title: 'Deploy Your Buddy',
    description: 'Launch an AI agent on Solana linked to your wallet with your chosen settings.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Settings,
    title: 'Customize & Teach',
    description: 'Use built-in tools to set trading style, then chat to teach new tactics and strategies.',
    color: 'from-pink-500 to-cyan-500'
  },
  {
    icon: TrendingUp,
    title: 'Training in the Trenches',
    description: 'Your Buddy trades on Solana pairs, learning from market data and your interactions.',
    color: 'from-cyan-500 to-green-500'
  },
  {
    icon: MessageSquare,
    title: 'Monitor & Adjust',
    description: 'Watch performance in real-time, review trades, and chat to refine behavior.',
    color: 'from-green-500 to-purple-500'
  },
  {
    icon: Smartphone,
    title: 'Integrate & Automate',
    description: 'Connect to Telegram for notifications and remote commands to optimize your workflow.',
    color: 'from-purple-500 to-pink-500'
  }
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 relative">
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
            <span className="gradient-text">How It Works</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get started with your AI trading companion in 5 simple steps
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 via-cyan-500 via-green-500 to-purple-500 transform -translate-y-1/2"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Step Card */}
                <div className="glass-effect rounded-2xl p-6 text-center relative z-10 hover:scale-105 transition-transform duration-300">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-sm`}>
                      {index + 1}
                    </div>
                  </div>
                  
                  {/* Icon */}
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center`}>
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Demo Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="glass-effect rounded-3xl p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div>
                <h3 className="text-3xl font-bold mb-6">
                  <span className="gradient-text">See It In Action</span>
                </h3>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  Watch how easy it is to deploy and customize your AI trading buddy. 
                  From setup to your first profitable trade in minutes.
                </p>
                <div className="space-y-4">
                  {[
                    '✨ One-click deployment',
                    '🎯 Intuitive customization',
                    '💬 Natural language training',
                    '📊 Real-time monitoring'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <button className="neon-button mr-4">
                    Watch Demo
                  </button>
                  <button className="glass-effect px-6 py-3 rounded-lg hover:bg-white/10 transition-colors">
                    Try Demo Mode
                  </button>
                </div>
              </div>
              
              {/* Right Content - Mock Interface */}
              <div className="relative">
                <div className="glass-effect rounded-2xl p-6 border border-purple-500/30">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-400 ml-2">Trenches Buddy Chat</span>
                  </div>
                  <div className="space-y-3 h-64 overflow-hidden">
                    <div className="bg-purple-600/20 rounded-lg p-3 text-sm">
                      <span className="text-purple-400">You:</span> Be more aggressive with SOL trades
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-3 text-sm">
                      <span className="text-cyan-400">Buddy:</span> Understood! I&apos;ll increase position sizes for SOL by 25% and tighten stop-losses to 3%. Should I also look for more momentum signals?
                    </div>
                    <div className="bg-purple-600/20 rounded-lg p-3 text-sm">
                      <span className="text-purple-400">You:</span> Yes, and show me your next trade before executing
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-3 text-sm">
                      <span className="text-cyan-400">Buddy:</span> Perfect! I&apos;ll enable trade confirmation mode. Currently analyzing SOL/USDC - seeing strong momentum signals...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 