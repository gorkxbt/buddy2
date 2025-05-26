# 🚀 Trenches Buddy - Real-Time Data & AI Setup Guide

This guide will help you set up real-time token data and AI chat functionality with **minimal effort and completely free**.

## 📋 Quick Setup Checklist

- [ ] Copy `env.example` to `.env.local`
- [ ] Get at least one LLM API key (Groq recommended)
- [ ] Optional: Get enhanced data API keys
- [ ] Test the application

## 🤖 LLM Integration (Choose One - All Free!)

### Option 1: Groq (RECOMMENDED) ⚡
**Why Groq?** Fastest responses, most reliable, completely free tier.

1. Go to [console.groq.com](https://console.groq.com/)
2. Sign up with Google/GitHub
3. Go to "API Keys" → "Create API Key"
4. Copy your key and add to `.env.local`:
   ```
   NEXT_PUBLIC_GROQ_API_KEY=gsk_your_key_here
   ```

**Free Tier:** 14,400 requests/day, 6,000 tokens/minute

### Option 2: Together AI 🔄
**Why Together AI?** Good alternative, many model options.

1. Go to [api.together.xyz](https://api.together.xyz/)
2. Sign up and verify email
3. Go to "Settings" → "API Keys" → "Create new key"
4. Add to `.env.local`:
   ```
   NEXT_PUBLIC_TOGETHER_API_KEY=your_key_here
   ```

**Free Tier:** $25 credit, then pay-per-use

### Option 3: Hugging Face 🤗
**Why Hugging Face?** Completely free forever, but slower.

1. Go to [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Create new token with "Read" permissions
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_HF_API_KEY=hf_your_key_here
   ```

**Free Tier:** Unlimited but rate-limited

## 📊 Real-Time Token Data

### Built-in Free APIs (Already Integrated)
- **Jupiter API**: Token prices and metadata (completely free)
- **Solscan API**: New token launches (free with rate limits)

### Optional Enhanced APIs

#### Helius (Enhanced Solana Data)
1. Go to [docs.helius.xyz](https://docs.helius.xyz/)
2. Sign up for free account
3. Create new project → copy API key
4. Add to `.env.local`:
   ```
   NEXT_PUBLIC_HELIUS_API_KEY=your_key_here
   ```

**Free Tier:** 100,000 requests/month

#### Birdeye (Enhanced Market Data)
1. Go to [docs.birdeye.so](https://docs.birdeye.so/)
2. Sign up and get API key
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_BIRDEYE_API_KEY=your_key_here
   ```

**Free Tier:** 1,000 requests/day

## 🔧 Setup Steps

### 1. Environment Configuration
```bash
# Copy the example file
cp env.example .env.local

# Edit with your API keys
nano .env.local  # or use your preferred editor
```

### 2. Install Dependencies (if not done)
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Test the Features

#### Test Real-Time Data:
1. Go to `/app` route
2. Deploy a buddy
3. Check if token prices are loading
4. Verify prices update every 5 seconds

#### Test AI Chat:
1. In the chat interface, type: "Hello buddy!"
2. Should get an AI response within 2-5 seconds
3. Try: "What's your trading strategy?"

## 🚨 Troubleshooting

### Chat Not Working?
1. **Check API Keys**: Make sure at least one LLM API key is set
2. **Check Console**: Open browser dev tools → Console tab
3. **Test API Key**: Try a simple request in browser console:
   ```javascript
   fetch('https://api.groq.com/openai/v1/models', {
     headers: { 'Authorization': 'Bearer YOUR_KEY' }
   }).then(r => r.json()).then(console.log)
   ```

### Token Data Not Loading?
1. **Check Network**: Jupiter API might be down (rare)
2. **CORS Issues**: Should work from localhost, might need proxy for production
3. **Rate Limits**: Wait a few minutes and try again

### Common Errors:

#### "API key not found"
- Make sure your `.env.local` file is in the root directory
- Restart the dev server after adding keys
- Check for typos in environment variable names

#### "CORS error"
- This is normal for some APIs in production
- Use a proxy service or server-side API routes

#### "Rate limit exceeded"
- Wait for the rate limit to reset
- Try a different API provider

## 🎯 For PumpFun New Pairs

Currently using Solscan API for new tokens. For better PumpFun integration:

### Option 1: Helius Enhanced API
```javascript
// In lib/api.ts, add this function:
export async function getPumpFunTokensHelius() {
  const response = await fetch(`https://api.helius.xyz/v0/tokens/metadata?api-key=${HELIUS_API_KEY}`)
  // Filter for recent PumpFun tokens
}
```

### Option 2: WebSocket for Real-Time
```javascript
// Real-time new token alerts
const ws = new WebSocket('wss://api.helius.xyz/v0/websocket?api-key=YOUR_KEY')
ws.onmessage = (event) => {
  const data = JSON.parse(event.data)
  if (data.type === 'new_token') {
    // Handle new token
  }
}
```

### Option 3: Third-Party Services
- **DexScreener API**: Free tier for new pairs
- **CoinGecko API**: Free tier with new listings
- **Moralis API**: Free tier for Solana data

## 🔄 Upgrading to Production

### 1. Environment Variables
Set these in your Vercel/Netlify dashboard:
```
NEXT_PUBLIC_GROQ_API_KEY=your_production_key
NEXT_PUBLIC_HELIUS_API_KEY=your_production_key
```

### 2. API Routes (Recommended)
Move API calls to server-side to hide keys:
```javascript
// pages/api/chat.js
export default async function handler(req, res) {
  const response = await fetch('https://api.groq.com/...', {
    headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` }
  })
  res.json(await response.json())
}
```

### 3. Rate Limiting
Add rate limiting for production:
```bash
npm install @upstash/ratelimit @upstash/redis
```

## 💡 Pro Tips

1. **Start with Groq**: Fastest and most reliable for chat
2. **Use Jupiter API**: Already integrated, completely free
3. **Add Helius later**: For enhanced PumpFun data when needed
4. **Monitor Usage**: Check API dashboards regularly
5. **Cache Responses**: Reduce API calls with smart caching

## 📞 Need Help?

1. **Check the Console**: Browser dev tools → Console tab
2. **API Documentation**: Each provider has excellent docs
3. **Community**: Join the Discord/Telegram for support

---

**Total Setup Time**: 5-10 minutes  
**Cost**: $0 (all free tiers)  
**Effort**: Minimal - just copy/paste API keys! 