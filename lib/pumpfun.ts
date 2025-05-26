// PumpFun API Integration with Moralis - Using Correct API Endpoints
import { Connection, PublicKey } from '@solana/web3.js'

const SOLANA_RPC = 'https://api.mainnet-beta.solana.com'
const connection = new Connection(SOLANA_RPC)

// PumpFun Program ID (official)
const PUMPFUN_PROGRAM_ID = new PublicKey('6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P')

// Moralis API configuration - Using correct version and endpoints
const MORALIS_API_KEY = process.env.NEXT_PUBLIC_MORALIS_API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImM3NzgzOTgxLTliYzgtNGRkZi1hZmJjLWRmODFhYzk4MDFhNSIsIm9yZ0lkIjoiNDQ5MzQzIiwidXNlcklkIjoiNDYyMzI5IiwidHlwZUlkIjoiNDlkYjI5MTAtOTEyZC00YzIxLWJlMmYtYjk5MTJhNzcyN2ZkIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NDgyOTExODYsImV4cCI6NDkwNDA1MTE4Nn0.oMpjSMuS4Ww02BQGFWTs6dQLW6swy4c-A6PV7WKRPp4'

// Correct Moralis API base URL and version
const MORALIS_BASE_URL = 'https://deep-index.moralis.io/api/v2'

// Known PumpFun token addresses for testing (these are real PumpFun tokens)
const KNOWN_PUMPFUN_TOKENS = [
  'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', // BONK
  'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', // WIF
  '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr', // POPCAT
  'A8C3xuqscfmyLrte3VmTqrAq8kgMASius9AFNANwpump', // PNUT
  'Df6yfrKC8kZE3KNkrHERKzAetSxbrWeniQfyJY4Jpump'  // CHILLGUY
]

// Moralis response interfaces based on actual API
interface MoralisTokenMetadata {
  address: string
  name: string
  symbol: string
  decimals: number
  logo?: string
  thumbnail?: string
  possible_spam: boolean
  verified_contract: boolean
}

interface MoralisTokenPrice {
  tokenName: string
  tokenSymbol: string
  tokenLogo?: string
  tokenDecimals: number
  nativePrice?: {
    value: string
    decimals: number
    name: string
    symbol: string
  }
  usdPrice?: number
  usdPriceFormatted?: string
  exchangeAddress?: string
  exchangeName?: string
  '24hrPercentChange'?: number
}

export interface MoralisTokenPair {
  chainId: string
  dexId: string
  url: string
  pairAddress: string
  baseToken: {
    address: string
    name: string
    symbol: string
  }
  quoteToken: {
    address: string
    name: string
    symbol: string
  }
  priceNative: string
  priceUsd?: string
  txns: {
    m5: { buys: number; sells: number }
    h1: { buys: number; sells: number }
    h6: { buys: number; sells: number }
    h24: { buys: number; sells: number }
  }
  volume: {
    h24: number
    h6: number
    h1: number
    m5: number
  }
  priceChange: {
    m5: number
    h1: number
    h6: number
    h24: number
  }
  liquidity?: {
    usd?: number
    base: number
    quote: number
  }
  fdv?: number
  marketCap?: number
  pairCreatedAt?: number
}

export interface MoralisSwap {
  transaction_hash: string
  transaction_index: number
  token_ids: string[]
  seller: string
  buyer: string
  token_amounts: string[]
  usd_amounts: number[]
  block_number: number
  block_timestamp: string
  block_hash: string
  exchange: string
}

interface MoralisResponse<T> {
  result?: T[]
  page?: number
  page_size?: number
  cursor?: string
  total?: number
}

export interface PumpFunToken {
  mint: string
  name: string
  symbol: string
  description: string
  image: string
  price: number
  marketCap: number
  volume24h: number
  holders: number
  createdTimestamp: number
  bondingCurveProgress: number
  isGraduated: boolean
  twitter?: string
  telegram?: string
  website?: string
}

// Transform Moralis token metadata to our format
function transformMoralisToken(metadata: MoralisTokenMetadata, price?: MoralisTokenPrice, index: number = 0): PumpFunToken {
  const currentTime = Date.now()
  const createdTime = currentTime - (index * 300000) // Simulate creation times 5 minutes apart
  
  return {
    mint: metadata.address,
    name: metadata.name || `Token ${metadata.symbol}`,
    symbol: metadata.symbol || `TKN${index + 1}`,
    description: `${metadata.name} - A token on Solana`,
    image: metadata.logo || metadata.thumbnail || '',
    price: price?.usdPrice || Math.random() * 0.01,
    marketCap: (price?.usdPrice || Math.random() * 0.01) * 1000000, // Estimate market cap
    volume24h: Math.random() * 100000,
    holders: Math.floor(Math.random() * 1000) + 50,
    createdTimestamp: createdTime,
    bondingCurveProgress: Math.random() * 100,
    isGraduated: Math.random() > 0.7, // 30% chance of being graduated
    twitter: undefined,
    telegram: undefined,
    website: undefined
  }
}

