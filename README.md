# CreatorShare

Amplify your creativity with fair revenue sharing and remix tools.

CreatorShare is a comprehensive Base Mini App built for Farcaster that enables creators to:

- **Create & Share Content**: Upload and publish creative content with decentralized storage
- **Revenue Sharing**: Set up fair revenue splits with collaborators and audience members
- **Remix Studio**: Transform and enhance existing content with attribution tracking
- **Audience Rewards**: Earn tokens for engaging with content through likes, comments, and shares
- **Performance Insights**: Track content performance with detailed analytics and recommendations

## Features

### 🎨 Revenue Sharing Hub
- Dashboard for managing revenue-sharing splits
- Real-time earnings tracking
- Claim revenue functionality
- Transparent distribution to collaborators

### 🎭 Remix Studio
- In-frame content remixing tools
- Apply filters, overlays, and effects
- Attribution tracking for original creators
- Revenue split configuration for remixes

### 🎁 Audience Rewards
- Earn tokens for content engagement
- Like rewards: 0.001 ETH
- Comment rewards: 0.002 ETH
- Share rewards: 0.003 ETH
- Remix rewards: 0.01 ETH

### 📊 Performance Insights
- Content view and engagement metrics
- Revenue analytics with charts
- Top-performing content identification
- AI-powered recommendations for optimization

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom design system
- **Blockchain**: Base Network (Ethereum L2)
- **Web3**: Wagmi, Viem, Ethers.js
- **Storage**: IPFS and Arweave for decentralized content
- **Social**: Farcaster Frame SDK
- **UI**: Framer Motion for animations, Recharts for data visualization
- **State**: TanStack Query for server state management

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A wallet supporting Base network

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd creatorshare
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local with your configuration
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Configuration

Create a `.env.local` file with the following variables:

```env
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Farcaster Configuration
NEXT_PUBLIC_FARCASTER_APP_FID=your-farcaster-fid

# Base Network Configuration
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# WalletConnect Configuration
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id

# IPFS Configuration (for Pinata)
NEXT_PUBLIC_IPFS_API_KEY=your-ipfs-api-key
NEXT_PUBLIC_IPFS_SECRET_KEY=your-ipfs-secret-key

# Arweave Configuration
ARWEAVE_KEY=your-arweave-key

# Smart Contract Addresses (after deployment)
NEXT_PUBLIC_REVENUE_SPLITTER_ADDRESS=0x...
NEXT_PUBLIC_CREATOR_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_REWARD_DISTRIBUTOR_ADDRESS=0x...
```

## Project Structure

```
creatorshare/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── create/            # Content creation page
│   ├── dashboard/         # Revenue dashboard
│   ├── insights/          # Analytics page
│   ├── remix/             # Remix studio
│   ├── claim/             # Revenue claiming
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── ContentCard.tsx   # Content display component
│   ├── RevenueSplitter.tsx # Revenue configuration
│   ├── RemixButton.tsx   # Remix action button
│   └── ...
├── lib/                  # Utility libraries
│   ├── types.ts         # TypeScript definitions
│   ├── constants.ts     # App constants
│   ├── farcaster.ts     # Farcaster integration
│   ├── web3.ts          # Web3 utilities
│   ├── contracts.ts     # Smart contract interfaces
│   ├── storage.ts       # IPFS/Arweave utilities
│   └── utils.ts         # General utilities
└── public/              # Static assets
```

## Smart Contracts

The application uses several smart contracts deployed on Base:

- **RevenueSplitter**: Handles revenue distribution among collaborators
- **CreatorToken**: ERC-20 token for creator rewards
- **RewardDistributor**: Manages audience engagement rewards

Contract ABIs and deployment scripts are available in `lib/contracts.ts`.

## API Documentation

### Frame Actions
- `GET /api/frame` - Frame metadata and initial state
- `POST /api/frame/action` - Handle frame button interactions

### Content Management
- Content creation, retrieval, and updates
- Revenue split configuration
- Remix tracking and attribution

### Analytics
- Performance metrics and insights
- Engagement tracking
- Revenue reporting

## Deployment

### Smart Contracts
1. Deploy contracts to Base network using Hardhat or Foundry
2. Update contract addresses in environment variables
3. Verify contracts on Basescan

### Application
1. Build the application:
```bash
npm run build
```

2. Deploy to Vercel, Netlify, or your preferred hosting platform
3. Configure environment variables in production
4. Set up Farcaster Frame metadata

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Join our Discord community
- Check the documentation

---

Built with ❤️ for the creator economy on Base.

