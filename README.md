# CreatorShare - Base MiniApp

A Base MiniApp for creators to build communities, share revenue from their content, and remix existing creations with transparent blockchain-based revenue distribution.

## Features

### 🎯 Core Features
- **Revenue Sharing Hub**: Manage transparent revenue splits with collaborators
- **Remix Studio**: Create and enhance existing content with attribution tracking
- **Audience Rewards**: Token-based rewards for community engagement
- **Performance Insights**: Analytics dashboard for content optimization

### 🛠 Technical Stack
- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base (Ethereum L2)
- **Identity**: Farcaster integration via MiniKit
- **Wallet**: OnchainKit for seamless Web3 interactions
- **Styling**: Tailwind CSS with custom design system
- **TypeScript**: Full type safety throughout

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OnchainKit API key from [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd creatorshare-miniapp
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Add your OnchainKit API key to `.env.local`:
```
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key_here
NEXT_PUBLIC_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Architecture

### Data Model
- **User**: Farcaster identity with wallet integration
- **ContentPiece**: Original creations with metadata and revenue splits
- **Remix**: Derivative works with attribution and revenue sharing
- **RevenueSplit**: Transparent distribution rules and tracking
- **EngagementReward**: Token rewards for community participation

### Design System
- **Colors**: Dark theme with neon accents (hsl(170, 70%, 45%))
- **Typography**: Modern, readable font stack with gradient text effects
- **Components**: Modular, reusable UI components with variants
- **Animations**: Smooth transitions with neon glow effects

## Key Components

### Dashboard
- Circular progress indicators for engagement metrics
- Revenue analytics with visual charts
- Performance insights and growth tracking

### Content Management
- Content cards with remix capabilities
- Revenue split visualization
- Engagement tracking and rewards

### Remix Studio
- Creative tools for content enhancement
- Attribution tracking system
- Revenue sharing for derivative works

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue in this repository
- Join our community discussions
- Check the [Base documentation](https://docs.base.org/)

---

Built with ❤️ for the creator economy on Base
