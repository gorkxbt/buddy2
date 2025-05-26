'use client'

import { motion } from 'framer-motion'
import { Coins, Lock, TrendingUp, Users, Zap, Vote } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const tokenUtilities = [
  {
    icon: Zap,
    title: 'Utility',
    description: 'Required to deploy Buddies, unlock advanced features, and access premium chat capabilities.',
    color: 'text-neon-purple'
  },
  {
    icon: Lock,
    title: 'Staking',
    description: 'Stake BUDDY to accelerate learning speed, gain priority access, and earn rewards.',
    color: 'text-neon-pink'
  },
  {
    icon: TrendingUp,
    title: 'Rewards',
    description: 'High-performing Buddies earn BUDDY tokens as incentives for continuous improvement.',
    color: 'text-neon-cyan'
  },
  {
    icon: Vote,
    title: 'Governance',
    description: 'Token holders vote on platform upgrades, new features, and partnerships.',
    color: 'text-neon-green'
  }
]

const tokenDistribution = [
  { label: 'Community & Rewards', percentage: 40, color: 'bg-purple-500' },
  { label: 'Development', percentage: 25, color: 'bg-pink-500' },
  { label: 'Marketing & Partnerships', percentage: 15, color: 'bg-cyan-500' },
  { label: 'Team & Advisors', percentage: 10, color: 'bg-green-500' },
  { label: 'Liquidity', percentage: 10, color: 'bg-yellow-500' }
]

export default function Tokenomics() {
  return (
    <section id="tokenomics" className="py-20 relative">
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
            <span className="gradient-text">Tokenomics</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            The BUDDY token powers the entire Trenches Buddy ecosystem
          </p>
        </motion.div>

        {/* Token Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="glass-effect rounded-3xl p-8 md:p-12 mb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Token Details */}
            <div>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Coins className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold gradient-text">BUDDY Token</h3>
                  <p className="text-gray-400">The lifeblood of the ecosystem</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-effect p-4 rounded-lg">
                    <div className="text-2xl font-bold text-neon-purple">1B</div>
                    <div className="text-sm text-gray-400">Total Supply</div>
                  </div>
                  <div className="glass-effect p-4 rounded-lg">
                    <div className="text-2xl font-bold text-neon-pink">SOL</div>
                    <div className="text-sm text-gray-400">Blockchain</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-white">Key Features:</h4>
                  {[
                    'Deflationary mechanism through buddy deployment fees',
                    'Staking rewards for active participants',
                    'Governance rights for platform decisions',
                    'Performance-based token distribution'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right - Distribution Chart */}
            <div>
              <h4 className="text-xl font-semibold text-white mb-6 text-center">Token Distribution</h4>
              <div className="space-y-4">
                {tokenDistribution.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-4"
                  >
                    <div className="w-24 text-sm text-gray-300">{item.percentage}%</div>
                    <div className="flex-1 bg-gray-700 rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.percentage}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className={`h-full ${item.color} rounded-full`}
                      />
                    </div>
                    <div className="w-40 text-sm text-gray-300">{item.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Token Utilities */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tokenUtilities.map((utility, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:scale-105 transition-transform duration-300 group">
                <CardHeader className="text-center">
                  <div className={`w-12 h-12 mx-auto rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <utility.icon className={`h-6 w-6 ${utility.color}`} />
                  </div>
                  <CardTitle className="text-lg font-semibold text-white">
                    {utility.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-center leading-relaxed">
                    {utility.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Economic Model */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="glass-effect rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-center mb-8">
              <span className="gradient-text">Sustainable Economic Model</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Value Creation</h4>
                <p className="text-gray-300 text-sm">
                  Successful trading generates value for the entire ecosystem through performance fees and token burns.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-pink-500 to-cyan-500 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Growth Incentives</h4>
                <p className="text-gray-300 text-sm">
                  Rewards for high-performing Buddies and active community members drive continuous improvement.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-500 to-green-500 flex items-center justify-center">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Long-term Alignment</h4>
                <p className="text-gray-300 text-sm">
                  Staking mechanisms and vesting schedules ensure long-term commitment from all stakeholders.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 