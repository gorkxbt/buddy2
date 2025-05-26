'use client'

import { motion } from 'framer-motion'
import { 
  MessageSquare, 
  Settings, 
  TrendingUp, 
  Shield, 
  Zap, 
  Bot,
  Target,
  BarChart3,
  Smartphone
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

const features = [
  {
    icon: MessageSquare,
    title: 'Conversational AI Training',
    description: 'Talk to your Buddy like a human mentor. Teach strategies, ask questions, and get explanations in natural language.',
    color: 'text-neon-purple'
  },
  {
    icon: Settings,
    title: 'Built-in Customization Tools',
    description: 'Rich set of tools to tailor your Buddy\'s personality and trading style. No coding required.',
    color: 'text-neon-pink'
  },
  {
    icon: TrendingUp,
    title: 'Dual Trading Modes',
    description: 'Choose between Live mode with real assets or Demo mode with paper money for risk-free testing.',
    color: 'text-neon-cyan'
  },
  {
    icon: Shield,
    title: 'Security & Transparency',
    description: 'Transparent smart contracts on Solana with all trades recorded on-chain for auditability.',
    color: 'text-neon-green'
  },
  {
    icon: Zap,
    title: 'Real-time Performance',
    description: 'Track your Buddy\'s progress with detailed PnL cards, trade logs, and analytics dashboards.',
    color: 'text-neon-purple'
  },
  {
    icon: Bot,
    title: 'AI Learning Agent',
    description: 'Your Buddy continuously learns from market data and your interactions, refining its strategy.',
    color: 'text-neon-pink'
  },
  {
    icon: Target,
    title: 'Strategy Presets',
    description: 'Choose from proven trading strategies including momentum trading, mean reversion, and arbitrage.',
    color: 'text-neon-cyan'
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Comprehensive insights with risk metrics, performance tracking, and detailed trade analysis.',
    color: 'text-neon-green'
  },
  {
    icon: Smartphone,
    title: 'API Integrations',
    description: 'Connect to Telegram and other platforms for alerts, commands, and automated trading workflows.',
    color: 'text-neon-purple'
  }
]

export default function Features() {
  return (
    <section id="features" className="py-20 relative">
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
            <span className="gradient-text">Powerful Features</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to deploy, customize, and optimize your AI trading companion
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:scale-105 transition-transform duration-300 group">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-semibold text-white">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
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
              Ready to Meet Your Buddy?
            </h3>
            <p className="text-gray-300 mb-6">
              Join thousands of traders who are already using AI to navigate the DeFi trenches
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/app">
                <button className="neon-button">
                  Start Trading Now
                </button>
              </Link>
              <button className="glass-effect px-6 py-3 rounded-lg hover:bg-white/10 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 