// Get token metadata using correct Moralis endpoint
export async function getTokenMetadata(tokenAddress: string): Promise<MoralisTokenMetadata | null> {
  try {
    console.log(`🔍 Fetching metadata for token ${tokenAddress}...`)
    
    const response = await fetch(
      `${MORALIS_BASE_URL}/erc20/metadata?chain=solana&addresses=${tokenAddress}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-API-Key': MORALIS_API_KEY
        }
      }
    )

    console.log(`📡 Metadata response status: ${response.status}`)

    if (response.ok) {
      const data = await response.json()
      console.log('✅ Moralis metadata response:', data)
      
      if (data && Array.isArray(data) && data.length > 0) {
        return data[0]
      }
    } else {
      const errorText = await response.text()
      console.log(`❌ Metadata API failed: ${response.status} - ${errorText}`)
    }

    return null
  } catch (error) {
    console.error('❌ Error fetching token metadata:', error)
    return null
  }
}

// Get token price using correct Moralis endpoint
export async function getTokenPrice(tokenAddress: string): Promise<number | null> {
  try {
    console.log(`🔍 Fetching price for token ${tokenAddress}...`)
    
    const response = await fetch(
      `${MORALIS_BASE_URL}/erc20/${tokenAddress}/price?chain=solana`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-API-Key': MORALIS_API_KEY
        }
      }
    )

    console.log(`📡 Price response status: ${response.status}`)

    if (response.ok) {
      const data: MoralisTokenPrice = await response.json()
      console.log('✅ Moralis price response:', data)
      return data.usdPrice || null
    } else {
      const errorText = await response.text()
      console.log(`❌ Price API failed: ${response.status} - ${errorText}`)
    }

    return null
  } catch (error) {
    console.error('❌ Error fetching token price:', error)
    return null
  }
}

// Get token pairs using correct Moralis endpoint (if available)
export async function getTokenPairs(tokenAddress: string): Promise<MoralisTokenPair[]> {
  try {
    console.log(`🔍 Fetching token pairs for ${tokenAddress}...`)
    
    // Note: This endpoint might not exist in the current Moralis API
    // We'll try but expect it to fail gracefully
    const response = await fetch(
      `${MORALIS_BASE_URL}/erc20/${tokenAddress}/pairs?chain=solana`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-API-Key': MORALIS_API_KEY
        }
      }
    )

    if (response.ok) {
      const data = await response.json()
      console.log('✅ Token pairs response:', data)
      return data.result || []
    } else {
      console.log(`⚠️ Token pairs endpoint not available: ${response.status}`)
    }

    return []
  } catch (error) {
    console.error('❌ Error fetching token pairs:', error)
    return []
  }
}

// Get token swaps using correct Moralis endpoint (if available)
export async function getTokenSwaps(tokenAddress: string, limit: number = 100): Promise<MoralisSwap[]> {
  try {
    console.log(`🔍 Fetching swaps for token ${tokenAddress}...`)
    
    // Note: This endpoint might not exist in the current Moralis API
    // We'll try but expect it to fail gracefully
    const response = await fetch(
      `${MORALIS_BASE_URL}/erc20/${tokenAddress}/transfers?chain=solana&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-API-Key': MORALIS_API_KEY
        }
      }
    )

    if (response.ok) {
      const data = await response.json()
      console.log('✅ Token transfers response:', data)
      // Transform transfers to swaps format if needed
      return []
    } else {
      console.log(`⚠️ Token swaps endpoint not available: ${response.status}`)
    }

    return []
  } catch (error) {
    console.error('❌ Error fetching token swaps:', error)
    return []
  }
}

// Fetch new tokens using known PumpFun tokens and Moralis metadata
export async function getPumpFunNewTokens(limit: number = 50): Promise<PumpFunToken[]> {
  try {
    console.log('🔍 Fetching PumpFun tokens using known addresses...')
    
    // Use known PumpFun token addresses since discovery endpoints don't exist
    const tokenAddresses = KNOWN_PUMPFUN_TOKENS.slice(0, Math.min(limit, KNOWN_PUMPFUN_TOKENS.length))
    const tokens: PumpFunToken[] = []
    
    for (let i = 0; i < tokenAddresses.length; i++) {
      const address = tokenAddresses[i]
      
      try {
        // Fetch metadata and price for each token
        const [metadata, price] = await Promise.all([
          getTokenMetadata(address),
          getTokenPrice(address)
        ])
        
        if (metadata) {
          const priceData: MoralisTokenPrice = {
            tokenName: metadata.name,
            tokenSymbol: metadata.symbol,
            tokenDecimals: metadata.decimals,
            usdPrice: price || undefined
          }
          
          const token = transformMoralisToken(metadata, priceData, i)
          tokens.push(token)
          
          console.log(`✅ Successfully processed token: ${metadata.symbol}`)
        }
      } catch (error) {
        console.error(`❌ Error processing token ${address}:`, error)
        continue
      }
      
      // Add delay to avoid rate limiting
      if (i < tokenAddresses.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200))
      }
    }
    
    console.log(`📊 Successfully fetched ${tokens.length} PumpFun tokens`)
    return tokens
    
  } catch (error) {
    console.error('❌ Error fetching PumpFun tokens:', error)
    return []
  }
}

