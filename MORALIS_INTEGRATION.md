# Moralis API Integration for PumpFun Data

This document outlines the comprehensive Moralis API integration implemented in Trenches Buddy for real-time PumpFun token data.

## Overview

The application now uses the official Moralis Web3 Data API to fetch real-time data from PumpFun, including:

- **New Token Discovery** - Real-time new token launches on PumpFun
- **Bonding Curve Tokens** - Tokens currently in bonding curve phase
- **Token Pairs** - Trading pairs for specific tokens
- **Swap Transactions** - Real-time buy/sell activity
- **Token Metadata** - Comprehensive token information
- **Price Data** - Real-time token pricing

## API Endpoints Used

### 1. New Tokens Discovery
```
GET /discovery/tokens/new?exchange=pumpfun&limit={limit}
```
- Fetches newly launched tokens on PumpFun
- Used in: `getPumpFunNewTokens()`
- Updates: Token list in "New" tab

### 2. Bonding Curve Tokens
```
GET /discovery/bonding-tokens?exchange=pumpfun&limit={limit}
```
- Fetches tokens currently in bonding curve phase
- Used in: `getTrendingPumpFunTokens()`
- Updates: Token list in "Trending" tab

### 3. Token Pairs
```
GET /tokens/{tokenAddress}/pairs?exchange=pumpfun
```
- Fetches all trading pairs for a specific token
- Used in: `getTokenPairs()`
- Updates: Token analysis metrics

### 4. Token Swaps
```
GET /tokens/{tokenAddress}/swaps?exchange=pumpfun&limit={limit}
```
- Fetches recent swap transactions for a token
- Used in: `getTokenSwaps()`
- Updates: Trading activity analysis

### 5. Token Metadata
```
GET /tokens/{tokenAddress}/metadata
```
- Fetches detailed token information
- Used in: `getTokenMetrics()`
- Updates: Token details panel

### 6. Token Price
```
GET /tokens/{tokenAddress}/price
```
- Fetches current token price in USD
- Used in: `getTokenPrice()`
- Updates: Real-time price display

## Data Structures

### PumpFunToken Interface
```typescript
interface PumpFunToken {
  mint: string                    // Token contract address
  name: string                    // Token name
  symbol: string                  // Token symbol
  description: string             // Token description
  image: string                   // Token logo URL
  price: number                   // Current price in USD
  marketCap: number              // Market capitalization
  volume24h: number              // 24-hour trading volume
  holders: number                // Number of token holders
  createdTimestamp: number       // Token creation timestamp
  bondingCurveProgress: number   // Bonding curve completion %
  isGraduated: boolean          // Whether token graduated from bonding curve
  twitter?: string              // Twitter URL (optional)
  telegram?: string             // Telegram URL (optional)
  website?: string              // Website URL (optional)
}
```

### MoralisTokenPair Interface
```typescript
interface MoralisTokenPair {
  pair_address: string
  base_token: {
    address: string
    name: string
    symbol: string
    logo?: string
  }
  quote_token: {
    address: string
    name: string
    symbol: string
    logo?: string
  }
  price_usd?: string
  price_native?: string
  volume_24h_usd?: string
  liquidity_usd?: string
  created_at: string
}
```

### MoralisSwap Interface
```typescript
interface MoralisSwap {
  transaction_hash: string
  block_number: number
  block_timestamp: string
  from_address: string
  to_address: string
  value: string
  gas: string
  gas_price: string
  input: string
  nonce: string
  transaction_index: number
  from_token: {
    address: string
    name: string
    symbol: string
    logo?: string
    decimals: number
  }
  to_token: {
    address: string
    name: string
    symbol: string
    logo?: string
  }
  from_amount: string
  to_amount: string
  exchange: string
}
```

## Enhanced Features

### 1. Real-Time Token Analysis
The `TokenAnalysis` component now provides:

- **Comprehensive Metrics**: Momentum, Volume, Community, Risk analysis
- **Real-Time Data**: Live price updates every 15 seconds
- **Swap Activity**: Analysis of recent trading activity
- **Trading Signals**: AI-generated buy/sell/hold recommendations
- **Confidence Scoring**: Percentage confidence in trading signals

### 2. Advanced Swap Analysis
```typescript
interface SwapActivity {
  totalSwaps: number        // Total number of swaps
  buyVolume: number        // Total buy volume in USD
  sellVolume: number       // Total sell volume in USD
  netFlow: number          // Net flow (buy - sell)
  avgTradeSize: number     // Average trade size
  uniqueTraders: number    // Number of unique traders
}
```

### 3. Real-Time Monitoring
The `PumpFunMonitor` class provides:

- **Auto-Discovery**: Automatically detects new tokens every 30 seconds
- **Price Updates**: Real-time price monitoring for subscribed tokens
- **Event Notifications**: Chat notifications for new token discoveries
- **Error Handling**: Graceful fallback when API calls fail

## Configuration

### Environment Variables
```bash
NEXT_PUBLIC_MORALIS_API_KEY=your_moralis_api_key_here
```

### API Key Setup
1. Sign up at [developers.moralis.com](https://developers.moralis.com)
2. Navigate to "API Keys" section
3. Copy your API key
4. Add to `.env.local` file

## Error Handling

The integration includes comprehensive error handling:

1. **API Failures**: Graceful fallback to empty arrays instead of mock data
2. **Rate Limiting**: Automatic retry logic with exponential backoff
3. **Network Issues**: Timeout handling and connection retry
4. **Data Validation**: Filtering of spam tokens and invalid data

## Performance Optimizations

1. **Caching**: Results cached for 30 seconds to reduce API calls
2. **Batching**: Multiple API calls batched together when possible
3. **Lazy Loading**: Data fetched only when needed
4. **Debouncing**: Search queries debounced to prevent excessive API calls

## Usage Examples

### Fetching New Tokens
```typescript
import { getPumpFunNewTokens } from '@/lib/pumpfun'

const newTokens = await getPumpFunNewTokens(50)
console.log(`Found ${newTokens.length} new tokens`)
```

### Analyzing Token Activity
```typescript
import { getTokenSwaps, getTokenPairs } from '@/lib/pumpfun'

const swaps = await getTokenSwaps(tokenAddress, 100)
const pairs = await getTokenPairs(tokenAddress)

console.log(`Token has ${pairs.length} trading pairs`)
console.log(`Recent ${swaps.length} swaps analyzed`)
```

### Real-Time Price Monitoring
```typescript
import { PumpFunMonitor } from '@/lib/pumpfun'

const monitor = new PumpFunMonitor()
monitor.onNewTokens((tokens) => {
  console.log(`New tokens discovered: ${tokens.map(t => t.symbol).join(', ')}`)
})
monitor.start()
```

## Benefits

1. **Real Data**: No more mock data - all information comes from live PumpFun activity
2. **Comprehensive Analysis**: Multi-factor analysis using real trading data
3. **Real-Time Updates**: Live price feeds and new token discovery
4. **Professional Trading**: Advanced metrics for informed trading decisions
5. **Scalable Architecture**: Built to handle high-frequency data updates

## Future Enhancements

1. **WebSocket Integration**: Real-time streaming data
2. **Historical Data**: OHLCV charts and historical analysis
3. **Advanced Filtering**: Custom filters for token discovery
4. **Portfolio Tracking**: Real-time portfolio value updates
5. **Alert System**: Custom alerts for price movements and new tokens

This integration transforms Trenches Buddy from a demo application into a professional-grade PumpFun trading platform with real-time data and advanced analytics. 