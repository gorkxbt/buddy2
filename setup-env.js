#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envContent = `# Base URL for metadata (change this to your production domain when deploying)
NEXT_PUBLIC_BASE_URL=http://localhost:3002

# API Keys for Trenches Buddy

# LLM API Keys (Choose at least one - all have free tiers)
# Groq (RECOMMENDED - fastest and most reliable for chat)
# Get your free API key at: https://console.groq.com/
NEXT_PUBLIC_GROQ_API_KEY=

# Together AI (Good alternative)
# Get your free API key at: https://api.together.xyz/
NEXT_PUBLIC_TOGETHER_API_KEY=

# Hugging Face (Completely free but slower)
# Get your free API key at: https://huggingface.co/settings/tokens
NEXT_PUBLIC_HF_API_KEY=

# Optional: Enhanced data APIs (all have free tiers)
# Helius (for PumpFun data and enhanced Solana data)
# Get your free API key at: https://docs.helius.xyz/
NEXT_PUBLIC_HELIUS_API_KEY=

# Birdeye (for enhanced market data)
# Get your free API key at: https://docs.birdeye.so/
NEXT_PUBLIC_BIRDEYE_API_KEY=

# QuickNode (for Solana RPC and data)
# Get your free endpoint at: https://www.quicknode.com/
NEXT_PUBLIC_QUICKNODE_ENDPOINT=
`;

const envPath = path.join(process.cwd(), '.env.local');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file with default configuration');
  console.log('📝 Please edit .env.local and add your API keys');
} else {
  console.log('⚠️  .env.local already exists. Skipping creation.');
}

console.log('\n🚀 Environment setup complete!');
console.log('Next steps:');
console.log('1. Edit .env.local and add your API keys');
console.log('2. Run "npm run dev" to start the development server'); 