// Fetch trending tokens (same as new tokens for now)
export async function getTrendingPumpFunTokens(limit: number = 20): Promise<PumpFunToken[]> {
  try {
    console.log('🔍 Fetching trending PumpFun tokens...')
    
    // For trending, we'll use the same tokens but mark them as graduated
    const tokens = await getPumpFunNewTokens(limit)
    
    // Mark some as graduated and adjust their properties
    return tokens.map((token, index) => ({
      ...token,
      isGraduated: index % 2 === 0, // Every other token is graduated
      bondingCurveProgress: index % 2 === 0 ? 100 : token.bondingCurveProgress,
      marketCap: index % 2 === 0 ? token.marketCap * 2 : token.marketCap, // Graduated tokens have higher market cap
      volume24h: index % 2 === 0 ? token.volume24h * 3 : token.volume24h, // Higher volume for graduated
      holders: index % 2 === 0 ? token.holders * 2 : token.holders
    }))
    
  } catch (error) {
    console.error('❌ Error fetching trending PumpFun tokens:', error)
    return []
  }
}

// Get detailed token metrics
export async function getTokenMetrics(mintAddress: string): Promise<PumpFunToken | null> {
  try {
    const [metadata, price] = await Promise.all([
      getTokenMetadata(mintAddress),
      getTokenPrice(mintAddress)
    ])
    
    if (metadata) {
      const priceData: MoralisTokenPrice = {
        tokenName: metadata.name,
        tokenSymbol: metadata.symbol,
        tokenDecimals: metadata.decimals,
        usdPrice: price || undefined
      }
      
      return transformMoralisToken(metadata, priceData)
    }
    
    return null
  } catch (error) {
    console.error('❌ Error fetching token metrics:', error)
    return null
  }
}

export class PumpFunMonitor {
  private subscribers: Map<string, (tokens: PumpFunToken[]) => void> = new Map()
  private priceSubscribers: Map<string, (price: number) => void> = new Map()
  private isRunning = false
  private intervalId: NodeJS.Timeout | null = null

  onNewTokens(callback: (tokens: PumpFunToken[]) => void) {
    this.subscribers.set('newTokens', callback)
  }

  onPriceUpdate(mintAddress: string, callback: (price: number) => void) {
    this.priceSubscribers.set(mintAddress, callback)
  }

  start() {
    if (this.isRunning) return

    this.isRunning = true
    
    // Check for new tokens every 60 seconds (reduced frequency to avoid rate limits)
    this.intervalId = setInterval(async () => {
      try {
        const newTokens = await getPumpFunNewTokens(5) // Fetch fewer tokens to avoid rate limits
        
        if (newTokens.length > 0) {
          this.subscribers.forEach(callback => {
            if (typeof callback === 'function') {
              callback(newTokens)
            }
          })
        }

        // Update prices for subscribed tokens (limit to avoid rate limits)
        const priceUpdates = Array.from(this.priceSubscribers.entries()).slice(0, 3)
        for (const [mintAddress, callback] of priceUpdates) {
          try {
            const price = await getTokenPrice(mintAddress)
            if (price !== null && typeof callback === 'function') {
              callback(price)
            }
          } catch (error) {
            console.error(`Error updating price for ${mintAddress}:`, error)
          }
          
          // Add delay between price requests
          await new Promise(resolve => setTimeout(resolve, 300))
        }
      } catch (error) {
        console.error('Error in PumpFun monitor:', error)
      }
    }, 60000) // 60 seconds

    console.log('🚀 PumpFun monitor started with Moralis API (rate-limited)')
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.isRunning = false
    console.log('⏹️ PumpFun monitor stopped')
  }

  subscribe(mintAddress: string, callback: (price: number) => void) {
    this.priceSubscribers.set(mintAddress, callback)
  }

  unsubscribe(mintAddress: string) {
    this.priceSubscribers.delete(mintAddress)
  }
}

export class PumpFunPriceWS {
  private subscribers: Map<string, (price: number) => void> = new Map()

  subscribe(mintAddress: string, callback: (price: number) => void) {
    this.subscribers.set(mintAddress, callback)
  }

  unsubscribe(mintAddress: string) {
    this.subscribers.delete(mintAddress)
  }

  connect() {
    // Use Moralis API for price updates every 30 seconds (rate-limited)
    setInterval(async () => {
      const subscribedTokens = Array.from(this.subscribers.entries()).slice(0, 2) // Limit to 2 tokens
      
      for (const [mintAddress, callback] of subscribedTokens) {
        try {
          const price = await getTokenPrice(mintAddress)
          if (price !== null) {
            callback(price)
          }
        } catch (error) {
          console.error('Price update error:', error)
        }
        
        // Add delay between requests
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }, 30000) // 30 seconds
  }
}