'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Bot, Zap, Shield, TrendingUp, MessageSquare, Target, Rocket, ChevronDown, Play, Star, Users, DollarSign, BarChart3, Sparkles, Brain, Cpu, Globe } from 'lucide-react'

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    {
      icon: Brain,
      title: "Conversational AI Training",
      description: "Teach your Buddy new strategies through natural language. No coding required.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Zap,
      title: "Real-Time PumpFun Integration",
      description: "Monitor and trade new token launches as they happen on PumpFun.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Target,
      title: "Built-In Customization",
      description: "Risk sliders, strategy presets, and trading parameters - all configurable.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Shield,
      title: "Demo & Live Modes",
      description: "Practice with paper trading or go live with real assets.",
      color: "from-orange-500 to-red-500"
    }
  ]

  const stats = [
    { label: "Active Buddies", value: "2,847", icon: Bot },
    { label: "Total Volume", value: "$12.4M", icon: DollarSign },
    { label: "Success Rate", value: "73%", icon: TrendingUp },
    { label: "Community", value: "15.2K", icon: Users }
  ]

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Trenches Buddy</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How It Works</a>
              <a href="#tokenomics" className="text-gray-300 hover:text-white transition-colors">Tokenomics</a>
              <a href="#roadmap" className="text-gray-300 hover:text-white transition-colors">Roadmap</a>
            </div>

            <Link 
              href="/app"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
            >
              Launch App
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-full text-sm text-gray-300 mb-8">
                <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
                AI-Powered Trading on Solana
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Your AI Trading
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Companion
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                Deploy, customize, and teach AI agents that trade PumpFun tokens in real-time. 
                Your Buddy learns from the market and from you.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  href="/app"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center gap-3 shadow-lg shadow-purple-500/25"
                >
                  <Rocket className="w-5 h-5" />
                  Deploy Your Buddy
                </Link>
                
                <button className="border border-gray-600 hover:border-gray-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center gap-3">
                  <Play className="w-5 h-5" />
                  Watch Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg mb-4">
                  <stat.icon className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Built for the <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Trenches</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Every feature designed for navigating Solana&apos;s volatile DeFi landscape with confidence and intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all duration-300 hover:transform hover:scale-105"
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              From deployment to profit - your journey in the Solana trenches.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Deploy Your Buddy</h3>
              <p className="text-gray-400 leading-relaxed">
                Launch an AI agent linked to your wallet. Choose from strategy presets or customize from scratch.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Train & Customize</h3>
              <p className="text-gray-400 leading-relaxed">
                Chat with your Buddy to teach strategies, adjust risk levels, and provide feedback on trades.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Trade & Profit</h3>
              <p className="text-gray-400 leading-relaxed">
                Your Buddy trades PumpFun tokens in real-time, learning and adapting to market conditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tokenomics */}
      <section id="tokenomics" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">$BUDDY</span> Token
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              The utility token powering the Trenches Buddy ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Deploy & Activate Buddies</h3>
                    <p className="text-gray-400">Use BUDDY tokens to deploy and activate your AI trading agents.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Cpu className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Premium Features</h3>
                    <p className="text-gray-400">Unlock advanced customization and enhanced AI capabilities.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Enhanced Chat</h3>
                    <p className="text-gray-400">Priority support and personalized AI training sessions.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
              <h3 className="text-2xl font-semibold text-white mb-6">Token Economics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Launch Platform</span>
                  <span className="text-white font-medium">PumpFun</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Team Fee</span>
                  <span className="text-white font-medium">0.1%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Buyback Fee</span>
                  <span className="text-white font-medium">0.05%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Launch Date</span>
                  <span className="text-white font-medium">Q2 2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section id="roadmap" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Roadmap</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our journey to revolutionize AI trading on Solana.
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                quarter: "Q2 2025",
                title: "Platform Launch",
                description: "Official launch of Trenches Buddy platform and BUDDY token on PumpFun. Initial Buddy deployment and demo trading.",
                status: "upcoming"
              },
              {
                quarter: "Q3 2025",
                title: "Live Trading & Chat",
                description: "Integration of live trading on PumpFun pairs. Release of conversational chatbox interface.",
                status: "upcoming"
              },
              {
                quarter: "Q4 2025",
                title: "API Integrations",
                description: "Telegram and Discord integrations. Launch of real-time analytics dashboard.",
                status: "upcoming"
              },
              {
                quarter: "Q1 2026",
                title: "Advanced AI",
                description: "Expansion of customization presets and advanced AI training modules.",
                status: "future"
              }
            ].map((item, index) => (
              <div key={index} className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    item.status === 'upcoming' ? 'bg-purple-600' : 'bg-gray-700'
                  }`}>
                    <span className="text-white font-semibold">{index + 1}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                    <span className="text-sm text-purple-400 font-medium">{item.quarter}</span>
                  </div>
                  <p className="text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Conquer the <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Trenches</span>?
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Deploy your AI trading companion and start navigating Solana&apos;s DeFi landscape with confidence.
          </p>
          
          <Link 
            href="/app"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg shadow-purple-500/25"
          >
            <Rocket className="w-5 h-5" />
            Launch Your Buddy Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Trenches Buddy</span>
            </div>
            
            <div className="flex items-center space-x-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">Discord</a>
              <a href="#" className="hover:text-white transition-colors">Telegram</a>
              <a href="#" className="hover:text-white transition-colors">Docs</a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 Trenches Buddy. Built for the Solana DeFi trenches.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 