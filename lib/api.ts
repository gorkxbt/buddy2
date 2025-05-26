// Jupiter API for Solana token prices and data
const JUPITER_API_BASE = 'https://price.jup.ag/v4'
const JUPITER_TOKENS_API = 'https://token.jup.ag/all'

// Birdeye API (free tier) for additional data
const BIRDEYE_API_BASE = 'https://public-api.birdeye.so'

export interface TokenData {
  symbol: string
  name: string
  address: string
  price: number
  change24h: number
  volume24h: string
  marketCap?: number
  logoURI?: string
}

export interface PumpFunToken {
  mint: string
  name: string
  symbol: string
  description: string
  image: string
  createdTimestamp: number
  marketCap: number
  price: number
}

// Get real-time token prices from Jupiter
export async function getTokenPrices(tokenAddresses: string[]): Promise<Record<string, number>> {
  try {
    const response = await fetch(`${JUPITER_API_BASE}/price?ids=${tokenAddresses.join(',')}`)
    const data = await response.json()
    return data.data || {}
  } catch (error) {
    console.error('Error fetching token prices:', error)
    return {}
  }
}

// Get all available tokens from Jupiter
export async function getAllTokens(): Promise<any[]> {
  try {
    const response = await fetch(JUPITER_TOKENS_API)
    const tokens = await response.json()
    return tokens
  } catch (error) {
    console.error('Error fetching tokens:', error)
    return []
  }
}

// Get popular Solana tokens with real data
export async function getPopularTokens(): Promise<TokenData[]> {
  const popularAddresses = [
    'So11111111111111111111111111111111111111112', // SOL
    'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', // BONK
    'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', // WIF
    '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr', // POPCAT
  ]

  try {
    const prices = await getTokenPrices(popularAddresses)
    const tokens = await getAllTokens()
    
    return popularAddresses.map(address => {
      const tokenInfo = tokens.find(t => t.address === address)
      return {
        symbol: tokenInfo?.symbol || 'UNKNOWN',
        name: tokenInfo?.name || 'Unknown Token',
        address,
        price: prices[address] || 0,
        change24h: Math.random() * 20 - 10, // Jupiter doesn't provide 24h change, would need Birdeye
        volume24h: `${(Math.random() * 100).toFixed(1)}M`,
        logoURI: tokenInfo?.logoURI
      }
    })
  } catch (error) {
    console.error('Error fetching popular tokens:', error)
    return []
  }
}

// Get new PumpFun tokens (you'll need to implement PumpFun API or use a third-party service)
export async function getPumpFunNewTokens(): Promise<PumpFunToken[]> {
  // PumpFun doesn't have a public API, but you can use:
  // 1. Helius API (free tier): https://docs.helius.xyz/
  // 2. QuickNode (free tier): https://www.quicknode.com/
  // 3. Solscan API: https://public-api.solscan.io/
  
  try {
    // Example using Solscan to get recent token creations
    const response = await fetch('https://public-api.solscan.io/token/list?sortBy=created_time&direction=desc&limit=20')
    const data = await response.json()
    
    return data.data?.map((token: any) => ({
      mint: token.tokenAddress,
      name: token.tokenName || 'Unknown',
      symbol: token.tokenSymbol || 'UNK',
      description: token.tokenDescription || '',
      image: token.tokenIcon || '',
      createdTimestamp: token.createdTime,
      marketCap: token.marketCap || 0,
      price: token.price || 0
    })) || []
  } catch (error) {
    console.error('Error fetching PumpFun tokens:', error)
    return []
  }
}

// WebSocket connection for real-time price updates
export class TokenPriceWebSocket {
  private ws: WebSocket | null = null
  private subscribers: Map<string, (price: number) => void> = new Map()

  connect() {
    // You can use Jupiter's WebSocket or Birdeye's WebSocket for real-time updates
    // For now, we'll simulate with polling
    setInterval(async () => {
      const addresses = Array.from(this.subscribers.keys())
      if (addresses.length > 0) {
        const prices = await getTokenPrices(addresses)
        addresses.forEach(address => {
          const callback = this.subscribers.get(address)
          if (callback && prices[address]) {
            callback(prices[address])
          }
        })
      }
    }, 5000) // Update every 5 seconds
  }

  subscribe(tokenAddress: string, callback: (price: number) => void) {
    this.subscribers.set(tokenAddress, callback)
  }

  unsubscribe(tokenAddress: string) {
    this.subscribers.delete(tokenAddress)
  }
} 