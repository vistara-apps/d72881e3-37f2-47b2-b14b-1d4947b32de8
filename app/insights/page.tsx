'use client'

import { useAccount } from 'wagmi'
import { PerformanceInsights } from '@/components/PerformanceInsights'

export default function InsightsPage() {
  const { address } = useAccount()

  if (!address) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Connect Your Wallet</h1>
          <p className="text-text/80 mb-8">
            Connect your wallet to view your performance insights.
          </p>
          <w3m-button />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="bg-surface border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Performance Insights</h1>
          <p className="text-text/80">Analyze your content performance and audience engagement</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <PerformanceInsights userId={address} />
      </div>
    </div>
  )
}

