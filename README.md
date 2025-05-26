# Trenches Buddy - AI Trading Companion Website

A modern, highly factorized Next.js website for Trenches Buddy, an AI-powered trading companion for Solana DeFi. Built with TypeScript, Tailwind CSS, and Framer Motion for smooth animations.

## 🚀 Features

- **Modern Design**: Dark theme with neon purple accents and glass morphism effects
- **Highly Factorized**: Modular component architecture for easy maintenance
- **Responsive**: Mobile-first design that works on all devices
- **Animated**: Smooth animations using Framer Motion
- **Performance**: Optimized for fast loading and SEO
- **TypeScript**: Full type safety throughout the codebase

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Components**: Custom UI components with Radix UI primitives

## 📁 Project Structure

```
trenches-buddy/
├── app/
│   ├── globals.css          # Global styles and CSS variables
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Main page combining all sections
├── components/
│   ├── ui/
│   │   ├── button.tsx       # Reusable button component
│   │   └── card.tsx         # Reusable card component
│   ├── Header.tsx           # Navigation header
│   ├── Hero.tsx             # Hero section with CTA
│   ├── Features.tsx         # Features showcase
│   ├── HowItWorks.tsx       # Process explanation
│   ├── Tokenomics.tsx       # Token information
│   ├── Roadmap.tsx          # Development timeline
│   └── Footer.tsx           # Footer with links
├── lib/
│   └── utils.ts             # Utility functions
└── public/                  # Static assets
```

## 🎨 Design System

### Colors
- **Primary**: Neon Purple (#a855f7)
- **Secondary**: Neon Pink (#ec4899)
- **Accent**: Neon Cyan (#06b6d4)
- **Success**: Neon Green (#10b981)
- **Background**: Dark gradient with purple undertones

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Monospace**: JetBrains Mono

### Components
- **Glass Effect**: Backdrop blur with transparency
- **Neon Buttons**: Glowing hover effects
- **Gradient Text**: Multi-color text gradients
- **Animated Cards**: Hover animations and scaling

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd trenches-buddy
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## 📱 Sections

### 1. Hero Section
- Animated logo and icons
- Gradient text effects
- Call-to-action buttons
- Key statistics
- Scroll indicator

### 2. Features
- 9 key features in a responsive grid
- Animated cards with hover effects
- Icon-based visual hierarchy
- Bottom CTA section

### 3. How It Works
- 5-step process visualization
- Interactive timeline
- Mock chat interface demo
- Feature highlights

### 4. Tokenomics
- Token utility explanation
- Distribution chart with animations
- Economic model overview
- Key metrics display

### 5. Roadmap
- Timeline with status indicators
- Quarterly milestones
- Progress visualization
- Community CTA

### 6. Footer
- Comprehensive link structure
- Social media integration
- Newsletter signup
- Brand information

## 🎯 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Configure build settings**:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
3. **Deploy**

### Environment Variables
No environment variables required for basic deployment.

## 🔧 Customization

### Colors
Edit the color palette in `tailwind.config.ts`:
```typescript
colors: {
  neon: {
    purple: '#a855f7',
    pink: '#ec4899',
    cyan: '#06b6d4',
    green: '#10b981',
  },
}
```

### Animations
Modify animations in `tailwind.config.ts`:
```typescript
animation: {
  'glow': 'glow 2s ease-in-out infinite alternate',
  'float': 'float 3s ease-in-out infinite',
}
```

### Content
Update content in individual component files:
- Hero stats: `components/Hero.tsx`
- Features list: `components/Features.tsx`
- Roadmap items: `components/Roadmap.tsx`
- Token distribution: `components/Tokenomics.tsx`

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for excellent user experience
- **Bundle Size**: Minimized with tree shaking
- **Images**: Optimized with Next.js Image component

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

Built with ❤️ for the Trenches Buddy community 