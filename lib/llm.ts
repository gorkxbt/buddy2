// Free LLM options for chat interface

// Option 1: Groq (FREE - fastest, best for real-time chat)
const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || ''
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

// Option 2: Together AI (FREE tier) - Updated with free models
const TOGETHER_API_KEY = process.env.NEXT_PUBLIC_TOGETHER_API_KEY || ''
const TOGETHER_API_URL = 'https://api.together.xyz/v1/chat/completions'

// Option 3: Hugging Face Inference API (FREE)
const HF_API_KEY = process.env.NEXT_PUBLIC_HF_API_KEY || ''
const HF_API_URL = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium'

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface TradingContext {
  selectedToken?: string
  portfolioValue?: number
  recentTrades?: any[]
  marketConditions?: string
}

// System prompt for the trading buddy
const TRADING_BUDDY_SYSTEM_PROMPT = `You are Trenches Buddy, an AI trading companion for Solana DeFi. You are:

- Knowledgeable about Solana, DeFi, and trading strategies
- Helpful but cautious about financial advice
- Able to learn from user preferences and adapt strategies
- Conversational and friendly, but professional
- Focused on risk management and education

Key traits:
- Always emphasize that trading involves risk
- Ask clarifying questions to understand user goals
- Provide educational explanations for your recommendations
- Remember previous conversations and user preferences
- Use trading terminology appropriately but explain complex concepts

Current context: You're integrated into a trading interface where users can see real-time token prices and execute trades.`

// Option 1: Groq (RECOMMENDED - fastest and free)
export async function chatWithGroq(messages: ChatMessage[], context?: TradingContext): Promise<string> {
  if (!GROQ_API_KEY) {
    throw new Error('Groq API key not found. Set NEXT_PUBLIC_GROQ_API_KEY in your .env.local')
  }

  const systemMessage: ChatMessage = {
    role: 'system',
    content: TRADING_BUDDY_SYSTEM_PROMPT + (context ? `\n\nCurrent context: ${JSON.stringify(context)}` : '')
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192', // Fast and good for chat
        messages: [systemMessage, ...messages],
        max_tokens: 500,
        temperature: 0.7,
        stream: false
      })
    })

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || 'Sorry, I had trouble processing that.'
  } catch (error) {
    console.error('Groq API error:', error)
    throw error
  }
}

// Option 2: Together AI (Updated with free models)
export async function chatWithTogether(messages: ChatMessage[], context?: TradingContext): Promise<string> {
  if (!TOGETHER_API_KEY) {
    throw new Error('Together API key not found. Set NEXT_PUBLIC_TOGETHER_API_KEY in your .env.local')
  }

  const systemMessage: ChatMessage = {
    role: 'system',
    content: TRADING_BUDDY_SYSTEM_PROMPT + (context ? `\n\nCurrent context: ${JSON.stringify(context)}` : '')
  }

  try {
    console.log('Calling Together AI with key:', TOGETHER_API_KEY.substring(0, 10) + '...')
    
    const response = await fetch(TOGETHER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free', // Free Llama 3.3 70B model
        messages: [systemMessage, ...messages],
        max_tokens: 500,
        temperature: 0.7,
        stream: false
      })
    })

    console.log('Together AI response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Together AI error response:', errorText)
      
      // Try fallback to another free model
      if (response.status === 400 || response.status === 404) {
        console.log('Trying fallback model...')
        return await chatWithTogetherFallback(messages, context)
      }
      
      throw new Error(`Together API error: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    console.log('Together AI response:', data)
    return data.choices[0]?.message?.content || 'Sorry, I had trouble processing that.'
  } catch (error) {
    console.error('Together API error:', error)
    // Try fallback model
    try {
      return await chatWithTogetherFallback(messages, context)
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError)
      throw error
    }
  }
}

// Fallback function with alternative free model
async function chatWithTogetherFallback(messages: ChatMessage[], context?: TradingContext): Promise<string> {
  const systemMessage: ChatMessage = {
    role: 'system',
    content: TRADING_BUDDY_SYSTEM_PROMPT + (context ? `\n\nCurrent context: ${JSON.stringify(context)}` : '')
  }

  const response = await fetch(TOGETHER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOGETHER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free', // Alternative free model
      messages: [systemMessage, ...messages],
      max_tokens: 500,
      temperature: 0.7,
      stream: false
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Together API fallback error: ${response.status} ${response.statusText} - ${errorText}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || 'Sorry, I had trouble processing that.'
}

// Option 3: Hugging Face (Basic fallback)
export async function chatWithHuggingFace(messages: ChatMessage[], context?: TradingContext): Promise<string> {
  if (!HF_API_KEY) {
    throw new Error('Hugging Face API key not found. Set NEXT_PUBLIC_HF_API_KEY in your .env.local')
  }

  const lastMessage = messages[messages.length - 1]?.content || ''

  try {
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: lastMessage,
        parameters: {
          max_length: 200,
          temperature: 0.7,
          return_full_text: false
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data[0]?.generated_text || 'Sorry, I had trouble processing that.'
  } catch (error) {
    console.error('Hugging Face API error:', error)
    throw error
  }
}

// Main function that tries different providers
export async function sendMessage(messages: ChatMessage[], context?: TradingContext): Promise<string> {
  // Try Together AI first (since we have the API key)
  if (TOGETHER_API_KEY) {
    try {
      return await chatWithTogether(messages, context)
    } catch (error) {
      console.error('Together AI failed, trying other providers...', error)
    }
  }

  // Try Groq as backup
  if (GROQ_API_KEY) {
    try {
      return await chatWithGroq(messages, context)
    } catch (error) {
      console.error('Groq failed, trying other providers...', error)
    }
  }

  // Try Hugging Face as last resort
  if (HF_API_KEY) {
    try {
      return await chatWithHuggingFace(messages, context)
    } catch (error) {
      console.error('Hugging Face failed...', error)
    }
  }

  // If all providers fail, return error message
  throw new Error('I\'m having trouble connecting to my AI brain right now. Please check your API keys in the .env.local file. You can get free API keys from:\n\n• Groq: https://console.groq.com/\n• Together AI: https://api.together.xyz/\n• Hugging Face: https://huggingface.co/settings/tokens')
}

// Utility function to check if any API keys are configured
export function hasValidApiKeys(): boolean {
  return !!(TOGETHER_API_KEY || GROQ_API_KEY || HF_API_KEY)
}

// Get available providers
export function getAvailableProviders(): string[] {
  const providers = []
  if (TOGETHER_API_KEY) providers.push('Together AI')
  if (GROQ_API_KEY) providers.push('Groq')
  if (HF_API_KEY) providers.push('Hugging Face')
  return providers
}

// Utility function to analyze trading context and generate insights
export function generateTradingInsights(context: TradingContext): string[] {
  const insights: string[] = []

  if (context.selectedToken) {
    insights.push(`Currently analyzing ${context.selectedToken}`)
  }

  if (context.portfolioValue) {
    insights.push(`Portfolio value: $${context.portfolioValue.toFixed(2)}`)
  }

  if (context.recentTrades && context.recentTrades.length > 0) {
    const winRate = context.recentTrades.filter(t => t.profit > 0).length / context.recentTrades.length
    insights.push(`Recent win rate: ${(winRate * 100).toFixed(1)}%`)
  }

  return insights
} 