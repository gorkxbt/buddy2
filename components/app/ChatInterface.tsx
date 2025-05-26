'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Zap, TrendingUp, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { sendMessage as sendLLMMessage, ChatMessage, TradingContext } from '@/lib/llm'

interface Message {
  id: string
  type: 'user' | 'buddy'
  content: string
  timestamp: Date
  action?: 'trade' | 'analysis' | 'setting'
}

const initialMessages: Message[] = [
  {
    id: '1',
    type: 'buddy',
    content: "Hey! I'm your AI trading buddy. I'm ready to learn from you and help you navigate the Solana DeFi space. What would you like to teach me first?",
    timestamp: new Date(Date.now() - 60000),
  }
]

const quickCommands = [
  { text: "Show me your current strategy", icon: Settings },
  { text: "Analyze SOL price action", icon: TrendingUp },
  { text: "Execute a small test trade", icon: Zap },
]

interface ChatInterfaceProps {
  selectedToken?: string
  portfolioValue?: number
  recentTrades?: any[]
}

export default function ChatInterface({ selectedToken, portfolioValue, recentTrades }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      // Prepare chat history for LLM
      const chatHistory: ChatMessage[] = messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))

      // Add the new user message
      chatHistory.push({
        role: 'user',
        content
      })

      // Prepare trading context
      const context: TradingContext = {
        selectedToken,
        portfolioValue,
        recentTrades,
        marketConditions: 'normal' // You can make this dynamic based on market data
      }

      // Get AI response
      const aiResponse = await sendLLMMessage(chatHistory, context)

      // Determine action type based on response content
      let action: 'trade' | 'analysis' | 'setting' | undefined
      if (aiResponse.toLowerCase().includes('trade') || aiResponse.toLowerCase().includes('buy') || aiResponse.toLowerCase().includes('sell')) {
        action = 'trade'
      } else if (aiResponse.toLowerCase().includes('analyz') || aiResponse.toLowerCase().includes('chart') || aiResponse.toLowerCase().includes('price')) {
        action = 'analysis'
      } else if (aiResponse.toLowerCase().includes('strategy') || aiResponse.toLowerCase().includes('setting') || aiResponse.toLowerCase().includes('parameter')) {
        action = 'setting'
      }

      const buddyMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'buddy',
        content: aiResponse,
        timestamp: new Date(),
        action
      }

      setMessages(prev => [...prev, buddyMessage])
    } catch (error) {
      console.error('Error getting AI response:', error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'buddy',
        content: "I'm having trouble connecting to my AI brain right now. Please make sure you have set up your API keys in the .env.local file. You can get free API keys from Groq, Together AI, or Hugging Face.",
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputValue)
  }

  const handleQuickCommand = (command: string) => {
    sendMessage(command)
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-neon-purple" />
          <span>Chat with Buddy</span>
          <div className="ml-auto flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-400">AI Powered</span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[80%] ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' 
                    ? 'bg-purple-500' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-500'
                }`}>
                  {message.type === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>
                
                <div className={`rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-100'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.action && (
                    <div className="mt-2 flex items-center space-x-1 text-xs text-gray-300">
                      {message.action === 'trade' && <TrendingUp className="h-3 w-3" />}
                      {message.action === 'analysis' && <Zap className="h-3 w-3" />}
                      {message.action === 'setting' && <Settings className="h-3 w-3" />}
                      <span className="capitalize">{message.action}</span>
                    </div>
                  )}
                  <div className="text-xs text-gray-400 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Commands */}
        <div className="p-4 border-t border-gray-700">
          <div className="mb-3">
            <p className="text-xs text-gray-400 mb-2">Quick Commands:</p>
            <div className="flex flex-wrap gap-2">
              {quickCommands.map((command, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuickCommand(command.text)}
                  className="text-xs h-8 px-3 bg-gray-800 hover:bg-gray-700"
                  disabled={isTyping}
                >
                  <command.icon className="h-3 w-3 mr-1" />
                  {command.text}
                </Button>
              ))}
            </div>
          </div>

          {/* Context Display */}
          {(selectedToken || portfolioValue) && (
            <div className="mb-3 p-2 bg-gray-800 rounded text-xs">
              <p className="text-gray-400 mb-1">Current Context:</p>
              {selectedToken && <p className="text-purple-400">Token: {selectedToken}</p>}
              {portfolioValue && <p className="text-green-400">Portfolio: ${portfolioValue.toFixed(2)}</p>}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Teach your buddy or ask questions..."
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-white text-sm"
              disabled={isTyping}
            />
            <Button
              type="submit"
              variant="neon"
              size="sm"
              disabled={!inputValue.trim() || isTyping}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
} 